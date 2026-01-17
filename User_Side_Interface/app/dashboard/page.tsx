// "use client";
// import React, { useState, useEffect } from 'react';
// import { 
//     Map as MapIcon, 
//     FileText, 
//     Trophy, 
//     Coins, 
//     CheckCircle, 
//     ChevronRight, 
//     Award, 
//     Lock, 
//     Download 
// } from 'lucide-react';
// import Link from 'next/link';
// import { useAuth } from "@/lib/AuthContext"; 
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"; 
// import { db } from '@/lib/firebaseconfig';
// import { doc, getDoc } from 'firebase/firestore';
// import CertificateModal from '@/components/CertificateModal';

// // Define the interface to match Firestore data
// interface UserStats {
//   totalReports: number;
//   coins: number;
//   level: number;
//   rankTitle: string;
// }

// // Define the static structure for certificates
// const CERTIFICATES_DATA = [
//     { id: 1, title: "Civic Observer", description: "Report your first 5 issues", threshold: 5, color: "text-[#00648e]" },
//     { id: 2, title: "Neighborhood Watch", description: "Report 10 issues", threshold: 10, color: "text-[#00648e]" },
//     { id: 3, title: "Community Guardian", description: "Report 25 issues", threshold: 25, color: "text-purple-600" },
//     { id: 4, title: "City Hero", description: "Report 50 issues", threshold: 50, color: "text-orange-500" }
// ];

// const CommunityDashboard: React.FC = () => {
//   const { user } = useAuth(); 
//   const [loading, setLoading] = useState(true);
  
//   // Default State (starts at 0)
//   const [stats, setStats] = useState<UserStats>({
//     totalReports: 0,
//     coins: 0,
//     level: 1,
//     rankTitle: "Citizen"
//   });

//   // 1. Fetch Data from Firestore
//   useEffect(() => {
//     const fetchStats = async () => {
//       if (!user?.uid) return;
      
//       try {
//         const docRef = doc(db, "user_stats", user.uid);
//         const snap = await getDoc(docRef);

//         if (snap.exists()) {
//           // Merge Firestore data with our interface
//           const data = snap.data();
//           setStats({
//             totalReports: data.totalReports || 0,
//             coins: data.coins || 0,
//             level: data.level || 1,
//             rankTitle: data.rankTitle || "Citizen"
//           });
//         }
//       } catch (error) {
//         console.error("Error fetching stats:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchStats();
//   }, [user]);

//   // 2. Logic: Calculate Next Milestone dynamically
//   const getNextMilestone = (currentReports: number) => {
//     if (currentReports < 5) return 5;
//     if (currentReports < 10) return 10;
//     if (currentReports < 25) return 25;
//     if (currentReports < 50) return 50;
//     return 100;
//   };

//   const nextThreshold = getNextMilestone(stats.totalReports);
//   const progressPercentage = Math.min((stats.totalReports / nextThreshold) * 100, 100);
//   const reportsNeeded = nextThreshold - stats.totalReports;

//   // 3. Mock Download Function
//   const handleDownload = (certTitle: string) => {
//       alert(`Downloading Certificate: ${certTitle}`);
//       // In future: triggers PDF generation
//   };

//   if (loading) return <div className="min-h-screen flex items-center justify-center text-[#00648e]">Loading Dashboard...</div>;

//   return (
//     <div className="min-h-screen bg-gray-50 font-sans text-slate-800">
      
//       {/* HEADER */}
//       <div className="bg-[#00648e] p-4 text-white shadow-md">
//         <div className="max-w-md mx-auto flex justify-between items-center">
//           <div>
//             <h1 className="text-xl font-bold">CivicSaathi</h1>
//             <p className="text-xs opacity-90">User Dashboard</p>
//           </div>
//           {user && (
//             <div className="flex items-center gap-3">
//               <div className="text-right hidden md:block">
//                 <p className="text-sm font-semibold">{user.displayName || "User"}</p>
//                 <p className="text-xs opacity-90">{stats.rankTitle}</p>
//               </div>
//               <Avatar className="h-10 w-10 border-2 border-white shadow-sm">
//                   <AvatarImage src={user.photoURL || ""} alt={user.email || ""} />
//                   <AvatarFallback className="bg-[#1a6b88] text-white font-bold">
//                       {user.email?.charAt(0).toUpperCase()}
//                   </AvatarFallback>
//               </Avatar>
//             </div>
//           )}
//         </div>
//       </div>

//       <div className="max-w-md mx-auto p-6 space-y-6">
        
//         {/* BALANCE / LEVEL CARD */}
//         <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
//           <div className="flex justify-between items-center mb-4">
//             <div>
//               <p className="text-sm text-gray-500 font-medium">Your Balance</p>
//               <div className="flex items-center gap-2">
//                 <Coins className="text-yellow-500" size={20} />
//                 <span className="text-2xl font-bold">{stats.coins.toLocaleString()}</span>
//               </div>
//             </div>
//             <div className="text-right">
//               <span className="bg-[#e4f4f9] text-[#00648e] text-xs font-bold px-3 py-1 rounded-full uppercase">
//                 LEVEL {stats.level}
//               </span>
//             </div>
//           </div>

//           <div className="space-y-2">
//             <div className="flex justify-between text-xs font-medium">
//               <span>Progress to Next Rank</span>
//               <span>{Math.round(progressPercentage)}%</span>
//             </div>
//             <div className="w-full bg-gray-100 h-3 rounded-full overflow-hidden">
//               <div className="bg-[#00648e] h-full transition-all duration-1000 ease-out" style={{ width: `${progressPercentage}%` }}/>
//             </div>
//             <p className="text-[10px] text-gray-400 italic">
//               {reportsNeeded > 0 
//                 ? `Submit ${reportsNeeded} more verified reports to level up.`
//                 : "Max level reached!"}
//             </p>
//           </div>
//         </div>

//         {/* CERTIFICATIONS CARD */}
//         <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
//           <div className="flex items-center justify-between mb-4">
//             <div className="flex items-center gap-2">
//               <Award className="text-[#00648e]" size={20} />
//               <h3 className="text-lg font-bold">Certifications</h3>
//             </div>
//             <span className="text-xs text-gray-400">
//               {/* Dynamic Count */}
//               <span className="text-[#00648e] font-semibold">
//                 {CERTIFICATES_DATA.filter(c => stats.totalReports >= c.threshold).length}
//               </span>
//               /{CERTIFICATES_DATA.length} Earned
//             </span>
//           </div>

//           <div className="space-y-3">
//             {CERTIFICATES_DATA.map((cert) => {
//               const isUnlocked = stats.totalReports >= cert.threshold;
              
//               return (
//                 <div 
//                   key={cert.id} 
//                   className={`flex items-center justify-between p-3 rounded-xl border transition-all ${
//                     isUnlocked 
//                       ? 'bg-[#e4f4f9] border-[#bee0eb]'
//                       : 'bg-white border-gray-100 opacity-60'
//                   }`}
//                 >
//                   <div className="flex items-center gap-3">
//                     <div className={`p-2 rounded-full ${isUnlocked ? 'bg-white shadow-sm' : 'bg-gray-100'}`}>
//                       {isUnlocked ? (
//                         <Award size={18} className={cert.color} />
//                       ) : (
//                         <Lock size={18} className="text-gray-400" />
//                       )}
//                     </div>
//                     <div>
//                       <p className={`text-sm font-bold ${isUnlocked ? 'text-gray-800' : 'text-gray-500'}`}>
//                         {cert.title}
//                       </p>
//                       <p className="text-[10px] text-gray-500">{cert.description}</p>
//                     </div>
//                   </div>
                  
//                   {isUnlocked && (
//                      <button onClick={() => handleDownload(cert.title)} className="text-[#00648e] hover:text-[#004d6e]">
//                         <Download size={16} />
//                      </button>
//                   )}
//                 </div>
//               );
//             })}
//           </div>
//         </div>

//         {/* ACTION BUTTONS */}
//         <Link href="/my-reports" className="block w-full">
//             <button className="w-full bg-[#00648e] text-white py-4 rounded-xl font-semibold hover:bg-[#1f7ca0] transition-all shadow-sm">
//             View My Reports
//             </button>
//         </Link>

//         {/* COMMUNITY IMPACT GRID */}
//         <div className="bg-[#e4f4f9] p-6 rounded-2xl border border-[#bee0eb]">
//           <div className="flex items-center gap-2 mb-6 text-[#00648e]">
//             <FileText size={18} />
//             <span className="font-semibold text-sm uppercase tracking-wider">Community Impact</span>
//           </div>
          
//           <div className="grid grid-cols-2 gap-4 text-center">
//             <div className="border-r border-[#bee0eb]">
//               <p className="text-3xl font-bold text-[#00648e]">{stats.totalReports}</p>
//               <p className="text-xs text-gray-600 mt-1">Issues Reported</p>
//             </div>
//             <div>
//               {/* Note: 'resolved' isn't in user_stats yet, so we mock it or calculate it */}
//               <p className="text-3xl font-bold text-[#2596be]">{Math.floor(stats.totalReports * 0.8)}</p>
//               <p className="text-xs text-gray-600 mt-1">Issues Resolved</p>
//             </div>
//           </div>
//         </div>

//         <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-6">
//           <div className="flex items-start gap-4">
//             <div className="bg-[#e4f4f9] p-3 rounded-xl">
//               <MapIcon className="text-[#00648e]" size={24} />
//             </div>
//             <div>
//               <h3 className="text-lg font-bold">Community Map</h3>
//               <p className="text-gray-500 text-sm">See reported issues in your area</p>
//             </div>
//           </div>
          
//           <Link href="/" className="block w-full"> 
//             <button className="w-full border border-gray-200 py-3 rounded-xl font-semibold hover:bg-gray-50 transition-all">
//                 View Map
//             </button>
//           </Link>
//         </div>

//         {/* FOOTER */}
//         <div className="bg-gradient-to-r from-[#00648e] to-[#1a6b88] p-4 rounded-xl flex items-center justify-between text-white shadow-sm">
//           <div className="flex items-center gap-3">
//             <Trophy className="text-yellow-400" size={24} />
//             <div>
//               <p className="text-sm font-bold">Available Rewards</p>
//               <p className="text-[10px] text-white/90">Redeem coins for local vouchers</p>
//             </div>
//           </div>
//           <ChevronRight size={20} className="text-white/90" />
//         </div>

//       </div>
//     </div>
//   );
// };

// export default CommunityDashboard;


"use client";
import React, { useState, useEffect } from 'react';
import { 
    Map as MapIcon, 
    FileText, 
    Trophy, 
    Coins, 
    CheckCircle, 
    ChevronRight, 
    Award, 
    Lock, 
    Download 
} from 'lucide-react';
import Link from 'next/link';
import { useAuth } from "@/lib/AuthContext"; 
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"; 
import { db } from '@/lib/firebaseconfig';
import { doc, getDoc } from 'firebase/firestore';
import CertificateModal from '@/components/CertificateModal'; // 👈 Import the modal

// Define the interface to match Firestore data
interface UserStats {
  totalReports: number;
  coins: number;
  level: number;
  rankTitle: string;
}

// Define the static structure for certificates
const CERTIFICATES_DATA = [
    { id: 1, title: "Civic Observer", description: "Report your first 5 issues", threshold: 5, color: "text-[#00648e]" },
    { id: 2, title: "Neighborhood Watch", description: "Report 10 issues", threshold: 10, color: "text-[#00648e]" },
    { id: 3, title: "Community Guardian", description: "Report 25 issues", threshold: 25, color: "text-purple-600" },
    { id: 4, title: "City Hero", description: "Report 50 issues", threshold: 50, color: "text-orange-500" }
];

const CommunityDashboard: React.FC = () => {
  const { user } = useAuth(); 
  const [loading, setLoading] = useState(true);
  
  // Default State (starts at 0)
  const [stats, setStats] = useState<UserStats>({
    totalReports: 0,
    coins: 0,
    level: 1,
    rankTitle: "Citizen"
  });

  // Certificate Modal State
  const [selectedCert, setSelectedCert] = useState<string | null>(null);
  const [isCertOpen, setIsCertOpen] = useState(false);

  // 1. Fetch Data from Firestore
  useEffect(() => {
    const fetchStats = async () => {
      if (!user?.uid) return;
      
      try {
        const docRef = doc(db, "user_stats", user.uid);
        const snap = await getDoc(docRef);

        if (snap.exists()) {
          // Merge Firestore data with our interface
          const data = snap.data();
          setStats({
            totalReports: data.totalReports || 0,
            coins: data.coins || 0,
            level: data.level || 1,
            rankTitle: data.rankTitle || "Citizen"
          });
        }
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [user]);

  // 2. Logic: Calculate Next Milestone dynamically
  const getNextMilestone = (currentReports: number) => {
    if (currentReports < 5) return 5;
    if (currentReports < 10) return 10;
    if (currentReports < 25) return 25;
    if (currentReports < 50) return 50;
    return 100;
  };

  const nextThreshold = getNextMilestone(stats.totalReports);
  const progressPercentage = Math.min((stats.totalReports / nextThreshold) * 100, 100);
  const reportsNeeded = nextThreshold - stats.totalReports;

  // 3. Handle Opening the Certificate
  const handleOpenCert = (certTitle: string) => {
      setSelectedCert(certTitle);
      setIsCertOpen(true);
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center text-[#00648e]">Loading Dashboard...</div>;

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-slate-800">
      
      {/* HEADER */}
      <div className="bg-[#00648e] p-4 text-white shadow-md">
        <div className="max-w-md mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold">CivicSaathi</h1>
            <p className="text-xs opacity-90">User Dashboard</p>
          </div>
          {user && (
            <div className="flex items-center gap-3">
              <div className="text-right hidden md:block">
                <p className="text-sm font-semibold">{user.displayName || "User"}</p>
                <p className="text-xs opacity-90">{stats.rankTitle}</p>
              </div>
              <Avatar className="h-10 w-10 border-2 border-white shadow-sm">
                  <AvatarImage src={user.photoURL || ""} alt={user.email || ""} />
                  <AvatarFallback className="bg-[#1a6b88] text-white font-bold">
                      {user.email?.charAt(0).toUpperCase()}
                  </AvatarFallback>
              </Avatar>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-md mx-auto p-6 space-y-6">
        
        {/* BALANCE / LEVEL CARD */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-4">
            <div>
              <p className="text-sm text-gray-500 font-medium">Your Balance</p>
              <div className="flex items-center gap-2">
                <Coins className="text-yellow-500" size={20} />
                <span className="text-2xl font-bold">{stats.coins.toLocaleString()}</span>
              </div>
            </div>
            <div className="text-right">
              <span className="bg-[#e4f4f9] text-[#00648e] text-xs font-bold px-3 py-1 rounded-full uppercase">
                LEVEL {stats.level}
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-xs font-medium">
              <span>Progress to Next Rank</span>
              <span>{Math.round(progressPercentage)}%</span>
            </div>
            <div className="w-full bg-gray-100 h-3 rounded-full overflow-hidden">
              <div className="bg-[#00648e] h-full transition-all duration-1000 ease-out" style={{ width: `${progressPercentage}%` }}/>
            </div>
            <p className="text-[10px] text-gray-400 italic">
              {reportsNeeded > 0 
                ? `Submit ${reportsNeeded} more verified reports to level up.`
                : "Max level reached!"}
            </p>
          </div>
        </div>

        {/* CERTIFICATIONS CARD */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Award className="text-[#00648e]" size={20} />
              <h3 className="text-lg font-bold">Certifications</h3>
            </div>
            <span className="text-xs text-gray-400">
              {/* Dynamic Count */}
              <span className="text-[#00648e] font-semibold">
                {CERTIFICATES_DATA.filter(c => stats.totalReports >= c.threshold).length}
              </span>
              /{CERTIFICATES_DATA.length} Earned
            </span>
          </div>

          <div className="space-y-3">
            {CERTIFICATES_DATA.map((cert) => {
              const isUnlocked = stats.totalReports >= cert.threshold;
              
              return (
                <div 
                  key={cert.id} 
                  className={`flex items-center justify-between p-3 rounded-xl border transition-all ${
                    isUnlocked 
                      ? 'bg-[#e4f4f9] border-[#bee0eb]'
                      : 'bg-white border-gray-100 opacity-60'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-full ${isUnlocked ? 'bg-white shadow-sm' : 'bg-gray-100'}`}>
                      {isUnlocked ? (
                        <Award size={18} className={cert.color} />
                      ) : (
                        <Lock size={18} className="text-gray-400" />
                      )}
                    </div>
                    <div>
                      <p className={`text-sm font-bold ${isUnlocked ? 'text-gray-800' : 'text-gray-500'}`}>
                        {cert.title}
                      </p>
                      <p className="text-[10px] text-gray-500">{cert.description}</p>
                    </div>
                  </div>
                  
                  {isUnlocked && (
                      <button onClick={() => handleOpenCert(cert.title)} className="text-[#00648e] hover:text-[#004d6e]">
                         <Download size={16} />
                      </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* ACTION BUTTONS */}
        <Link href="/my-reports" className="block w-full">
            <button className="w-full bg-[#00648e] text-white py-4 rounded-xl font-semibold hover:bg-[#1f7ca0] transition-all shadow-sm">
            View My Reports
            </button>
        </Link>

        {/* COMMUNITY IMPACT GRID */}
        <div className="bg-[#e4f4f9] p-6 rounded-2xl border border-[#bee0eb]">
          <div className="flex items-center gap-2 mb-6 text-[#00648e]">
            <FileText size={18} />
            <span className="font-semibold text-sm uppercase tracking-wider">Community Impact</span>
          </div>
          
          <div className="grid grid-cols-2 gap-4 text-center">
            <div className="border-r border-[#bee0eb]">
              <p className="text-3xl font-bold text-[#00648e]">{stats.totalReports}</p>
              <p className="text-xs text-gray-600 mt-1">Issues Reported</p>
            </div>
            <div>
              {/* Note: 'resolved' isn't in user_stats yet, so we mock it or calculate it */}
              <p className="text-3xl font-bold text-[#2596be]">{Math.floor(stats.totalReports * 0.8)}</p>
              <p className="text-xs text-gray-600 mt-1">Issues Resolved</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-6">
          <div className="flex items-start gap-4">
            <div className="bg-[#e4f4f9] p-3 rounded-xl">
              <MapIcon className="text-[#00648e]" size={24} />
            </div>
            <div>
              <h3 className="text-lg font-bold">Community Map</h3>
              <p className="text-gray-500 text-sm">See reported issues in your area</p>
            </div>
          </div>
          
          <Link href="/" className="block w-full"> 
            <button className="w-full border border-gray-200 py-3 rounded-xl font-semibold hover:bg-gray-50 transition-all">
                View Map
            </button>
          </Link>
        </div>

        {/* FOOTER */}
        <div className="bg-gradient-to-r from-[#00648e] to-[#1a6b88] p-4 rounded-xl flex items-center justify-between text-white shadow-sm">
          <div className="flex items-center gap-3">
            <Trophy className="text-yellow-400" size={24} />
            <div>
              <p className="text-sm font-bold">Available Rewards</p>
              <p className="text-[10px] text-white/90">Redeem coins for local vouchers</p>
            </div>
          </div>
          <ChevronRight size={20} className="text-white/90" />
        </div>

      </div>

      {/* MODAL IS PLACED HERE AT THE ROOT OF THE COMPONENT */}
      <CertificateModal 
        isOpen={isCertOpen} 
        onClose={() => setIsCertOpen(false)} 
        userName={user?.displayName || user?.email?.split('@')[0] || "Civic Citizen"} 
        rank={selectedCert || "Citizen"} 
        date={new Date()} 
      />

    </div>
  );
};

export default CommunityDashboard;
