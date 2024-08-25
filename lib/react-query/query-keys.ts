export const workspaceKeys = {
  all: ['workspaces'] as const,
  lists: () => [...workspaceKeys.all, 'list'] as const,
  list: (...filters: string[]) => [...workspaceKeys.all, 'list', { ...filters }] as const,
  details: () => [...workspaceKeys.all, 'detail'] as const,
  detail: (id: string) => [...workspaceKeys.details(), id] as const,
};

export const departmentKeys = {
  all: ['departments'] as const,
  lists: () => [...departmentKeys.all, 'list'] as const,
  list: (...filters: string[]) => [...departmentKeys.all, 'list', { ...filters }] as const,
  details: () => [...departmentKeys.all, 'detail'] as const,
  detail: (id: string) => [...departmentKeys.details(), id] as const,
};

export const commentKeys = {
  all: ['comments'] as const,
  lists: () => [...commentKeys.all, 'list'] as const,
  list: (...filters: string[]) => [...commentKeys.all, 'list', { ...filters }] as const,
  details: () => [...commentKeys.all, 'detail'] as const,
  detail: (id: string) => [...commentKeys.details(), id] as const,
};

export const requestKeys = {
  all: ['requests'] as const,
  lists: () => [...requestKeys.all, 'list'] as const,
  list: (...filters: string[]) => [...requestKeys.all, 'list', { ...filters }] as const,
  details: () => [...requestKeys.all, 'detail'] as const,
  detail: (id: string) => [...requestKeys.details(), id] as const,
};

export const workspaceUserKeys = {
  all: ['workspace-users'] as const,
  lists: () => [...workspaceUserKeys.all, 'list'] as const,
  list: (...filters: string[]) => [...workspaceUserKeys.all, 'list', { ...filters }] as const,
  details: () => [...workspaceUserKeys.all, 'detail'] as const,
  detail: (id: string) => [...workspaceUserKeys.details(), id] as const,
};

export const workspaceInviteKeys = {
  all: ['workspace-invites'] as const,
  lists: () => [...workspaceInviteKeys.all, 'list'] as const,
  list: (...filters: string[]) => [...workspaceInviteKeys.all, 'list', { ...filters }] as const,
  details: () => [...workspaceInviteKeys.all, 'detail'] as const,
  detail: (id: string) => [...workspaceInviteKeys.details(), id] as const,
};

export const locationKeys = {
  all: ['location'] as const,
  lists: () => [...locationKeys.all, 'list'] as const,
  list: (...filters: string[]) => [...locationKeys.all, 'list', { ...filters }] as const,
  details: () => [...locationKeys.all, 'detail'] as const,
  detail: (id: string) => [...locationKeys.details(), id] as const,
};

export const hotelKeys = {
  all: ['hotels'] as const,
  lists: () => [...hotelKeys.all, 'list'] as const,
  list: (...filters: string[]) => [...hotelKeys.all, 'list', { ...filters }] as const,
  details: () => [...hotelKeys.all, 'detail'] as const,
  detail: (id: string) => [...hotelKeys.details(), id] as const,
};

export const groupMemberKeys = {
  all: ['groupMembers'] as const,
  lists: () => [...groupMemberKeys.all, 'list'] as const,
  list: (...filters: string[]) => [...groupMemberKeys.all, 'list', { ...filters }] as const,
  details: () => [...groupMemberKeys.all, 'detail'] as const,
  detail: (id: string) => [...groupMemberKeys.details(), id] as const,
};
