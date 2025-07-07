import GroupDetails from "@components/dashboard/group-details";
import GroupSidebar from "@components/dashboard/group-sidebar";
import useGroupStore from "@store/group-store";
import useChatStore from "@store/chat-store";
import { useMobile } from "@hooks/use-mobile";
import { ScrollArea } from "@components/ui/scroll-area";
import { cn } from "@lib/utils";

const Dashboard = () => {
  const currentGroup = useGroupStore((state) => state.currentGroup);
  const activeTab = useGroupStore((state) => state.activeTab);
  const currentDiscussionId = useChatStore(
    (state) => state.currentDiscussionId
  );
  const isMobile = useMobile();
  const showSidebar =
    !currentDiscussionId || !isMobile || activeTab !== "discussions";

  return (
    <div
      className={cn("flex min-h-[calc(100vh-54px)] w-full", {
        "min-h-screen": !showSidebar,
      })}
    >
      {showSidebar && <GroupSidebar />}
      {isMobile && !currentDiscussionId ? (
        <ScrollArea className="flex-1 max-h-[calc(100vh-3.4rem)] md:max-h-full">
          <div className="flex-1 min-h-0">
            {currentGroup && <GroupDetails />}
          </div>
        </ScrollArea>
      ) : (
        <div className="flex-1 min-h-0">{currentGroup && <GroupDetails />}</div>
      )}
    </div>
  );
};

export default Dashboard;
