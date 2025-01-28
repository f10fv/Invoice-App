import { MainSidebar } from '@/app/(protected)/_components/sideBar'
import { MainNavbar } from '@/app/(protected)/_components/navbar'
import { SidebarProvider } from '@/components/ui/sidebar'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="h-full">
        <SidebarProvider>
          <div className="flex h-full w-full">
            {/* Sidebar should have a fixed width */}
            <MainSidebar className="w-64" />

            <div className="flex-1 flex flex-col overflow-hidden">
              {/* Navbar will be above the main content */}
              <MainNavbar />
              
              <main className="flex-1 w-full h-full overflow-auto p-4 flex justify-center items-center">
                {children}
              </main>
            </div>
          </div>
        </SidebarProvider>
      </body>
    </html>
  )
}
