'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { motion } from 'framer-motion'
import { staggerContainerVariants, listItemVariants } from '@/lib/motion'

export default function TestAnimationsPage() {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-bold mb-2">Animation Test Page</h1>
          <p className="text-muted-foreground">Testing Framer Motion animations</p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-4"
          variants={staggerContainerVariants}
          initial="hidden"
          animate="visible"
        >
          {[1, 2, 3].map((i) => (
            <motion.div key={i} variants={listItemVariants}>
              <Card hoverEffect>
                <CardHeader>
                  <CardTitle>Card {i}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>This card should animate in and lift on hover</p>
                  <Badge pulse className="mt-2 bg-green-500">Live</Badge>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Buttons</h2>
          <div className="flex gap-4">
            <Button>Animated Button</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="destructive">Destructive</Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>If you see this, the app is working!</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Animations should be visible on this page.</p>
            <p className="mt-2 text-sm text-muted-foreground">
              Access at: <code>https://irisnet.wiredleap.com/test-animations</code>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

