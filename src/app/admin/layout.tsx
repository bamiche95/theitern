import { redirect } from "next/navigation";
import { getCurrentAdmin } from "@/lib/admin";
import NavLink from "@/app/components/admin/NavLinks"; // Import the new component

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const admin = await getCurrentAdmin();

  if (!admin) {
    redirect("/login");
  }

  return (
    <div className="flex min-h-screen ">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white p-6 flex flex-col">
        <h2 className="text-2xl font-bold mb-8 px-4 text-blue-400">Admin Panel</h2>
        
        <nav className="flex flex-col gap-2">
          <NavLink href="/admin">Dashboard</NavLink>
          <NavLink href="/admin/categories">Courses</NavLink>
          <NavLink href="/admin/courses">Modules</NavLink>
          <NavLink href="/admin/tutors">Tutors</NavLink>
          
          <div className="my-4 border-t border-slate-800" /> {/* Divider */}
          
          <NavLink href="/admin/navigation">Navigation</NavLink>
          <NavLink href="/admin/features">Why Choose Us</NavLink>
       
          
          <NavLink href="/admin/reviews">Reviews</NavLink>
          
          <NavLink href="/admin/carousel">Carousel Images</NavLink>
             <NavLink href="/admin/settings">General Settings</NavLink>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 bg-slate-50">
        {children}
      </main>
    </div>
  );
}