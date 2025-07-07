import useGroupStore from "@store/group-store";
import { useMembersQuery } from "@hooks/use-zero-queries";
import type { GroupMember } from "@lib/group-permissions";
import { Loader2, ShieldAlert, UserX } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@components/ui/table";
import { Button } from "@components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@components/ui/avatar";
import { Badge } from "@components/ui/badge";
import { getInitials } from "@lib/utils";
import {
  canRemoveMember,
  canPromoteToAdmin,
  canLeaveGroup,
  isCurrentUser,
} from "@lib/group-permissions";
import { useMembershipOperations } from "@hooks/use-membership-operations";
import useAuthStore from "@store/auth-store";

const GroupMembers = () => {
  const groupId = useGroupStore((state) => state.currentGroupId)!;
  const currentUser = useAuthStore((state) => state.user);
  const isCurrentUserAdmin = useGroupStore((state) => state.isAdmin);
  const { members, membersDetails } = useMembersQuery(groupId);

  const { handleRemoveMember, handleLeaveGroup, handleChangeRole } =
    useMembershipOperations(groupId);

  const loading = membersDetails.type === "unknown";

  const getMemberActions = (member: GroupMember) => {
    const showAdminActions = canPromoteToAdmin(
      currentUser,
      member,
      isCurrentUserAdmin
    );
    const showRemoveAction = canRemoveMember(
      currentUser,
      member,
      isCurrentUserAdmin
    );
    const showLeaveAction = canLeaveGroup(currentUser, member);
    const isMemberCurrentUser = isCurrentUser(currentUser, member);

    return {
      showAdminActions,
      showRemoveAction,
      showLeaveAction,
      isMemberCurrentUser,
    };
  };

  if (loading) {
    return (
      <div className="w-full flex justify-center items-center h-full">
        <Loader2 className="h-4 w-4 animate-spin" />
      </div>
    );
  }

  if (members.length === 0) {
    return (
      <div className="text-center pt-8 p-4 text-muted-foreground">
        No members found in this group.
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Header */}
      <div className="p-4 border-b bg-muted flex justify-between items-center">
        <h3 className="font-semibold">Group Members - {members.length}</h3>
      </div>

      {/* Mobile Card Layout */}
      <div className="block md:hidden space-y-2">
        {members.map((member) => {
          const {
            showAdminActions,
            showRemoveAction,
            showLeaveAction,
            isMemberCurrentUser,
          } = getMemberActions(member as GroupMember);

          return (
            <div key={member.id} className="border-b p-3 space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3 flex-1 min-w-0">
                  <Avatar className="w-10 h-10">
                    <AvatarImage
                      className="object-cover"
                      src={member.user?.image || ""}
                    />
                    <AvatarFallback className="text-sm">
                      {getInitials(member.user?.name || "")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-medium text-sm truncate">
                        {member.user?.name}
                      </h3>
                      <Badge
                        variant={
                          member.role === "ADMIN" ? "destructive" : "outline"
                        }
                        className="text-xs"
                      >
                        {member.role}
                      </Badge>
                      {isMemberCurrentUser && (
                        <Badge variant="secondary" className="text-xs">
                          You
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground truncate">
                      {member.user?.email}
                    </p>
                  </div>
                </div>
              </div>

              {(showAdminActions || showRemoveAction || showLeaveAction) && (
                <div className="flex items-center space-x-2">
                  {showAdminActions && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleChangeRole(member.userId, "ADMIN")}
                      className="h-8 text-xs"
                    >
                      <ShieldAlert className="h-3 w-3 mr-1" />
                      Make Admin
                    </Button>
                  )}
                  {showRemoveAction && (
                    <Button
                      variant="destructive"
                      size="sm"
                      className="h-8 text-xs"
                      onClick={() => handleRemoveMember(member.userId)}
                    >
                      <UserX className="h-3 w-3 mr-1" />
                      Remove
                    </Button>
                  )}
                  {showLeaveAction && (
                    <Button
                      variant="destructive"
                      size="sm"
                      className="h-8 text-xs"
                      onClick={handleLeaveGroup}
                    >
                      <UserX className="h-3 w-3 mr-1" />
                      Leave
                    </Button>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Desktop Table Layout */}
      <div className="hidden md:block">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted">
                <TableHead>Member</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {members.map((member) => {
                const { showAdminActions, showRemoveAction, showLeaveAction } =
                  getMemberActions(member as GroupMember);

                return (
                  <TableRow key={member.id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <Avatar className="w-8 h-8">
                          <AvatarImage
                            className="object-cover"
                            src={member.user?.image || ""}
                          />
                          <AvatarFallback>
                            {getInitials(member.user?.name || "")}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-medium">{member.user?.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>{member.user?.email}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          member.role === "ADMIN" ? "destructive" : "outline"
                        }
                      >
                        {member.role}
                      </Badge>
                    </TableCell>

                    <TableCell className="text-right">
                      <div className="flex items-center justify-end space-x-2">
                        {showAdminActions && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              handleChangeRole(member.userId, "ADMIN")
                            }
                          >
                            <ShieldAlert className="h-4 w-4 mr-2" />
                            Make Admin
                          </Button>
                        )}
                        {showRemoveAction && (
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleRemoveMember(member.userId)}
                          >
                            <UserX className="h-4 w-4 mr-2" />
                            Remove
                          </Button>
                        )}
                        {showLeaveAction && (
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={handleLeaveGroup}
                          >
                            <UserX className="h-4 w-4 mr-2" />
                            Leave Group
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default GroupMembers;
