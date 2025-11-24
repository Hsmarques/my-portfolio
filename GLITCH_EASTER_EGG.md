# Glitch Easter Egg - Brutalist Mode

## Overview
A hidden brutalist theme that transforms the entire portfolio site when activated by clicking a special "trigger" photo in the gallery.

## How to Activate
1. Navigate to the home page gallery
2. **Hover over the FIRST photo** in the gallery - you'll see a distinctive chromatic aberration effect with colorful glowing borders
3. **Click the first photo** to toggle brutalist mode ON
4. Click it again to toggle brutalist mode OFF

The trigger photo has a tooltip: "⚠️ WARNING: REALITY BREACH DETECTED"

## Visual Features

### Brutalist Theme Characteristics
- **Typography**: Monospace font (Courier New) throughout
- **Colors**: 
  - Neon lime green accent (#00FF41)
  - Pure black backgrounds (#000000)
  - Pure white text (#FFFFFF)
- **Borders**: Chunky 4px borders on all interactive elements
- **Shapes**: No rounded corners - everything is sharp and boxy
- **Shadows**: Hard drop shadows (no blur) for depth
- **Text**: UPPERCASE, bold, high contrast

### Activation Animation
When you click the trigger photo:
- **Glitch Flash**: Screen flashes with opacity changes
- **Skew Transform**: Brief horizontal skewing effect
- Duration: 600ms

### Hover States
The trigger photo has a unique hover effect:
- Animated chromatic aberration (color separation)
- Pulsing gradient border (magenta/cyan)
- Neon green glow effect
- Continuous animation loop

### Theme Changes

#### Navigation Bar
- Neon green background with black text
- 4px white border with hard shadow
- Text transforms to: "[ HUGO.EXE ]", "[ PHOTOS ]", "[ ABOUT ]"

#### Hero Section
- Title transforms to uppercase: "CAPTURING LIGHT & CODE"
- Highlighted words get black background with neon border
- Subtitle becomes: "SYSTEM: HUGO.EXE | FUNCTION: PHOTOGRAPHY.DLL + WEBDEV.DLL"
- Button text: "[ EXECUTE: VIEW_WORK ]"
- Neon green text shadow on headings

#### Gallery
- 4px neon green borders on all photos
- Hard shadows (8px offset)
- Higher contrast on images
- Rigid grid spacing

#### Section Headers
- "Recent Captures" → "[ RECENT_CAPTURES.DAT ]"
- "View all photos" → ">> ALL PHOTOS"
- Footer text → "POWERED BY: SOLIDJS.FRAMEWORK | STATUS: OPERATIONAL"

#### Lightbox/Modal
- Pure black background
- Neon green buttons with black text
- White borders on all controls
- Counter badge gets neon styling

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

### Why Brutalist?
- Maximum contrast with elegant default theme
- Creates "glitch" feeling through jarring transition
- Memorable and shareable experience
- Fits "reality breach" narrative

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

1. **Sound Effects**: Add glitch sound on activation
2. **More Animations**: Additional transition effects between modes
3. **Hidden Messages**: Console.log easter eggs in brutalist mode
4. **Konami Code**: Alternative activation method
5. **Theme Variations**: Multiple brutalist color schemes
6. **Analytics**: Track how many users discover the feature
7. **Other Pages**: Extend brutalist styling to /photos, /about pages
8. **Lightbox Trigger**: Allow activation from lightbox view too

## Notes for Developers

- The trigger photo is determined by array index (0), not photo ID
- If gallery order changes, trigger moves with the first position
- To change trigger photo, modify the `isGlitchTrigger` logic in Gallery.tsx
- To adjust colors, edit CSS variables in app.css `:root` selector
- Animation duration can be adjusted in GlitchContext.tsx timeout
- All `!important` flags in CSS are intentional for complete override

## Known Limitations

1. Lightbox doesn't trigger glitch mode (by design - prevents accidental activation)
2. Some third-party components may not fully adopt brutalist styling
3. Print styles not adjusted for brutalist mode
4. Screen reader announcements don't mention theme change
5. No prefers-reduced-motion consideration for glitch animation

## Accessibility Considerations

- Trigger photo has descriptive tooltip
- Glitch animation is brief (600ms) to minimize motion issues
- High contrast in brutalist mode may improve readability for some users
- Consider adding prefers-reduced-motion query for animation-sensitive users

---

**Branch**: `feature/glitch-easter-egg`  
**Commit**: `feat: add brutalist glitch easter egg to gallery`  
**Status**: ✅ Ready for review
