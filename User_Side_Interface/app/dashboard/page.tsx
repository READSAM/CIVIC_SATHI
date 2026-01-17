"use client";
import React, { useState } from 'react';
import { Map as MapIcon, FileText, Trophy, Coins, CheckCircle, ChevronRight, Award, Lock } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from "@/lib/AuthContext"; 
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"; 

interface UserStats {
  reportsIssued: number;
  reportsResolved: number;
  coins: number;
  level: number;
}

interface Certification {
  id: number;
  title: string;
  description: string;
  threshold: number;
  achieved: boolean;
  iconColor: string; 
}

const CommunityDashboard: React.FC = () => {
  const { user } = useAuth(); 
  const [stats, setStats] = useState<UserStats>({
    reportsIssued: 247,
    reportsResolved: 189,
    coins: 1250,
    level: 3
  });

  const certifications: Certification[] = [
    { 
      id: 1, 
      title: "Civic Observer", 
      description: "Report your first 10 issues", 
      threshold: 10, 
      achieved: true,
      iconColor: "text-[#00648e]" 
    },
    { 
      id: 2, 
      title: "Neighborhood Watch", 
      description: "Earn 1000 Coins", 
      threshold: 1000, 
      achieved: true,
      iconColor: "text-[#00648e]" 
    },
    { 
      id: 3, 
      title: "Community Guardian", 
      description: "Reach Level 5", 
      threshold: 5,
      achieved: false,
      iconColor: "text-gray-400"
    },
    { 
      id: 4, 
      title: "City Hero", 
      description: "Resolve 500 Issues", 
      threshold: 500, 
      achieved: false,
      iconColor: "text-gray-400"
    }
  ];

  const nextLevelThreshold = 2000;
  const progressPercentage = (stats.coins / nextLevelThreshold) * 100;

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-slate-800">
      <div className="bg-[#00648e] p-4 text-white shadow-md">
        <div className="max-w-md mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold">CivicSaathi</h1>
            <p className="text-xs opacity-90">User Dashboard</p>
          </div>
          {user && (
            <div className="flex items-center gap-3">
              <div className="text-right hidden md:block">
                <p className="text-sm font-semibold">{user.displayName || user.email?.split('@')[0]}</p>
                <p className="text-xs opacity-90">Citizen</p>
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
              <span className="bg-[#e4f4f9] text-[#00648e] text-xs font-bold px-3 py-1 rounded-full">
                LEVEL {stats.level}
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-xs font-medium">
              <span>Progress to Certification</span>
              <span>{Math.round(progressPercentage)}%</span>
            </div>
            <div className="w-full bg-gray-100 h-3 rounded-full overflow-hidden">
              <div className="bg-[#00648e] h-full transition-all duration-500" style={{ width: `${progressPercentage}%` }}/>
            </div>
            <p className="text-[10px] text-gray-400 italic">
              Earn {nextLevelThreshold - stats.coins} more coins for your 'Community Guardian' Certificate
            </p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Award className="text-[#00648e]" size={20} />
              <h3 className="text-lg font-bold">Certifications</h3>
            </div>
            <span className="text-xs text-gray-400">
              <span className="text-[#00648e] font-semibold">{certifications.filter(c => c.achieved).length}</span>/{certifications.length} Earned
            </span>
          </div>

          <div className="space-y-3">
            {certifications.map((cert) => (
              <div 
                key={cert.id} 
                className={`flex items-center justify-between p-3 rounded-xl border transition-all ${
                  cert.achieved 
                    ? 'bg-[#e4f4f9] border-[#bee0eb]'
                    : 'bg-white border-gray-100 opacity-60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-full ${cert.achieved ? 'bg-white shadow-sm' : 'bg-gray-100'}`}>
                    {cert.achieved ? (
                      <Award size={18} className={cert.iconColor} />
                    ) : (
                      <Lock size={18} className="text-gray-400" />
                    )}
                  </div>
                  <div>
                    <p className={`text-sm font-bold ${cert.achieved ? 'text-gray-800' : 'text-gray-500'}`}>
                      {cert.title}
                    </p>
                    <p className="text-[10px] text-gray-500">{cert.description}</p>
                  </div>
                </div>
                
                {cert.achieved && (
                  <CheckCircle size={16} className="text-[#2596be]" />
                )}
              </div>
            ))}
          </div>
          
          <button className="w-full mt-4 text-xs font-semibold text-[#2596be] hover:text-[#1a6b88] transition-colors">
            View All Achievements
          </button>
        </div>

        <Link href="/my-reports" className="block w-full">
            <button className="w-full bg-[#00648e] text-white py-4 rounded-xl font-semibold hover:bg-[#1f7ca0] transition-all shadow-sm">
            View My Reports
            </button>
        </Link>

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

        <div className="bg-[#e4f4f9] p-6 rounded-2xl border border-[#bee0eb]">
          <div className="flex items-center gap-2 mb-6 text-[#00648e]">
            <FileText size={18} />
            <span className="font-semibold text-sm uppercase tracking-wider">Community Impact</span>
          </div>
          
          <div className="grid grid-cols-2 gap-4 text-center">
            <div className="border-r border-[#bee0eb]">
              <p className="text-3xl font-bold text-[#00648e]">{stats.reportsIssued}</p>
              <p className="text-xs text-gray-600 mt-1">Issues Reported</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-[#2596be]">{stats.reportsResolved}</p>
              <p className="text-xs text-gray-600 mt-1">Issues Resolved</p>
            </div>
          </div>
        </div>
        <div className="text-center px-6">
          <p className="text-gray-500 text-sm leading-relaxed">
            Together we can make our community better, one report at a time.
          </p>
        </div>
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
    </div>
  );
};

export default CommunityDashboard;
