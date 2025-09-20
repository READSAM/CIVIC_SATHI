"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, MapPin, Filter, X } from "lucide-react"
import Link from "next/link"

// Mock data for community reports
const mockCommunityReports = [
  {
    id: "RPT-101",
    date: "2024-01-20",
    type: "Broken Streetlight",
    location: "Main St & 3rd Ave",
    coordinates: { lat: 40.7128, lng: -74.006 },
    status: "in-progress",
    description: "Streetlight flickering intermittently",
    reporter: "Anonymous",
  },
  {
    id: "RPT-102",
    date: "2024-01-19",
    type: "Pothole",
    location: "Broadway & 42nd St",
    coordinates: { lat: 40.7589, lng: -73.9851 },
    status: "submitted",
    description: "Deep pothole causing traffic issues",
    reporter: "Community Member",
  },
  {
    id: "RPT-103",
    date: "2024-01-18",
    type: "Graffiti",
    location: "Central Park entrance",
    coordinates: { lat: 40.7829, lng: -73.9654 },
    status: "resolved",
    description: "Graffiti removed from park signage",
    reporter: "Park Visitor",
  },
  {
    id: "RPT-104",
    date: "2024-01-17",
    type: "Traffic Signal Issue",
    location: "5th Ave & 14th St",
    coordinates: { lat: 40.7359, lng: -73.9911 },
    status: "acknowledged",
    description: "Traffic light stuck on red",
    reporter: "Daily Commuter",
  },
  {
    id: "RPT-105",
    date: "2024-01-16",
    type: "Damaged Sidewalk",
    location: "Washington Square Park",
    coordinates: { lat: 40.7308, lng: -73.9973 },
    status: "in-progress",
    description: "Cracked pavement near fountain",
    reporter: "Local Resident",
  },
]

const getStatusColor = (status: string) => {
  switch (status) {
    case "submitted":
      return "bg-blue-100 text-blue-800 border-blue-200"
    case "acknowledged":
      return "bg-yellow-100 text-yellow-800 border-yellow-200"
    case "in-progress":
      return "bg-orange-100 text-orange-800 border-orange-200"
    case "resolved":
      return "bg-green-100 text-green-800 border-green-200"
    default:
      return "bg-gray-100 text-gray-800 border-gray-200"
  }
}

const getStatusText = (status: string) => {
  switch (status) {
    case "submitted":
      return "Submitted"
    case "acknowledged":
      return "Acknowledged"
    case "in-progress":
      return "In Progress"
    case "resolved":
      return "Resolved"
    default:
      return status
  }
}

const getMarkerColor = (status: string) => {
  switch (status) {
    case "submitted":
      return "#3b82f6" // blue
    case "acknowledged":
      return "#eab308" // yellow
    case "in-progress":
      return "#f97316" // orange
    case "resolved":
      return "#22c55e" // green
    default:
      return "#6b7280" // gray
  }
}

export default function MapViewPage() {
  const [filter, setFilter] = useState("all")
  const [selectedReport, setSelectedReport] = useState<(typeof mockCommunityReports)[0] | null>(null)

  const filteredReports = mockCommunityReports.filter((report) => {
    if (filter === "all") return true
    if (filter === "open") return report.status !== "resolved"
    return report.status === filter
  })

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-primary text-primary-foreground px-4 py-4">
        <div className="max-w-md mx-auto flex items-center gap-3">
          <Link href="/">
            <Button variant="ghost" size="sm" className="text-primary-foreground hover:bg-primary-foreground/10">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-xl font-semibold">Community Map</h1>
        </div>
      </header>

      {/* Filter Controls */}
      <div className="max-w-md mx-auto px-4 py-4 bg-muted/50">
        <div className="flex items-center gap-3">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="flex-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Issues</SelectItem>
              <SelectItem value="open">Open Issues Only</SelectItem>
              <SelectItem value="submitted">Submitted</SelectItem>
              <SelectItem value="acknowledged">Acknowledged</SelectItem>
              <SelectItem value="in-progress">In Progress</SelectItem>
              <SelectItem value="resolved">Resolved</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Map Placeholder */}
      <div className="max-w-md mx-auto px-4">
        <div className="relative bg-muted rounded-lg h-64 mb-4 overflow-hidden">
          {/* Simulated Map Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-green-100">
            <div className="absolute inset-0 opacity-20">
              <svg className="w-full h-full" viewBox="0 0 400 300">
                {/* Street lines */}
                <line x1="0" y1="100" x2="400" y2="100" stroke="#94a3b8" strokeWidth="2" />
                <line x1="0" y1="200" x2="400" y2="200" stroke="#94a3b8" strokeWidth="2" />
                <line x1="100" y1="0" x2="100" y2="300" stroke="#94a3b8" strokeWidth="2" />
                <line x1="200" y1="0" x2="200" y2="300" stroke="#94a3b8" strokeWidth="2" />
                <line x1="300" y1="0" x2="300" y2="300" stroke="#94a3b8" strokeWidth="2" />
              </svg>
            </div>
          </div>

          {/* Map Pins */}
          {filteredReports.map((report, index) => (
            <button
              key={report.id}
              onClick={() => setSelectedReport(report)}
              className="absolute transform -translate-x-1/2 -translate-y-full hover:scale-110 transition-transform"
              style={{
                left: `${20 + ((index * 15) % 60)}%`,
                top: `${30 + ((index * 20) % 40)}%`,
              }}
            >
              <div
                className="w-6 h-6 rounded-full border-2 border-white shadow-lg flex items-center justify-center"
                style={{ backgroundColor: getMarkerColor(report.status) }}
              >
                <MapPin className="h-3 w-3 text-white" />
              </div>
            </button>
          ))}

          {/* Map Controls */}
          <div className="absolute top-4 right-4 space-y-2">
            <Button size="sm" variant="secondary" className="w-8 h-8 p-0">
              +
            </Button>
            <Button size="sm" variant="secondary" className="w-8 h-8 p-0">
              -
            </Button>
          </div>

          {/* Map Legend */}
          <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-2 text-xs">
            <div className="text-xs font-medium mb-1">Status Legend</div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                <span>Submitted</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <span>Acknowledged</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                <span>In Progress</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span>Resolved</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Selected Report Details */}
      {selectedReport && (
        <div className="max-w-md mx-auto px-4 mb-4">
          <Card className="border-2 border-primary/20">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <CardTitle className="text-base">{selectedReport.type}</CardTitle>
                    <Badge className={`text-xs ${getStatusColor(selectedReport.status)}`}>
                      {getStatusText(selectedReport.status)}
                    </Badge>
                  </div>
                  <CardDescription className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {selectedReport.location}
                  </CardDescription>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedReport(null)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-sm text-muted-foreground mb-2 text-pretty">{selectedReport.description}</p>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Reported by: {selectedReport.reporter}</span>
                <span>{new Date(selectedReport.date).toLocaleDateString()}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Reports List */}
      <main className="max-w-md mx-auto px-4 pb-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Nearby Issues ({filteredReports.length})</h2>
          </div>

          {filteredReports.map((report) => (
            <Card
              key={report.id}
              className={`cursor-pointer transition-colors ${
                selectedReport?.id === report.id ? "border-primary bg-primary/5" : "hover:bg-card/80"
              }`}
              onClick={() => setSelectedReport(report)}
            >
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <CardTitle className="text-sm">{report.type}</CardTitle>
                      <Badge className={`text-xs ${getStatusColor(report.status)}`}>
                        {getStatusText(report.status)}
                      </Badge>
                    </div>
                    <CardDescription className="text-xs">{report.location}</CardDescription>
                  </div>
                  <div
                    className="w-4 h-4 rounded-full border border-white shadow-sm"
                    style={{ backgroundColor: getMarkerColor(report.status) }}
                  />
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-xs text-muted-foreground text-pretty">{report.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Action Button */}
        <div className="mt-6">
          <Link href="/report" className="block">
            <Button className="w-full" size="lg">
              Report Issue Here
            </Button>
          </Link>
        </div>
      </main>
    </div>
  )
}
