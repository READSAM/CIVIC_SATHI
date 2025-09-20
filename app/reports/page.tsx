// import { Button } from "@/components/ui/button"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Badge } from "@/components/ui/badge"
// import { ArrowLeft, Calendar, MapPin, Eye } from "lucide-react"
// import Link from "next/link"
// import { db } from "@/lib/firebaseconfig";
// import { collection,getDocs } from "firebase/firestore"
// import { useEffect,useState } from "react";
// // Mock data for user reports
// // const mockReports = [
// //   {
// //     id: "RPT-001",
// //     date: "2024-01-15",
// //     type: "Broken Streetlight",
// //     location: "Main St & 5th Ave",
// //     status: "resolved",
// //     description: "Streetlight not working, creating safety hazard at night",
// //     image: "/broken-streetlight.jpg",
// //   },
// //   {
// //     id: "RPT-002",
// //     date: "2024-01-18",
// //     type: "Pothole",
// //     location: "Oak Street, near school",
// //     status: "in-progress",
// //     description: "Large pothole causing damage to vehicles",
// //     image: "/pothole-in-road.png",
// //   },
// //   {
// //     id: "RPT-003",
// //     date: "2024-01-20",
// //     type: "Graffiti",
// //     location: "City Park entrance",
// //     status: "submitted",
// //     description: "Vandalism on park entrance sign",
// //     image: "/graffiti-on-sign.jpg",
// //   },
// //   {
// //     id: "RPT-004",
// //     date: "2024-01-22",
// //     type: "Damaged Sidewalk",
// //     location: "Elm St, block 200",
// //     status: "acknowledged",
// //     description: "Cracked sidewalk creating trip hazard",
// //     image: "/cracked-sidewalk.jpg",
// //   },
// // ]

// type Report={
//   id:string;
//   date:string;
//   type:string;
//   location:string;
//   description:string;
//   image:string
// }
// export default function MyReportsPage() {
//   const [reports, setReports] = useState<Report[]>([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchReports = async () => {
//       const querySnapshot = await getDocs(collection(db, "reports"));
//       const reportsData: Report[] = querySnapshot.docs.map((doc) => ({
//         id: doc.id,
//         ...doc.data(),
//       })) as Report[];
//       setReports(reportsData);
//       setLoading(false);
//     };
//     fetchReports();
//   }, []);

// const getStatusColor = (status: string) => {
//   switch (status) {
//     case "submitted":
//       return "bg-blue-100 text-blue-800 border-blue-200"
//     case "acknowledged":
//       return "bg-yellow-100 text-yellow-800 border-yellow-200"
//     case "in-progress":
//       return "bg-orange-100 text-orange-800 border-orange-200"
//     case "resolved":
//       return "bg-green-100 text-green-800 border-green-200"
//     default:
//       return "bg-gray-100 text-gray-800 border-gray-200"
//   }
// }

// const getStatusText = (status: string) => {
//   switch (status) {
//     case "submitted":
//       return "Submitted"
//     case "acknowledged":
//       return "Acknowledged"
//     case "in-progress":
//       return "In Progress"
//     case "resolved":
//       return "Resolved"
//     default:
//       return status
//   }
// }

// export default function MyReportsPage() {
//   return (
//     <div className="min-h-screen bg-background">
//       {/* Header */}
//       <header className="bg-primary text-primary-foreground px-4 py-4">
//         <div className="max-w-md mx-auto flex items-center gap-3">
//           <Link href="/">
//             <Button variant="ghost" size="sm" className="text-primary-foreground hover:bg-primary-foreground/10">
//               <ArrowLeft className="h-4 w-4" />
//             </Button>
//           </Link>
//           <h1 className="text-xl font-semibold">My Reports</h1>
//         </div>
//       </header>

//       {/* Main Content */}
//       <main className="max-w-md mx-auto px-4 py-6">
//         {/* Summary Stats */}
//         <div className="grid grid-cols-2 gap-4 mb-6">
//           <Card>
//             <CardContent className="pt-4 text-center">
//               <div className="text-2xl font-bold text-primary">{reports.length}</div>
//               <div className="text-sm text-muted-foreground">Total Reports</div>
//             </CardContent>
//           </Card>
//           <Card>
//             <CardContent className="pt-4 text-center">
//               <div className="text-2xl font-bold text-secondary">
//                 {reports.filter((r) => r.status === "resolved").length}
//               </div>
//               <div className="text-sm text-muted-foreground">Resolved</div>
//             </CardContent>
//           </Card>
//         </div>

//         {/* Reports List */}
//         <div className="space-y-4">
//           <h2 className="text-lg font-semibold">Your Reports</h2>

//           {reports.length === 0 ? (
//             <Card>
//               <CardContent className="pt-6 text-center">
//                 <p className="text-muted-foreground mb-4">You haven't submitted any reports yet.</p>
//                 <Link href="/report">
//                   <Button>Report Your First Issue</Button>
//                 </Link>
//               </CardContent>
//             </Card>
//           ) : (
//             {loading ? (
//   <p className="text-center text-muted-foreground">Loading reports...</p>
// ) : reports.length === 0 ? (
//   <Card>
//     <CardContent className="pt-6 text-center">
//       <p className="text-muted-foreground mb-4">
//         You haven't submitted any reports yet.
//       </p>
//       <Link href="/report">
//         <Button>Report Your First Issue</Button>
//       </Link>
//     </CardContent>
//   </Card>
// ) : (
//   reports.map((report) => (
//     <Card key={report.id} className="hover:bg-card/80 transition-colors">
//       {/* same UI as before, but using `report` from Firestore */}
//     </Card>
//   ))
// )}

//           )}
//         </div>

//         {/* Action Button */}
//         <div className="mt-8">
//           <Link href="/report" className="block">
//             <Button className="w-full" size="lg">
//               Report New Issue
//             </Button>
//           </Link>
//         </div>
//       </main>
//     </div>
//   )
// }

"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { db } from "@/lib/firebaseconfig"
import { collection, getDocs } from "firebase/firestore"
import { useEffect, useState } from "react"
import type { Timestamp } from "firebase/firestore" 
type Report = {
  id: string
  date: string
  type: string
  location: string
  description: string
  image: string
  status: string
  tags?:string
  assignedDepartment?:string
}

export default function MyReportsPage() {
  const [reports, setReports] = useState<Report[]>([])
  const [loading, setLoading] = useState(true)

  // useEffect(() => {
  //   const fetchReports = async () => {
  //     try {
  //       const querySnapshot = await getDocs(collection(db, "reports"))
  //       const reportsData: Report[] = querySnapshot.docs.map((doc) => ({
  //       setReports(reportsData)
  //     } catch (err) {
  //       console.error("Error fetching reports:", err)
  //     } finally {
  //       setLoading(false)
  //     }
  //   }
  //   fetchReports()
  // }, [])
  useEffect(() => {
    const fetchReports = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "reports"))
        const reportsData: Report[] = querySnapshot.docs.map((doc) => {
          const data = doc.data()
          const timestamp = data.createdAt as Timestamp
          return {
            id: doc.id,
            date: data.date,
            type: data.type,
            location: data.location,
            description: data.description,
            image: data.image,
            status: data.status,
            tags: data.tags,
            // assignedDepartment: data.assignedDepartment,
          } as Report
        })
        setReports(reportsData)
      } catch (err) {
        console.error("Error fetching reports:", err)
      } finally {
        setLoading(false)
      }
    }
    fetchReports()
  }, [])


  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-primary text-primary-foreground px-4 py-4">
        <div className="max-w-md mx-auto flex items-center gap-3">
          <Link href="/">
            <Button
              variant="ghost"
              size="sm"
              className="text-primary-foreground hover:bg-primary-foreground/10"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-xl font-semibold">My Reports</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-md mx-auto px-4 py-6">
        {/* Summary Stats */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <Card>
            <CardContent className="pt-4 text-center">
              <div className="text-2xl font-bold text-primary">{reports.length}</div>
              <div className="text-sm text-muted-foreground">Total Reports</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4 text-center">
              <div className="text-2xl font-bold text-secondary">
                {reports.filter((r) => r.status === "resolved").length}
              </div>
              <div className="text-sm text-muted-foreground">Resolved</div>
            </CardContent>
          </Card>
        </div>

        {/* Reports List */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Your Reports</h2>

          {loading ? (
            <p className="text-center text-muted-foreground">Loading reports...</p>
          ) : reports.length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center">
                <p className="text-muted-foreground mb-4">
                  You haven't submitted any reports yet.
                </p>
                <Link href="/report">
                  <Button>Report Your First Issue</Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            reports.map((report) => (
              <Card key={report.id} className="hover:bg-card/80 transition-colors">
                <CardContent className="p-4">
                  <p className="font-semibold">{report.type}</p>
                  <p className="text-sm text-muted-foreground">{report.location}</p>
                  <p className="text-xs mt-1">{report.description}</p>
                  <div className="mt-2 space-y-1 text-sm">
                                        {report.tags && (
                                            <p><span className="font-medium">Tags:</span> {report.tags}</p>
                                        )}
                                        {report.assignedDepartment && (
                                            <p><span className="font-medium">Assigned to:</span> {report.assignedDepartment}</p>
                                        )}
                                    </div>
                                    <p className="text-xs text-muted-foreground mt-2">
                                        Submitted on: {formatDate(report.createdAt)}
                                    </p>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Action Button */}
        <div className="mt-8">
          <Link href="/report" className="block">
            <Button className="w-full" size="lg">
              Report New Issue
            </Button>
          </Link>
        </div>
      </main>
    </div>
  )
}
