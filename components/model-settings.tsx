"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { User, Camera, Bell, Shield, Save } from "lucide-react"

export function ModelSettings() {
  const [profile, setProfile] = useState({
    displayName: "Sarah Model",
    bio: "Professional model and content creator. Love connecting with my audience!",
    location: "Los Angeles, CA",
    website: "https://sarahmodel.com",
  })

  const [streamSettings, setStreamSettings] = useState({
    defaultTitle: "Live with Sarah ✨",
    autoStart: false,
    recordStreams: true,
    allowScreenShare: true,
    moderationEnabled: true,
  })

  const [notifications, setNotifications] = useState({
    newFollowers: true,
    streamStart: true,
    donations: true,
    messages: false,
  })

  const [privacy, setPrivacy] = useState({
    showViewerCount: true,
    allowPrivateMessages: true,
    blockAnonymous: false,
    requireVerification: false,
  })

  return (
    <div className="space-y-6">
      {/* Profile Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <User className="w-5 h-5" />
            <span>Profile Settings</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="displayName">Display Name</Label>
              <Input
                id="displayName"
                value={profile.displayName}
                onChange={(e) => setProfile((prev) => ({ ...prev, displayName: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={profile.location}
                onChange={(e) => setProfile((prev) => ({ ...prev, location: e.target.value }))}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              value={profile.bio}
              onChange={(e) => setProfile((prev) => ({ ...prev, bio: e.target.value }))}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="website">Website</Label>
            <Input
              id="website"
              type="url"
              value={profile.website}
              onChange={(e) => setProfile((prev) => ({ ...prev, website: e.target.value }))}
            />
          </div>
        </CardContent>
      </Card>

      {/* Stream Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Camera className="w-5 h-5" />
            <span>Stream Settings</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="defaultTitle">Default Stream Title</Label>
            <Input
              id="defaultTitle"
              value={streamSettings.defaultTitle}
              onChange={(e) => setStreamSettings((prev) => ({ ...prev, defaultTitle: e.target.value }))}
            />
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Auto-start Recording</Label>
                <p className="text-sm text-gray-600">Automatically record all streams</p>
              </div>
              <Switch
                checked={streamSettings.recordStreams}
                onCheckedChange={(checked) => setStreamSettings((prev) => ({ ...prev, recordStreams: checked }))}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Allow Screen Sharing</Label>
                <p className="text-sm text-gray-600">Enable screen sharing during streams</p>
              </div>
              <Switch
                checked={streamSettings.allowScreenShare}
                onCheckedChange={(checked) => setStreamSettings((prev) => ({ ...prev, allowScreenShare: checked }))}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Chat Moderation</Label>
                <p className="text-sm text-gray-600">Enable automatic chat moderation</p>
              </div>
              <Switch
                checked={streamSettings.moderationEnabled}
                onCheckedChange={(checked) => setStreamSettings((prev) => ({ ...prev, moderationEnabled: checked }))}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Bell className="w-5 h-5" />
            <span>Notifications</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>New Followers</Label>
              <p className="text-sm text-gray-600">Get notified when someone follows you</p>
            </div>
            <Switch
              checked={notifications.newFollowers}
              onCheckedChange={(checked) => setNotifications((prev) => ({ ...prev, newFollowers: checked }))}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Stream Started</Label>
              <p className="text-sm text-gray-600">Notify followers when you go live</p>
            </div>
            <Switch
              checked={notifications.streamStart}
              onCheckedChange={(checked) => setNotifications((prev) => ({ ...prev, streamStart: checked }))}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Donations</Label>
              <p className="text-sm text-gray-600">Get notified about donations</p>
            </div>
            <Switch
              checked={notifications.donations}
              onCheckedChange={(checked) => setNotifications((prev) => ({ ...prev, donations: checked }))}
            />
          </div>
        </CardContent>
      </Card>

      {/* Privacy Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="w-5 h-5" />
            <span>Privacy & Safety</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Show Viewer Count</Label>
              <p className="text-sm text-gray-600">Display viewer count publicly</p>
            </div>
            <Switch
              checked={privacy.showViewerCount}
              onCheckedChange={(checked) => setPrivacy((prev) => ({ ...prev, showViewerCount: checked }))}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Allow Private Messages</Label>
              <p className="text-sm text-gray-600">Let viewers send you private messages</p>
            </div>
            <Switch
              checked={privacy.allowPrivateMessages}
              onCheckedChange={(checked) => setPrivacy((prev) => ({ ...prev, allowPrivateMessages: checked }))}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Block Anonymous Users</Label>
              <p className="text-sm text-gray-600">Only allow registered users to view</p>
            </div>
            <Switch
              checked={privacy.blockAnonymous}
              onCheckedChange={(checked) => setPrivacy((prev) => ({ ...prev, blockAnonymous: checked }))}
            />
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button size="lg" className="px-8">
          <Save className="w-4 h-4 mr-2" />
          Save All Settings
        </Button>
      </div>
    </div>
  )
}
