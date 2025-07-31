"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, Users, Clock, Heart, MessageCircle, DollarSign, Calendar, BarChart3 } from "lucide-react"

export function ModelAnalytics() {
  const analyticsData = {
    totalStreams: 45,
    totalHours: 127,
    totalViewers: 2847,
    avgViewers: 63,
    totalEarnings: 3456.78,
    topStreamDuration: "3h 24m",
    bestDay: "Saturday",
    growthRate: 23.5,
  }

  const recentStreams = [
    { date: "2024-01-30", title: "Evening Chat Session", duration: "2h 15m", viewers: 89, earnings: 145.5 },
    { date: "2024-01-29", title: "Music & Chill", duration: "1h 45m", viewers: 67, earnings: 98.25 },
    { date: "2024-01-28", title: "Q&A with Fans", duration: "3h 10m", viewers: 124, earnings: 234.75 },
    { date: "2024-01-27", title: "Fitness Motivation", duration: "1h 30m", viewers: 45, earnings: 67.8 },
  ]

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Streams</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData.totalStreams}</div>
            <p className="text-xs text-muted-foreground">+12% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Hours</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData.totalHours}h</div>
            <p className="text-xs text-muted-foreground">+8% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Viewers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData.totalViewers.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">+{analyticsData.growthRate}% growth rate</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${analyticsData.totalEarnings.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">+15% from last month</p>
          </CardContent>
        </Card>
      </div>

      {/* Performance Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Performance Insights</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Average Viewers per Stream</span>
              <Badge variant="secondary">{analyticsData.avgViewers}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Longest Stream</span>
              <Badge variant="secondary">{analyticsData.topStreamDuration}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Best Performing Day</span>
              <Badge variant="secondary">{analyticsData.bestDay}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Viewer Growth Rate</span>
              <Badge variant="default" className="bg-green-100 text-green-800">
                <TrendingUp className="w-3 h-3 mr-1" />+{analyticsData.growthRate}%
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Engagement Metrics</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Heart className="w-4 h-4 text-red-500" />
                <span className="text-sm text-gray-600">Total Likes</span>
              </div>
              <span className="font-semibold">1,247</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <MessageCircle className="w-4 h-4 text-blue-500" />
                <span className="text-sm text-gray-600">Total Messages</span>
              </div>
              <span className="font-semibold">3,891</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Users className="w-4 h-4 text-green-500" />
                <span className="text-sm text-gray-600">New Followers</span>
              </div>
              <span className="font-semibold">156</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <DollarSign className="w-4 h-4 text-yellow-500" />
                <span className="text-sm text-gray-600">Avg. Earnings/Hour</span>
              </div>
              <span className="font-semibold">
                ${(analyticsData.totalEarnings / analyticsData.totalHours).toFixed(2)}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Streams */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Streams</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentStreams.map((stream, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-600">{stream.date}</span>
                  </div>
                  <div>
                    <h4 className="font-medium">{stream.title}</h4>
                    <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                      <span className="flex items-center">
                        <Clock className="w-3 h-3 mr-1" />
                        {stream.duration}
                      </span>
                      <span className="flex items-center">
                        <Users className="w-3 h-3 mr-1" />
                        {stream.viewers} viewers
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-green-600">${stream.earnings}</div>
                  <div className="text-sm text-gray-500">earned</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
