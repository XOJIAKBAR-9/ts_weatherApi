# Shadcn/UI Integration Guide for Weather App

## 🎯 Overview
This guide helps integrate shadcn/ui components to replace the current custom styling with production-ready, accessible components.

---

## 📦 Installation Steps

### 1. Install shadcn/ui
```bash
npm install -D shadcn-ui
npm install @radix-ui/react-dialog @radix-ui/react-slot
npm install class-variance-authority clsx tailwind-merge
```

### 2. Setup Tailwind CSS (if not already done)
```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

### 3. Configure `tailwind.config.js`
```javascript
module.exports = {
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Minimalistic Dark Theme
        'dark-base': '#0f0f1e',
        'dark-surface': '#1a1a2e',
        'dark-card': '#16213e',
        'dark-hover': '#1f2a47',
        'accent-cyan': '#06d6d0',
        'accent-blue': '#118ab2',
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
```

---

## 🧩 Key Components to Integrate

### 1. **Button Component**
**Replace:** `.btn`, `.btn-primary`, `.btn-secondary`
```bash
npx shadcn-ui@latest add button
```

**Usage:**
```tsx
import { Button } from '@/components/ui/button'

<Button>Search</Button>
<Button variant="outline">Cancel</Button>
<Button variant="ghost">Remove</Button>
<Button variant="destructive">Delete</Button>
```

---

### 2. **Input Component**
**Replace:** `.search-input`
```bash
npx shadcn-ui@latest add input
```

**Usage:**
```tsx
import { Input } from '@/components/ui/input'

<Input placeholder="Enter city name…" />
```

---

### 3. **Card Component**
**Replace:** `.glass-card`, `.card`
```bash
npx shadcn-ui@latest add card
```

**Usage:**
```tsx
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

<Card>
  <CardHeader>
    <CardTitle>Current Weather</CardTitle>
  </CardHeader>
  <CardContent>
    {/* Weather details */}
  </CardContent>
</Card>
```

---

### 4. **Badge Component**
**For weather status indicators**
```bash
npx shadcn-ui@latest add badge
```

**Usage:**
```tsx
import { Badge } from '@/components/ui/badge'

<Badge variant="secondary">Cloudy</Badge>
<Badge variant="default">Clear</Badge>
```

---

### 5. **Dialog Component**
**For modals and favorites**
```bash
npx shadcn-ui@latest add dialog
```

**Usage:**
```tsx
import { Dialog, DialogTrigger, DialogContent } from '@/components/ui/dialog'

<Dialog>
  <DialogTrigger>Open</DialogTrigger>
  <DialogContent>
    {/* Modal content */}
  </DialogContent>
</Dialog>
```

---

### 6. **Separator Component**
**For dividers between sections**
```bash
npx shadcn-ui@latest add separator
```

**Usage:**
```tsx
import { Separator } from '@/components/ui/separator'

<Separator className="my-4" />
```

---

### 7. **Loading Spinner Component**
**For async operations**

Create `@/components/ui/spinner.tsx`:
```tsx
export function Spinner() {
  return (
    <div className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-accent-cyan border-r-transparent" />
  )
}
```

---

## 🎨 Custom Component Examples

### Weather Card Component
```tsx
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export function WeatherCard({ weather }) {
  return (
    <Card className="bg-dark-card border-dark-card/50 hover:border-accent-cyan/50">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white">{weather.location}</h2>
            <p className="text-sm text-gray-400">{weather.date}</p>
          </div>
          <Badge>{weather.status}</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col">
            <span className="text-sm text-gray-400">Temperature</span>
            <span className="text-3xl font-bold text-accent-cyan">{weather.temp}°C</span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm text-gray-400">Humidity</span>
            <span className="text-3xl font-bold text-accent-cyan">{weather.humidity}%</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
```

---

### Search Form Component
```tsx
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'

export function SearchForm({ onSearch }) {
  const [city, setCity] = React.useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    onSearch(city)
    setCity('')
  }

  return (
    <Card className="bg-dark-card/60 backdrop-blur-lg border-dark-card/50">
      <form onSubmit={handleSubmit} className="p-6 space-y-4">
        <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider">
          Search city
        </label>
        <div className="flex gap-3">
          <Input
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Enter city name…"
            className="bg-dark-surface border-dark-hover/50 focus:border-accent-cyan"
          />
          <Button type="submit" className="bg-gradient-to-r from-accent-cyan to-accent-blue hover:shadow-lg hover:shadow-cyan-500/50">
            Search
          </Button>
        </div>
      </form>
    </Card>
  )
}
```

---

## 🎯 Color Classes Reference

Add these to `global.css` or Tailwind config:

```css
@layer components {
  .bg-glass {
    @apply bg-dark-card/60 backdrop-blur-lg;
  }

  .border-glass {
    @apply border border-white/5 hover:border-accent-cyan/30 transition-colors;
  }

  .text-accent {
    @apply text-accent-cyan;
  }

  .btn-primary-custom {
    @apply bg-gradient-to-r from-accent-cyan to-accent-blue text-dark-base font-semibold hover:shadow-lg hover:shadow-cyan-500/50 transition-all;
  }

  .card-hover {
    @apply hover:border-accent-cyan/50 hover:shadow-lg hover:shadow-cyan-500/20 transition-all;
  }
}
```

---

## 📱 Responsive Breakpoints

Shadcn uses Tailwind's default breakpoints:
- `sm`: 640px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px
- `2xl`: 1536px

Example responsive grid:
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {/* Cards */}
</div>
```

---

## ♿ Accessibility Features

All shadcn components include:
- ✅ ARIA labels
- ✅ Keyboard navigation
- ✅ Focus indicators (cyan glow)
- ✅ Semantic HTML
- ✅ High contrast support
- ✅ Screen reader support

---

## 🚀 Migration Checklist

- [ ] Install shadcn/ui and dependencies
- [ ] Set up Tailwind CSS
- [ ] Add Button component
- [ ] Add Input component
- [ ] Add Card component
- [ ] Add Badge component
- [ ] Add Dialog component
- [ ] Create custom Weather Card component
- [ ] Create Search Form component
- [ ] Update HTML structure in `index.html`
- [ ] Test responsive design
- [ ] Test keyboard navigation
- [ ] Test with screen readers
- [ ] Deploy and monitor

---

## 📚 Resources

- [shadcn/ui Documentation](https://ui.shadcn.com)
- [Radix UI Primitives](https://www.radix-ui.com)
- [Tailwind CSS](https://tailwindcss.com)
- [Accessible Design Patterns](https://www.a11yproject.com)

