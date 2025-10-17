"use client"

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { OptimizedCard, OptimizedCardHeader, OptimizedCardTitle, OptimizedCardDescription, OptimizedCardContent, OptimizedCardFooter } from '@/components/ui/optimized-card'
import { OptimizedButton } from '@/components/ui/optimized-button'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { borderRadius, performanceClasses } from '@/lib/performance'
import { transitions } from '@/lib/motion'

export default function OptimizedComponentsPage() {
  const [dragEnabled, setDragEnabled] = useState(false)
  const [resizeEnabled, setResizeEnabled] = useState(false)

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-6xl mx-auto space-y-12">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={transitions.smooth}
          className="text-center space-y-4"
        >
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Optimized Components Showcase
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Demonstrating consistent border radius, smooth 60fps animations, and performance optimizations
          </p>
        </motion.div>

        {/* Border Radius System */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...transitions.smooth, delay: 0.1 }}
          className="space-y-6"
        >
          <h2 className="text-2xl font-semibold">Border Radius System</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {[
              { name: 'xs', class: borderRadius.xs },
              { name: 'sm', class: borderRadius.sm },
              { name: 'base', class: borderRadius.base },
              { name: 'md', class: borderRadius.md },
              { name: 'lg', class: borderRadius.lg },
              { name: 'xl', class: borderRadius.xl },
              { name: '2xl', class: borderRadius['2xl'] },
              { name: 'full', class: borderRadius.full },
            ].map(({ name, class: radiusClass }) => (
              <motion.div
                key={name}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ ...transitions.smooth, delay: 0.1 + Math.random() * 0.3 }}
                className={`w-16 h-16 bg-primary/20 ${radiusClass} flex items-center justify-center text-sm font-medium border border-primary/30`}
              >
                {name}
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Optimized Buttons */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...transitions.smooth, delay: 0.2 }}
          className="space-y-6"
        >
          <h2 className="text-2xl font-semibold">Optimized Buttons</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Button Variants */}
            <OptimizedCard variant="outlined" size="md">
              <OptimizedCardHeader>
                <OptimizedCardTitle>Button Variants</OptimizedCardTitle>
              </OptimizedCardHeader>
              <OptimizedCardContent className="space-y-3">
                <div className="flex flex-wrap gap-2">
                  <OptimizedButton variant="default">Default</OptimizedButton>
                  <OptimizedButton variant="secondary">Secondary</OptimizedButton>
                  <OptimizedButton variant="outline">Outline</OptimizedButton>
                  <OptimizedButton variant="ghost">Ghost</OptimizedButton>
                  <OptimizedButton variant="gradient">Gradient</OptimizedButton>
                </div>
              </OptimizedCardContent>
            </OptimizedCard>

            {/* Button Sizes */}
            <OptimizedCard variant="outlined" size="md">
              <OptimizedCardHeader>
                <OptimizedCardTitle>Button Sizes</OptimizedCardTitle>
              </OptimizedCardHeader>
              <OptimizedCardContent className="space-y-3">
                <div className="flex flex-wrap items-center gap-2">
                  <OptimizedButton size="sm">Small</OptimizedButton>
                  <OptimizedButton size="default">Default</OptimizedButton>
                  <OptimizedButton size="lg">Large</OptimizedButton>
                  <OptimizedButton size="xl">Extra Large</OptimizedButton>
                </div>
              </OptimizedCardContent>
            </OptimizedCard>

            {/* Button Animations */}
            <OptimizedCard variant="outlined" size="md">
              <OptimizedCardHeader>
                <OptimizedCardTitle>Button Animations</OptimizedCardTitle>
              </OptimizedCardHeader>
              <OptimizedCardContent className="space-y-3">
                <div className="flex flex-wrap gap-2">
                  <OptimizedButton animation="subtle">Subtle</OptimizedButton>
                  <OptimizedButton animation="bounce">Bounce</OptimizedButton>
                  <OptimizedButton animation="scale">Scale</OptimizedButton>
                  <OptimizedButton animation="lift">Lift</OptimizedButton>
                </div>
              </OptimizedCardContent>
            </OptimizedCard>

          </div>
        </motion.section>

        {/* Optimized Cards */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...transitions.smooth, delay: 0.3 }}
          className="space-y-6"
        >
          <h2 className="text-2xl font-semibold">Optimized Cards</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Interactive Cards */}
            <OptimizedCard 
              variant="default" 
              hoverEffect 
              size="md"
              className="cursor-pointer"
            >
              <OptimizedCardHeader>
                <OptimizedCardTitle>Hover Effect</OptimizedCardTitle>
                <OptimizedCardDescription>
                  This card has a smooth hover animation
                </OptimizedCardDescription>
              </OptimizedCardHeader>
              <OptimizedCardContent>
                <p className="text-sm text-muted-foreground">
                  Hover over this card to see the smooth lift effect with optimized performance.
                </p>
              </OptimizedCardContent>
            </OptimizedCard>

            {/* Draggable Card */}
            <OptimizedCard 
              variant="elevated" 
              dragEnabled={dragEnabled}
              size="md"
              className="cursor-grab active:cursor-grabbing"
            >
              <OptimizedCardHeader>
                <OptimizedCardTitle>Draggable Card</OptimizedCardTitle>
                <OptimizedCardDescription>
                  {dragEnabled ? 'Drag me around!' : 'Enable drag to move this card'}
                </OptimizedCardDescription>
              </OptimizedCardHeader>
              <OptimizedCardContent>
                <OptimizedButton 
                  onClick={() => setDragEnabled(!dragEnabled)}
                  variant={dragEnabled ? "destructive" : "default"}
                  size="sm"
                >
                  {dragEnabled ? 'Disable Drag' : 'Enable Drag'}
                </OptimizedButton>
              </OptimizedCardContent>
            </OptimizedCard>

            {/* Resizable Card */}
            <OptimizedCard 
              variant="outlined" 
              resizeEnabled={resizeEnabled}
              size="md"
            >
              <OptimizedCardHeader>
                <OptimizedCardTitle>Resizable Card</OptimizedCardTitle>
                <OptimizedCardDescription>
                  {resizeEnabled ? 'This card is optimized for resize operations' : 'Enable resize optimization'}
                </OptimizedCardDescription>
              </OptimizedCardHeader>
              <OptimizedCardContent>
                <OptimizedButton 
                  onClick={() => setResizeEnabled(!resizeEnabled)}
                  variant={resizeEnabled ? "destructive" : "default"}
                  size="sm"
                >
                  {resizeEnabled ? 'Disable Resize' : 'Enable Resize'}
                </OptimizedButton>
              </OptimizedCardContent>
            </OptimizedCard>

          </div>
        </motion.section>

        {/* Performance Comparison */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...transitions.smooth, delay: 0.4 }}
          className="space-y-6"
        >
          <h2 className="text-2xl font-semibold">Performance Comparison</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Standard Components */}
            <Card>
              <CardHeader>
                <CardTitle>Standard Components</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Button>Standard Button</Button>
                  <Button variant="outline">Outline</Button>
                </div>
                <Input placeholder="Standard Input" />
                <div className="flex gap-2">
                  <Badge>Standard</Badge>
                  <Badge variant="secondary">Badge</Badge>
                </div>
              </CardContent>
            </Card>

            {/* Optimized Components */}
            <OptimizedCard variant="elevated">
              <OptimizedCardHeader>
                <OptimizedCardTitle>Optimized Components</OptimizedCardTitle>
              </OptimizedCardHeader>
              <OptimizedCardContent className="space-y-4">
                <div className="flex gap-2">
                  <OptimizedButton>Optimized Button</OptimizedButton>
                  <OptimizedButton variant="outline">Outline</OptimizedButton>
                </div>
                <Input placeholder="Optimized Input" className={performanceClasses.gpu} />
                <div className="flex gap-2">
                  <Badge className={performanceClasses.gpu}>Optimized</Badge>
                  <Badge variant="secondary" className={performanceClasses.gpu}>Badge</Badge>
                </div>
              </OptimizedCardContent>
            </OptimizedCard>

          </div>
        </motion.section>

        {/* Performance Tips */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...transitions.smooth, delay: 0.5 }}
          className="space-y-6"
        >
          <h2 className="text-2xl font-semibold">Performance Optimizations</h2>
          <OptimizedCard variant="default" size="lg">
            <OptimizedCardHeader>
              <OptimizedCardTitle>Key Optimizations Applied</OptimizedCardTitle>
            </OptimizedCardHeader>
            <OptimizedCardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h4 className="font-semibold text-primary">Border Radius</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Consistent radius system based on CSS variables</li>
                    <li>• Semantic naming (xs, sm, md, lg, xl, full)</li>
                    <li>• Automatic dark/light theme support</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold text-primary">Animation Performance</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• GPU-accelerated transforms</li>
                    <li>• Optimized spring configurations</li>
                    <li>• Hardware acceleration hints</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold text-primary">Smooth Interactions</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• 60fps target for all animations</li>
                    <li>• Reduced motion support</li>
                    <li>• Optimized drag and resize</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold text-primary">Developer Experience</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Type-safe component props</li>
                    <li>• Consistent API across components</li>
                    <li>• Easy customization options</li>
                  </ul>
                </div>
              </div>
            </OptimizedCardContent>
          </OptimizedCard>
        </motion.section>

      </div>
    </div>
  )
}
