# Mathsteroids
Mathsteroids is a game based on asteroids that can be played on a selection of interesting mathematical surfaces.
Press `A` and `D` to steer the ship left and right, `W` to move forwards and `K` to fire. Destroy the asteroids to win points.

You can play mathsteroids at [mscroggs.co.uk/mathsteroids](http://www.mscroggs.co.uk/mathsteroids).

## Surfaces
The following surfaces are currently available:

* Sphere
  * Mercator projection
  * Isometric
  * Stereographic projection
  * Gall–Peters projection
  * Craig retroazimuthal projection
  * Distance preserving azimuthal projection
  * Robinson projection
  * sinusoidal projection
  * Mollweide projection
  * Goode homolosine projection
  * dymaxion map
  * cube net
  * tetrahedron net
  * octahedron net
  * dodecahedron net
  * icosahedron net
* Flat
  * cylinder
  * Mobius strip
  * torus
  * Klein bottle
  * real projective plane
  * unbounded
  * loop (elliptical pool)
* Torus
  * Top view
  * Projected flat
* Hyperbolic
  * bounded
    * Poincare disk model
    * Beltrami-Klein model
    * Poincare half-plane model
    * hyperboloid
    * Gand model
    * band model
  * unbounded
    * Poincare disk model
    * Beltrami-Klein model

# Config.json
Mathsteroids can be configured by setting values in a file called `config.json`
(see [`config.json.template`](config.json.template)). The following entries can be set
in the configuration JSON:

-----------------------------------------------------------------------------------------------
| Entry                 | Allowed values                            | Default   | Description |
-----------------------------------------------------------------------------------------------
| `"high-scores"`       | `true`, `false`                           | `false`   | Toggles high score tables |
| `"controller"`        | `"none"`, `"playstation"`, `"mega-drive"` | `"none"`  | Allows input from a controller to be used |
| `"game-mode"`         | `"lives"`, `"time"`                       | `"lives"` | Set the game mode. If `"lives"`, player start with 3 lives and games end when lives run out. If `"time", games will last 30 seconds, with negative points given for losing a "life" |
| `"pre-html"`          | Any string                                | `""`      | HTML to place above the game |
| `"centered"`          | `true`, `false`                           | `false`   | Toggles centering of content |
| `"show-webad"`        | `true`, `false`                           | `false`   | Toggles advert below game saying you can play it onling|
| `"show-instructions"` | `true`, `false`                           | `true`    | Toggles instructions that can be displayed beloe the game |
| `"debug"`             | `true`, `false`                           | `false`   | Toggles the visibility of debug information |
-----------------------------------------------------------------------------------------------

