"use client";
import React from 'react';
import { X, Printer, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  userName: string;
  rank: string;
  date: Date;
}

export default function CertificateModal({ isOpen, onClose, userName, rank, date }: CertificateModalProps) {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 print:p-0 print:bg-white print:static">
      
      {/* 🖨️ FIXED PRINT STYLES */}
      <style jsx global>{`
        @media print {
          /* 1. HIDE EVERYTHING using visibility, not display */
          body {
            visibility: hidden;
            background: white;
          }

          /* 2. SHOW ONLY THE CERTIFICATE CONTAINER */
          #certificate-print-container {
            visibility: visible !important;
            position: fixed !important;
            left: 0 !important;
            top: 0 !important;
            width: 100vw !important;
            height: 100vh !important;
            z-index: 9999 !important;
            background: white !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            margin: 0 !important;
            padding: 0 !important;
          }

          /* 3. Ensure all children of the certificate are visible */
          #certificate-print-container * {
            visibility: visible !important;
          }

          /* 4. Hide the buttons explicitly */
          .no-print {
            display: none !important;
          }
        }
      `}</style>

      {/* Main Modal Content */}
      <div className="relative w-full max-w-4xl bg-white rounded-lg shadow-2xl overflow-hidden">
        
        {/* Controls (Hidden on Print) */}
        <div className="flex justify-between items-center p-4 border-b bg-gray-50 no-print">
          <h3 className="font-bold text-gray-700">Certificate Preview</h3>
          <div className="flex gap-2">
            <Button onClick={handlePrint} className="flex gap-2 bg-[#00648e] hover:bg-[#004d6e]">
              <Printer size={16} /> Print / Save PDF
            </Button>
            <Button variant="ghost" onClick={onClose} size="icon">
              <X size={20} />
            </Button>
          </div>
        </div>

        {/* 📜 CERTIFICATE AREA */}
        <div id="certificate-print-container" className="p-8 overflow-auto bg-gray-200 flex justify-center min-h-[600px]">
          <div 
            className="w-[800px] h-[600px] bg-white p-10 relative shadow-lg text-center flex flex-col items-center justify-center border-[20px] border-double border-[#00648e] print:shadow-none print:w-full print:h-full print:border-[10px] print:m-0"
            style={{ fontFamily: "'Times New Roman', serif" }}
          >
            {/* Background Watermark */}
            <div className="absolute inset-0 opacity-5 pointer-events-none flex items-center justify-center">
               <Award size={400} />
            </div>

            {/* Content */}
            <div className="relative z-10 space-y-6 w-full">
              
              {/* Logo */}
              <div className="flex justify-center mb-4">
                <div className="h-16 w-16 bg-[#00648e] rounded-full flex items-center justify-center text-white print:h-20 print:w-20">
                  <Award size={32} />
                </div>
              </div>

              <h1 className="text-5xl font-bold text-[#00648e] uppercase tracking-widest print:text-6xl">
                Certificate
              </h1>
              <h2 className="text-xl font-semibold text-gray-500 uppercase tracking-wide">
                of Civic Excellence
              </h2>

              <div className="w-2/3 h-px bg-gray-300 mx-auto my-4"></div>

              <p className="text-lg text-gray-600 italic">This is to certify that</p>
              
              <h3 className="text-4xl font-bold text-black py-2 decoration-2 underline-offset-4 capitalize">
                {userName || "Civic Citizen"}
              </h3>

              <p className="text-lg text-gray-600 italic px-10">
                Has successfully demonstrated exceptional responsibility towards the community and is hereby awarded the rank of
              </p>

              <h2 className="text-4xl font-bold text-[#d97706] py-4 uppercase tracking-wider print:text-5xl">
                {rank}
              </h2>

              <p className="text-md text-gray-600">
                Issued on {date ? new Date(date).toLocaleDateString() : new Date().toLocaleDateString()}
              </p>

              <div className="mt-12 flex justify-between w-full px-16 items-end">
                <div className="text-center">
                  <div className="font-cursive text-2xl text-[#00648e] mb-2" style={{ fontFamily: "cursive" }}>CivicSathi</div>
                  <div className="border-t-2 border-gray-400 w-40 pt-1 font-bold text-xs uppercase tracking-wider">Civic Sathi Team</div>
                </div>
                
                {/* Gold Seal */}
                <div className="relative mb-2">
                   <div className="h-24 w-24 bg-yellow-400 rounded-full flex items-center justify-center border-4 border-yellow-600 shadow-sm text-yellow-900 font-bold text-[10px] p-2 text-center rotate-12 print:shadow-none">
                      OFFICIAL<br/>VERIFIED<br/>MEMBER
                   </div>
                </div>

                <div className="text-center">
                   <div className="font-cursive text-2xl text-[#00648e] mb-2" style={{ fontFamily: "cursive" }}>Community</div>
                  <div className="border-t-2 border-gray-400 w-40 pt-1 font-bold text-xs uppercase tracking-wider">Community Board</div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
