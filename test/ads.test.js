const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const html = fs.readFileSync('docs/index.html', 'utf8');
const rewarded = html.slice(html.indexOf('        async function playRewardedAd('), html.indexOf('        function refreshSpinStatus()'));
const interstitial = html.slice(html.indexOf('        const INTERSTITIAL_EVERY'), html.indexOf('        /* THE one place'));
function fixture(overrides = {}) {
  let earned = 0, shown = 0;
  const button = { disabled: false, classList: { add() {}, remove() {} } };
  const label = { textContent: 'Watch ad', id: 'bonus' };
  const context = vm.createContext({
    document: { hidden: false }, bootGone: true, bannerPending: () => false,
    pauseGame() {}, console: { warn() {} },
    adLoading: false, adsRemoved: () => false, adPlatform: () => 'ios',
    unityAds: {
      prepareRewarded: async () => ({ loaded: true }),
      showRewarded: async () => ({ shown: true, rewarded: true }),
      prepareInterstitial: async () => ({ loaded: true }),
      showInterstitial: async () => { shown++; return { shown: true }; },
    },
    progress: { racesFinished: 6, lastInterstitial: 0 }, saveProgress() {},
    requestAdTracking: async () => {}, syncAdConsent: async () => true,
    setFbConsent: async () => {}, trackEvent() {},
    setTimeout: fn => fn(), Date: { now: () => 0 },
    ...overrides,
  });
  vm.runInContext(interstitial + rewarded, context);
  context.Date.now = () => 240000;
  return { context, button, label, earned: () => earned, shown: () => shown,
    play: () => context.playRewardedAd(button, label, () => { earned++; }) };
}
test('Unity earned reward grants once and restores button', async () => {
  const f = fixture(); await f.play();
  assert.equal(f.earned(), 1); assert.equal(f.button.disabled, false);
});
test('completed playback without reward callback grants nothing', async () => {
  const f = fixture(); f.context.unityAds.showRewarded = async () => ({ shown: true, rewarded: false, finishState: 'completed' });
  await f.play(); assert.equal(f.earned(), 0); assert.equal(f.button.disabled, false);
});
test('missing native config never falls back to a free reward', async () => {
  const f = fixture({ unityAds: null }); await f.play();
  assert.equal(f.earned(), 0); assert.equal(f.button.disabled, false);
});
test('no-fill grants nothing and restores button', async () => {
  const f = fixture(); f.context.unityAds.prepareRewarded = async () => ({ loaded: false });
  await f.play(); assert.equal(f.earned(), 0); assert.equal(f.button.disabled, false);
});
test('web never simulates a rewarded ad', async () => {
  const f = fixture({ adPlatform: () => 'web', syncAdConsent: async () => false });
  await f.play(); assert.equal(f.earned(), 0); assert.equal(f.button.disabled, false);
});
test('no-ads entitlement retains its reward benefit', async () => {
  const f = fixture({ adsRemoved: () => true, unityAds: null });
  await f.play(); assert.equal(f.earned(), 1);
});
test('production race grace, cadence and two-minute gap are restored', async () => {
  const f = fixture();
  for (const races of [0, 1, 3, 5, 7]) {
    f.context.progress.racesFinished = races;
    assert.equal(f.context.interstitialDue(), false);
  }
  f.context.progress.racesFinished = 2;
  f.context.progress.lastInterstitial = 120001;
  assert.equal(f.context.interstitialDue(), false);
  f.context.progress.lastInterstitial = 120000;
  await f.context.maybeShowInterstitial();
  assert.equal(f.shown(), 1);
  assert.equal(f.context.progress.lastInterstitial, 240000);
});
test('rewarded playback suppresses an immediate interstitial', async () => {
  const f = fixture(); await f.play();
  assert.equal(f.context.interstitialDue(), false);
});
test('all inline game JavaScript parses', () => {
  for (const match of html.matchAll(/<script>([\s\S]*?)<\/script>/g)) new vm.Script(match[1]);
});

test('rewarded cooldown lasts two minutes', async () => {
  const f = fixture();
  await f.play();
  f.context.Date.now = () => 359999;
  assert.equal(f.context.interstitialDue(), false);
  f.context.Date.now = () => 360000;
  assert.equal(f.context.interstitialDue(), true);
});
test('interstitial does not overlap a rewarded ad', async () => {
  const f = fixture();
  f.context.adLoading = true;
  await f.context.maybeShowInterstitial();
  assert.equal(f.shown(), 0);
});
