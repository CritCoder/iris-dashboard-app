# Framer Motion Animation Implementation

## Overview
This document outlines the comprehensive Framer Motion animation system implemented across the entire IRIS Dashboard platform. The implementation includes micro-level animations, page transitions, scroll-based effects, and interactive hover states.

## Installation
```bash
yarn add framer-motion
```

## Architecture

### 1. Animation Library (`lib/motion.ts`)
Centralized animation configuration with reusable variants and transitions.

**Key Components:**
- **Transitions**: Pre-configured spring, tween, and easing configurations
- **Micro Animations**: Button, card, input, icon, and badge animations
- **Page Animations**: Fade, slide, and scale transitions
- **List Animations**: Stagger containers and item animations
- **Special Effects**: Modals, notifications, spinners, and more
- **Scroll Animations**: Scroll reveal and parallax effects
- **Hover Effects**: Glow, lift, and underline animations

### 2. Enhanced UI Components

#### Button (`components/ui/button.tsx`)
```tsx
<Button>Click Me</Button> // Automatically animated
<Button disableAnimation>No Animation</Button>
```
- **Features**: Hover scale, tap feedback, spring transitions
- **Props**: `disableAnimation` to opt-out

#### Card (`components/ui/card.tsx`)
```tsx
<Card hoverEffect>Content</Card>
<Card fadeIn>Content</Card>
```
- **Features**: Hover lift, fade-in animation, shadow effects
- **Props**: 
  - `hoverEffect`: Lifts card on hover
  - `fadeIn`: Animates in on mount
  - `disableAnimation`: Disables all animations

#### Input (`components/ui/input.tsx`)
```tsx
<Input placeholder="Search..." />
```
- **Features**: Subtle scale on focus
- **Props**: `disableAnimation`

#### Badge (`components/ui/badge.tsx`)
```tsx
<Badge pulse>Live</Badge>
```
- **Features**: Pulsing animation for live indicators
- **Props**: 
  - `pulse`: Enables pulsing animation
  - `disableAnimation`

### 3. Reusable Animation Components (`components/ui/animated.tsx`)

#### Basic Fade Animations
```tsx
<FadeInUp>Content</FadeInUp>
<FadeInDown>Content</FadeInDown>
<FadeInLeft>Content</FadeInLeft>
<FadeInRight>Content</FadeInRight>
<ScaleFade>Content</ScaleFade>
```

#### Stagger Lists
```tsx
<StaggerList speed="fast">
  <StaggerItem>Item 1</StaggerItem>
  <StaggerItem>Item 2</StaggerItem>
  <StaggerItem>Item 3</StaggerItem>
</StaggerList>
```
- **Speed options**: `'fast'`, `'normal'`, `'slow'`
- **Custom delays**: Use `staggerDelay` and `delayChildren` props

#### Scroll-Based Animations
```tsx
<ScrollReveal once={true} amount={0.3}>
  Content reveals when scrolled into view
</ScrollReveal>

<ScrollStaggerList speed="normal">
  <StaggerItem>Item 1</StaggerItem>
  <StaggerItem>Item 2</StaggerItem>
</ScrollStaggerList>
```
- **Props**:
  - `once`: Animate only once (default: `true`)
  - `amount`: Percentage of element visible to trigger (0-1)

#### Hover Effects
```tsx
<HoverLift>
  Lifts and glows on hover
</HoverLift>

<Pressable>
  Button-like press effect
</Pressable>
```

#### Loading Animations
```tsx
<Spinner size={24} className="text-primary" />
<PulsingDot className="bg-green-500" />
```

#### Wrappers
```tsx
<PageWrapper>
  Page content with transition
</PageWrapper>

<ModalWrapper>
  Modal content with slide-up
</ModalWrapper>
```

### 4. Page Transition (`components/layout/page-transition.tsx`)
```tsx
<PageTransition>
  {children}
</PageTransition>
```
- **Features**: Automatic page transitions on route change
- **Animation**: Scale and fade effect

### 5. Dashboard Animations

#### Stats Grid (`components/dashboard/stats-grid.tsx`)
- **Stagger animation**: Cards animate in sequence
- **Number counters**: Animated from 0 to value
- **Progress bars**: Animated width transitions
- **Hover effects**: Lift and glow on cards

#### Main Dashboard (`app/page.tsx`)
- **Critical alerts**: Pulsing indicators
- **Dashboard grid**: Staggered card animations
- **Trending topics**: Hover and tap interactions
- **List items**: Scroll-triggered stagger

## Usage Examples

### Basic Animation
```tsx
import { motion } from 'framer-motion'
import { fadeInUpVariants } from '@/lib/motion'

<motion.div
  variants={fadeInUpVariants}
  initial="hidden"
  animate="visible"
>
  Content
</motion.div>
```

### Stagger Children
```tsx
import { motion } from 'framer-motion'
import { staggerContainerVariants, listItemVariants } from '@/lib/motion'

<motion.div
  variants={staggerContainerVariants}
  initial="hidden"
  animate="visible"
>
  {items.map((item) => (
    <motion.div key={item.id} variants={listItemVariants}>
      {item.content}
    </motion.div>
  ))}
</motion.div>
```

### Scroll Animation
```tsx
import { ScrollReveal } from '@/components/ui/animated'

<ScrollReveal once={true}>
  <h2>This reveals when scrolled into view</h2>
</ScrollReveal>
```

### Interactive Card
```tsx
import { Card } from '@/components/ui/card'

<Card hoverEffect>
  <CardHeader>
    <CardTitle>Interactive Card</CardTitle>
  </CardHeader>
  <CardContent>
    Lifts and glows on hover
  </CardContent>
</Card>
```

### Custom Animation
```tsx
import { motion } from 'framer-motion'
import { createFadeIn } from '@/lib/motion'

<motion.div
  variants={createFadeIn('left', 50)}
  initial="hidden"
  animate="visible"
>
  Custom fade from left
</motion.div>
```

## Animation Presets

Access common animation patterns through presets:
```tsx
import { presets } from '@/lib/motion'

<motion.div variants={presets.page} />
<motion.div variants={presets.card} />
<motion.div variants={presets.button} />
<motion.div variants={presets.list} />
<motion.div variants={presets.modal} />
<motion.div variants={presets.notification} />
<motion.div variants={presets.scrollReveal} />
```

## Performance Considerations

1. **Use `layoutId`** for smooth transitions between states
2. **Prefer `transform` and `opacity`** for animations (GPU accelerated)
3. **Use `will-change`** sparingly and remove after animation
4. **Disable animations** on low-end devices with `disableAnimation` prop
5. **Stagger carefully**: Don't stagger more than 10-15 items at once
6. **Use `AnimatePresence`** for exit animations

## Best Practices

1. **Consistency**: Use predefined variants from `lib/motion.ts`
2. **Subtlety**: Keep micro-animations quick (150-300ms)
3. **Purpose**: Every animation should enhance UX, not distract
4. **Accessibility**: Respect `prefers-reduced-motion`
5. **Performance**: Monitor frame rates and optimize if needed

## Future Enhancements

- [ ] Add gesture-based animations (swipe, drag)
- [ ] Implement shared element transitions
- [ ] Add more complex orchestration patterns
- [ ] Create animation playground/demo page
- [ ] Add animation timing visualizer
- [ ] Implement path animations for SVGs

## Troubleshooting

### Animation Not Working
1. Ensure framer-motion is installed
2. Check that component is wrapped in motion component
3. Verify variants are properly defined
4. Check for CSS conflicts (especially `transform`)

### Performance Issues
1. Reduce number of animated elements
2. Use `will-change` CSS property
3. Simplify animation variants
4. Consider using CSS animations for simple cases

### Layout Shift
1. Use `layout` prop for automatic layout animations
2. Set explicit dimensions on animated elements
3. Use `layoutId` for morphing animations

## Resources

- [Framer Motion Docs](https://www.framer.com/motion/)
- [Animation Best Practices](https://web.dev/animations/)
- [Performance Guide](https://www.framer.com/motion/guide-upgrade/#performance)

---

**Last Updated**: May 9, 2025
**Version**: 1.0.0
**Framer Motion**: 12.23.24

