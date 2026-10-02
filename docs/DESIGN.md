---
name: Botanical Vitality
colors:
  surface: '#f5fbf7'
  surface-dim: '#d5dbd8'
  surface-bright: '#f5fbf7'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#eff5f1'
  surface-container: '#e9efeb'
  surface-container-high: '#e3eae6'
  surface-container-highest: '#dee4e0'
  on-surface: '#171d1b'
  on-surface-variant: '#404a38'
  inverse-surface: '#2b322f'
  inverse-on-surface: '#ecf2ee'
  outline: '#707a66'
  outline-variant: '#c0cab3'
  surface-tint: '#2f6c00'
  primary: '#2f6c00'
  on-primary: '#ffffff'
  primary-container: '#6cc532'
  on-primary-container: '#204d00'
  inverse-primary: '#82dd48'
  secondary: '#456553'
  on-secondary: '#ffffff'
  secondary-container: '#c4e8d1'
  on-secondary-container: '#496a57'
  tertiary: '#006d36'
  on-tertiary: '#ffffff'
  tertiary-container: '#40c772'
  on-tertiary-container: '#004e24'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#9dfa61'
  primary-fixed-dim: '#82dd48'
  on-primary-fixed: '#0a2100'
  on-primary-fixed-variant: '#225100'
  secondary-fixed: '#c7ebd4'
  secondary-fixed-dim: '#abcfb8'
  on-secondary-fixed: '#002113'
  on-secondary-fixed-variant: '#2d4d3c'
  tertiary-fixed: '#79fca0'
  tertiary-fixed-dim: '#5bdf87'
  on-tertiary-fixed: '#00210c'
  on-tertiary-fixed-variant: '#005227'
  background: '#f5fbf7'
  on-background: '#171d1b'
  surface-variant: '#dee4e0'
typography:
  headline-xl:
    fontFamily: Plus Jakarta Sans
    fontSize: 36px
    fontWeight: '800'
    lineHeight: 44px
    letterSpacing: -0.03em
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 36px
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 32px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 20px
    fontWeight: '700'
    lineHeight: 28px
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 24px
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '500'
    lineHeight: 24px
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  body-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 18px
  label-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 15px
    fontWeight: '700'
    lineHeight: 20px
    letterSpacing: 0.01em
  label-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 13px
    fontWeight: '600'
    lineHeight: 18px
  label-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 11px
    fontWeight: '600'
    lineHeight: 14px
    letterSpacing: 0.02em
rounded:
  sm: 0.5rem
  DEFAULT: 1rem
  md: 1.5rem
  lg: 2rem
  xl: 3rem
  full: 9999px
spacing:
  gutter: 1rem
  gutter-mobile: 0.75rem
  margin: 1.5rem
  margin-mobile: 1.25rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2.25rem
---

## Brand & Style

This design system expresses a vibrant, nature-infused, and optimistic mobile-first philosophy tailored for smart plant commerce and urban green living. 

### Brand Personality & Mood
- **Fresh & Vital:** Evoking lush foliage, fresh dew, and thriving indoor gardens.
- **Friendly & Approachable:** Soft curves, pill controls, and warm rounded micro-interactions that make plant care intuitive and joyful.
- **Modern & Clean:** Ample white space balanced with rich emerald foliage graphics, avoiding rustic clutter in favor of crisp digital utility.

### Design Movement
A blend of **Modern Organic Minimalism** and **Tactile Softness**. The system relies on bright leafy greens, crisp white canvases, soft tinted mint containers, deeply rounded corners, and gentle luminous shadows that replicate dappled sunlight.

## Colors

The palette directly reflects living botanical vitality, built around an electric lime-leaf primary green grounded by deep forest green typography.

### Core Swatches
- **Primary (`#6CC532`):** Vibrant leaf green used for key call-to-actions, highlighted statuses, and signature brand accents.
- **Secondary / Deep Botanical (`#1B3B2B`):** Deep forest pine, replacing harsh pitch black for primary typography, icons, and grounded contrast.
- **Tertiary / Emerald Mint (`#0FA958`):** Energetic middle green for active tags, toggles, success feedback, and botanical gradient transitions.
- **Neutral Light (`#F4FAF6`):** Soft, soothing mint-tinted neutral surface that eliminates harsh glare while staying crisp.

### Supporting Functional Tints
- **Canvas Base:** Pure White (`#FFFFFF`) for elevated cards and crisp input surfaces.
- **Muted Background Containers:** Soft Pale Sage (`#EBF7F0` to `#DDF4E8`) for secondary chips, inactive states, and input field strokes.
- **Text Supporting:** Sage Ash (`#6D8878`) for subtitles, helper hints, and tertiary metadata.

## Typography

The design system exclusively implements **Plus Jakarta Sans**, providing clean geometric construction, wide friendly apertures, and exceptional legibility across dense mobile screens.

### Hierarchical Treatment
- **Hero & Onboarding Headlines:** Heavyweight 700 and 800 with tight negative letter tracking (`-0.02em` to `-0.03em`), frequently tinted in secondary deep forest (`#1B3B2B`) or highlighted with primary leaf green keywords.
- **Body & Captions:** Medium 400/500 weights paired with generous line-height ratios (1.4x to 1.5x) to maintain effortless scannability on compact handheld displays.
- **Labels & CTAs:** Bold, authoritative weight (`600` and `700`) centered inside pill containers with slight positive letter spacing for quick finger targeting.

## Layout & Spacing

The layout model is optimized around mobile ergonomics, using a fluid 4-column structure for mobile devices that cleanly adapts to 8 columns on tablets and 12 columns on web views.

### Rhythm & Alignment
- **Canvas Margins:** Set to `1.25rem` (20px) on compact handheld viewports and `1.5rem` (24px) on wider displays, keeping touch targets clear from device bezels and gesture edges.
- **Vertical Flow:** Spacing follows a base-8 rhythmic scale. Related items (labels and fields) cluster tightly at `space-xs` (4px) and `space-sm` (8px), while distinct functional groups separate by `space-lg` (24px) or `space-xl` (36px).
- **Safe Zone Strategy:** Bottom screen actions float over content using fixed bottom pill wrappers anchored with `1.25rem` horizontal and vertical offsets to accommodate native home indicators.

## Elevation & Depth

Visual depth avoids harsh industrial drop shadows in favor of **botanical luminescence and soft layered surfaces**:

### Elevation Levels
1. **Flat / Tonal Baseline:** Used for inner inputs, inactive chips, and recessed keypad surfaces using light sage tints (`#F4FAF6` / `#EBF7F0`).
2. **Surface Elevation (Cards & Sheets):** Pure white `#FFFFFF` layered against the neutral canvas with an ambient botanical shadow:
   - `box-shadow: 0 8px 24px -4px rgba(27, 59, 43, 0.06);`
3. **Primary Action Glow (Buttons & FABs):** Primary buttons cast a vibrant leaf-green radiant blur that reinforces energy and pressability:
   - `box-shadow: 0 10px 20px -3px rgba(108, 197, 50, 0.38);`
4. **Modals & Overlays:** Bottom sheets feature a heavy blur backdrop (`backdrop-filter: blur(16px); background: rgba(255, 255, 255, 0.85);`) with high diffuse depth (`box-shadow: 0 -12px 32px rgba(27, 59, 43, 0.08);`).

## Shapes

The shape architecture relies on full pill curves and generous organic radiuses that communicate warmth, safety, and natural life cycles.

### Radius Rules
- **Interactive Controls (Buttons, Inputs, Badges):** Full pill (`9999px` / `rounded-full`), producing soft oval contact areas ideal for thumbs.
- **Cards, Panels & Sheets:** Generously curved containers using `rounded-2xl` (1.5rem / 24px) up to `rounded-3xl` (2rem / 32px).
- **Keypad Buttons:** Rounded squares or soft circles (`rounded-2xl` to `rounded-full`) providing distinct tactile pads.

## Components

### Buttons
- **Primary CTA:** Full pill border radius (`rounded-full`), solid `#6CC532` background, pure white bold text (`label-lg`), and the signature leaf-green glow shadow (`0 10px 20px -3px rgba(108, 197, 50, 0.38)`). Minimum height is 52px for ergonomic tap ease.
- **Secondary / Social Login:** Full pill container with a pure white `#FFFFFF` background, a 1.5px subtle border in `#D4ECD9`, dark forest green text (`#1B3B2B`), and branded third-party vector icons on the left.
- **Ghost / Tertiary Action:** Borderless, deep green text with an understated tint hover/press state (`#EBF7F0`).

### Input Fields
- **Pill Form Fields:** Height 52px, fully rounded pill boundaries (`rounded-full`), clean white background, framed with a soft botanical border (`1.5px solid #D4ECD9`).
- **Focus State:** Border shifts to primary green (`#6CC532`) accompanied by a subtle 3px ring in `rgba(108, 197, 50, 0.15)`.
- **Placeholder & Text:** Centered or left-padded with generous 24px horizontal clearance; placeholder text rendered in soft sage `#8FA799`.

### Numeric Keypad & PIN Code
- **Keypad Surface:** Enclosed within a gentle tonal sheet (`#EBF4EE` background) seamlessly pinned to the viewport base.
- **Keypad Keys:** Pure white rounded cards (`rounded-xl` or `rounded-2xl`) with clear, centered numbers in `#1B3B2B` (`headline-md`).
- **Code Indicators:** Clean horizontal dashes or circular pills with empty outlines in `#D4ECD9` that fill with vivid `#6CC532` as security digits are entered.

### Chips & Tags
- **Selection Chips:** Pill containers (`rounded-full`) with light mint fills (`#EBF7F0`) and forest green text (`#1B3B2B`). When selected, chips shift to a solid `#6CC532` fill with white text.

### Cards & Botanical Displays
- **Plant Showcase Cards:** White base surfaces (`#FFFFFF`) with `rounded-3xl` (24px to 28px) geometry. Top area accommodates rich botanical photography or flat organic illustrations, bordered below with clear plant names, care level tags, and pricing in bold primary hues.

### Illustration & Iconography
- **Style:** Clean, flat vector artwork depicting lush leaves, sprouts, and cheerful gardeners. Line strokes use deep forest `#1B3B2B` with rich fills across lime `#6CC532`, jade `#0FA958`, and soft sky accents.