/* MDI Icon Search: de lijst komt van @mdi/svg (zelfde versie als het lettertype) */
const VER = '7.4.47';
const META = `https://cdn.jsdelivr.net/npm/@mdi/svg@${VER}/meta.json`;
const SVG = (n) => `https://cdn.jsdelivr.net/npm/@mdi/svg@${VER}/svg/${n}.svg`;
const KLEUREN = ['', '#ffc107', '#ff9800', '#f44336', '#e91e63', '#9c27b0', '#2196f3', '#03a9f4', '#4caf50', '#607d8b'];
/* Nederlandse (en wat Duitse) zoekwoorden -> Engelse termen */
const NL = { lamp: 'lightbulb lamp', licht: 'lightbulb light', verlichting: 'lightbulb', deur: 'door', voordeur: 'door', raam: 'window', gordijn: 'curtains', rolluik: 'roller-shade window-shutter', zonwering: 'awning blinds',
  temperatuur: 'thermometer', thermostaat: 'thermostat', verwarming: 'radiator heating', kachel: 'fireplace radiator', vochtigheid: 'water-percent humidity', wasmachine: 'washing-machine', droger: 'tumble-dryer', vaatwasser: 'dishwasher',
  koelkast: 'fridge', oven: 'stove oven', magnetron: 'microwave', koffie: 'coffee', tv: 'television', televisie: 'television', speaker: 'speaker', luidspreker: 'speaker', muziek: 'music', stroom: 'flash lightning-bolt power',
  energie: 'lightning-bolt flash', zon: 'weather-sunny solar', zonnepaneel: 'solar-panel', zonnepanelen: 'solar-panel', batterij: 'battery', accu: 'battery', auto: 'car', fiets: 'bike', laadpaal: 'ev-station', garage: 'garage',
  tuin: 'flower tree', bloem: 'flower', boom: 'tree', water: 'water', regen: 'weather-rainy', sneeuw: 'snowflake', wind: 'weather-windy', weer: 'weather', wolk: 'cloud', maan: 'moon', nacht: 'weather-night', slot: 'lock', sleutel: 'key',
  alarm: 'alarm-light shield', beveiliging: 'shield security', camera: 'cctv camera', beweging: 'motion-sensor run', aanwezigheid: 'home-account account', persoon: 'account', huis: 'home', woonkamer: 'sofa', bank: 'sofa',
  slaapkamer: 'bed', bed: 'bed', keuken: 'countertop stove', badkamer: 'shower bathtub', douche: 'shower', toilet: 'toilet', trap: 'stairs', kantoor: 'desk', bureau: 'desk', computer: 'desktop-tower monitor', laptop: 'laptop',
  telefoon: 'cellphone phone', printer: 'printer', 'printer3d': 'printer-3d', router: 'router-wireless', wifi: 'wifi', netwerk: 'lan network', server: 'server', ventilator: 'fan', airco: 'air-conditioner', luchtreiniger: 'air-purifier',
  rook: 'smoke-detector', brand: 'fire', gas: 'gas-cylinder meter-gas', meter: 'meter-electric gauge', stopcontact: 'power-socket', schakelaar: 'light-switch toggle-switch', knop: 'gesture-tap-button button', klok: 'clock',
  kalender: 'calendar', afval: 'trash-can delete', vuilnis: 'trash-can', kliko: 'trash-can', post: 'mailbox email', brievenbus: 'mailbox', hond: 'dog', kat: 'cat', vis: 'fish', baby: 'baby', kind: 'human-child', zwembad: 'pool',
  vijver: 'pond waves', sproeier: 'sprinkler', grasmaaier: 'robot-mower mower', stofzuiger: 'robot-vacuum vacuum', dakraam: 'window-shutter skylight', ketel: 'water-boiler', boiler: 'water-boiler', waterkoker: 'kettle', pomp: 'pump' };
const st = opslag.lees('mdi.v1', { kleur: '', sz: 32, recent: [] });
let alle = [], lijst = [], toon = 0, gekozen = null;
const PAGINA = 240;

function zetKleur() {
  document.documentElement.style.setProperty('--ic', st.kleur || 'var(--fg)');
  $('#kleuren').innerHTML = KLEUREN.map((k) => `<button type="button" class="sw ${st.kleur === k ? 'sel' : ''}" data-k="${k}" title="${k || 'Default'}" style="background:${k || 'linear-gradient(135deg,var(--fg) 50%,var(--panel) 50%)'}"></button>`).join('')
    + `<input type="color" id="eigen" value="${st.kleur || '#03a9f4'}" title="Custom colour">`;
}
function zoek() {
  const raw = $('#q').value.trim().toLowerCase(), cat = $('#cat').value;
  const woorden = raw.split(/\s+/).filter(Boolean).map((w) => [w, ...(NL[w] ? NL[w].split(' ') : [])]);
  lijst = alle.filter((i) => (!cat || i.tags.includes(cat)) && woorden.every((opts) => opts.some((w) => i.zoek.includes(w))));
  if (raw) {   // exacte en beginnende namen bovenaan
    const eerste = woorden[0] || [];
    const score = (i) => (eerste.includes(i.name) ? 0 : eerste.some((w) => i.name.startsWith(w)) ? 1 : eerste.some((w) => i.name.includes(w)) ? 2 : 3) + (i.name.endsWith('-outline') ? .1 : 0);
    lijst.sort((a, b) => score(a) - score(b) || a.name.length - b.name.length);
  }
  toon = 0; $('#grid').innerHTML = ''; meer();
  $('#stat').textContent = raw || cat ? `${lijst.length.toLocaleString('en')} icons found` : `${alle.length.toLocaleString('en')} icons · Material Design Icons ${VER} (same set as Home Assistant)`;
}
function meer() {
  const stuk = lijst.slice(toon, toon + PAGINA); toon += stuk.length;
  $('#grid').insertAdjacentHTML('beforeend', stuk.map((i) => `<button type="button" class="ic ${gekozen === i.name ? 'on' : ''}" data-n="${i.name}" title="mdi:${i.name}"><i class="mdi mdi-${i.name}"></i><small>${i.name}</small></button>`).join(''));
  $('#meer').hidden = toon >= lijst.length;
  if (!lijst.length) $('#grid').innerHTML = '<p class="hint">No icons found. Try an English word, e.g. <b>lightbulb</b> or <b>door</b>.</p>';
}
function kies(n, scroll) {
  const i = alle.find((x) => x.name === n); if (!i) return;
  gekozen = n; $$('.ic.on').forEach((b) => b.classList.remove('on')); $(`.ic[data-n="${n}"]`)?.classList.add('on');
  $('#big').innerHTML = `<i class="mdi mdi-${n}"></i>`; $('#dnaam').textContent = n; $('#dmdi').textContent = 'mdi:' + n;
  $('#dmeta').innerHTML = [i.aliases.length ? 'Also: ' + i.aliases.slice(0, 6).map(esc).join(', ') : '', `Added in ${esc(i.version)}`, i.deprecated ? '<b class="bad">Deprecated</b>' : ''].filter(Boolean).join(' · ');
  $('#dbtns').hidden = false; $('#mini').hidden = false; $('#mi1').className = $('#mi2').className = 'mdi mdi-' + n;
  $('#dtags').innerHTML = i.tags.map((t) => `<button type="button" data-t="${esc(t)}">${esc(t)}</button>`).join('');
  history.replaceState(null, '', '#' + n);
  if (scroll && matchMedia('(max-width: 860px)').matches) $('#detail').scrollIntoView({ behavior: 'smooth' });
}
async function svgTekst(n) {
  const r = await fetch(SVG(n)); if (!r.ok) throw new Error();
  let t = await r.text(); if (st.kleur) t = t.replace('<path ', `<path fill="${st.kleur}" `); return t;
}
function onthoud(n) { st.recent = [n, ...st.recent.filter((x) => x !== n)].slice(0, 16); opslag.schrijf('mdi.v1', st); recent(); }
function recent() {
  $('#recent').hidden = !st.recent.length;
  $('#recent').innerHTML = '<span>Recent:</span>' + st.recent.map((n) => `<button type="button" data-n="${n}" title="mdi:${n}"><i class="mdi mdi-${n}"></i></button>`).join('');
}

$('#grid').onclick = (e) => { const b = e.target.closest('.ic'); if (b) kies(b.dataset.n, true); };
$('#grid').ondblclick = (e) => { const b = e.target.closest('.ic'); if (b) { kopieer('mdi:' + b.dataset.n, `Copied mdi:${b.dataset.n}`); onthoud(b.dataset.n); } };
$('#recent').onclick = (e) => { const b = e.target.closest('button[data-n]'); if (b) kies(b.dataset.n, true); };
$('#dtags').onclick = (e) => { const b = e.target.closest('button'); if (b) { $('#cat').value = b.dataset.t; $('#q').value = ''; zoek(); } };
$('#dbtns').onclick = async (e) => {
  const b = e.target.closest('button'); if (!b || !gekozen) return; const n = gekozen;
  try {
    if (b.dataset.c === 'mdi') kopieer('mdi:' + n, `Copied mdi:${n}`);
    else if (b.dataset.c === 'yaml') kopieer(`icon: mdi:${n}`, 'Copied YAML');
    else if (b.dataset.c === 'link') kopieer(location.href.split('#')[0] + '#' + n, 'Link copied');
    else if (b.dataset.c === 'svg') kopieer(await svgTekst(n), 'SVG copied');
    else if (b.dataset.c === 'dl') download(`${n}.svg`, await svgTekst(n), 'image/svg+xml');
    else if (b.dataset.c === 'path') kopieer((await svgTekst(n)).match(/ d="([^"]+)"/)[1], 'Path data copied');
    onthoud(n);
  } catch (err) { toast('Could not load the SVG, check your connection'); }
};
let t; $('#q').oninput = () => { clearTimeout(t); t = setTimeout(zoek, 120); };
$('#cat').onchange = zoek;
$('#meer').onclick = meer;
$('#kleuren').onclick = (e) => { const b = e.target.closest('.sw'); if (!b) return; st.kleur = b.dataset.k; opslag.schrijf('mdi.v1', st); zetKleur(); };
$('#kleuren').oninput = (e) => { if (e.target.id !== 'eigen') return; st.kleur = e.target.value; opslag.schrijf('mdi.v1', st); document.documentElement.style.setProperty('--ic', st.kleur); $$('.sw').forEach((x) => x.classList.remove('sel')); };
new IntersectionObserver((es) => { if (es[0].isIntersecting && !$('#meer').hidden) meer(); }, { rootMargin: '400px' }).observe($('#meer'));
document.addEventListener('keydown', (e) => { if (e.key === '/' && document.activeElement.tagName !== 'INPUT') { e.preventDefault(); $('#q').focus(); } });

(async () => {
  zetKleur(); recent();
  try {
    const data = await (await fetch(META)).json();
    alle = data.map((i) => ({ name: i.name, aliases: i.aliases || [], tags: i.tags || [], version: i.version || '', deprecated: !!i.deprecated,
      zoek: [i.name, ...(i.aliases || []), ...(i.tags || []).map((x) => x.toLowerCase())].join(' ') }));
    alle.sort((a, b) => a.name.localeCompare(b.name));
    const cats = [...new Set(alle.flatMap((i) => i.tags))].sort();
    $('#cat').insertAdjacentHTML('beforeend', cats.map((c) => `<option>${esc(c)}</option>`).join(''));
    zoek();
    const h = decodeURIComponent(location.hash.slice(1)).replace(/^mdi:/, '');
    if (h) { $('#q').value = h; zoek(); kies(h); }
  } catch (err) { $('#stat').textContent = 'Could not load the icon list. Check your connection and reload.'; }
})();
