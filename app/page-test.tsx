'use client'

import { PageLayout } from '@/components/layout/page-layout'
import { ProtectedRoute } from '@/components/auth/protected-route'
import { PageHeader } from '@/components/layout/page-header'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import {
  FadeInUp,
  FadeInDown,
  FadeInLeft,
  FadeInRight,
  ScaleFade,
  StaggerList,
  StaggerItem,
  ScrollReveal,
  ScrollStaggerList,
  HoverLift,
  Pressable,
  Spinner,
  PulsingDot,
} from '@/components/ui/animated'
import { Sparkles, Zap, Heart, Star } from 'lucide-react'

export default function PageTest() {
  return (
    <ProtectedRoute>
      <PageLayout>
        <PageHeader
          title="Animation Showcase"
          description="Comprehensive Framer Motion implementation across all components"
        />
        <main className="flex-1 overflow-y-auto bg-gradient-to-b from-background to-muted/20">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-8 space-y-12">
            
            {/* Hero Section */}
            <FadeInUp className="text-center space-y-4 py-12">
              <h1 className="text-5xl font-bold bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent">
                Framer Motion Animations
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Every interaction has been carefully crafted with micro-animations for a delightful user experience
              </p>
            </FadeInUp>

            {/* Buttons Section */}
            <ScrollReveal>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5" />
                    Interactive Buttons
                  </CardTitle>
                  <CardDescription>Hover and click to see animations</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-4">
                    <Button>Default Button</Button>
                    <Button variant="destructive">Destructive</Button>
                    <Button variant="outline">Outline</Button>
                    <Button variant="secondary">Secondary</Button>
                    <Button variant="ghost">Ghost</Button>
                    <Button size="lg">Large</Button>
                    <Button size="sm">Small</Button>
                  </div>
                </CardContent>
              </Card>
            </ScrollReveal>

            {/* Cards Section */}
            <ScrollReveal>
              <div className="space-y-4">
                <h2 className="text-2xl font-bold">Animated Cards</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card hoverEffect>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Zap className="w-5 h-5 text-yellow-500" />
                        Hover Card
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      Lifts and glows on hover
                    </CardContent>
                  </Card>

                  <Card fadeIn>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Heart className="w-5 h-5 text-red-500" />
                        Fade In Card
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      Fades in on mount
                    </CardContent>
                  </Card>

                  <Card hoverEffect fadeIn>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Star className="w-5 h-5 text-purple-500" />
                        Combined
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      Both effects together
                    </CardContent>
                  </Card>
                </div>
              </div>
            </ScrollReveal>

            {/* Badges Section */}
            <ScrollReveal>
              <Card>
                <CardHeader>
                  <CardTitle>Animated Badges</CardTitle>
                  <CardDescription>Including pulsing live indicators</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-3">
                    <Badge>Default</Badge>
                    <Badge variant="secondary">Secondary</Badge>
                    <Badge variant="destructive">Destructive</Badge>
                    <Badge variant="outline">Outline</Badge>
                    <Badge pulse className="bg-green-500">
                      <PulsingDot className="bg-white mr-1" />
                      Live
                    </Badge>
                    <Badge pulse className="bg-red-500">
                      <PulsingDot className="bg-white mr-1" />
                      Recording
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </ScrollReveal>

            {/* Input Section */}
            <ScrollReveal>
              <Card>
                <CardHeader>
                  <CardTitle>Animated Inputs</CardTitle>
                  <CardDescription>Subtle scale on focus</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 max-w-md">
                    <Input placeholder="Type something..." />
                    <Input placeholder="Focus me to see animation" />
                    <Input type="email" placeholder="Email address" />
                  </div>
                </CardContent>
              </Card>
            </ScrollReveal>

            {/* Fade Directions */}
            <div className="space-y-4">
              <h2 className="text-2xl font-bold">Fade Animations</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <FadeInUp>
                  <Card className="h-32 flex items-center justify-center bg-blue-500/10 border-blue-500/30">
                    <p className="font-semibold text-blue-600 dark:text-blue-400">Fade Up</p>
                  </Card>
                </FadeInUp>
                <FadeInDown delay={0.1}>
                  <Card className="h-32 flex items-center justify-center bg-green-500/10 border-green-500/30">
                    <p className="font-semibold text-green-600 dark:text-green-400">Fade Down</p>
                  </Card>
                </FadeInDown>
                <FadeInLeft delay={0.2}>
                  <Card className="h-32 flex items-center justify-center bg-purple-500/10 border-purple-500/30">
                    <p className="font-semibold text-purple-600 dark:text-purple-400">Fade Left</p>
                  </Card>
                </FadeInLeft>
                <FadeInRight delay={0.3}>
                  <Card className="h-32 flex items-center justify-center bg-orange-500/10 border-orange-500/30">
                    <p className="font-semibold text-orange-600 dark:text-orange-400">Fade Right</p>
                  </Card>
                </FadeInRight>
              </div>
            </div>

            {/* Stagger Lists */}
            <ScrollReveal>
              <Card>
                <CardHeader>
                  <CardTitle>Staggered Lists</CardTitle>
                  <CardDescription>Items animate in sequence</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-6">
                    <div>
                      <h3 className="font-semibold mb-3">Fast</h3>
                      <StaggerList speed="fast">
                        {[1, 2, 3, 4, 5].map((i) => (
                          <StaggerItem key={i}>
                            <div className="p-3 bg-muted rounded-lg mb-2">
                              Item {i}
                            </div>
                          </StaggerItem>
                        ))}
                      </StaggerList>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-3">Normal</h3>
                      <StaggerList speed="normal">
                        {[1, 2, 3, 4, 5].map((i) => (
                          <StaggerItem key={i}>
                            <div className="p-3 bg-muted rounded-lg mb-2">
                              Item {i}
                            </div>
                          </StaggerItem>
                        ))}
                      </StaggerList>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-3">Slow</h3>
                      <StaggerList speed="slow">
                        {[1, 2, 3, 4, 5].map((i) => (
                          <StaggerItem key={i}>
                            <div className="p-3 bg-muted rounded-lg mb-2">
                              Item {i}
                            </div>
                          </StaggerItem>
                        ))}
                      </StaggerList>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </ScrollReveal>

            {/* Hover Effects */}
            <div className="space-y-4">
              <h2 className="text-2xl font-bold">Hover & Press Effects</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <HoverLift>
                  <Card className="h-32 flex items-center justify-center cursor-pointer">
                    <p className="font-semibold">Hover to Lift</p>
                  </Card>
                </HoverLift>
                <Pressable>
                  <Card className="h-32 flex items-center justify-center cursor-pointer">
                    <p className="font-semibold">Click to Press</p>
                  </Card>
                </Pressable>
              </div>
            </div>

            {/* Loading States */}
            <ScrollReveal>
              <Card>
                <CardHeader>
                  <CardTitle>Loading Animations</CardTitle>
                  <CardDescription>Spinners and pulsing indicators</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-8">
                    <div className="text-center">
                      <Spinner size={32} className="text-primary mb-2 mx-auto" />
                      <p className="text-sm text-muted-foreground">Spinner</p>
                    </div>
                    <div className="text-center">
                      <div className="flex gap-2 mb-2 justify-center">
                        <PulsingDot className="bg-blue-500" />
                        <PulsingDot className="bg-green-500" />
                        <PulsingDot className="bg-red-500" />
                      </div>
                      <p className="text-sm text-muted-foreground">Pulsing Dots</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </ScrollReveal>

            {/* Scroll Reveal Demo */}
            <div className="space-y-8 py-12">
              <h2 className="text-2xl font-bold text-center">Scroll Down to See More Animations</h2>
              {[1, 2, 3, 4, 5].map((i) => (
                <ScrollReveal key={i}>
                  <Card className="p-8 text-center">
                    <h3 className="text-xl font-semibold">Scroll Reveal Item {i}</h3>
                    <p className="text-muted-foreground mt-2">
                      This card animates into view as you scroll
                    </p>
                  </Card>
                </ScrollReveal>
              ))}
            </div>

            {/* Scroll Stagger List */}
            <ScrollStaggerList speed="normal">
              <h2 className="text-2xl font-bold mb-4">Scroll-Triggered Stagger</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <StaggerItem key={i}>
                    <Card hoverEffect className="p-6">
                      <h3 className="font-semibold">Card {i}</h3>
                      <p className="text-sm text-muted-foreground mt-2">
                        Animates when scrolled into view
                      </p>
                    </Card>
                  </StaggerItem>
                ))}
              </div>
            </ScrollStaggerList>

            {/* Footer */}
            <div className="text-center py-12 space-y-4">
              <ScaleFade>
                <h2 className="text-3xl font-bold">🎉 All Animations Complete!</h2>
                <p className="text-muted-foreground">
                  Every component now has smooth, delightful micro-interactions
                </p>
              </ScaleFade>
            </div>

          </div>
        </main>
      </PageLayout>
    </ProtectedRoute>
  )
}
