import MainView from "@/components/Editor";
import Sidebar from "@/components/SideBar";

export default function Home() {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <MainView />
    </div>
  );
}
