# Project Guidelines & Architecture Memory

## 3D Orbit & Disciplines Section State

### 1. Front Card Alignment & Focus
- Front-facing natural camera orientation as cards rotate through the center orbit position.
- No artificial scale/zoom pop or `targetZBoost` on the active front card; cards retain natural scale proportional to orbit depth.

### 2. Hover & Drag Interaction Physics
- Hovering over cards MUST NEVER pause or freeze orbit rotation. Continuous auto-rotation runs at all times when not actively dragging.
- Smooth GSAP hover progress interpolation (`--hover-p`) drives edge lighting and frosted glass reflections continuously.
- Pointer dragging pauses auto-rotation and applies smooth inertia decay upon release without snapping or position jumps.

### 3. Directional Studio Lighting
- Fixed scene-space key light anchored ~35° top-behind the orbit.
- No central radial emitting sphere. The orbit moves through fixed lighting.
- Ambient fill ensures back cards maintain legibility (minimum 55–58% brightness baseline).
