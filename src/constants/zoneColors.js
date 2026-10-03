// Curated architectural colors for virtual workspace zones
export const ZONE_COLORS = [
  "#1e293b", // Zone 0: Architectural Wall (Dark Slate)
  "#f1f5f9", // Zone 1: Lobby & Reception (Light Terrazzo / Tile)
  "#e2e8f0", // Zone 2: Team Workspace (Modern Slate Carpet)
  "#e0f2fe", // Zone 3: Meeting Room (Executive Blue-Gray Floor)
  "#f3e8ff", // Zone 4: Project Room (Studio Collaboration Floor)
  "#fee2e2", // Zone 5: Private Room (Restricted Executive Suite)
  "#fef3c7"  // Zone 6: Lounge & Chill (Warm Parquet / Oak)
];

export const ZONE_NAMES = [
  "Wall",
  "Lobby & Reception",
  "Team Workspace",
  "Meeting Room",
  "Project Room",
  "Private Room",
  "Lounge & Chill Area"
];

export const ZONE_METADATA = {
  0: {
    id: 0,
    name: "Architectural Wall",
    label: "Wall",
    icon: "🧱",
    accentColor: "#334155",
    floorColor: "#1e293b",
    desc: "Solid boundary partition",
    restricted: false
  },
  1: {
    id: 1,
    name: "Lobby & Reception",
    label: "Lobby",
    icon: "🏢",
    accentColor: "#3b82f6",
    floorColor: "#f1f5f9",
    desc: "Main Entrance & Welcome Desk",
    restricted: false
  },
  2: {
    id: 2,
    name: "Team Workspace",
    label: "Team Workspace",
    icon: "💼",
    accentColor: "#2563eb",
    floorColor: "#e2e8f0",
    desc: "Open Desks & Collaborative Workstations",
    restricted: false
  },
  3: {
    id: 3,
    name: "Meeting Room",
    label: "Meeting Room",
    icon: "📊",
    accentColor: "#059669",
    floorColor: "#e0f2fe",
    desc: "Boardroom Table & Presentation Screen",
    restricted: false
  },
  4: {
    id: 4,
    name: "Project Room",
    label: "Project Room",
    icon: "🚀",
    accentColor: "#7c3aed",
    floorColor: "#f3e8ff",
    desc: "Team Sprint Pods & Whiteboard",
    restricted: false
  },
  5: {
    id: 5,
    name: "Private Room",
    label: "Private Room",
    icon: "🔒",
    accentColor: "#dc2626",
    floorColor: "#fee2e2",
    desc: "Executive Suite • Host Permission Required",
    restricted: true
  },
  6: {
    id: 6,
    name: "Lounge & Chill Area",
    label: "Lounge Area",
    icon: "☕",
    accentColor: "#d97706",
    floorColor: "#fef3c7",
    desc: "Casual Sofas, Coffee Table & Plants",
    restricted: false
  }
};

export function getZoneMetadata(zoneId) {
  return ZONE_METADATA[zoneId] || {
    id: zoneId,
    name: `Zone ${zoneId}`,
    label: `Zone ${zoneId}`,
    icon: "📍",
    accentColor: "#64748b",
    floorColor: "#f8fafc",
    desc: "Workspace Area",
    restricted: false
  };
}

// Default 15x20 architectural office layout
export const DEFAULT_OFFICE_MAP = [
  // Row 0: Outer North Wall
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  // Rows 1-4: Lobby (Left) | Dividing Wall with doorway | Lounge (Right)
  [0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 6, 6, 6, 6, 6, 6, 6, 6, 6, 0],
  [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 6, 6, 6, 6, 6, 6, 6, 6, 6, 0], // Doorway col 9
  [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 6, 6, 6, 6, 6, 6, 6, 6, 6, 0], // Doorway col 9
  [0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 6, 6, 6, 6, 6, 6, 6, 6, 6, 0],
  // Row 5: Horizontal Dividing Wall with wide hallway doorways at cols 4-5 and 14-15
  [0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 6, 6, 0, 0, 0, 0],
  // Rows 6-9: Team Workspace (Left) | Dividing Wall | Meeting Room (Right)
  [0, 2, 2, 2, 2, 2, 2, 2, 2, 0, 3, 3, 3, 3, 3, 3, 3, 3, 3, 0],
  [0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 3, 3, 3, 3, 3, 3, 3, 3, 0], // Corridor opening col 9
  [0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 3, 3, 3, 3, 3, 3, 3, 3, 0], // Corridor opening col 9
  [0, 2, 2, 2, 2, 2, 2, 2, 2, 0, 3, 3, 3, 3, 3, 3, 3, 3, 3, 0],
  // Row 10: Horizontal Dividing Wall with doorways at cols 4-5 and 14-15
  [0, 0, 0, 0, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 0, 0, 0, 0],
  // Rows 11-13: Project Room (Left) | Dividing Wall | Private Room (Right, Restricted)
  [0, 4, 4, 4, 4, 4, 4, 4, 4, 0, 5, 5, 5, 5, 5, 5, 5, 5, 5, 0],
  [0, 4, 4, 4, 4, 4, 4, 4, 4, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 0], // Restricted entrance at col 9
  [0, 4, 4, 4, 4, 4, 4, 4, 4, 0, 5, 5, 5, 5, 5, 5, 5, 5, 5, 0],
  // Row 14: Outer South Wall
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
];

export function parseHexColor(hexStr) {
  if (typeof hexStr === 'number') return hexStr;
  if (!hexStr || typeof hexStr !== 'string') return 0x3182ce;
  return parseInt(hexStr.replace('#', '0x'), 16);
}
