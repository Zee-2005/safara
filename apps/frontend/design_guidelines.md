# SaFara Tourist Safety PWA Design Guidelines

## Design Approach Documentation

**Selected Approach**: Hybrid approach combining Material Design principles with safety-focused customizations, inspired by emergency services apps and travel platforms like Google Maps and Uber for critical functionality.

**Key Design Principles**:
- Safety-first hierarchy with emergency features prominently displayed
- Trust-building through clean, official government app aesthetics
- Accessibility for diverse Indian language users
- Offline-ready visual feedback systems

## Core Design Elements

### A. Color Palette

**Primary Colors**:
- Emergency Red: 345 85% 47% (SOS and critical alerts)
- Safety Blue: 210 95% 42% (primary actions, navigation)
- Success Green: 142 76% 36% (verified status, safe zones)

**Dark Mode**:
- Background: 220 13% 8%
- Surface: 220 13% 12%
- Text Primary: 0 0% 95%

**Light Mode**:
- Background: 0 0% 98%
- Surface: 0 0% 100%
- Text Primary: 220 13% 18%

### B. Typography

**Font Stack**: Inter (via Google Fonts CDN) for Latin text, Noto Sans for Indian languages
- Headlines: 600 weight, 24-32px
- Body: 400 weight, 16px
- Captions: 400 weight, 14px
- Emergency text: 700 weight, 18px

### C. Layout System

**Spacing Units**: Tailwind classes using 4, 6, 8, 12, 16 units (p-4, m-6, h-8, gap-12, etc.)
- Mobile-first responsive grid
- Safe area padding for PWA installation
- Emergency button zones use larger touch targets (minimum 48px)

### D. Component Library

**Navigation**: 
- Bottom tab bar for main modes (Regular/Activated)
- Floating action button for emergency access
- Language switcher in header

**Cards/Tiles**:
- Rounded corners (rounded-xl)
- Subtle shadows for depth
- Color-coded borders for status (green=safe, red=emergency, blue=info)

**Buttons**:
- Primary: Solid blue background
- Emergency: Large, red with white text
- Secondary: Outline style with transparent background
- For buttons on images: Use backdrop-blur-sm with semi-transparent background

**Forms**:
- Floating labels for KYC inputs
- Multi-step progress indicators
- File upload areas with drag-and-drop

**Maps**:
- Custom markers for geofences (red=danger, yellow=caution, green=safe)
- Current location indicator with pulsing animation
- Offline map tiles cached locally

### E. Emergency & Safety UX

**SOS Flow**:
- Large red button always visible in activated mode
- Biometric confirmation modal before activation
- Emergency page with quick description and evidence capture
- Clear escalation path to 112 system

**Status Indicators**:
- Tourist ID validity with countdown timer
- Location sharing status (active/paused)
- Offline mode indicators

**Geofence Alerts**:
- Non-intrusive banner notifications
- Color-coded severity levels
- Quick action buttons (acknowledge, get directions)

### F. Multilingual Design

- Text size adjustments for different scripts
- RTL layout support where needed
- Cultural color considerations (saffron, white, green for Indian context)
- Icon universality across languages

### G. Images and Media

**No large hero image** - this is a utility-focused safety app prioritizing quick access to features over marketing visuals.

**Image Usage**:
- Small agency logos in Plan Journey section
- User profile photos (circular, 40px)
- Emergency contact photos for quick identification
- QR code displays for Tourist ID verification
- Map tiles and location imagery

**Icons**: Use Heroicons via CDN for consistency, with custom safety-specific icons where needed (<!-- CUSTOM ICON: emergency beacon -->)

This design prioritizes immediate access to safety features while maintaining the professional appearance users expect from government-related services, ensuring the app builds trust while remaining highly functional across India's diverse user base.