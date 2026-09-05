# Tiderunner

A buoy-racing game for the browser, wrapped as an iOS and Android app with Capacitor.

Four boats, a winding river and a lot of red and green marks. The current runs with you —
keep the reds to port and stay off the sand.

The whole game is a single self-contained HTML file (`docs/index.html`): canvas rendering,
physics, AI, procedural courses and Web Audio music, with no build step and no runtime
dependencies beyond a webfont.

## Racing

- **One hundred courses across four worlds** — twenty-five each of rivers, lava, ice and space —
  each with
  its own width and character. The menu shows only the one you've got selected: its plotter
  trace on the left, and on the right its name, its character and a row per stat — how many
  boats it fields, your best lap, your best total, an em dash where you haven't set one yet
  rather than a missing row. **Change course** underneath opens the full list as a popup grid
  with a tab per world. That card replaced a sideways-scrolling rail of every course, its dots
  row and an "all courses" button — three rows for a job the popup already did better, and
  **Start race** has always been the thing fighting for that space. Verified on an iPhone SE,
  an iPhone 14, a phone in landscape and an iPad.

  **On a phone the menu runs down the middle.** Below 560px the laps/rivals/start row wraps
  into a stack, and a stack of left-aligned groups of different widths reads as ragged — so
  they centre, and the eye has one line to follow down to Start race. The results sheet's
  header centres with it, so finishing a race doesn't swing the layout back to the left. The
  desktop layout, where the three sit side by side on one line, is untouched.

  **The laps and rivals segments are equal columns** (`grid-auto-columns: minmax(42px, 1fr)`),
  not flex. Selecting a lap count bolds its label, and under flex that grew the one button —
  2/3/5 were never the same width twice, and the group visibly shifted on every tap.

  **Each world unlocks on its own chain**: its first course is open from the start and every
  one after that wants the previous finished. So Ember Flow is raceable immediately rather
  than sitting behind all twenty-five rivers — otherwise the Lava tab would be five padlocks
  for most of a play session, which is a poor advert for a new world.

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
- **Fifty-nine courses have things in the water**, and what's in it depends on the world.
  Hazards are declared per course and spawned per race, so a course with none is untouched
  and still races exactly as its records were set.

  |                    | world  | what it does                                                                                                                                                                                                                                          |
  | ------------------ | ------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
  | **Whirlpool**      | any    | pulls you toward the eye and turns the helm — the only hazard that takes the boat somewhere you didn't point it. Its inward pull peaks at 165 against 340 of thrust, so you can always drive out; you just won't come out pointing where you went in. |
  | **Log**            | rivers | solid, and it drifts with the current, so the line that worked last lap is not the line this lap.                                                                                                                                                     |
  | **Weed bed**       | rivers | not solid; it just holds on to the hull, and costs you the exit of whatever corner it's sitting in.                                                                                                                                                   |
  | **Rockfall**       | lava   | not there, then there. A shadow tightens on the channel for a second and a half, then a boulder lands in it and sits for two — the hardest hit in the game, and the only warning is the shadow.                                                       |
  | **Orca**           | ice    | surfaces on a cycle, breaching along the channel. Down it's a shadow that grows as it comes up; up it's solid and it takes a third of your speed.                                                                                                     |
  | **Ice floe**       | ice    | the river's log, frozen — solid, drifting, and it never sits where it did last lap.                                                                                                                                                                   |
  | **Asteroid**       | space  | tumbling rock, solid and drifting. Asteroid Belt runs twenty of them down a 142px channel.                                                                                                                                                            |
  | **Alien**          | space  | walks across the channel bank to bank and turns round at each edge, not looking. Soft — it barely slows you — but it's never in the same place twice.                                                                                                 |
  | **Ashfall**        | lava   | settling soot. Not solid; it holds on to the hull, same as a weed bed.                                                                                                                                                                                |
  | **Debris field**   | space  | orbital junk, thick enough to snag on. Also not solid.                                                                                                                                                                                                |
  | **Brash ice**      | ice    | loose slush; it holds on to the hull, same as a weed bed.                                                                                                                                                                                             |
  | **Pressure crack** | ice    | the one hazard that isn't a circle. It opens as a seam straight across the channel on a cycle and is solid the whole way along while it's open — but it stops short of the far bank, and that gap is the way past.                                    |

  A hazard is never drawn wider than 80% of the channel half-width. A whirlpool broader than
  the river is not a hazard, it's a roadblock — the first cut had a 92px eddy on a 73px
  half-width and the whole field simply ground to a halt.

  The table in `HAZ` is what makes a hazard rather than a branch per type: `solid` is the hull
  clearance a boat is pushed back to on contact and marks it as something you hit rather than
  something you're pulled through, `bite` is what's left of your speed after a hard one,
  `drift` is how fast it rides the current, `cycle` is `[down, up]` seconds for the ones that
  come and go, `cross` is lanes-per-second for the ones that walk, and `drag` marks the ones
  that just hold on to the hull. Weed, ashfall and debris are that last one in three coats of
  paint — the second and third cost a table row and a drawing each, which is the point of
  having the table. A laid Net has no row —
  nothing about it is quoted per course — so the collision pass has to tolerate a hazard the
  table doesn't know, which is a guard worth having for whatever gear comes next.

  The cycled ones stagger their phase at spawn. A course's worth of orcas surfacing in unison
  reads as a cutscene rather than a hazard.

- **The lava world is a palette, not a second renderer.** Ember Flow, Cinder Run, Obsidian
  Narrows, Caldera Ring and The Crucible run the same physics and the same meander generator
  as the rivers; a course carries a `theme`, and every colour the world is drawn in resolves
  through `THEMES[theme]` — flats, the four channel bands, the flow dashes, the course
  thumbnail and the chartplotter. Those were hardcoded literals scattered through the render
  before, lifted out unchanged as the river palette, so a further world is a palette entry and
  some `gen` configs rather than a render rewrite. **Ice** and **Space** are exactly that, twenty-five
  courses each, and each world's set is drawn to be a different shape of race rather than the
  same meander twenty-five times: an open sweep, a narrow buckled one, a twisting one full of drift,
  a flattened ring, and one tight enough to be unforgiving.

  Every world now carries an **open, flat-out course drawn by hand** — Basalt Plain's rounded
  triangle, The Polynya's long lead down one side and a bay round the other, The Ecliptic's
  stadium canted eighteen degrees off the horizontal — and a **blind one**: Aa Field's three
  notches cut into a circle at deliberately uneven spacing, Serac Passage's slalom worked into
  the top half only, Terminator Line's wide sweeping arcs on one side and tight switchbacks on
  the other. A sinusoid's corners always arrive on the beat and it behaves the same all the way
  round; uneven spacing and a course with two different halves are things it structurally
  cannot produce, which is what those six slots are for.

  Each world also has a **technical course of hairpins** and an **angular one of straight lines**.
  The hairpins are a notch doubling back into the loop — a row of vents, a whaling inlet, a
  docking berth — and the angular ones are pure right angles: The Dykes is a plus sign of twelve
  of them, Station Cuts a staircase of treads and risers.

  All five of those, and the harbour below, taught the same lesson the hard way, and it is worth
  writing down because it is not obvious: **a hairpin fails on the spacing of its control points,
  not on its width.** Three of the five first measured as self-intersecting or cornering at a
  radius of 5–20px, and in every case the cause was two control points left within ~50px of each
  other where the notch met the outer loop — the smoothing cannot round a kink that tight. The
  fix each time was to delete the crowding point and let the notch descend straight from coast
  points 300px apart, not to widen the notch.

  The same rule caught The Gantries from the other direction. It started as a rectangle with a
  sawtooth of triangular gantries down one edge, and a tooth landing next to a corner makes a
  reversal — around 140&deg; — that the smoothing cannot round at any spacing: it measured a
  radius of 33px, and moving the teeth only moved the problem to the other end. Square bays fix
  it by construction, because every angle is a right angle and no control point sits within
  200px of its neighbour.

  Each world ends the way the rivers do: a **vast** course and an **enormous** one at 8,900 and
  9,800px a lap against Kraken Deep's 9,298 and Leviathan Run's 10,193, a **dogbone** with two
  long straights and the only real slipstreaming in the world, and an **asymmetric finale** that
  is two courses in one — a smooth sweep down one side and a weave down the other that gives
  nothing back.

  Each world also has a **full-fleet set piece** — The Firebowl, The Ice Shelf and The
  Drydock, all 290px wide and twelve boats, the same shape of race The Broadwater is on the
  rivers. They run to about 6,500px a lap against the 4,000&ndash;5,000 everything else holds,
  which is deliberate: a set piece should feel like a different size of event.

  Each world also has its **built environment**, and the three are deliberately different
  kinds of built: Foundry Quays is an L of right angles, Erebus Quay a harbour basin with a
  jetty you go up one side of and back down the other, Relay Quays a regular hexagonal station
  ring. Erebus Quay took four passes to land — the first was 5,685px against a 4,000–5,000
  band, and two attempts to shorten it drove the hairpin round the jetty from radius 46 to 21,
  tighter than anything else in the game. The fix was spacing rather than scale: control points
  60px apart either side of a right angle make a kink the smoothing can't round, and the three
  bands of the harbour (top edge, jetty, bottom edge) each need a channel width of room. The meander generator is a sinusoid, so
  a straight is one of the few shapes it cannot draw at all; those three are the only courses
  outside the rivers with real straights in them, and The Ecliptic is the only course in the
  game whose long axis isn't square to the world. Each also carries a **surging** course, where
  an eighth harmonic over a fourfold meander makes the channel swell and pinch rather than
  hold one width.

  Lava **inverts the river's value structure**: dark basalt flats with the channel as the
  brightest thing on screen, where a river runs dark water through lighter shallows. The two
  inner bands are deliberately far apart in value — at 22px the shelf ring is thin, and at
  close values it vanished into the channel and the whole river read as one flat orange slab.
  The ground tile is randomised and used to be built once globally, so it's cached per theme
  rather than per course; rebuilding it on every pick would reshuffle the ground underfoot.

  **The interface takes the colour of the world you're racing.** Every teal in the stylesheet
  resolves through one `--tint` triple, so a world's UI is that one declaration —
  `body[data-world]`, set whenever the course changes, turns the panels, rules and accents
  ember on lava. `--amber`, `--port` and `--stbd` stay put: coins are coins, and the marks are
  still red and green whatever they're floating in. The two derived colours, `--chart` and
  `--hair`, have to be declared on `body` rather than next to `--tint` on `:root` — a custom
  property is substituted where it's computed, so declaring `--chart` at `:root` bakes in the
  root's tint and children inherit that finished value, and overriding `--tint` further down
  does nothing to it.

  **Out on the basalt there are lava lakes**, what the wildlife is to a river: scenery you
  pass rather than anything you can touch. Blobs are baked once per course and drawn as the
  same irregular outline shrunk toward its centre three times — rim, pool, and a core that
  breathes. Clipping a circle inside the blob instead, which is what the first cut did, just
  reads as a disc with a bitten edge. **The channel marks are spatter cones** rather than
  floating buoys, lit from the top left so they sit up off the ground, but still red to port
  and green to starboard: the game is "keep the reds to port" whatever the marks are made of.

  Otherwise it's cosmetic for now — the molten channel doesn't hurt you any more than water
  does. Nothing lives out on the basalt to be scenery, so the only creature on a lava course
  is **the lava worm** that comes for you when you run aground: `THEMES[world].hunter` names
  which species `stepFauna()` summons, so a world brings its own predator rather than every
  world borrowing the river's shark. It's drawn as a running stream of molten rock — a chain
  of overlapping blobs down an undulating spine, in three passes (cooled crust, molten body,
  additive core) with a few crust plates riding on top. Blobs rather than one outline because
  a body that long can't promise a clean bezier at every wag, and overlapping circles never
  show a join; at wider spacing the tail broke into a row of beads and read as a string of
  embers instead of an animal. What it throws up when it takes a boat is lava, not blood:
  `THEMES[world].gore` supplies the two colours, and `goreHot` routes that spatter through
  `drawEmbers()` — over the hulls, additive, scaled up and back down across its life so it
  reads as something thrown in the air rather than the flat wake slick that spreads on the
  ground underneath.

- **Ice is the river frozen in.** Glacier Run keeps water in the channel — it's still the
  darkest thing on screen, the way a river is — and turns the plain it runs through into a
  white sheet you can read the cracks in. The ground texture is its own generator rather than
  the flats' short dashes: `iceTile()` lays down drifts of snow glare first, then cuts
  branching cracks through them, each crack a short run of wandering legs with every third one
  forked. A single polyline reads as a drawn line; a forked one reads as something that broke.
  Every crack is drawn at all four wrap offsets so one running off an edge comes back on the
  other, which is what stops a 200px repeating tile looking like a repeating tile.

  **Seals and polar bears** wander the sheet, and the bear is also what comes for you — the
  way the river's shark is both scenery and threat. A white bear on white ice is a smudge
  without an edge, so its silhouette is drawn twice: once scaled up in a cold grey, then again
  at size in white. That gives a clean outer halo without the seams that stroking each
  overlapping part would leave criss-crossing the body.

- **Space runs the same ribbon as a river of stars.** Nebula Drift inverts again — the plain
  is the darkest thing here and the channel glows. `starTile()` scatters faint dust, then
  stars, then a handful bright enough to carry a diffraction cross. Over the channel the four
  flow lanes get a second, far sparser dash pass at their own speed: at `[2, 46]` the dashes
  are dots, and dots drifting downstream are what makes it a river of stars rather than a
  violet ribbon.

  **Freighters and drifting green aliens** are the scenery, and the hunter is a saucer that
  shoots rather than bites. It's the one hunter with a `hunterReach` (105px against everything
  else's 30) and a `jawFar`, so the beam charges across the whole approach instead of flashing
  on for the last few metres — the point is that you see it coming. The beam draws from the
  rim out to whatever it's pointed at, additive, with the glow wider than the core. What it
  leaves is green plasma through the same `goreHot` path lava's spatter uses, and the banner
  says **Vaporised** rather than Eaten (`THEMES[world].hunterKill`).

  Space is the one world whose own colour can't be the interface tint: black text on a black
  panel is no interface at all. The black is the ground — panels and backdrop go to it — and
  the accent is the green everything alive out there is lit in, from the drifting aliens to
  the beam that gets you. Ice takes its white straight, since the panels stay dark.

- **Building all hundred costs 47ms at boot.** `TRACKS = COURSES.map(buildTrack)` runs for every
  course at load, and at forty courses that measured 40ms, which suggested a hundred would land
  near 100ms and want building lazily. Measured at a hundred: 46.9ms for 33,540 centreline
  points. The first number was mostly JIT warm-up, and the lazy build is not worth writing.
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
- **Run aground** and you lose way; stay stuck too long and something takes an interest, with
  a hard backstop a few seconds later. Which something depends on the world —
  `THEMES[world].hunter` names the species `stepFauna()` summons, so each world brings its own
  predator rather than every world borrowing the river's shark. Getting caught respawns you on
  the centreline.
- **Wildlife and scenery** — whales, rays, sharks and shoals of fish on the rivers, seals and
  polar bears out on the ice, freighters and drifting green aliens in space, and moored yachts
  with cheering crews along the banks. `THEMES[world].idle` is the roster and the count of
  each on a course of ordinary length; lava's is `null`, because nothing lives out on basalt.

The HUD keeps the instruments in one row along the top — lap, position, speed in knots and
elapsed time with last lap, session best and course record — leaving the chartplotter the
top-right corner and the bottom of the screen clear for the touch controls.

**Course records** are saved per course and survive a reload, shown on the menu tile and in
the HUD while you race. They live in `localStorage` under `tiderunner.records.v1`; storage
that refuses to answer (private windows, sandboxed frames) is handled, and records simply
stop persisting beyond the session rather than breaking the game.

**Next race**, on the results screen, moves straight to the next course in the same world
(wrapping from Skerryvore Sound back to Ouse Bends, or The Crucible back to Ember Flow) and
starts it — for a "just keep playing" session rather than a deliberate pick each time. Within
the world rather than down the whole list, so finishing the last river doesn't drop you into
lava unannounced. **Race again**, **Change course** — which opens the picker straight away
rather than dropping you on the menu to find it — and **Main menu** sit alongside it.

All four are the same box — same width, same height, same label size — in one centred block:
two columns above 560px, a single stack below, where two columns would be narrower than
"Change course" needs and every label would wrap to two lines. The primary is picked out by
being **filled** rather than by being bigger: `.go-btn` takes `var(--chart)` as its background
and knocks its label back out of the fill with `-webkit-text-stroke`, so the CTA is the exact
inverse of the `.ghost` buttons beside it. Nothing in that family is amber any more — the CTA
takes the world's colour with everything else, teal on the rivers and ember on lava. The
text-stroke is behind an `@supports` guard, since without it a transparent fill would leave the
label invisible; plain dark-on-tint is the fallback. `.go-btn` is styled app-wide, so Start
race, Done, Resume and Spin all read as the same kind of thing — a half-migrated mix of two
primary treatments would look worse than either.

## The Boathouse, coins and gear

**Courses unlock in order within their world** — finishing one (any place, any difficulty)
unlocks the next on that chain. `courseUnlocked(i)` walks `THEME_SEQ[theme]` rather than the
whole list, so each world's first course is open from the start; picking a locked one, from
the popup or a stale Next race target, is a no-op — a course you're actually racing was
already unlocked when you started it.

**Each river course has a challenge skin**, earned by lapping it 3 laps under a per-course
time target (`CHALLENGE_SKINS`, index-aligned to `TRACKS`). Beat all 25 and Diamond Camo
unlocks on top. Lava courses have no target time or skin of their own yet, so they map to
`null` and there's simply nothing to award — Diamond stays "beat all 25" rather than quietly
moving to 30 when the lava world landed.

**Coins are earned on every finish**, not just a win, adding three things rather than
multiplying them: `totalLaps` (the race you chose to run), a placement bonus, and a difficulty
rank out of 4.

| Term       | Values                                            |
| ---------- | ------------------------------------------------- |
| Laps       | 2, 3 or 5 — whatever the race was, doubled        |
| Placement  | 12 / 6 / 3 / 0 for 1st / 2nd / 3rd / 4th-or-worse |
| Difficulty | Easy 2, Normal 4, Hard 6, Insane 8                |

A 5-lap Insane win is `10 + 12 + 8 = 30`, the ceiling. A 2-lap Easy 4th-or-worse is `4 + 0 + 2 =
6`, the floor — showing up is still worth something even without a placing, just not much.
`DIFF_RANK` and `placeBonus()` are the only two things involved, both right next to
`coinsForFinish()` in `docs/index.html`, and trivial to retune.

**Winning is meant to visibly outpace merely finishing, not just edge it out.** The original
formula (`laps + placeBonus`, `placeBonus` topping out at 3) put a 3-lap Normal win at 6 coins
against 4 for last place — barely a difference, so there was little reason to race for position
rather than just survive to the finish. `placeBonus()` going from 3/2/1/0 to 12/6/3/0, on top of
the base and difficulty both doubling, makes that same win worth 22 against last place's 10 —
more than double, not "a bit more."

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
stars, same idea as Amsterdam's simplified X's). All of them cost the same **150 coins** — a flat
price rather than a ladder, still roughly 5-25 races against `coinsForFinish()`'s 6-30-per-race
range, same pacing as the original 75 coins against the original 3-12 range. Doubled deliberately
alongside `coinsForFinish()` rather than left at 75 once income doubled too, so flags stay a
genuine grind instead of suddenly going cheap. Germany isn't duplicated here since it already
exists as a challenge skin.

**The flag actually shows on the boat**, not just the shop card. Challenge skins already had
hand-drawn canvas patterns for the hull in `paintPlayerSkin()`; shop flags fell through to a
flat `base`-colour fill with only the small trim-coloured cabin accent hinting at a second
colour. `paintPlayerSkin()` now falls back to drawing the flag's own SVG (the same one used for
the shop card preview) onto the hull with `drawImage`, cached per flag id in `shopFlagImages`
the first time it's needed and redrawn from that cache every frame after.

A locked, affordable shop skin buys and equips itself on tap, no confirmation step, matching
how every other single-tap choice in this menu already works; short of the price, tapping does
nothing and the card's note says by how much.

All three unlock paths — challenge, Diamond, shop — write into the same
`progress.skins[id] = true` map under `tiderunner.progress.v1` in `localStorage`, which is
what lets `skinUnlocked()`, `selectedSkin()` and the Skins grid treat every skin uniformly
regardless of how it was earned. Adding another shop skin is one entry in `SHOP_SKINS`; adding
another earn path is one more branch in `skinUnlocked()`.

**The Skins screen is split into four tabbed categories** — Colours, Flags, Challenges
(the 25 challenge skins plus Diamond Camo, which needs all of them), then Other — each its own `.skin-grid`,
built by the same shared `skinCard()`/`fillSkinGrid()` helpers so a skin's card looks and
behaves identically regardless of which grid it's in. Only one grid is shown at a time, switched
via a `.seg` tab bar (the same segmented-control style as the Laps/Rivals pickers); opening the
menu defaults to whichever tab holds the currently equipped skin, via `skinCategoryFor()`.

**Nine solid colours now**, not five — Harbour Gold, Jet Black, Volt Green, Flare Red and Ion
Cyan, plus Pearl White, Riptide Purple, Sunset Orange and Coral Pink.

### Animated skins

**The three lime skins in Other are drawn per pixel, not painted.** `ANIMATED_SKINS` holds
Lime Nebula (fractal gas clouds with twinkling stars), Lime Flux (domain-warped camo
posterised to four tones so the blob edges stay crisp while the blobs drift) and Lime Pulse
(hex cells lit by a wave travelling bow to stern). All three cost 300 coins and save through
the same `progress.skins` map as everything else, so nothing about buying, equipping or
persisting them is special-cased — `skinCategoryFor()` gained one branch and that is the whole
of their integration. Each carries an `anim: { speed, intensity }` pair; the values in the file
are the defaults, not constraints.

There is no shader stage in this game, so the "material" is an `ImageData` buffer filled by
hand and stretched over the hull. Three things keep that affordable:

- **48×24 per skin.** The hull is about 36px across on screen, so the buffer is drawn very
  slightly down rather than up, and `imageSmoothing` turns the noise lattice into cloud. The
  garage previews stretch the same buffer, which is why they read soft — deliberate, since a
  preview-sized field would cost 16× as much for a picture nobody races on.
- **A cache keyed by skin _and_ size, holding the time it was last built at.** Asking for the
  same field twice in a frame builds it once.
- **`FIELD_FPS = 24`, by quantising the clock rather than counting frames.** The motion is slow
  enough that the rebuild rate is invisible, and it holds regardless of a skin's `speed`.
  Measured cost per animated hull: 0.56ms per build, 0.23ms amortised per frame.

**A hex tiling is the Voronoi diagram of a triangular lattice**, so Lime Pulse finds a pixel's
cell by taking its nearest lattice point out of nine candidates. The gap between the nearest
and the runner-up is the distance to the cell wall, which gives the emissive edge for free —
no separate edge pass.

**`skinT` belongs to `render()`**, which runs every frame in every state including the menu.
The garage's own rAF loop therefore only redraws; when it also advanced the clock, the skins
ran at double speed anywhere a preview was on screen.

**Deciding whether a preview is on screen needs `checkVisibility()`.** Neither of the obvious
tests works here: the browse popup is `position: fixed`, so every canvas inside it reports a
null `offsetParent` whether it is open or not, and it hides itself with `visibility` rather
than `display`, so it keeps its client rects while shut. The loop shuts itself down when
nothing it holds is visible, which is the normal state for a grid on an unselected tab, so
`showSkinCategory()` and `openSkinsBrowse()` re-arm it — those are the two moments that can
put a hidden preview on screen.

**Reduced motion freezes the field at t=0 rather than dropping it.** The player bought a
pattern, so they still get the pattern; it just holds still. That is also the static fallback
for anything that can't keep up.

**Every card previews the actual boat, not a flat swatch.** `traceHull()`, `paintPlayerSkin()`
and `hull()` used to be closed over the live game's own canvas context; they now take a context
as their first argument, so the exact same drawing code that paints the racing boat also paints
a tiny boat-shaped icon on each Skins card and on the "new skin unlocked" popup, via one shared
`drawSkinPreview(canvas, skin)`. What you see in the menu is pixel-for-pixel what you get on the
water — hull shape, flag or pattern, trim accent and all — instead of a rectangle in the skin's
base colour.

**The card backdrop is the same pattern too, blown up and dimmed behind the boat.**
`drawSkinPreview()` calls `paintPlayerSkin()` a second time first, scaled non-uniformly so its
fixed 36×18 hull rect fills the whole canvas edge to edge, at 40% opacity — then draws the boat
itself over it at full brightness. A flag or camo now reads at a glance before you've even
picked the boat shape out of the card, without hand-drawing a second version of every pattern.

**The Skins screen is now the Boathouse**, and skins are one part of it rather than the whole
thing. "Your name" moved in from the pre-race screen — same `#playerName` input, same
`SETTINGS.name`/`saveSettings()` wiring, just relocated — so there's a reason to open the
Boathouse even when you're not spending coins. "Your boat" collapsed from three always-visible
tabbed grids down to a single summary card (the equipped skin's own `drawSkinPreview()`, its
name and category) with a **Browse** button; the three tabs and grids didn't go anywhere, they
just moved into `#skinsBrowsePop`, a full-screen popup that mirrors `#coursePop` — same overlay
CSS, same open/close/Escape pattern — rather than inventing a second kind of popup.

**Done stays put while the rest of the sheet scrolls.** The Boathouse's content — name, daily
spin, boat summary, gear list — got long enough that Done used to need scrolling past the gear
list to reach. `#skinsMenu .sheet` is now a flex column with the scrollable content wrapped in
its own `.bh-scroll` (`flex:1 1 auto; min-height:0; overflow-y:auto`, the same pattern
`#popGrid` already used for a scrolling middle under a fixed header) and `.btnstack` sitting
after it as a fixed footer. `fitSheets()` still measures `.sheet` generically across every
screen and may toggle its `scrolls` class, but that class no longer does anything here — the
sheet itself doesn't overflow any more, only `.bh-scroll` does — so `#skinsMenu .sheet.scrolls`
is overridden back to `overflow: hidden` regardless of which way that toggle lands.

**Gear is a consumable, not a skin.** A flag is bought once and stays bought;
`progress.skins[id]` only ever needs to be a boolean. Gear gets bought, used, and bought again,
so it needed an actual count: `progress.gear[id]`, incremented by `buyGear()` and decremented
both by buying and by spending a charge in a race. Every item you own comes with you into the
next race — there's no single "carried" slot to pick between them, so buying a second kind of
gear doesn't cost you the first. Four items so far, all defined in one place (`GEAR_ITEMS`,
right next to the shop skins) with a small hand-drawn canvas icon apiece, reused unmodified for
the shop row, the in-race HUD stack and the "+1 X" spin-wheel wedge:

| Item           | Price | Effect                                                                     |
| -------------- | ----- | -------------------------------------------------------------------------- |
| Net            | 12    | Drops behind the boat; the next rival to cross it loses way to a near-stop |
| Nitro Charge   | 15    | An extra 3.4s of boost, triggered on demand instead of found on the course |
| Torpedo        | 20    | Fires from the bow; a hit brings the rival to a near-stop, same as a net   |
| Tracer Torpedo | 30    | Locks onto the boat ahead of you at launch and curves to chase them down   |

Dropped from 25/45/30/60 (a single item briefly cost _more_ than a flag) once
`coinsForFinish()` and the flag price both doubled — a consumable needs to be cheap enough to
buy every race or two, or "buy it, use it, buy another" doesn't actually happen.

**In the race, gear reuses physics that already exist rather than inventing new ones.** Nitro
just sets `b.boost` — the same field a boost pickup sets, so the flame trail and HUD glow are
free. Net pushes a `{ type: "net", owner, ttl, spent }` object into the same `hazards` array a
course's weed beds live in; `hazardForces()` gets one more `else if` branch that skips the
boat that dropped it, cuts its velocity to 4% — a near-total stop, the same weight as running
into a buoy, rather than the milder slowdown both Net and Torpedo shipped with at first, which
playtesting found barely noticeable — on the first rival to touch it, and marks it `spent` so
one net only ever catches one boat, then `stepHazards()` sweeps it out. `drawHazards()` gets its
own `net` case too — a cross-hatched lattice inside an ellipse outline — rather than falling
through to the log drawing, which is what it did at first (invisible in practice, since a net
has no `h.a`/`h.wob` for the log branch to rotate and bob by, so the transform went to `NaN` and
nothing painted). Torpedo is the genuinely new moving thing — a straight-line shot in its own
`torpedoes` array, stepped and collision-checked in `stepTorpedoes()`, called from `update()`
right after `stepHazards()`; `drawTorpedoes()` is its equivalent of `drawHazards()`, added
alongside it — the first version had the physics and hit detection working but nothing drawing
the torpedo itself, so firing one looked and felt like nothing had happened even when it landed.
It shares the net's 4% hit — same "dead stop" weight, different delivery.

**The 4% hit alone still recovered too fast to feel like it landed.** Zeroing velocity for one
frame didn't stop the engine from pushing straight back up to speed on the next one — cutting
speed is not the same as taking speed away for a while. Both hits now also set `b.stunned = 1`,
a new boat field `stepBoat()` checks right after computing thrust (throttle and any active boost
alike): while it's above zero, `push` is forced to `0` before it's applied to velocity, so there's
no acceleration at all for a full second — the river current still nudges a stunned boat along
and it can still be steered, just not driven, before thrust comes back on its own. Net's older
`b.netted` (2s of extra drag) still runs underneath it: 0–1s is a dead stop, 1–2s is sluggish
recovery, rather than the hit being fully over in one frame. (Started at 0.5s; a second full
second read better on replay.)

**Tracer Torpedo is a torpedo with `homing: true` and a locked-on `target`, not a new system.**
`boatAhead(b)` — next to `ranked()`, since it's just "one place better in that same order" — is
called once at launch to find whoever's currently ahead of the player; the target doesn't
change even if someone else takes that spot mid-flight, and the leader firing one just gets a
plain straight shot, `target` being `null`, rather than the charge doing nothing. Every frame in
`stepTorpedoes()`, a homing torpedo turns at most `TRACER_TURN_RATE` (3.2 rad/s) toward its
target's current position — a chase with a real turn radius a target can juke, not a snap-to
guarantee — before moving and running the same hit check every torpedo does.
`drawTorpedoes()`'s only concession to it is colour: teal instead of red, `t.homing` picked at
draw time, same shape.

`me.gear` (an id → count map, seeded from `progress.gear` at `startRace()`) tracks what the
player is carrying for the race, separately from `progress.gear`, which `useGear(type)` also
decrements immediately so a mid-race quit doesn't hand back an unspent charge. Gear is
player-only for this first pass: rivals never carry or trigger it, so there's no AI
decision-making to get right yet, only the mechanics themselves. The HUD shows one circle per
gear type you're still carrying, stacked bottom-left above the pause button (mirroring its
corner and styling) rather than a single button for one selected item, since you can carry every
kind at once now; each circle's count badge reads `9+` once it passes nine so it never
grows past what the circle can hold. Tap a circle to fire that item, or press `Space` on desktop
to fire whichever owned item comes first in `GEAR_ITEMS` order; a circle disappears the moment
that item's count hits zero.

**On touch the stack moves out from under your thumb.** The stick is a floating one — it
appears wherever you press — so on a phone it lands straight on top of a stack anchored in the
bottom-left corner, which is exactly where a right-handed player puts their left thumb. On
every `pointerdown` the body takes a `joy-left`/`joy-right` class from which half of the screen
the stick landed in, and the stack moves to the other side and up clear of the pause button.
It keeps that side after the stick is released rather than snapping back — otherwise letting go
to reach for a gear button would drop it right back under the thumb that just let go.

**A daily spin gives away a taste of the gear economy for free.** One spin per calendar day
(`progress.lastSpin`, a plain `YYYY-M-D` string compared against `todayKey()` — a played-out
day, not a rolling 24 hours), weighted toward small coin amounts with two of the three gear
items as the rarer outcome and a 75-coin jackpot at the bottom of the odds. The wheel is drawn
from the same `SPIN_REWARDS` list the payout logic reads, so it can't show a wedge spinning
couldn't actually land on. Winning gear calls the exact same "increment `progress.gear[id]`"
line buying it would. The day turns over at 9am rather than midnight (`SPIN_RESET_HOUR`,
subtracted from `Date.now()` before `todayKey()` reads the date), on the theory that most
players open the app before bed rather than right after waking up.

Once the free spin is used, a second "watch an ad for another spin" button appears in its
place (`adSpinAvailable()`, its own `progress.lastAdSpin` date stamp so it resets on the same
9am boundary — one bonus spin per day, same as the free one). `playRewardedAd()` is currently a
stand-in — a couple of seconds of simulated "loading" — that arms one bonus spin
(`bonusSpinArmed`, held in memory only, not persisted: closing the Boathouse before spinning the
armed bonus just means watching another ad next time) and needs swapping for a real
rewarded-ad SDK call before shipping, calling `onComplete()` only once the viewer has actually
earned the reward.

**The wheel lands on the wedge it actually pays out.** The rotation delta is measured from
where the wheel is currently parked (`wheelRotation` mod 360), not from zero. It accumulates
across spins, so computing the delta as `1800 + (360 - segMid)` was only right for the first
spin of a session; every one after that landed the previous spin's offset away from the wedge
it had just awarded, and the pointer said one thing while the coins said another.

Three close/reopen edge cases around that flow are guarded explicitly rather than left as bugs:
`adLoading` tracks whether a `playRewardedAd()` call is still in flight, independently of the
button's own `disabled` state, because closing the popup and reopening it mid-load used to
reset the watch-ad button back to clickable — `refreshSpinStatus()` had no way to know a request
was already pending — which could fire a second one alongside the first. And `spinPopSession`,
bumped every time `openSpinPop()` runs, is what the auto-close timer scheduled after a landed
spin checks against before closing: without it, reopening the popup — say, to watch the bonus
ad — inside that timer's 2s window let it fire anyway and slam the new session shut, since its
only check was "is the popup currently open," which reopening had made true again for an
unrelated reason. That same auto-close is now held in `spinCloseTimer` and cancelled the
moment the player taps the ad: the ad offer appears exactly when the free spin lands, which is
also when the two-second timer starts, so tapping it inside that window used to close the
popup mid-ad and drop the player back on the Boathouse to go and find their bonus spin. The
ad's completion handler reopens the popup if it had already closed, so watching an ad always
ends on the wheel with the bonus spin ready.

**The wheel itself lives in its own full-screen popup (`#spinPop`), not inline in the
Boathouse.** The Daily Spin section there is just a launcher — reusing the `.boat-summary`
card pattern verbatim (icon, meta text, a chip CTA) with `#spinStatus` as its live status line
— that opens the popup on tap. The popup follows the same `.screen` + centered `.sheet.panel`
convention as the skin-unlock celebration (`#skinPop`), just with the wheel scaled way up
(`.wheel-wrap-big`) so the spin reads as the main event rather than something happening in a
corner of a longer scrolling page. Landing flashes the wedge that was actually won
(`wheelPaths[idx]`, a per-segment reference array `buildSpinWheel()` fills in alongside the SVG
it already builds) and pops the reward line in with a small scale animation, then the popup
closes itself two seconds later — `spinBtnEl.onclick`'s existing reward-resolution callback,
extended rather than replaced. It can also be dismissed early with the `✕` or `Escape`, which
just hides the overlay; the reward is already committed to `progress` by the time either could
fire, so there's nothing to lose by closing early.

## Controls

| Action   | Keyboard          | Touch                                                            |
| -------- | ----------------- | ---------------------------------------------------------------- |
| Throttle | `W` / `↑`         | **GO** pad                                                       |
| Astern   | `S` / `↓`         | **Reverse** pad                                                  |
| Helm     | `A` `D` / `←` `→` | Left thumb joystick                                              |
| Restart  | `R`               | **Restart race** in the pause menu                               |
| Use gear | `Space`           | Amber circular buttons, one per item carried, opposite the stick |

Touch controls appear automatically on coarse-pointer devices.

**Two fingers work at once**, which took fixing. The stick was tracked with
`setPointerCapture` on the full-screen touch overlay, and the gear buttons fired on `click`.
Between them a second finger was useless: a click is synthesised from a whole touch sequence,
and one landing while the helm is already held does not reliably produce one, so firing gear
meant letting go of the helm first — the one moment you cannot afford to. The stick is now
tracked with `pointermove` / `pointerup` on the window instead of a captured pointer, which is
what the capture was really for (keeping the stick alive when the thumb slides over the gear
buttons, which sit at a higher z-index) without taking the pointer hostage; and gear fires on
`pointerdown`, with the `click` handler kept only for keyboard activation, which arrives with
`detail === 0`. Regression-tested with two real touch points through CDP: the helm stays held
and still steers while the second finger fires.

**Pause is wired the same way**, so you can call for it without letting go of the helm. Both go
through one `onTap(el, fn)` helper rather than two copies of the same trick — anything you might
reach for mid-race belongs on the press, not on the click.

**The gear sits in a box of its own**, and the box is the point. The overlay that reads the
stick covers the whole screen, so a thumb landing _beside_ a gear button rather than on it
planted a fresh joystick right under the gear — measured before the change: 12px outside the
stack was enough. The stack now carries 12–14px of padding, and anything inside it belongs to
the gear. It's drawn rather than invisible so the safe area is somewhere you can see instead of
something you have to learn, and the padding is subtracted back off the offsets so the buttons
sit exactly where they did before the box existed (measured: they moved 1px). The corner radius
is 26px rather than a pill — at a radius wider than half the box, the corners round away to
nothing and a thumb landing in one is outside the guard again, which the first cut did.

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

The main menu's title is `docs/tiderunner-wordmark.png` (the same wordmark the app icon uses),
not styled text — it's an `<img>` inside the `<h1>`, sized by `.brand-logo`'s `height: clamp(...)`
so it scales the same way the old text title did.

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
