// "use client";
// import { MainSidebar } from '@/app/(protected)/_components/sideBar'
// import { MainNavbar } from '@/app/(protected)/_components/navbar'
// import { SidebarProvider } from '@/components/ui/sidebar'
// import { motion } from 'framer-motion'
// export default function RootLayout({
//   children,
// }: {
//   children: React.ReactNode
// }) {
//   return (
//     <html lang="en">
//           <motion.div
//     initial={{ opacity: 0 }}
//     animate={{ opacity: 1 }}
//     exit={{ opacity: 0 }}
//     transition={{ duration: 1.3 }}
//     >
//       <body className="h-full">
//         <SidebarProvider>
//           <div className="flex h-full w-full">
//             {/* Sidebar should have a fixed width */}
//             <MainSidebar className="w-64" />

//             <div className="flex-1 flex flex-col overflow-hidden">
//               {/* Navbar will be above the main content */}
//               <MainNavbar />
              
//               <main className="flex-1 w-full h-full overflow-auto p-4 flex justify-center items-center">
//                 {children}
//               </main>
//             </div>
//           </div>
//         </SidebarProvider>
//       </body>
//       </motion.div>
//     </html>

//   )
// }

"use client";
import { MainSidebar } from '@/app/(protected)/_components/sideBar'
import { MainNavbar } from '@/app/(protected)/_components/navbar'
import { SidebarProvider } from '@/components/ui/sidebar'
import { motion } from 'framer-motion'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="h-full">
        <SidebarProvider>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.3 }}
            className="h-full w-full"
          >
            <div className="flex h-full w-full">
              {/* Sidebar */}
              <MainSidebar className="w-64" />

              <div className="flex-1 flex flex-col overflow-hidden">
                {/* Navbar */}
                <MainNavbar />
                
                {/* Main content */}
                <main className="flex-1 w-full h-full overflow-auto p-4 flex justify-center items-center">
                  {children}
                </main>
              </div>
            </div>
          </motion.div>
        </SidebarProvider>
      </body>
    </html>
  )
}