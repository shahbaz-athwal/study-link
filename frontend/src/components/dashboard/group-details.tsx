import { CardHeader, CardContent } from "@components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@components/ui/tabs";
import GroupMembers from "@components/dashboard/tabs/group-members";
import GroupSettings from "@components/dashboard/tabs/group-settings";
import GroupFiles from "@components/dashboard/tabs/group-files";
import {
  ShieldAlert,
  MessageCircle,
  FileText,
  Users,
  Settings,
} from "lucide-react";
import { getGroupMembers } from "@lib/api/group";
import { useQuery } from "@tanstack/react-query";
import useGroupStore from "@store/group-store";
import { useEffect } from "react";
import { getGroupFiles } from "@lib/api/files";
import DiscussionsLayout from "@components/dashboard/tabs/discussions-layout";
import useChatStore from "@store/chat-store";
import { useMobile } from "@hooks/use-mobile";

const GroupDetails = () => {
  const group = useGroupStore((state) => state.currentGroup)!;
  const activeTab = useGroupStore((state) => state.activeTab);
  const setActiveTab = useGroupStore((state) => state.setActiveTab);
  const isAdmin = useGroupStore((state) => state.isAdmin);
  const updateAdminStatus = useGroupStore((state) => state.updateAdminStatus);
  const currentDiscussionId = useChatStore(
    (state) => state.currentDiscussionId
  );

  const { data: members = [] } = useQuery({
    queryKey: ["group-members", group.id],
    queryFn: () => getGroupMembers(group.id),
  });

  useQuery({
    queryKey: ["group-files", group.id],
    queryFn: () => getGroupFiles(group.id),
  });

  useEffect(() => {
    if (members.length > 0) {
      updateAdminStatus(members);
    }
  }, [members, updateAdminStatus]);

  useEffect(() => {
    if (activeTab === "settings" && !isAdmin) {
      setActiveTab("discussions");
    }
  }, [activeTab, isAdmin, setActiveTab]);

  const tabs = [
    { id: "discussions", label: "Discussions", icon: MessageCircle },
    { id: "files", label: "Files & Resources", icon: FileText },
    { id: "members", label: "Members", icon: Users },
    ...(isAdmin ? [{ id: "settings", label: "Settings", icon: Settings }] : []),
  ];

  const isMobile = useMobile();
  const showGroupHeader =
    !currentDiscussionId || !isMobile || activeTab !== "discussions";

  return (
    <div className="h-full flex flex-col">
      {showGroupHeader && (
        <CardHeader className="px-2 pb-1 pt-2 md:p-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl md:text-2xl font-semibold">
                {group.name}
              </h1>
              <p className="text-muted-foreground font-mono text-sm">
                {group.description ? group.description : "No description"}
              </p>
            </div>
            {isAdmin && (
              <div className="flex items-center text-xs font-medium text-primary">
                <ShieldAlert className="w-4 h-4 mr-1" />
                Admin
              </div>
            )}
          </div>
        </CardHeader>
      )}

      <CardContent className="flex-1 p-0 h-full ">
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="h-full flex flex-col gap-0"
        >
          {showGroupHeader && (
            <div className="w-full overflow-x-auto border-b">
              <TabsList className="h-fit justify-start rounded-none w-full bg-transparent p-0 inline-flex ">
                {tabs.map((tab) => {
                  const IconComponent = tab.icon;
                  return (
                    <TabsTrigger
                      key={tab.id}
                      value={tab.id}
                      className="relative h-9 rounded-none border-b-2 px-4 pb-3 pt-2 font-semibold text-muted-foreground shadow-none data-[state=active]:border-b-primary data-[state=active]:shadow-none whitespace-nowrap flex-shrink-0"
                    >
                      <div className="flex items-center gap-2">
                        <IconComponent className="w-5 h-5 md:hidden" />
                        <span className="hidden md:inline">{tab.label}</span>
                        <span className="md:hidden sr-only">{tab.label}</span>
                      </div>
                    </TabsTrigger>
                  );
                })}
              </TabsList>
            </div>
          )}
          <TabsContent value="discussions" className="flex-1 ">
            <DiscussionsLayout />
          </TabsContent>

          <TabsContent value="files" className="flex-1">
            <GroupFiles />
          </TabsContent>

          <TabsContent value="members" className="flex-1">
            <GroupMembers />
          </TabsContent>

          {isAdmin && (
            <TabsContent value="settings" className="flex-1">
              <GroupSettings />
            </TabsContent>
          )}
        </Tabs>
      </CardContent>
    </div>
  );
};

export default GroupDetails;
