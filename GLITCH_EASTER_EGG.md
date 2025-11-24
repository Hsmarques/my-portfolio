# Retro Easter Egg - Vintage Mode

## Overview
A hidden vintage/retro theme that transforms the entire portfolio site into a classic newspaper/vintage photograph aesthetic when activated by clicking a special "trigger" photo in the gallery.

## How to Activate
1. Navigate to the home page gallery
2. **Hover over the FIRST photo** in the gallery - you'll see a vintage postcard frame effect with golden borders and a warm sepia glow
3. **Click the first photo** to toggle vintage mode ON
4. Click it again to toggle vintage mode OFF

The trigger photo has a tooltip: "✨ Est. 1895 - A Window to the Past"

## Visual Features

### Vintage/Retro Theme Characteristics
- **Typography**: Classic serif fonts (Georgia, Times New Roman) throughout
- **Colors**: 
  - Cream (#F5E6D3) - aged paper background
  - Sepia brown (#8B7355) - body text
  - Burgundy (#6B2737) - headings
  - Dark brown (#2A1810) - navigation/dark elements
  - Gold (#D4AF37) - accent borders and highlights
- **Borders**: Ornate double borders, decorative frames
- **Textures**: Subtle line texture simulating old paper
- **Photos**: Sepia filter on images for vintage photograph effect
- **Shadows**: Soft, warm shadows with sepia tones
- **Text**: Elegant serif, italicized elements, proper case

### Activation Animation
When you click the trigger photo:
- **Vintage Fade**: Gradual sepia tone transition with film grain effect
- **Paper Fold**: Subtle 3D rotation mimicking page turn
- Duration: 1000ms (slower, more elegant)

### Hover States
The trigger photo has a unique hover effect:
- Vintage postcard frame with ornate borders
- Pulsing golden glow (warm, antique feeling)
- Sepia tone deepening on the image
- Dashed gold border appearing around the frame
- Continuous gentle animation loop

### Theme Changes

#### Navigation Bar
- Dark brown background with cream text
- 3px double gold border with subtle inner glow
- Text transforms to: "Hugo Marques, Esq.", "Photographs", "Biography"
- Italic serif typography
- Gold divider line

#### Hero Section
- Title changes "Code" → "Craft"
- Highlighted words get gold background with burgundy border and shadow
- Subtitle becomes: "Hugo Marques — Photographer & Digital Craftsman, Est. 2024"
- Button text: "View Collection"
- Burgundy text with gold shadow on headings
- Sepia-toned body text

#### Gallery
- Thick cream borders (6-8px) mimicking photo frames
- Gold inner outline creating ornate frame effect
- Sepia filter on all photos (30-40%)
- Warm drop shadows
- Double outline borders

#### Section Headers
- "Recent Captures" → "Recent Exhibitions"
- "View all photos" → "Complete Gallery →"
- Footer text → "Hand-crafted with SolidJS — A Modern Web Publication"
- Double-line borders in sepia tones

#### Lightbox/Modal
- Dark brown background
- Cream and burgundy buttons with gold borders
- Vintage frame-style controls
- Counter badge gets burgundy background with cream text

## Technical Implementation

### Architecture
```
src/
├── lib/
│   └── GlitchContext.tsx          # Global state management
├── components/
│   ├── Gallery.tsx                # Trigger photo logic
│   └── Nav.tsx                    # Brutalist nav styling
├── routes/
│   └── index.tsx                  # Brutalist hero text
├── app.tsx                        # Context provider wrapper
└── app.css                        # Brutalist theme CSS
```

### State Management
- **Context**: `GlitchProvider` wraps entire app in `app.tsx`
- **Signals**:
  - `isBrutalistMode()`: Boolean - current theme state
  - `isGlitching()`: Boolean - animation trigger (600ms duration)
- **Persistence**: State saved to localStorage (`brutalist-mode` key)
- **SSR Safety**: All window/localStorage access guarded with `typeof window !== 'undefined'`

### CSS Strategy
Global CSS classes applied to root wrapper:
- `.brutalist-mode` - Applied when theme is active
- `.glitch-active` - Applied during activation animation
- `.glitch-trigger` - Applied to first photo in gallery

All brutalist styles use `!important` to override existing styles, ensuring complete theme transformation.

### Key Files Modified
1. **src/lib/GlitchContext.tsx** (NEW)
   - SolidJS context provider
   - Signal-based state management
   - LocalStorage persistence

2. **src/app.tsx**
   - Wraps app with GlitchProvider
   - Applies global CSS classes based on state

3. **src/app.css**
   - ~250 lines of brutalist theme CSS
   - Keyframe animations for glitch effects
   - Trigger photo hover styles
   - Complete component overrides

4. **src/components/Gallery.tsx**
   - Detects first photo as trigger
   - Toggles brutalist mode on click
   - Special hover class and tooltip

5. **src/components/Nav.tsx**
   - Conditional text rendering (normal vs brutalist)
   - Uses context for theme detection

6. **src/routes/index.tsx**
   - Conditional text rendering for hero and sections
   - Uses context for theme detection

## Testing

### Manual Testing Steps
1. **Initial State**
   ```bash
   npm run dev
   # Navigate to http://localhost:3000
   # Verify normal theme loads
   ```

2. **Trigger Discovery**
   ```
   # Hover over first photo
   # Verify chromatic aberration effect
   # Verify tooltip appears
   # Verify pulsing border animation
   ```

3. **Activation**
   ```
   # Click first photo
   # Verify glitch flash animation plays
   # Verify entire site transforms to brutalist theme
   # Verify all text changes (nav, hero, sections)
   # Verify all colors change (neon green, black, white)
   ```

4. **Persistence**
   ```
   # Refresh page
   # Verify brutalist mode persists
   ```

5. **Deactivation**
   ```
   # Click first photo again
   # Verify site returns to normal theme
   # Verify glitch animation plays
   ```

6. **Build Test**
   ```bash
   npm run build
   # Verify no TypeScript errors
   # Verify build succeeds
   ```

### Browser Compatibility
- Modern browsers with CSS Grid support
- CSS animations (keyframes)
- LocalStorage API
- Tested on: Chrome, Firefox, Safari, Edge

## Design Rationale

### Why the First Photo?
- Most prominent position in the gallery
- Users naturally explore gallery from top-left
- Consistent location regardless of content

### Why Vintage/Retro?
- Creates beautiful contrast with modern default theme
- Evokes nostalgia and timeless photography aesthetic
- Warm, inviting alternative to dark minimalism
- Feels like stepping into an old photography studio or classic newspaper
- Celebrates the history and craft of photography

### Why Toggle Instead of Permanent?
- Users can experience both themes
- Non-destructive - easy to exit
- Encourages repeat interaction
- Reduces novelty fatigue

### Why LocalStorage?
- Preserves user choice across navigation
- Demonstrates technical capability
- Creates consistency in experience
- Optional - can be removed if not desired

## Future Enhancements (Optional)

1. **Sound Effects**: Add vintage camera shutter sound on activation
2. **More Animations**: Film reel countdown or page flip effects
3. **Hidden Messages**: Console.log vintage photography quotes
4. **Konami Code**: Alternative activation method
5. **Theme Variations**: Different era styles (1920s, 1950s, 1970s)
6. **Analytics**: Track how many users discover the feature
7. **Other Pages**: Extend vintage styling to /photos, /about pages
8. **Paper Texture**: More detailed old paper texture overlay
9. **Typewriter Effect**: Animated text reveal on activation

## Notes for Developers

- The trigger photo is determined by array index (0), not photo ID
- If gallery order changes, trigger moves with the first position
- To change trigger photo, modify the `isGlitchTrigger` logic in Gallery.tsx
- To adjust colors, edit CSS variables in app.css `:root` selector
- Animation duration can be adjusted in GlitchContext.tsx timeout
- All `!important` flags in CSS are intentional for complete override

## Known Limitations

1. Lightbox doesn't trigger vintage mode (by design - prevents accidental activation)
2. Some third-party components may not fully adopt vintage styling
3. Print styles not adjusted for vintage mode
4. Screen reader announcements don't mention theme change
5. Paper texture is subtle - could be enhanced with actual texture images
6. Sepia filter may reduce visibility of some photo details

## Accessibility Considerations

- Trigger photo has descriptive tooltip
- Vintage animation is smooth and gradual (1000ms) to minimize motion issues
- Good contrast maintained in vintage mode (burgundy on cream)
- Serif fonts are larger and well-spaced for readability
- Warm color palette is generally easier on the eyes than high-contrast themes
- Consider adding prefers-reduced-motion query for animation-sensitive users

---

**Branch**: `feature/glitch-easter-egg`  
**Initial Commit**: `feat: add brutalist glitch easter egg to gallery`  
**Updated Commit**: `refactor: transform brutalist theme to vintage/retro aesthetic`  
**Status**: ✅ Ready for review

## Summary of Changes (Brutalist → Vintage)

**Color Palette:**
- ❌ Neon green (#00FF41) → ✅ Gold (#D4AF37)
- ❌ Pure black → ✅ Dark brown (#2A1810) 
- ❌ Pure white → ✅ Cream (#F5E6D3)
- ➕ Burgundy (#6B2737) for headings
- ➕ Sepia brown (#8B7355) for text

**Typography:**
- ❌ Courier New monospace → ✅ Georgia/Times New Roman serif
- ❌ ALL CAPS → ✅ Proper case with italics

**Visual Style:**
- ❌ Sharp edges, brutalist → ✅ Ornate frames, vintage
- ❌ Chromatic aberration → ✅ Sepia photograph effect
- ❌ Glitch flash → ✅ Film grain fade
- ❌ Neon glow → ✅ Golden warm glow

**Text Content:**
- ❌ "[HUGO.EXE]" → ✅ "Hugo Marques, Esq."
- ❌ "SYSTEM: HUGO.EXE..." → ✅ "Hugo Marques — Photographer & Digital Craftsman, Est. 2024"
- ❌ Technical/cyberpunk → ✅ Classical/elegant
