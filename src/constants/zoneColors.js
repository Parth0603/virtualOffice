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
  "Conference Room",
  "Breakout Area",
  "Private Offices",
  "Lounge & Kitchen"
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
    desc: "Main Entrance, Branding Wall & Reception",
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
    name: "Conference Room",
    label: "Conference Room",
    icon: "📊",
    accentColor: "#059669",
    floorColor: "#e0f2fe",
    desc: "12-Seat Boardroom & Presentation Screen",
    restricted: false
  },
  4: {
    id: 4,
    name: "Breakout Area",
    label: "Breakout Area",
    icon: "🚀",
    accentColor: "#7c3aed",
    floorColor: "#f3e8ff",
    desc: "Casual Collaboration & Whiteboard",
    restricted: false
  },
  5: {
    id: 5,
    name: "Private Offices",
    label: "Private Offices",
    icon: "🔒",
    accentColor: "#dc2626",
    floorColor: "#fee2e2",
    desc: "Executive Suites & Pods • Host Permission Required",
    restricted: true
  },
  6: {
    id: 6,
    name: "Lounge & Kitchen",
    label: "Lounge & Kitchen",
    icon: "☕",
    accentColor: "#d97706",
    floorColor: "#fef3c7",
    desc: "Casual Sofas, Kitchen Island & Dining",
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

// Modern 24x36 architectural startup office layout
export const DEFAULT_OFFICE_MAP = [
  // Row 0
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  // Row 1
  [0, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 5, 5, 5, 5, 5, 0, 5, 5, 5, 0],
  // Row 2
  [0, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 5, 5, 5, 5, 5, 0, 5, 5, 5, 0],
  // Row 3
  [0, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 5, 5, 5, 5, 5, 0, 5, 5, 5, 0],
  // Row 4
  [0, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 5, 5, 5, 5, 5, 0, 5, 5, 5, 0],
  // Row 5
  [0, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 0, 0, 5, 0, 0, 0, 0, 5, 0, 0],
  // Row 6
  [0, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 5, 5, 5, 5, 5, 0, 5, 5, 5, 0],
  // Row 7
  [0, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 5, 5, 5, 5, 5, 0, 5, 5, 5, 0],
  // Row 8
  [0, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 5, 5, 5, 5, 5, 0, 5, 5, 5, 0],
  // Row 9
  [0, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 5, 5, 5, 5, 5, 0, 5, 5, 5, 0],
  // Row 10
  [0, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 5, 5, 5, 5, 5, 0, 5, 5, 5, 0],
  // Row 11
  [0, 0, 0, 0, 0, 3, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 5, 0, 0, 0, 0, 5, 0, 0],
  // Row 12
  [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
  // Row 13
  [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
  // Row 14
  [0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 6, 6, 6, 0, 0, 0, 0, 0, 0, 0, 6, 6, 0, 0, 0, 0, 4, 4, 0, 0],
  // Row 15
  [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 0, 6, 6, 6, 6, 6, 6, 0, 4, 4, 4, 4, 0],
  // Row 16
  [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 0, 6, 6, 6, 6, 6, 6, 0, 4, 4, 4, 4, 0],
  // Row 17
  [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 0, 6, 6, 6, 6, 6, 6, 0, 4, 4, 4, 4, 0],
  // Row 18
  [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 4, 4, 4, 4, 4, 0],
  // Row 19
  [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 4, 4, 4, 4, 4, 0],
  // Row 20
  [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 0, 6, 6, 6, 6, 6, 6, 0, 4, 4, 4, 4, 0],
  // Row 21
  [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 0, 6, 6, 6, 6, 6, 6, 0, 4, 4, 4, 4, 0],
  // Row 22
  [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 0, 6, 6, 6, 6, 6, 6, 0, 4, 4, 4, 4, 0],
  // Row 23
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
];

export function parseHexColor(hexStr) {
  if (typeof hexStr === 'number') return hexStr;
  if (!hexStr || typeof hexStr !== 'string') return 0x3182ce;
  return parseInt(hexStr.replace('#', '0x'), 16);
}
