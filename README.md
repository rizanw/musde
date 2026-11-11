# MUSDE — MUSDE Ultimate Space Debris Extinguisher

A 3D endless-runner in the browser, built with **Three.js** and playable with your mouse, a touchscreen, or your bare hands through a **Leap Motion** controller. Fly the ship over an alien planet, grab space debris, and dodge the hazards before your energy runs out.

**[▶ Play it in your browser](https://musde.rzndwb.xyz/)** · **[Watch the demo](https://youtu.be/iEwIx27ZDqE)**

<!-- TODO: add a gameplay GIF or screenshot, e.g. docs/gameplay.gif -->
<!-- ![MUSDE gameplay](docs/gameplay.gif) -->

## Features

- **Real-time 3D rendering** with Three.js: glTF models, procedurally animated planet surface, particles, sky and clouds
- **Three input methods**: mouse, touch, and Leap Motion hand tracking (palm position steers the ship, grab gestures are detected from grab strength)
- **Progressive difficulty**: speed and level increase with distance traveled
- **Energy and health system** with debris collection and collision feedback
- **Local high-score board** persisted in the browser with IndexedDB
- **Sound design**: background music and effects for engine, lasers, warp, and explosions
- **Texture swapping** between planet themes

## Tech stack

| Area | Tools |
|---|---|
| Rendering | Three.js, GLTFLoader |
| Input | Mouse/touch events, LeapJS |
| Persistence | IndexedDB |
| Build | Webpack 4, Babel |

## Getting started

Requirements: Node.js and npm.

```bash
git clone https://github.com/rizanw/musde.git
cd musde
npm install

npm run start:dev   # dev server with live reload at http://localhost:9000
npm run build       # bundle src/ into public/main.js
npm start           # serve the built game from ./public
```

To play with hand tracking, install the Leap Motion (Ultraleap) driver and plug in the controller before opening the game. Without one, the game falls back to mouse or touch.

## Project structure

```
src/
├── index.js        # game loop, scene setup, input handling, UI state
├── conf.js         # game tuning: speeds, levels, spawn distances, colors
├── 3d/             # scene objects: ship, planet, sky, clouds, debris, enemies, particles
└── util/           # Leap Motion handling, audio, IndexedDB high scores, glTF loader
public/             # static assets (3D models, textures, audio, fonts) and build output
```

## Team

Built in 2019 as a Computer Graphics course project at Institut Teknologi Sepuluh Nopember (ITS) by:

- [Rizky Andre Wibisono](https://github.com/rizanw)
- Anggar Wahyu

## Credits

This is a non-commercial fan project. Star Wars names, ship designs, and music belong to Lucasfilm/Disney. 3D models of the ship and debris come from their original authors on Sketchfab. <!-- TODO: list each model's author and license here -->

## License

[MIT](LICENSE) for the source code. Third-party assets keep their original licenses.
