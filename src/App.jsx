import { Outlet, Route, Routes } from "react-router-dom"
import { Toaster } from "sonner"

import { AppHeader } from "@/components/AppHeader"
import { BoardPage } from "@/pages/BoardPage"
import { Landing } from "@/pages/Landing"
import { NotFound } from "@/pages/NotFound"

function Layout() {
  return (
    <>
      <AppHeader />
      <Outlet />
    </>
  )
}

export default function App() {
  return (
    <div className="min-h-dvh bg-background font-sans text-foreground">
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route element={<Layout />}>
          <Route path="/board" element={<BoardPage />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
      <Toaster position="bottom-center" richColors />
    </div>
  )
}