import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const postcss = require('postcss');
const root = new URL('../../', import.meta.url);
const tokens = await readFile(new URL('src/styles/tokens.css', root), 'utf8');
const css = await readFile(new URL('src/styles/global.css', root), 'utf8');
const tokenTree = postcss.parse(tokens);
const declarations = new Map();
tokenTree.walkDecls(decl => declarations.set(decl.prop, decl.value));
const color = name => declarations.get(name);
function luminance(hex) {
  const components = hex.slice(1).match(/../g).map(part => parseInt(part, 16) / 255);
  const linear = components.map(value => value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4);
  return linear[0] * .2126 + linear[1] * .7152 + linear[2] * .0722;
}
function contrast(a, b) {
  const [high, low] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (high + .05) / (low + .05);
}

test('Dossier palette preserves the archive contract and normal-text contrast', () => {
  for (const [token, hex] of Object.entries({
    '--color-page': '#f3ecdc', '--color-surface': '#faf6ea', '--color-text': '#211a12', '--color-stamp': '#a32c21',
  })) assert.equal(color(token), hex, token);
  for (const foreground of ['--color-text', '--color-text-muted', '--color-accent', '--color-stamp']) {
    for (const background of ['--color-page', '--color-surface']) {
      assert.ok(contrast(color(foreground), color(background)) >= 4.5, `${foreground} on ${background}`);
    }
  }
  assert.ok(contrast(color('--color-surface'), color('--color-action')) >= 4.5);
  for (const foreground of ['--color-control-border', '--color-series-a', '--color-series-b']) {
    assert.ok(contrast(color(foreground), color('--color-surface')) >= 3, foreground);
  }
});

test('Dossier CSS parses without duplicate-selector patches or raster texture', () => {
  const tree = postcss.parse(css, { from: fileURLToPath(new URL('src/styles/global.css', root)) });
  const imports = [];
  tree.walkAtRules('import', rule => imports.push(rule.params));
  assert.deepEqual(imports, ["'./tokens.css'"]);
  assert.ok(css.includes('.filing-tab') && css.includes('.dossier-frame') && css.includes('.exhibit__body'));
  assert.ok(css.includes('prefers-reduced-motion') && css.includes('forced-colors'));
  assert.ok(css.includes('min-width: 40rem') && css.includes('min-width: 48rem') && css.includes('min-width: 64rem'));
  assert.ok(!/url\([^)]*\.(?:png|jpe?g|webp)/i.test(css), 'Texture must not load the reference bitmap');
  tree.walkRules(rule => {
    const selectors = rule.selectors || [];
    if (selectors.some(selector => ['html', 'body', '.container', 'main.container'].includes(selector))) {
      for (const decl of rule.nodes.filter(node => node.type === 'decl')) {
        assert.ok(!(decl.prop.startsWith('overflow') && decl.value === 'hidden'), `Page clipping in ${rule.selector}`);
      }
    }
  });
  const hidden = tree.nodes.find(node => node.type === 'rule' && node.selector === '[hidden]');
  assert.ok(hidden?.nodes.some(decl => decl.prop === 'display' && decl.value === 'none' && decl.important));
  assert.ok(!/position:\s*sticky/.test(css), 'No stacked sticky masthead/control bars');
});

test('Browser chrome palette matches the shared paper and ink tokens', async () => {
  const manifest = JSON.parse(await readFile(new URL('public/manifest.webmanifest', root), 'utf8'));
  const favicon = await readFile(new URL('public/favicon.svg', root), 'utf8');
  const base = await readFile(new URL('src/layouts/Base.astro', root), 'utf8');
  assert.equal(manifest.theme_color, color('--color-page'));
  assert.equal(manifest.background_color, color('--color-page'));
  assert.ok(base.includes(`content="${color('--color-page')}"`));
  assert.ok(favicon.includes(color('--color-page')) && favicon.includes(color('--color-text')) && favicon.includes(color('--color-stamp')));
  assert.ok(!favicon.includes('#07554c'));
});

test('Nested filing/exhibit frames do not double-pad plots or squeeze minimum-size SVG labels', () => {
  const tree = postcss.parse(css);
  const values = selector => {
    const rule = tree.nodes.find(node => node.type === 'rule' && node.selector === selector);
    assert.ok(rule, selector);
    return new Map(rule.nodes.filter(node => node.type === 'decl').map(decl => [decl.prop, decl.value]));
  };
  assert.equal(values('.exhibit.dossier-frame').get('padding'), '0');
  assert.equal(values('.compare-toolbar.dossier-frame').get('padding'), '0');
  assert.equal(values('.filing-tab').get('inline-size'), 'fit-content');
  assert.equal(values('.chart-svg').get('min-inline-size'), '300px');
  assert.equal(values('.chart-wide .chart-svg').get('min-inline-size'), '640px');
  assert.equal(values('.chart-plot').get('overflow-x'), 'auto');
  assert.ok(!values('.chart-plot').has('overflow'), 'Local scroll, not hidden plot clipping');
});
