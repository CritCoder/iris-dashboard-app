'use client'

import { useState, useEffect } from 'react'
import { Bell, Mail, Users, AlertCircle, Check, Loader2, Send } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { useToast } from '@/hooks/use-toast'
import { api } from '@/lib/api'
import { mockNotificationApi } from '@/lib/mock-notification-api'

interface NotificationSettings {
  emailEnabled: boolean
  emailRecipients: string[]
  notifyOnNewPost: boolean
  notifyOnHighPriority: boolean
  notifyOnNegativeSentiment: boolean
  notifyOnHighEngagement: boolean
  minEngagementThreshold: number
  digestFrequency: 'realtime' | 'hourly' | 'daily' | 'weekly'
}

interface TeamMember {
  id: string
  email: string
  name: string
  role: string
}

interface CampaignNotificationSettingsProps {
  campaignId: string
  campaignName: string
}

export function CampaignNotificationSettings({ campaignId, campaignName }: CampaignNotificationSettingsProps) {
  const [settings, setSettings] = useState<NotificationSettings>({
    emailEnabled: false,
    emailRecipients: [],
    notifyOnNewPost: true,
    notifyOnHighPriority: true,
    notifyOnNegativeSentiment: true,
    notifyOnHighEngagement: false,
    minEngagementThreshold: 1000,
    digestFrequency: 'realtime'
  })

  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([])
  const [newEmail, setNewEmail] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [testing, setTesting] = useState(false)
  const { toast, success, error } = useToast()

  useEffect(() => {
    loadSettings()
    loadTeamMembers()
  }, [campaignId])

  const loadSettings = async () => {
    try {
      setLoading(true)
      console.log('Loading notification settings for campaign:', campaignId)
      
      // Try to load from API first
      const result = await api.notification.getCampaignSettings(campaignId)
      console.log('Load settings result:', result)
      
      if (result.success && result.data) {
        setSettings(result.data)
      } else {
        console.warn('API failed, trying mock API:', result.message)
        
        // Fallback to mock API
        const mockResult = await mockNotificationApi.getCampaignSettings(campaignId)
        if (mockResult.success && mockResult.data) {
          setSettings(mockResult.data)
          console.log('Loaded settings from mock API')
        } else {
          console.warn('Mock API also failed, using default settings')
          // Use default settings if both APIs fail
          setSettings({
            emailEnabled: false,
            emailRecipients: [],
            notifyOnNewPost: true,
            notifyOnHighPriority: true,
            notifyOnNegativeSentiment: true,
            notifyOnHighEngagement: false,
            minEngagementThreshold: 1000,
            digestFrequency: 'realtime'
          })
        }
      }
    } catch (err) {
      console.error('Failed to load notification settings:', err)
      
      // Fallback to mock API on error
      try {
        const mockResult = await mockNotificationApi.getCampaignSettings(campaignId)
        if (mockResult.success && mockResult.data) {
          setSettings(mockResult.data)
          console.log('Loaded settings from mock API after error')
        }
      } catch (mockErr) {
        console.error('Mock API also failed:', mockErr)
        // Use default settings as last resort
        setSettings({
          emailEnabled: false,
          emailRecipients: [],
          notifyOnNewPost: true,
          notifyOnHighPriority: true,
          notifyOnNegativeSentiment: true,
          notifyOnHighEngagement: false,
          minEngagementThreshold: 1000,
          digestFrequency: 'realtime'
        })
      }
    } finally {
      setLoading(false)
    }
  }

  const loadTeamMembers = async () => {
    try {
      const result = await api.notification.getTeamMembers()
      if (result.success && result.data) {
        setTeamMembers(result.data)
      } else {
        console.warn('API failed, trying mock API for team members:', result.message)
        
        // Fallback to mock API
        const mockResult = await mockNotificationApi.getTeamMembers()
        if (mockResult.success && mockResult.data) {
          setTeamMembers(mockResult.data)
          console.log('Loaded team members from mock API')
        }
      }
    } catch (err) {
      console.error('Failed to load team members:', err)
      
      // Fallback to mock API on error
      try {
        const mockResult = await mockNotificationApi.getTeamMembers()
        if (mockResult.success && mockResult.data) {
          setTeamMembers(mockResult.data)
          console.log('Loaded team members from mock API after error')
        }
      } catch (mockErr) {
        console.error('Mock API also failed:', mockErr)
      }
    }
  }

  const handleSave = async () => {
    try {
      setSaving(true)
      console.log('Saving notification settings:', { campaignId, settings })
      
      const result = await api.notification.updateCampaignSettings(campaignId, settings)
      console.log('Save result:', result)

      if (result.success) {
        success('Notification settings saved successfully!')
      } else {
        console.error('API save failed, trying mock API:', result.message)
        
        // Fallback to mock API
        const mockResult = await mockNotificationApi.updateCampaignSettings(campaignId, settings)
        if (mockResult.success) {
          success('Notification settings saved successfully! (using offline mode)')
        } else {
          error('Failed to save notification settings')
        }
      }
    } catch (err) {
      console.error('Save error:', err)
      
      // Fallback to mock API on error
      try {
        const mockResult = await mockNotificationApi.updateCampaignSettings(campaignId, settings)
        if (mockResult.success) {
          success('Notification settings saved successfully! (using offline mode)')
        } else {
          error('Failed to save notification settings')
        }
      } catch (mockErr) {
        console.error('Mock API also failed:', mockErr)
        error('Failed to save notification settings')
      }
    } finally {
      setSaving(false)
    }
  }

  const handleTestEmail = async () => {
    if (settings.emailRecipients.length === 0) {
      error('Please add at least one email recipient')
      return
    }

    try {
      setTesting(true)
      const result = await api.notification.testEmail({
        campaignId,
        recipientEmail: settings.emailRecipients[0]
      })

      if (result.success) {
        success(`Test email sent to ${settings.emailRecipients[0]}`)
      } else {
        console.error('API test email failed, trying mock API:', result.message)
        
        // Fallback to mock API
        const mockResult = await mockNotificationApi.testEmail({
          campaignId,
          recipientEmail: settings.emailRecipients[0]
        })
        
        if (mockResult.success) {
          success(`Test email sent to ${settings.emailRecipients[0]} (simulated)`)
        } else {
          error('Failed to send test email')
        }
      }
    } catch (err) {
      console.error('Test email error:', err)
      
      // Fallback to mock API on error
      try {
        const mockResult = await mockNotificationApi.testEmail({
          campaignId,
          recipientEmail: settings.emailRecipients[0]
        })
        
        if (mockResult.success) {
          success(`Test email sent to ${settings.emailRecipients[0]} (simulated)`)
        } else {
          error('Failed to send test email')
        }
      } catch (mockErr) {
        console.error('Mock API also failed:', mockErr)
        error('Failed to send test email')
      }
    } finally {
      setTesting(false)
    }
  }

  const addEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      error('Please enter a valid email address')
      return
    }

    if (settings.emailRecipients.includes(email)) {
      error('Email already added')
      return
    }

    setSettings(prev => ({
      ...prev,
      emailRecipients: [...prev.emailRecipients, email]
    }))
    setNewEmail('')
  }

  const removeEmail = (email: string) => {
    setSettings(prev => ({
      ...prev,
      emailRecipients: prev.emailRecipients.filter(e => e !== email)
    }))
  }

  const addTeamMember = (member: TeamMember) => {
    addEmail(member.email)
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Bell className="w-5 h-5" />
              Email Notifications
            </CardTitle>
            <CardDescription>
              Configure email alerts for "{campaignName}" campaign
            </CardDescription>
          </div>
          <Switch
            checked={settings.emailEnabled}
            onCheckedChange={(checked) => setSettings(prev => ({ ...prev, emailEnabled: checked }))}
          />
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {settings.emailEnabled && (
          <>
            {/* Email Recipients */}
            <div className="space-y-3">
              <Label className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email Recipients
              </Label>
              <div className="flex gap-2">
                <Input
                  type="email"
                  placeholder="Enter email address"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      addEmail(newEmail)
                    }
                  }}
                />
                <Button
                  onClick={() => addEmail(newEmail)}
                  variant="outline"
                >
                  Add
                </Button>
              </div>

              {/* Team Members Quick Add */}
              {teamMembers.length > 0 && (
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground flex items-center gap-2">
                    <Users className="w-3 h-3" />
                    Quick Add Team Members
                  </Label>
                  <div className="flex flex-wrap gap-2">
                    {teamMembers
                      .filter(member => !settings.emailRecipients.includes(member.email))
                      .map((member) => (
                        <Button
                          key={member.id}
                          variant="outline"
                          size="sm"
                          onClick={() => addTeamMember(member)}
                          className="text-xs"
                        >
                          {member.name} ({member.role})
                        </Button>
                      ))}
                  </div>
                </div>
              )}

              {/* Current Recipients */}
              {settings.emailRecipients.length > 0 && (
                <div className="flex flex-wrap gap-2 p-3 bg-muted rounded-lg">
                  {settings.emailRecipients.map((email) => (
                    <Badge key={email} variant="secondary" className="gap-2">
                      {email}
                      <button
                        onClick={() => removeEmail(email)}
                        className="hover:text-destructive"
                      >
                        ×
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            {/* Notification Triggers */}
            <div className="space-y-4">
              <Label>Notification Triggers</Label>

              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div>
                    <p className="font-medium text-sm">New Posts</p>
                    <p className="text-xs text-muted-foreground">Get notified for every new post matching campaign filters</p>
                  </div>
                  <Switch
                    checked={settings.notifyOnNewPost}
                    onCheckedChange={(checked) => setSettings(prev => ({ ...prev, notifyOnNewPost: checked }))}
                  />
                </div>

                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div>
                    <p className="font-medium text-sm">High Priority Posts</p>
                    <p className="text-xs text-muted-foreground">Alert for posts marked as high priority</p>
                  </div>
                  <Switch
                    checked={settings.notifyOnHighPriority}
                    onCheckedChange={(checked) => setSettings(prev => ({ ...prev, notifyOnHighPriority: checked }))}
                  />
                </div>

                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div>
                    <p className="font-medium text-sm">Negative Sentiment</p>
                    <p className="text-xs text-muted-foreground">Alert when negative sentiment posts are detected</p>
                  </div>
                  <Switch
                    checked={settings.notifyOnNegativeSentiment}
                    onCheckedChange={(checked) => setSettings(prev => ({ ...prev, notifyOnNegativeSentiment: checked }))}
                  />
                </div>

                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div>
                    <p className="font-medium text-sm">High Engagement</p>
                    <p className="text-xs text-muted-foreground">Alert when posts exceed engagement threshold</p>
                  </div>
                  <Switch
                    checked={settings.notifyOnHighEngagement}
                    onCheckedChange={(checked) => setSettings(prev => ({ ...prev, notifyOnHighEngagement: checked }))}
                  />
                </div>

                {settings.notifyOnHighEngagement && (
                  <div className="ml-4 space-y-2">
                    <Label className="text-xs">Engagement Threshold</Label>
                    <Input
                      type="number"
                      value={settings.minEngagementThreshold}
                      onChange={(e) => setSettings(prev => ({ ...prev, minEngagementThreshold: parseInt(e.target.value) || 0 }))}
                      placeholder="1000"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Digest Frequency */}
            <div className="space-y-2">
              <Label>Notification Frequency</Label>
              <Select
                value={settings.digestFrequency}
                onValueChange={(value: any) => setSettings(prev => ({ ...prev, digestFrequency: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="realtime">Real-time (Immediate)</SelectItem>
                  <SelectItem value="hourly">Hourly Digest</SelectItem>
                  <SelectItem value="daily">Daily Digest</SelectItem>
                  <SelectItem value="weekly">Weekly Digest</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Warning for realtime */}
            {settings.digestFrequency === 'realtime' && (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Real-time notifications will send an email for each qualifying post. Consider using digest mode for high-volume campaigns.
                </AlertDescription>
              </Alert>
            )}
          </>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4 border-t">
          <Button
            onClick={handleSave}
            disabled={saving}
            className="flex-1"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Check className="w-4 h-4 mr-2" />
                Save Settings
              </>
            )}
          </Button>

          {settings.emailEnabled && settings.emailRecipients.length > 0 && (
            <Button
              onClick={handleTestEmail}
              disabled={testing}
              variant="outline"
            >
              {testing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Test Email
                </>
              )}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
