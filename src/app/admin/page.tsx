import { getCurrentAdmin } from "@/lib/admin";


export default async function AdminHome() {

  const admin =  await getCurrentAdmin();



  return (
    <div>
  <h1>Welcome to your Admin Dashboard</h1>
      {admin && <p>Logged in as: {admin.name} ({admin.email})</p>}
      <p>Select an option from the sidebar to manage content.</p>
    </div>
  );
}
