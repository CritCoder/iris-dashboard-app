'use client'

import { useState } from 'react'
import { PageLayout } from '@/components/layout/page-layout'
// import { PageHeader } from '@/components/ui/page-header'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Search, Globe, Shield, Eye, Database, Zap, AlertTriangle, CheckCircle } from 'lucide-react'
import { AnimatedPage, AnimatedGrid, AnimatedCard } from '@/components/ui/animated'

export default function OSINTToolsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedTool, setSelectedTool] = useState<string | null>(null)

  const osintTools = [
    {
      id: 'domain-analyzer',
      name: 'Domain Analyzer',
      description: 'Analyze domain reputation, DNS records, and security status',
      category: 'Network Intelligence',
      icon: Globe,
      status: 'active',
      features: ['DNS Analysis', 'SSL Certificate Check', 'Subdomain Discovery', 'Historical Data']
    },
    {
      id: 'social-monitor',
      name: 'Social Media Monitor',
      description: 'Monitor social media platforms for mentions and sentiment',
      category: 'Social Intelligence',
      icon: Eye,
      status: 'active',
      features: ['Real-time Monitoring', 'Sentiment Analysis', 'Influence Tracking', 'Trend Detection']
    },
    {
      id: 'threat-intel',
      name: 'Threat Intelligence',
      description: 'Gather intelligence on cyber threats and vulnerabilities',
      category: 'Security Intelligence',
      icon: Shield,
      status: 'active',
      features: ['IOC Analysis', 'Threat Feeds', 'Vulnerability Scanning', 'Risk Assessment']
    },
    {
      id: 'data-miner',
      name: 'Data Miner',
      description: 'Extract and analyze data from various sources',
      category: 'Data Intelligence',
      icon: Database,
      status: 'beta',
      features: ['Web Scraping', 'API Integration', 'Data Processing', 'Pattern Recognition']
    },
    {
      id: 'network-scanner',
      name: 'Network Scanner',
      description: 'Scan networks for open ports and services',
      category: 'Network Intelligence',
      icon: Zap,
      status: 'active',
      features: ['Port Scanning', 'Service Detection', 'OS Fingerprinting', 'Vulnerability Assessment']
    },
    {
      id: 'incident-tracker',
      name: 'Incident Tracker',
      description: 'Track and analyze security incidents',
      category: 'Security Intelligence',
      icon: AlertTriangle,
      status: 'active',
      features: ['Incident Logging', 'Timeline Analysis', 'Impact Assessment', 'Response Tracking']
    }
  ]

  const filteredTools = osintTools.filter(tool =>
    tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tool.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tool.category.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-500/10 text-green-400 border-green-500/20'
      case 'beta':
        return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
      case 'maintenance':
        return 'bg-red-500/10 text-red-400 border-red-500/20'
      default:
        return 'bg-gray-500/10 text-gray-400 border-gray-500/20'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="w-3 h-3" />
      case 'beta':
        return <AlertTriangle className="w-3 h-3" />
      default:
        return <AlertTriangle className="w-3 h-3" />
    }
  }

  return (
    <PageLayout>
      <div className="h-screen flex flex-col overflow-hidden">
        {/* Header with consistent padding */}
        <div className="p-4 sm:p-6 lg:p-8 border-b border-border bg-gradient-to-r from-blue-500/5 to-purple-500/5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Shield className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-foreground">OSINT Intelligence Tools</h1>
                  <p className="text-sm text-muted-foreground">Advanced investigation and intelligence gathering suite</p>
                </div>
              </div>
              <div className="flex items-center gap-2 mt-3">
                <Badge variant="secondary" className="text-xs">
                  <Shield className="w-3 h-3 mr-1" />
                  Law Enforcement Only
                </Badge>
                <Badge variant="outline" className="text-xs">
                  6 Active Tools
                </Badge>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  type="text"
                  placeholder="Search tools..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              <Button>
                <Zap className="w-4 h-4 mr-2" />
                Quick Scan
              </Button>
            </div>
          </div>
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3 mt-4">
            <p className="text-sm text-foreground">
              <span className="font-semibold">Note:</span> These tools provide advanced intelligence gathering capabilities for authorized law enforcement personnel. All activities are logged and monitored for compliance.
            </p>
          </div>
        </div>

        {/* Main content with consistent padding */}
        <AnimatedPage className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6">

        {/* Tools Grid */}
        <AnimatedGrid staggerDelay={0.05} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTools.map((tool) => {
            const IconComponent = tool.icon
            return (
              <AnimatedCard
                key={tool.id}
                className="cursor-pointer"
                onClick={() => setSelectedTool(tool.id)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <IconComponent className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{tool.name}</CardTitle>
                        <CardDescription className="text-sm">{tool.category}</CardDescription>
                      </div>
                    </div>
                    <Badge className={getStatusColor(tool.status)}>
                      <div className="flex items-center gap-1">
                        {getStatusIcon(tool.status)}
                        {tool.status}
                      </div>
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">{tool.description}</p>
                  
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-foreground">Features:</h4>
                    <div className="flex flex-wrap gap-1">
                      {tool.features.map((feature, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {feature}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-border">
                    <Button 
                      className="w-full" 
                      variant={selectedTool === tool.id ? "default" : "outline"}
                      onClick={(e) => {
                        e.stopPropagation()
                        setSelectedTool(tool.id)
                      }}
                    >
                      {selectedTool === tool.id ? 'Selected' : 'Select Tool'}
                    </Button>
                  </div>
                </CardContent>
              </AnimatedCard>
            )
          })}
        </AnimatedGrid>

        {/* Selected Tool Details */}
        {selectedTool && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Tool Configuration</CardTitle>
              <CardDescription>
                Configure and run the selected OSINT tool
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Target
                  </label>
                  <Input placeholder="Enter target (domain, IP, email, etc.)" />
                </div>
                
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Scan Options
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="flex items-center gap-2">
                        <input type="checkbox" defaultChecked />
                        <span className="text-sm">Deep Scan</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input type="checkbox" />
                        <span className="text-sm">Historical Data</span>
                      </label>
                    </div>
                    <div className="space-y-2">
                      <label className="flex items-center gap-2">
                        <input type="checkbox" defaultChecked />
                        <span className="text-sm">Real-time Updates</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input type="checkbox" />
                        <span className="text-sm">Export Results</span>
                      </label>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button>
                    <Zap className="w-4 h-4 mr-2" />
                    Start Scan
                  </Button>
                  <Button variant="outline">
                    Save Configuration
                  </Button>
                  <Button variant="outline" onClick={() => setSelectedTool(null)}>
                    Cancel
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-green-500/10">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Active Tools</p>
                  <p className="text-2xl font-bold text-foreground">
                    {osintTools.filter(t => t.status === 'active').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-500/10">
                  <Database className="w-4 h-4 text-blue-400" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Scans</p>
                  <p className="text-2xl font-bold text-foreground">1,247</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-yellow-500/10">
                  <AlertTriangle className="w-4 h-4 text-yellow-400" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Threats Detected</p>
                  <p className="text-2xl font-bold text-foreground">23</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-purple-500/10">
                  <Eye className="w-4 h-4 text-purple-400" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Data Sources</p>
                  <p className="text-2xl font-bold text-foreground">156</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        </AnimatedPage>
      </div>
    </PageLayout>
  )
}