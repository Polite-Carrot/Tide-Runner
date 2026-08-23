# Tiderunner

A buoy-racing game for the browser, wrapped as an iOS and Android app with Capacitor.

Four boats, a winding river and a lot of red and green marks. The current runs with you —
keep the reds to port and stay off the sand.

The whole game is a single self-contained HTML file (`docs/index.html`): canvas rendering,
physics, AI, procedural courses and Web Audio music, with no build step and no runtime
dependencies beyond a webfont.

## Racing

- **Seventeen courses**, each with its own channel width and character. The menu leads with
  six — two full rows — and keeps the rest behind **More courses**; a course picked from the
  full list stays on show when the list collapses again.

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
  abreast down a channel twice the usual width. A course sets its own fleet size, so any
  other course could field one too.
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

## Controls

| Action | Keyboard | Touch |
| --- | --- | --- |
| Throttle | `W` / `↑` | **GO** pad |
| Astern | `S` / `↓` | **Reverse** pad |
| Helm | `A` `D` / `←` `→` | Left thumb joystick |
| Restart | `R` | — |

Touch controls appear automatically on coarse-pointer devices. The game honours
`prefers-reduced-motion` by dropping particle effects.

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
