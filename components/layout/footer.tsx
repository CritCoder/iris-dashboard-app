'use client'

import Link from 'next/link'
import { Github, Twitter, Mail, Shield, FileText, Users } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t border-border bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">IRIS Dashboard</h3>
            <p className="text-sm text-muted-foreground">
              Advanced social media monitoring and intelligence platform for comprehensive OSINT analysis.
            </p>
            <div className="flex items-center gap-4">
              <Link
                href="https://github.com"
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label="GitHub"
              >
                <Github className="w-5 h-5" />
              </Link>
              <Link
                href="https://twitter.com"
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="w-5 h-5" />
              </Link>
              <Link
                href="mailto:contact@iris-dashboard.com"
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Email"
              >
                <Mail className="w-5 h-5" />
              </Link>
            </div>
          </div>

          {/* Product Links */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-foreground uppercase tracking-wider">Product</h4>
            <nav className="space-y-2">
              <Link
                href="/dashboard"
                className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Dashboard
              </Link>
              <Link
                href="/analysis-history"
                className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Analysis History
              </Link>
              <Link
                href="/entity-search"
                className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Entity Search
              </Link>
              <Link
                href="/communities"
                className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Communities
              </Link>
            </nav>
          </div>

          {/* Resources */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-foreground uppercase tracking-wider">Resources</h4>
            <nav className="space-y-2">
              <Link
                href="/docs"
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <FileText className="w-4 h-4" />
                Documentation
              </Link>
              <Link
                href="/support"
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <Users className="w-4 h-4" />
                Support
              </Link>
              <Link
                href="/api"
                className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                API Reference
              </Link>
              <Link
                href="/changelog"
                className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Changelog
              </Link>
            </nav>
          </div>

          {/* Legal & Security */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-foreground uppercase tracking-wider">Legal</h4>
            <nav className="space-y-2">
              <Link
                href="/privacy"
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <Shield className="w-4 h-4" />
                Privacy Policy
              </Link>
              <Link
                href="/terms"
                className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Terms of Service
              </Link>
              <Link
                href="/security"
                className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Security
              </Link>
              <Link
                href="/compliance"
                className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Compliance
              </Link>
            </nav>
          </div>
        </div>

        {/* Security Notice */}
        <Card className="mt-8 bg-muted/20 border-muted">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <Shield className="w-5 h-5 text-muted-foreground mt-0.5 flex-shrink-0" />
              <div className="space-y-1">
                <p className="text-sm font-medium text-foreground">Security & Compliance</p>
                <p className="text-xs text-muted-foreground">
                  This platform is designed for legitimate OSINT and security research purposes only.
                  All monitoring activities must comply with applicable laws and ethical guidelines.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Copyright */}
        <div className="mt-8 pt-6 border-t border-border">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-xs text-muted-foreground">
              © {currentYear} IRIS Dashboard. All rights reserved.
            </p>
            <div className="flex items-center gap-4">
              <Link
                href="/status"
                className="text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                System Status
              </Link>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-xs text-muted-foreground">All systems operational</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}