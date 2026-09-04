# Tiderunner

A buoy-racing game for the browser, wrapped as an iOS and Android app with Capacitor.

Four boats, a winding river and a lot of red and green marks. The current runs with you —
keep the reds to port and stay off the sand.

The whole game is a single self-contained HTML file (`docs/index.html`): canvas rendering,
physics, AI, procedural courses and Web Audio music, with no build step and no runtime
dependencies beyond a webfont.

## Racing

- **Twenty-five courses**, each with its own channel width and character. The menu shows them
  on a rail that scrolls sideways, one card per snap, with dots tracking where you are;
  **All 17 courses** opens the full list as a popup grid. Picking one there selects it,
  closes the popup and scrolls the rail to it, so the rail always shows what you chose.
  Costing one row rather than three is what keeps **Start race** on screen without scrolling
  — verified on an iPhone SE, an iPhone 14, a phone in landscape and an iPad.

  At the gentle end, Fjord Run and Atlantic Leg are four long sweeps you can hold the
  throttle through. At the other, Corryvreckan and Hell's Mouth are 26 and 24 corners of
  more or less continuous helm — the two hardest in the game — with Staithes Twist and
  Monaco Harbour tied for the tightest single corner the hull can still get round.

- **2, 3 or 5 laps** against three rivals (Sea Fret, Bramble and Mad Mackerel) at one of
  four skill tiers — Easy, Normal, Hard and Insane. Up to Hard the tiers are driving skill
  rather than horsepower: they scale how much of the theoretical corner speed a rival will
  use, how much of the river it takes to straighten a bend, how steady it holds its line,
  how fast it moves the helm, and whether it checks for clear water before grabbing a boost.
  From Normal upward they also race each other — tucking into the wake ahead for the tow,
  then pulling out to pass once there's clear water and the speed to use it.

  Roughly what each tier laps Ouse Bends in: Easy ~31s, Normal ~23s, Hard ~21s, Insane ~20s.

  **Insane is tuned against one number.** Your boat settles at about 231px/s, or 257 sitting
  in another boat's wake. A rival geared past that drives away down every straight no matter
  how well you take the bends — difficulty stops being difficulty and becomes a locked door.
  Insane sits just above what a drafting boat can hold, near 276px/s: quick enough that you
  have to chase it, slow enough to be caught in the corners, on the boosts and in traffic.
  Expect to need the slipstream and every boost on the lap.

  The tiers bunch up at the top on purpose. By Hard the AI is already cornering at its limit,
  and driving better than that is worth under half a second a lap, so the gap from Hard to
  Insane is narrower than the one from Easy to Normal. Corner-heavy courses squeeze it
  further — on Corryvreckan, Insane is only a second a lap up on Hard, because raw engine
  buys little where you are always turning.

- **The Broadwater is a full-fleet race** — twelve boats rather than four, starting three
  abreast down a channel twice the usual width.
- **Some courses roll their fleet size.** A course can name a range instead of a number, and
  it is rolled fresh at the start of every race — Kraken Deep fields anywhere from six boats
  to twelve, so the same course is a procession one race and a scrap the next.
- **Six courses have things in the water.** Hazards are declared per course and spawned per
  race, so the seventeen above them are untouched and still race exactly as their records
  were set.

  |               | what it does                                                                                                                                                                                                                                          |
  | ------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
  | **Whirlpool** | pulls you toward the eye and turns the helm — the only hazard that takes the boat somewhere you didn't point it. Its inward pull peaks at 165 against 340 of thrust, so you can always drive out; you just won't come out pointing where you went in. |
  | **Log**       | solid, and it drifts with the current, so the line that worked last lap is not the line this lap.                                                                                                                                                     |
  | **Weed bed**  | not solid; it just holds on to the hull, and costs you the exit of whatever corner it's sitting in.                                                                                                                                                   |

  A hazard is never drawn wider than 80% of the channel half-width. A whirlpool broader than
  the river is not a hazard, it's a roadblock — the first cut had a 92px eddy on a 73px
  half-width and the whole field simply ground to a halt.

- **Three of them are enormous.** Kraken Deep, The Great Sound and Leviathan Run run to
  9,300–10,200px a lap against 4,000–5,000 for the rest, so a lap is a voyage rather than a
  circuit. Wildlife is scaled by track length so the big water isn't empty.
- **Two are drawn by hand to be shapes the generator can't make.** The meander generator is a
  sinusoid, so every course it draws has the same character the whole way round.

  **The Long Bight** is a dogbone, and has the only real straight in the game: 966px where
  the boat turns less than 12°, against 909px on a course twice its length and under 600px
  for everything else — 24% of its lap, where the next best manages 10%. Long enough to sit
  in a wake and be towed the whole way, so it is the one course where the tow is worth more
  than the corner. Its geometry is set by the physics: you must lift below R=180
  (`TOP 225 / OMEGA 1.25`), so the ends are turns of about that radius and the reaches sit
  340px apart to make them.

  **Skerryvore Sound** has two sectors. Six control points carry an open sweep across the
  north at full throttle; twelve carry a rock shelf across the south, close enough together
  that the corners never let you back up to speed. Fastest third 224px/s against slowest
  third 190 — a 15% spread, where the widest on any other course is Staithes Twist at 14%
  and most sit under 5%.

- **Momentum-based handling.** The hull carries its speed through a turn, so ease off before
  the mark and let the stern come round. Astern is available but slow.
- **Slipstream.** Sitting close behind another boat and roughly in line with it pulls you
  along.
- **Boost pickups** — surges of current placed off the ideal line, so taking one always
  costs a little cornering.
- **Run aground** and you lose way; stay stuck too long and a shark takes an interest, with
  a hard backstop a few seconds later. Getting eaten respawns you on the centreline.
- **Wildlife and scenery** — whales, rays, sharks and shoals of fish move through the
  channel, and moored yachts with cheering crews line the banks.

The HUD keeps the instruments in one row along the top — lap, position, speed in knots and
elapsed time with last lap, session best and course record — leaving the chartplotter the
top-right corner and the bottom of the screen clear for the touch controls.

**Course records** are saved per course and survive a reload, shown on the menu tile and in
the HUD while you race. They live in `localStorage` under `tiderunner.records.v1`; storage
that refuses to answer (private windows, sandboxed frames) is handled, and records simply
stop persisting beyond the session rather than breaking the game.

**Next race**, on the results screen, moves straight to the next course in the list (wrapping
from Skerryvore Sound back to Ouse Bends) and starts it — for a "just keep playing" session
rather than a deliberate pick each time. **Race again** and **Change course** are still there
alongside it.

## Skins and coins

**Courses unlock in order** — finishing one (any place, any difficulty) unlocks the next.
`courseUnlocked(i)` checks every course before `i`; picking a locked one, from the rail, the
popup or a stale Next race target, is a no-op — a course you're actually racing was already
unlocked when you started it.

**Each course has a challenge skin**, earned by lapping it 3 laps under a per-course time
target (`CHALLENGE_SKINS`, one per track). Beat all 25 and Diamond Camo unlocks on top.

**Coins are earned on every finish**, not just a win, adding three things rather than
multiplying them: `totalLaps` (the race you chose to run), a placement bonus, and a difficulty
rank out of 4.

| Term       | Values                                           |
| ---------- | ------------------------------------------------ |
| Laps       | 2, 3 or 5 — whatever the race was                |
| Placement  | 3 / 2 / 1 / 0 for 1st / 2nd / 3rd / 4th-or-worse |
| Difficulty | Easy 1, Normal 2, Hard 3, Insane 4               |

A 2-lap Insane win is `2 + 3 + 4 = 9`. Last place in that same race is still `2 + 0 + 4 = 6` —
showing up on a hard difficulty is worth something on its own, even without a placing.
Everything from a 2-lap Easy 4th (3, the floor) to a 5-lap Insane win (12, the ceiling) sits in
that range. `DIFF_RANK` and `placeBonus()` are the only two things involved, both right next
to `coinsForFinish()` in `docs/index.html`, and trivial to retune.

**That's a much smaller economy than shop prices were set against.** Under the previous
laps-×-multiplier formula a normal race paid tens of coins; this one pays single digits, so
**Union Jack at 200 coins is now on the order of 20-65 races** rather than a handful. Worth
revisiting the price (or adding a cheaper first item) once this has actually been played
against — not changed pre-emptively without seeing how it feels.

**The coin itself is a drawn `.coin-icon`**, not an image or an icon font: a small
`radial-gradient` circle with an inset rim, the same technique the toggle switches already use
elsewhere in this file, reused at two sizes. On the results screen it sits in its own badge
next to the amount earned (`#coinReward`, a `.pop` entrance animation that re-triggers on every
finish and is skipped under `prefers-reduced-motion`), separate from the plain-English summary
sentence rather than folded into it. On the Skins screen it sits beside the running balance.

**Shop skins** are bought with coins rather than earned, for cosmetics that don't fit a
time-and-course challenge — national flags, named after the actual country rather than a
nickname (Japan, France, United Kingdom, United States, Canada, Australia, South Korea, Brazil,
Mexico, Turkey, Poland, Thailand, Vietnam, Indonesia, Philippines, India, Pakistan, Egypt,
Nigeria), each an SVG pattern built the same way the existing Monaco/Germany/Amsterdam
challenge-skin flags are — stylised, not heraldic, since a 60×30 swatch can't render fine
detail legibly (the US flag's starfield is a simplified 12-dot grid rather than 50 accurate
stars, same idea as Amsterdam's simplified X's). All of them cost the same **75 coins** — a flat
price rather than a ladder, roughly 6-25 races against `coinsForFinish()`'s 3-12-per-race range.
Germany isn't duplicated here since it already exists as a challenge skin.

A locked, affordable shop skin buys and equips itself on tap, no confirmation step, matching
how every other single-tap choice in this menu already works; short of the price, tapping does
nothing and the card's note says by how much.

All three unlock paths — challenge, Diamond, shop — write into the same
`progress.skins[id] = true` map under `tiderunner.progress.v1` in `localStorage`, which is
what lets `skinUnlocked()`, `selectedSkin()` and the Skins grid treat every skin uniformly
regardless of how it was earned. Adding another shop skin is one entry in `SHOP_SKINS`; adding
another earn path is one more branch in `skinUnlocked()`.

**The Skins screen is split into three labelled categories** — Colours, Flags, then
Challenges (the 25 challenge skins plus Diamond Camo, which needs all of them) — each its own
`.skin-grid`, built by the same shared `skinCard()`/`fillSkinGrid()` helpers so a skin's card
looks and behaves identically regardless of which grid it's in.

## Controls

| Action   | Keyboard          | Touch                              |
| -------- | ----------------- | ---------------------------------- |
| Throttle | `W` / `↑`         | **GO** pad                         |
| Astern   | `S` / `↓`         | **Reverse** pad                    |
| Helm     | `A` `D` / `←` `→` | Left thumb joystick                |
| Restart  | `R`               | **Restart race** in the pause menu |

Touch controls appear automatically on coarse-pointer devices.

## Analytics

The web build can send gameplay events to Google Analytics (GA4, `G-2JK7DZ59VV`) — but nothing
is requested until a player says yes. `level_start` when a race begins, `level_end` when it
resolves — `success: true` on finishing, `success: false` on exiting to the menu mid-race, both
carrying the course, difficulty and lap count, and the finish carries place, total time and
whether it was a new record. Quitting during the pre-race countdown doesn't count as abandoning
a level, since nothing has been raced yet.

**Opt-in, not opt-out.** A first-visit banner asks before anything loads; declining, or leaving
it unanswered, costs the player nothing — the game plays identically either way, and no gtag
script is ever requested. **Send usage data** in Settings is the same choice, answerable there
directly without ever seeing the banner, and editable afterward in either direction. Both write
to the same `SETTINGS.analytics` in `localStorage` under `tr-settings`, through one shared
resolver (`resolveAnalyticsConsent()`) — `undefined` means never asked (the only state that
shows the banner), `true`/`false` means it's been answered, however it was answered.

**Web only, deliberately, on top of the opt-in.** The gtag library is appended to the document —
not just called — only when `window.Capacitor.isNativePlatform()` is absent or false _and_ the
player has explicitly accepted, so inside the iOS and Android apps it is never requested at all,
regardless of what a player would have chosen. Neither native shell has its own analytics yet;
that gate is where it will branch when they do. `docs/privacy.html` discloses this and is the
source of truth if the two drift.

Once accepted, turning it back off is checked in three places, because each covers something the
others can't: `trackEvent()` gates on `SETTINGS.analytics` first, which is the one this file
times precisely and stops every custom event the instant it's declined; the toggle also sets
`window['ga-disable-G-2JK7DZ59VV']`, Google's own runtime switch, so an already-loaded gtag.js
stops its own automatic page views and engagement pings too — things `trackEvent()` never calls
and so can't reach; and the choice is read directly out of `localStorage` at the very top of
`<head>`, before `SETTINGS` itself is even built further down the page, so only an explicit
prior accept (`=== true`) loads gtag on a fresh visit — absent or declined both mean don't.
Accepting later, from either the banner or the toggle, calls `gaEnable()` (exposed on `window`
from the head) live, no reload needed in either direction.

The banner itself only ever shows on the menu — `syncConsentBanner()` is called on every
transition on or off it (starting a race, returning from one), not just once at boot. It's a
full-width bar pinned to the bottom of the screen, exactly where the pause button lives, so a
player who starts racing without answering it would otherwise have it sitting over the HUD and
touch controls, unreachable, for the whole race. While it's showing, its own height comes out of
`--app-h` the same way the safe-area insets do, so it never lands on top of Start race either —
first visit included.

Skins exist now (course completion unlocks the next course and challenge skins), so the
`select_content` event with `content_type: "boat_skin"` sketched out here previously — for
"whenever it lands" — is ready to wire up whenever that's wanted; it hasn't been yet.

### Filling the screen

**The dark band along the bottom of an installed iOS app is one meta tag, not a CSS problem.**

```html
<meta name="apple-mobile-web-app-status-bar-style" content="black" />
```

With `black-translucent`, iOS slides the web view _up_ under the status bar but leaves its
height at screen minus status bar. On an installed iPad app that is a 788px-tall window pinned
to the top of an 820px screen, with 32px along the bottom that belongs to no one — the page is
painting behind the status bar at the top and running out of window at the bottom. Its
signature is `canvas top: 0` and `safe-area-inset-top: 32px` reported together.

No CSS reaches that band, because the page is not the thing falling short: `window.innerHeight`,
`documentElement.clientHeight` and a stretched `position: fixed; inset: 0` box all correctly
report 788. Five attempts at CSS heights — `100%`, `100vh`, `100dvh`, `inset: 0` with no height,
and `innerHeight` in a custom property — failed identically for that reason.

`black` gives the status bar its own opaque strip and hands the page the whole of the rest of
the screen, bottom edge included. **iOS reads this at install time**, so a change here needs the
home-screen icon removed and re-added.

The full-screen layers still size to `--app-h`, which `resize()` sets from `#vpProbe` — an empty
`position: fixed; inset: 0` div with no height, which the engine stretches to the fixed viewport.
That is belt and braces rather than the fix: it agrees with `innerHeight` everywhere measured so
far, but it is measured rather than reported, so it tracks the window even where the two would
diverge. The canvas cannot do it for itself, being a _replaced_ element: at `height: auto` it
takes its intrinsic size instead of stretching to `bottom: 0`, and collapses to a few hundred
pixels.

`resize()` measures the canvas from its own `getBoundingClientRect()` rather than from the
viewport, and a `ResizeObserver` watches both that box and the probe. It is load-bearing: on iOS
the laid-out height settles a frame or two after load, as the safe area and the dynamic viewport
are applied, and no `resize`, `orientationchange` or `visualViewport` event fires for it. Without
the observer the first measurement sticks, the frame is painted short of the bottom of the
screen, and it only comes right once something else forces a resize — rotating the device, say.

The game honours `prefers-reduced-motion` by dropping particle effects.

## Running it

There is no build step for the web version. Serve the `docs/` directory and open it:

```bash
npx serve web
# or: python3 -m http.server -d web
```

Opening `docs/index.html` directly from the filesystem also works. An internet connection is
only needed for the Google Fonts stylesheet — without it, the game falls back to system
fonts and plays normally.

## Building the apps

Capacitor is configured in `capacitor.config.json` (`com.politecarrot.tiderunner`, web assets in
`docs/`). The native projects are checked in under `android/` and `ios/`.

```bash
npm install
npx cap sync          # copy docs/ into both native projects and update plugins
npx cap open android  # opens Android Studio
npx cap open ios      # opens Xcode
```

Re-run `npx cap sync` (or `npx cap copy`) after any change to `docs/index.html`.

Targets: Android minSdk 24 / compileSdk 36, iOS 15.0+.

## Layout

```
docs/index.html        the entire game — markup, styles, and all game code
capacitor.config.json app id, name and web asset directory
android/              Capacitor Android project
ios/                  Capacitor iOS project
```

Inside `docs/index.html` the code is grouped into commented sections: course definitions and
track generation, boat physics and AI, audio, fauna, boosts, moored scenery, rendering, the
chartplotter, and the HUD and menu screens.

Courses are either generated — a closed loop with sinusoidal meanders laid over it — or laid
out by hand as control points. Either way two limits have to hold: no corner tighter than
the hull can turn, and enough land left between two reaches that they don't merge into one
pool. The floors, taken from the courses already in the game, are a **65px corner radius**
and **79px of land** between reaches. Measure the land strip (closest approach minus the
channel width), not the ratio of the two — a wide course like The Broadwater looks close on
a ratio while actually leaving more land than most of the narrow ones.

For a generated course, more corners means raising the meander count `k`, not the amplitude:
deep meanders at high frequency fold the bank back through itself long before the corners
get interesting.
