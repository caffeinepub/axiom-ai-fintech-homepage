# VVSPL MF Agent

## Current State
- Homepage (`HomePage` in App.tsx) uses a flat dark background (`#0f1117` / `#141920`)
- Three.js, @react-three/fiber, @react-three/drei are already installed
- Inner pages (SIP, Risk Profile, Fund Analysis, Projection, Report, Saved Reports) also use flat dark backgrounds

## Requested Changes (Diff)

### Add
- `AnimatedBackground` component: a full-screen fixed canvas using React Three Fiber with:
  - Animated 3D particle field (floating nodes representing financial data points)
  - Interconnected line mesh between nearby particles (neural network / data mesh look)
  - Slowly rotating / drifting camera animation
  - Ambient glow orbs (emerald #00c896 and subtle gold/purple) pulsing in 3D space
  - Smooth depth-of-field atmospheric fog effect
- Background applied to homepage AND all inner pages via the root layout

### Modify
- `RootLayout` in App.tsx: render `AnimatedBackground` as a fixed, full-screen z-0 layer behind all page content
- All page containers: ensure `position: relative; z-index: 1` so content sits above the canvas
- Homepage `HomePage`: remove the solid `#0f1117` background from the outer div so the 3D canvas shows through; keep card backgrounds semi-transparent glassy

### Remove
- Nothing removed

## Implementation Plan
1. Create `src/frontend/src/components/AnimatedBackground.tsx` with Three.js canvas
   - 200 floating particles in 3D space
   - Line segments connecting particles within proximity threshold
   - Two large glowing orbs (emerald, soft indigo) slowly moving
   - `useFrame` for animation, particles drift slowly with sine/cosine offset
   - Canvas is `position: fixed, top:0, left:0, width:100%, height:100%, z-index:0, pointer-events:none`
2. Import and render `<AnimatedBackground />` in `RootLayout` (before `<Outlet />`)
3. Update `HomePage` outer div: remove bg color, ensure cards keep their semi-transparent styles
4. Update `PageWrapper`: remove the solid bg so canvas shows through
5. Ensure nav bar has a semi-transparent backdrop-blur so it sits cleanly above the canvas
