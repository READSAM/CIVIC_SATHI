import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Camera, Map, FileText, Bell } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-primary text-primary-foreground px-4 py-6">
        <div className="max-w-md mx-auto">
          <h1 className="text-2xl font-bold text-balance">CivicSaathi</h1>
          <p className="text-primary-foreground/90 mt-1 text-pretty">
            Help improve your community by reporting civic issues
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-md mx-auto px-4 py-6">
        {/* Welcome Message */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-2 text-balance">Welcome to CivicSaathi</h2>
          <p className="text-muted-foreground text-pretty leading-relaxed">
            Report issues like broken streetlights, potholes, or damaged infrastructure. Track your reports and see
            community issues on the map.
          </p>
        </div>

        {/* Action Cards */}
        <div className="space-y-4">
          {/* Report Issue Card */}
          <Card className="border-2 border-primary/20 hover:border-primary/40 transition-colors">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Camera className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-lg">Report Issue</CardTitle>
                  <CardDescription>Take a photo and report a civic problem</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <Link href="/report" className="block">
                <Button className="w-full" size="lg">
                  Report New Issue
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* My Reports Card */}
          <Card className="hover:bg-card/80 transition-colors">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-secondary/10 rounded-lg">
                  <FileText className="h-6 w-6 text-secondary" />
                </div>
                <div>
                  <CardTitle className="text-lg">My Reports</CardTitle>
                  <CardDescription>Track your submitted issues</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <Link href="/reports" className="block">
                <Button variant="secondary" className="w-full" size="lg">
                  View My Reports
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Map View Card */}
          <Card className="hover:bg-card/80 transition-colors">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-accent/10 rounded-lg">
                  <Map className="h-6 w-6 text-accent" />
                </div>
                <div>
                  <CardTitle className="text-lg">Community Map</CardTitle>
                  <CardDescription>See reported issues in your area</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <Link href="/map" className="block">
                <Button variant="outline" className="w-full bg-transparent" size="lg">
                  View Map
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Quick Stats */}
        <div className="mt-8 p-4 bg-muted rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Bell className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Community Impact</span>
          </div>
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-primary">247</div>
              <div className="text-xs text-muted-foreground">Issues Reported</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-secondary">189</div>
              <div className="text-xs text-muted-foreground">Issues Resolved</div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-8 text-center">
          <p className="text-sm text-muted-foreground text-pretty">
            Together we can make our community better, one report at a time.
          </p>
        </footer>
      </main>
    </div>
  )
}
