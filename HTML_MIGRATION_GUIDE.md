# HTML Structure Updates for New Dark UI

## 📋 Quick Reference

### Before (Current Purple/Pink)
```html
<div class="search-card glass-card">
  <input class="search-input" placeholder="Enter city name…" />
  <button class="btn btn-primary search-btn">Search</button>
</div>
```

### After (New Dark Theme)
```html
<div class="glass-card search-card">
  <input class="search-input" placeholder="Enter city name…" />
  <button class="btn btn-primary search-btn">Search</button>
</div>
```

**Note:** The new CSS is fully backward compatible. Just replace `styles.css` with `styles-new.css`

---

## 🎨 CSS Classes Cheat Sheet

### Layout
- `.main-container` - Max width 1400px, auto margins
- `.section` - Section spacing with fade-in animation
- `.section-title` - Section headings with accent underline

### Cards
- `.glass-card` - Frosted glass effect with dark background
- `.card` - Base card styling
- `.glass-card:hover` - Hover effects

### Buttons
- `.btn` - Base button
- `.btn-primary` - Cyan gradient, glowing effect
- `.btn-secondary` - Ghost style, cyan border
- `.btn-accent` - Subtle surface button
- `.btn-danger` - Red danger button

### Inputs
- `.search-input` - Text input with focus glow
- `.search-input:focus` - Cyan border and glow

### Weather Components
- `.weather-card` - 2-column layout
- `.weather-detail` - Detail boxes with hover effects
- `.weather-detail-value` - Cyan accent text

### Lists
- `.list-container` - Auto-grid layout
- `.list-item` - Item with hover animations
- `.list-item:hover` - Cyan border, lift animation

### Typography
- `h1, h2, h3` - Automatic sizing and spacing
- `p` - Gray secondary text
- `small` - Muted small text

### States
- `.loading` - Spinning cyan loader
- `.pulse` - Gentle pulse animation
- `.skeleton` - Shimmer effect
- `.error-message` - Red error text
- `.success-message` - Cyan success text
- `.hidden` - Display none
- `.disabled` - 50% opacity

### Responsive Helpers
- Mobile: `max-width: 480px` (stacked layout)
- Tablet: `max-width: 768px` (2-column)
- Desktop: `max-width: 1400px` (3-column)

---

## 🔄 Migration Steps

### Step 1: Backup Current CSS
```bash
cp src/styles.css src/styles.css.backup
```

### Step 2: Use New CSS
Replace the link in `index.html`:
```html
<!-- OLD -->
<link rel="stylesheet" href="src/styles.css" />

<!-- NEW -->
<link rel="stylesheet" href="src/styles-new.css" />
```

### Step 3: HTML Remains the Same
Your existing HTML structure doesn't need changes! The new CSS uses the same class names.

---

## 🎯 Feature Highlights

### Color System
- **Base:** Deep charcoal `#0f0f1e`
- **Surface:** Mid-tone `#1a1a2e`
- **Accent:** Vibrant cyan `#06d6d0`
- **Secondary:** Ocean blue `#118ab2`

### Animations & Transitions
- Smooth hover effects (250ms)
- Fade-in section animations
- Glowing focus states
- Scale effects on buttons

### Accessibility
- WCAG AA contrast ratio (7:1+)
- Visible focus indicators (cyan glow)
- Proper semantic HTML
- Screen reader friendly

---

## 📱 Responsive Behavior

### Mobile (≤480px)
- Font size reduced to 14px
- Single column layouts
- Full-width inputs
- Stacked buttons

### Tablet (481px - 768px)
- 2-column grid for lists
- Optimized spacing
- Touch-friendly buttons (48px min height)

### Desktop (≥769px)
- 3-column grid
- Multi-column layouts
- Full animations enabled

---

## 🚀 Implementation Tips

1. **Test in Browser DevTools**
   - Open DevTools (F12)
   - Toggle classes manually
   - Check focus states

2. **Check Animations**
   - Hover over buttons
   - Click search to see fade-in
   - Check loading state

3. **Responsive Testing**
   - Toggle device toolbar (Cmd+Shift+M on Mac)
   - Test at 375px (mobile), 768px (tablet), 1024px (desktop)

4. **Performance**
   - CSS is minimal and optimized
   - No external animations library
   - Uses CSS custom properties for easy tweaking

---

## 🎨 Color Customization

Want to tweak colors? Edit these CSS variables in `styles-new.css`:

```css
:root {
  --color-primary: #06d6d0;        /* Change cyan to your accent */
  --color-secondary: #118ab2;      /* Change blue */
  --color-danger: #ef476f;         /* Change red */
  --color-warning: #ffa500;        /* Change orange */
  --color-success: #06d6d0;        /* Change success green */
}
```

---

## ✅ Verification Checklist

- [ ] New CSS file is linked
- [ ] Colors match design system
- [ ] Buttons have glow effects
- [ ] Search input has cyan focus glow
- [ ] Cards have hover animations
- [ ] Mobile layout is responsive
- [ ] No console errors
- [ ] All interactions work smoothly

