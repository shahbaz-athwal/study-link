import { Outlet } from "react-router-dom";
import { ThemeProvider } from "@hooks/use-theme";
import Navbar from "@components/nav-bar";
import useChatStore from "@store/chat-store";
import { useMobile } from "@hooks/use-mobile";
import useGroupStore from "@store/group-store";

const Layout = () => {
  const activeTab = useGroupStore((state) => state.activeTab);
  const currentDiscussionId = useChatStore(
    (state) => state.currentDiscussionId
  );
  const isMobile = useMobile();
  const showNavbar =
    !currentDiscussionId || !isMobile || activeTab !== "discussions";
  return (
    <ThemeProvider>
      <div className="min-h-screen flex flex-col">
        {showNavbar && <Navbar />}
        <main className="flex-1">
          <Outlet />
        </main>
      </div>
    </ThemeProvider>
  );
};

export default Layout;
