// "use client";
// import { useAuth } from "@/lib/AuthContext";
// import { Button } from "@/components/ui/button"; 
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"; 
// import Link from "next/link";
// import { LogOut, FileText } from "lucide-react";

// export function UserNav() {
//   const { user, logOut } = useAuth();

//   // 1. NOT LOGGED IN STATE
//   // matches the "Report New Issue" button style (Teal background, White text)
//   if (!user) {
//     return (
//       <Button asChild className="bg-[#006886] hover:bg-[#00556d] text-white font-medium shadow-sm">
//         <Link href="/login">Sign In</Link>
//       </Button>
//     );
//   }

//   // 2. LOGGED IN STATE
//   return (
//     <div className="flex items-center gap-4">
//         {/* User Name (hidden on mobile) */}
//         <div className="hidden md:flex flex-col items-end mr-1">
//             <span className="text-sm font-semibold text-gray-700 leading-none">
//                 {user.displayName || user.email?.split('@')[0]}
//             </span>
//             <span className="text-xs text-gray-500 leading-none mt-1">
//                 Citizen
//             </span>
//         </div>

//         {/* Dropdown Container */}
//         <div className="relative group">
//             {/* Avatar Trigger */}
//             <button className="focus:outline-none flex items-center">
//                 <Avatar className="h-10 w-10 border-2 border-white shadow-sm cursor-pointer ring-offset-2 hover:ring-2 hover:ring-[#006886] transition-all">
//                     <AvatarImage src={user.photoURL || ""} alt={user.email || ""} />
//                     <AvatarFallback className="bg-[#006886] text-white font-bold">
//                         {user.email?.charAt(0).toUpperCase()}
//                     </AvatarFallback>
//                 </Avatar>
//             </button>

//             {/* Custom Dropdown Menu */}
//             <div className="absolute right-0 mt-2 w-60 bg-white rounded-lg shadow-xl border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 transform origin-top-right">
                
//                 {/* Dropdown Header */}
//                 <div className="px-5 py-4 border-b border-gray-100 bg-gray-50 rounded-t-lg">
//                     <p className="text-sm font-bold text-[#006886]">My Account</p>
//                     <p className="text-xs text-gray-500 truncate mt-0.5">{user.email}</p>
//                 </div>
                
//                 {/* Menu Items */}
//                 <div className="py-2">
//                     <Link 
//                         href="/my-reports" 
//                         className="flex items-center px-5 py-3 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#006886] transition-colors"
//                     >
//                         <FileText className="mr-3 h-4 w-4" />
//                         My Reports
//                     </Link>
//                 </div>
                
//                 {/* Logout Section */}
//                 <div className="border-t border-gray-100 py-2">
//                     <button 
//                         onClick={() => logOut()}
//                         className="flex w-full items-center px-5 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors"
//                     >
//                         <LogOut className="mr-3 h-4 w-4" />
//                         Sign Out
//                     </button>
//                 </div>
//             </div>
//         </div>
//     </div>
//   );
// }



"use client";
import { useAuth } from "@/lib/AuthContext";
import { Button } from "@/components/ui/button"; 
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"; 
import Link from "next/link";
// 👇 Added LayoutDashboard to imports
import { LogOut, FileText, LayoutDashboard } from "lucide-react";

export function UserNav() {
  const { user, logOut } = useAuth();

  // 1. NOT LOGGED IN STATE
  if (!user) {
    return (
      <Button asChild className="bg-[#006886] hover:bg-[#00556d] text-white font-medium shadow-sm">
        <Link href="/login">Sign In</Link>
      </Button>
    );
  }

  // 2. LOGGED IN STATE
  return (
    <div className="flex items-center gap-4">
        {/* User Name (hidden on mobile) */}
        <div className="hidden md:flex flex-col items-end mr-1">
            <span className="text-sm font-semibold text-gray-700 leading-none">
                {user.displayName || user.email?.split('@')[0]}
            </span>
            <span className="text-xs text-gray-500 leading-none mt-1">
                Citizen
            </span>
        </div>

        {/* Dropdown Container */}
        <div className="relative group">
            {/* Avatar Trigger */}
            <button className="focus:outline-none flex items-center">
                <Avatar className="h-10 w-10 border-2 border-white shadow-sm cursor-pointer ring-offset-2 hover:ring-2 hover:ring-[#006886] transition-all">
                    <AvatarImage src={user.photoURL || ""} alt={user.email || ""} />
                    <AvatarFallback className="bg-[#006886] text-white font-bold">
                        {user.email?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                </Avatar>
            </button>

            {/* Custom Dropdown Menu */}
            <div className="absolute right-0 mt-2 w-60 bg-white rounded-lg shadow-xl border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 transform origin-top-right">
                
                {/* Dropdown Header */}
                <div className="px-5 py-4 border-b border-gray-100 bg-gray-50 rounded-t-lg">
                    <p className="text-sm font-bold text-[#006886]">My Account</p>
                    <p className="text-xs text-gray-500 truncate mt-0.5">{user.email}</p>
                </div>
                
                {/* Menu Items */}
                <div className="py-2">
                    {/* 👇 NEW DASHBOARD LINK ADDED HERE 👇 */}
                    <Link 
                        href="/dashboard" 
                        className="flex items-center px-5 py-3 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#006886] transition-colors"
                    >
                        <LayoutDashboard className="mr-3 h-4 w-4" />
                        User Dashboard
                    </Link>

                    <Link 
                        href="/my-reports" 
                        className="flex items-center px-5 py-3 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#006886] transition-colors"
                    >
                        <FileText className="mr-3 h-4 w-4" />
                        My Reports
                    </Link>
                </div>
                
                {/* Logout Section */}
                <div className="border-t border-gray-100 py-2">
                    <button 
                        onClick={() => logOut()}
                        className="flex w-full items-center px-5 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                        <LogOut className="mr-3 h-4 w-4" />
                        Sign Out
                    </button>
                </div>
            </div>
        </div>
    </div>
  );
}
