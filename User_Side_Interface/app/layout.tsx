// import type { Metadata } from 'next'

// import { GeistSans } from 'geist/font/sans'

// import { GeistMono } from 'geist/font/mono'

// import { Analytics } from '@vercel/analytics/next'

// import './globals.css'



// export const metadata: Metadata = {

//   title: 'v0 App',

//   description: 'Created with v0',

//   generator: 'v0.app',

// }



// export default function RootLayout({

//   children,

// }: Readonly<{

//   children: React.ReactNode

// }>) {

//   return (

//     <html lang="en">

//       <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>

//         {children}

//         <Analytics />

//       </body>

//     </html>

//   )

// }



import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import { Analytics } from '@vercel/analytics/next'
import { StatusNotification } from "@/components/StatusNotification";
import './globals.css'

// 1. Import the AuthProvider we just created
import { AuthProvider } from "@/lib/AuthContext";

export const metadata: Metadata = {
  title: 'Civic Sathi', // Updated title
  description: 'Community Issue Reporting App',
  generator: 'v0.app',
}
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        {/* 2. Wrap everything inside AuthProvider */}
        <AuthProvider>
          {children}
          <Analytics />
        </AuthProvider>
      </body>
    </html>
  )
}
