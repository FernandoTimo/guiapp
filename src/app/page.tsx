import Editor from "@/components/editor/Editor";
import Sidebar from "@/components/sidebar/SideBar";

export default function Home() {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <Editor />
    </div>
  );
}
