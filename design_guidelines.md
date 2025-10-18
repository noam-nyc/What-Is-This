# Design Guidelines for "Xplain This"

## Design Approach
**Accessibility-First System Approach** - Inspired by Material Design's accessibility principles and iOS Camera app's simplicity, optimized for seniors and non-technical users. Success metrics prioritize usability, readability, and reduced cognitive load over visual sophistication.

## Core Design Principles
1. **Radical Simplicity**: One primary action per screen
2. **Maximum Readability**: AAA contrast ratios, generous text sizes
3. **Touch-Optimized**: Extra-large interactive elements
4. **Universal Design**: Icons + text labels, no assumptions about digital literacy

---

## Color Palette

**Light Mode (Primary)**
- Background: 0 0% 98% (near-white for reduced eye strain)
- Surface: 0 0% 100% (white cards)
- Primary: 210 100% 45% (trustworthy blue, high contrast)
- Primary Hover: 210 100% 40%
- Text Primary: 0 0% 10% (near-black, AAA contrast)
- Text Secondary: 0 0% 40%
- Success: 140 60% 40% (green for confirmations)
- Warning: 35 100% 50% (amber for safety warnings)
- Border: 0 0% 88%

**Dark Mode**
- Background: 220 15% 12%
- Surface: 220 13% 18%
- Primary: 210 100% 60%
- Primary Hover: 210 100% 65%
- Text Primary: 0 0% 98%
- Text Secondary: 0 0% 70%
- Border: 0 0% 30%

---

## Typography

**Font Stack**: System fonts for maximum legibility and performance
- Primary: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif
- Monospace: SF Mono, Monaco, "Courier New" (for technical details if needed)

**Scale** (mobile-first, larger than standard):
- Hero/Display: text-4xl (36px) / text-5xl (48px desktop)
- Heading 1: text-3xl (30px) / text-4xl (36px desktop)
- Heading 2: text-2xl (24px) / text-3xl (30px desktop)
- Body Large: text-xl (20px) / text-2xl (24px desktop) - primary reading text
- Body: text-lg (18px) - secondary content
- Caption: text-base (16px) - minimum size
- **Line Height**: 1.6 minimum for all body text (enhanced readability)
- **Font Weight**: 400 (regular), 600 (semibold headers), 700 (bold emphasis only)

---

## Layout System

**Spacing Primitives**: Use Tailwind units of **4, 6, 8, 12, 16** (p-4, m-6, gap-8, etc.)
- Compact spacing: 4 units (16px)
- Standard spacing: 6-8 units (24-32px)
- Generous spacing: 12-16 units (48-64px)
- Section spacing: 16-20 units (64-80px)

**Touch Targets**:
- Minimum: 48x48px (h-12, w-12)
- Preferred: 56x56px (h-14, w-14)
- Primary actions: 64x64px or larger (h-16, w-16)

**Container Strategy**:
- Max-width: max-w-2xl (672px) - narrow for focus
- Padding: px-4 mobile, px-6 tablet, px-8 desktop
- Single-column layout throughout (no multi-column complexity)

---

## Component Library

**Navigation**
- Fixed bottom navigation bar (mobile) with 3-4 large icons
- Simple top header with app logo and language selector only
- No hamburger menus - all options visible

**Buttons**
- Primary: Large, rounded-xl, min-h-14, text-xl, bold labels with icons
- Secondary: outline variant, same size
- Icon-only: min 56x56px, with tooltip on hover
- Always: Icon + Text label (never icon-only for primary actions)

**Camera Interface**
- Full-screen camera preview
- Centered circular capture button (80x80px minimum)
- Gallery/upload button (bottom-left, 64x64px)
- Switch camera button (top-right, 56x56px)
- All controls with high-contrast backgrounds (white with shadow or dark with glow)

**Language Selector**
- Large dropdown with flag icons + native language names
- Persistent in header, not hidden
- Each option: flag (32x32px) + text (text-lg)

**Results Display**
- Photo thumbnail at top (max-h-48, rounded-lg)
- Explanation sections with clear headers
- Text-to-speech button (floating, bottom-right, 64x64px, primary color)
- Font size controls (A- A A+) in header

**Loading States**
- Large spinner (64x64px) with text ("Analyzing image...")
- Progress indicators for multi-step processes
- No subtle animations - clear, obvious feedback

**Cards**
- Rounded-2xl borders
- Shadow-lg for elevation
- Padding: p-6 minimum
- Background: surface color with border

---

## Accessibility Enhancements

**Visual**
- All text AAA contrast (7:1 minimum)
- Focus indicators: 3px solid primary color ring
- No reliance on color alone (icons + text + patterns)
- Large click areas extend beyond visual button

**Interaction**
- No hover-required interactions
- All gestures have button alternatives
- Long-press avoided (use explicit buttons)
- Undo available for destructive actions

**Content**
- Simple vocabulary (6th-grade reading level maximum)
- Short sentences (15 words or less)
- Bullet points over paragraphs
- Icons reinforce meaning (not decorative)

---

## Images

**No hero image required** - This is a utility app, not marketing
**Product photos**: User-uploaded images displayed as rounded thumbnails (aspect-ratio-square, max-h-48) at the top of results
**Language flags**: 32x32px SVG flags for each supported language
**Placeholder states**: Simple icon + text, no decorative imagery

---

## Animation

**Minimal and Purposeful**:
- Page transitions: Simple fade (200ms)
- Button feedback: Scale 0.98 on press
- Camera capture: Quick flash effect (white overlay, 150ms)
- Loading: Smooth spinner rotation
- NO: Parallax, scroll animations, complex transitions

---

## Screen-Specific Layouts

**Home/Camera Screen**: Full viewport camera preview with floating controls overlay

**Results Screen**: Scrollable with photo at top, explanation sections below, sticky text-to-speech button

**Language Selection**: Full-screen modal with large tappable rows, search at top

**History** (if included): Grid of previous scans (2 columns max), large thumbnails with date/time