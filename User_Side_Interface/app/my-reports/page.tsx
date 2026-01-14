"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/AuthContext";
import { db } from "@/lib/firebaseconfig";
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, MapPin, Calendar, Clock, CheckCircle, FileText } from "lucide-react";

export default function MyReportsPage() {
  const { user, loading } = useAuth();
  const [reports, setReports] = useState<any[]>([]);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      if (!user) return;
      
      try {
        // Query: Get reports for this user, ordered by newest first
        const q = query(
          collection(db, "reports"),
          where("userId", "==", user.uid),
          orderBy("createdAt", "desc") // Make sure to create an index in Firebase if this errors!
        );
        
        const querySnapshot = await getDocs(q);
        const userReports = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        setReports(userReports);
      } catch (error) {
        console.error("Error fetching reports:", error);
        // Fallback if index is missing (client-side sort)
        if (error.code === 'failed-precondition') {
           console.log("Creating fallback query without sort...");
           const qFallback = query(collection(db, "reports"), where("userId", "==", user.uid));
           const snap = await getDocs(qFallback);
           const data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
           setReports(data.sort((a,b) => b.createdAt - a.createdAt));
        }
      } finally {
        setFetching(false);
      }
    };

    if (!loading) fetchReports();
  }, [user, loading]);

  // Calculate Stats
  const totalReports = reports.length;
  const resolvedReports = reports.filter(r => r.status === 'resolved' || r.status === 'Resolved').length;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      
      {/* 1. BLUE HEADER BAR */}
      <div className="bg-[#0f609b] text-white p-4 shadow-md sticky top-0 z-10">
        <div className="container mx-auto max-w-md flex items-center gap-4">
          <Link href="/">
            <ArrowLeft className="h-6 w-6 cursor-pointer hover:opacity-80" />
          </Link>
          <h1 className="text-xl font-bold">My Reports</h1>
        </div>
      </div>

      <div className="container mx-auto max-w-md p-4 flex-1 flex flex-col gap-6">

        {/* 2. STATS CARDS */}
        <div className="grid grid-cols-2 gap-4 mt-2">
          {/* Total Card */}
          <Card className="shadow-sm border-none">
            <CardContent className="flex flex-col items-center justify-center p-6">
              <span className="text-4xl font-bold text-[#0f609b]">{totalReports}</span>
              <span className="text-sm text-gray-500 mt-1">Total Reports</span>
            </CardContent>
          </Card>
          
          {/* Resolved Card */}
          <Card className="shadow-sm border-none">
             <CardContent className="flex flex-col items-center justify-center p-6">
              <span className="text-4xl font-bold text-green-500">{resolvedReports}</span>
              <span className="text-sm text-gray-500 mt-1">Resolved</span>
            </CardContent>
          </Card>
        </div>

        {/* 3. "YOUR REPORTS" SECTION */}
        <div>
          <h2 className="text-lg font-bold text-gray-800 mb-4">Your Reports</h2>
          
          {fetching ? (
            <div className="text-center py-10 text-gray-500 animate-pulse">
              Loading reports...
            </div>
          ) : reports.length === 0 ? (
            <div className="text-center py-10 bg-white rounded-lg shadow-sm">
              <FileText className="h-12 w-12 text-gray-300 mx-auto mb-2" />
              <p className="text-gray-500">No reports found.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {reports.map((report) => (
                <Card key={report.id} className="shadow-sm border-none overflow-hidden hover:shadow-md transition-shadow">
                  <div className="flex">
                    {/* Image Thumbnail (Left) */}
                    {report.image ? (
                        <div className="w-24 h-auto bg-gray-200">
                            <img src={report.image} alt="Issue" className="w-full h-full object-cover" />
                        </div>
                    ) : (
                        <div className="w-24 h-auto bg-gray-100 flex items-center justify-center text-gray-400">
                            <FileText className="h-8 w-8" />
                        </div>
                    )}
                    
                    {/* Content (Right) */}
                    <div className="flex-1 p-3">
                        <div className="flex justify-between items-start mb-1">
                            <h3 className="font-semibold text-gray-800 line-clamp-1 capitalize">
                                {report.type || "General Issue"}
                            </h3>
                            <Badge variant="outline" className={
                                report.status === 'resolved' 
                                ? "text-green-600 bg-green-50 border-green-200" 
                                : "text-yellow-600 bg-yellow-50 border-yellow-200"
                            }>
                                {report.status || "Pending"}
                            </Badge>
                        </div>
                        <p className="text-xs text-gray-500 line-clamp-2 mb-2 h-8">
                            {report.description}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-gray-400">
                             <Calendar className="h-3 w-3" />
                             <span>
                                {report.createdAt?.seconds 
                                    ? new Date(report.createdAt.seconds * 1000).toLocaleDateString() 
                                    : 'Recently'}
                             </span>
                        </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>

      </div>

      {/* 4. BOTTOM BUTTON */}
      <div className="p-4 bg-white border-t sticky bottom-0 z-10">
        <div className="container mx-auto max-w-md">
            <Button className="w-full bg-[#006886] hover:bg-[#00556d] text-white h-12 text-lg rounded-lg" asChild>
                <Link href="/report">
                    Report New Issue
                </Link>
            </Button>
        </div>
      </div>
    </div>
  );
}
