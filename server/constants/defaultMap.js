export const DEFAULT_ZONE_COLORS = [
  "#1e293b", // Zone 0: Wall
  "#f1f5f9", // Zone 1: Lobby & Reception
  "#e2e8f0", // Zone 2: Team Workspace
  "#e0f2fe", // Zone 3: Meeting Room
  "#f3e8ff", // Zone 4: Project Room
  "#fee2e2", // Zone 5: Private Room (Restricted)
  "#fef3c7"  // Zone 6: Lounge & Chill Area
];

export const DEFAULT_OFFICE_MAP = [
  // Row 0: Outer North Wall
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  // Rows 1-4: Lobby (Left) | Dividing Wall with doorway | Lounge (Right)
  [0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 6, 6, 6, 6, 6, 6, 6, 6, 6, 0],
  [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 6, 6, 6, 6, 6, 6, 6, 6, 6, 0],
  [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 6, 6, 6, 6, 6, 6, 6, 6, 6, 0],
  [0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 6, 6, 6, 6, 6, 6, 6, 6, 6, 0],
  // Row 5: Horizontal Dividing Wall with wide hallway doorways at cols 4-5 and 14-15
  [0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 6, 6, 0, 0, 0, 0],
  // Rows 6-9: Team Workspace (Left) | Dividing Wall | Meeting Room (Right)
  [0, 2, 2, 2, 2, 2, 2, 2, 2, 0, 3, 3, 3, 3, 3, 3, 3, 3, 3, 0],
  [0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 3, 3, 3, 3, 3, 3, 3, 3, 0],
  [0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 3, 3, 3, 3, 3, 3, 3, 3, 0],
  [0, 2, 2, 2, 2, 2, 2, 2, 2, 0, 3, 3, 3, 3, 3, 3, 3, 3, 3, 0],
  // Row 10: Horizontal Dividing Wall with doorways at cols 4-5 and 14-15
  [0, 0, 0, 0, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 0, 0, 0, 0],
  // Rows 11-13: Project Room (Left) | Dividing Wall | Private Room (Right, Restricted)
  [0, 4, 4, 4, 4, 4, 4, 4, 4, 0, 5, 5, 5, 5, 5, 5, 5, 5, 5, 0],
  [0, 4, 4, 4, 4, 4, 4, 4, 4, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 0],
  [0, 4, 4, 4, 4, 4, 4, 4, 4, 0, 5, 5, 5, 5, 5, 5, 5, 5, 5, 0],
  // Row 14: Outer South Wall
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
];
