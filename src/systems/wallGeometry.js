import { TILE_SIZE, PLAYER_RADIUS } from '../constants/grid.js';

export const WALL_HEIGHT = 58.8; // 42 * 1.4 = 58.8
export const WALL_THICKNESS = 0.6;
export const GLASS_THICKNESS = 0.2;

/**
 * Canonical Office Wall Segments
 * Unified representation: start point -> end point -> height -> thickness
 * Visuals and collision geometry are generated from the EXACT same definitions.
 */
export const CANONICAL_WALL_SEGMENTS = [
  // --------------------------------------------------------------------------
  // 1. Exterior Perimeter Walls (Footprint: X in [16, 1136], Z in [16, 752])
  // --------------------------------------------------------------------------
  { id: 'perim_north', x1: 16, z1: 16, x2: 1136, z2: 16, height: WALL_HEIGHT, thickness: WALL_THICKNESS, isPerimeter: true },
  { id: 'perim_south', x1: 16, z1: 752, x2: 1136, z2: 752, height: WALL_HEIGHT, thickness: WALL_THICKNESS, isPerimeter: true },
  { id: 'perim_west',  x1: 16, z1: 16, x2: 16,   z2: 752, height: WALL_HEIGHT, thickness: WALL_THICKNESS, isPerimeter: true },
  { id: 'perim_east',  x1: 1136, z1: 16, x2: 1136, z2: 752, height: WALL_HEIGHT, thickness: WALL_THICKNESS, isPerimeter: true },

  // --------------------------------------------------------------------------
  // 2. Vertical Interior Partitions North of Central Hallway (Z in [16, 368])
  // --------------------------------------------------------------------------
  // Between Meeting Room (Zone 3) and Workspace (Zone 2)
  { id: 'vert_col11', x1: 368, z1: 16, x2: 368, z2: 368, height: WALL_HEIGHT, thickness: WALL_THICKNESS },
  // Between Workspace (Zone 2) and Private Suites (Zone 5) - Frosted for privacy
  { id: 'vert_col25', x1: 816, z1: 16, x2: 816, z2: 368, height: WALL_HEIGHT, thickness: WALL_THICKNESS, isFrosted: true },
  // Inside Private Suites (Zone 5) between Office 1 and Pods
  { id: 'vert_col31', x1: 1008, z1: 16, x2: 1008, z2: 368, height: WALL_HEIGHT, thickness: WALL_THICKNESS, isFrosted: true },

  // --------------------------------------------------------------------------
  // 3. Horizontal Interior Partition in Meeting Pods (Row 5, Z = 176)
  // (Private Office is a single unified executive suite from Z = 16 to 368)
  // --------------------------------------------------------------------------
  { id: 'row5_seg3', x1: 1008, z1: 176, x2: 1056, z2: 176, height: WALL_HEIGHT, thickness: WALL_THICKNESS, isFrosted: true },
  // Walkway opening at X in [1056, 1088] (c = 33)
  { id: 'row5_seg4', x1: 1088, z1: 176, x2: 1136, z2: 176, height: WALL_HEIGHT, thickness: WALL_THICKNESS, isFrosted: true },

  // --------------------------------------------------------------------------
  // 4. Central Hallway North Partition (Row 11, Z = 368)
  // --------------------------------------------------------------------------
  { id: 'row11_seg1', x1: 16,   z1: 368, x2: 160,  z2: 368, height: WALL_HEIGHT, thickness: WALL_THICKNESS },
  // Doorway 1: Conference Room at X in [160, 192] (c = 5)
  { id: 'row11_seg2', x1: 192,  z1: 368, x2: 368,  z2: 368, height: WALL_HEIGHT, thickness: WALL_THICKNESS },
  { id: 'row11_seg3', x1: 368,  z1: 368, x2: 576,  z2: 368, height: WALL_HEIGHT, thickness: WALL_THICKNESS },
  // Doorway 2: Team Workspace at X in [576, 608] (c = 18)
  { id: 'row11_seg4', x1: 608,  z1: 368, x2: 816,  z2: 368, height: WALL_HEIGHT, thickness: WALL_THICKNESS },
  { id: 'row11_seg5', x1: 816,  z1: 368, x2: 896,  z2: 368, height: WALL_HEIGHT, thickness: WALL_THICKNESS, isFrosted: true },
  // Doorway 3: Private Offices at X in [896, 928] (c = 28)
  { id: 'row11_seg6', x1: 928,  z1: 368, x2: 1008, z2: 368, height: WALL_HEIGHT, thickness: WALL_THICKNESS, isFrosted: true },
  { id: 'row11_seg7', x1: 1008, z1: 368, x2: 1056, z2: 368, height: WALL_HEIGHT, thickness: WALL_THICKNESS, isFrosted: true },
  // Doorway 4: Meeting Pods at X in [1056, 1088] (c = 33)
  { id: 'row11_seg8', x1: 1088, z1: 368, x2: 1136, z2: 368, height: WALL_HEIGHT, thickness: WALL_THICKNESS, isFrosted: true },

  // --------------------------------------------------------------------------
  // 5. Central Hallway South Partition (Row 14, Z = 464)
  // --------------------------------------------------------------------------
  { id: 'row14_seg1', x1: 16,   z1: 464, x2: 192,  z2: 464, height: WALL_HEIGHT, thickness: WALL_THICKNESS },
  // Doorway 5: Lobby & Reception at X in [192, 224] (c = 6)
  { id: 'row14_seg2', x1: 224,  z1: 464, x2: 400,  z2: 464, height: WALL_HEIGHT, thickness: WALL_THICKNESS },
  { id: 'row14_seg3', x1: 400,  z1: 464, x2: 544,  z2: 464, height: WALL_HEIGHT, thickness: WALL_THICKNESS },
  // Doorway 6: Lounge Area at X in [544, 576] (c = 17)
  { id: 'row14_seg4', x1: 576,  z1: 464, x2: 752,  z2: 464, height: WALL_HEIGHT, thickness: WALL_THICKNESS },
  { id: 'row14_seg5', x1: 752,  z1: 464, x2: 832,  z2: 464, height: WALL_HEIGHT, thickness: WALL_THICKNESS },
  // Doorway 7: Kitchen & Pantry at X in [832, 864] (c = 26)
  { id: 'row14_seg6', x1: 864,  z1: 464, x2: 976,  z2: 464, height: WALL_HEIGHT, thickness: WALL_THICKNESS },
  { id: 'row14_seg7', x1: 976,  z1: 464, x2: 1024, z2: 464, height: WALL_HEIGHT, thickness: WALL_THICKNESS },
  // Doorway 8: Breakout Studio at X in [1024, 1056] (c = 32)
  { id: 'row14_seg8', x1: 1056, z1: 464, x2: 1136, z2: 464, height: WALL_HEIGHT, thickness: WALL_THICKNESS },

  // --------------------------------------------------------------------------
  // 6. Vertical Interior Partitions South of Hallway (Z in [464, 752])
  // --------------------------------------------------------------------------
  // Col 12 (X = 400) between Lobby and Lounge (Walkway at Z in [576, 640])
  { id: 'vert_col12_top', x1: 400, z1: 464, x2: 400, z2: 576, height: WALL_HEIGHT, thickness: WALL_THICKNESS },
  { id: 'vert_col12_bot', x1: 400, z1: 640, x2: 400, z2: 752, height: WALL_HEIGHT, thickness: WALL_THICKNESS },

  // Col 23 (X = 752) inside Lounge / Kitchen (Walkway at Z in [576, 640])
  { id: 'vert_col23_top', x1: 752, z1: 464, x2: 752, z2: 576, height: WALL_HEIGHT, thickness: WALL_THICKNESS },
  { id: 'vert_col23_bot', x1: 752, z1: 640, x2: 752, z2: 752, height: WALL_HEIGHT, thickness: WALL_THICKNESS },

  // Col 30 (X = 976) between Kitchen and Breakout (Walkway at Z in [576, 640])
  { id: 'vert_col30_top', x1: 976, z1: 464, x2: 976, z2: 576, height: WALL_HEIGHT, thickness: WALL_THICKNESS },
  { id: 'vert_col30_bot', x1: 976, z1: 640, x2: 976, z2: 752, height: WALL_HEIGHT, thickness: WALL_THICKNESS }
];

/**
 * Architectural Vertical Mullion Posts at every corner and junction.
 * Ensures clean 90-degree and T-connections with zero gaps and no overlapping bulk.
 */
export const CANONICAL_CORNER_POSTS = [
  // 4 Outer Building Corners
  { id: 'post_c_nw', x: 16,   z: 16 },
  { id: 'post_c_ne', x: 1136, z: 16 },
  { id: 'post_c_sw', x: 16,   z: 752 },
  { id: 'post_c_se', x: 1136, z: 752 },

  // North Perimeter T-Junctions
  { id: 'post_n_col11', x: 368,  z: 16 },
  { id: 'post_n_col25', x: 816,  z: 16 },
  { id: 'post_n_col31', x: 1008, z: 16 },

  // South Perimeter T-Junctions
  { id: 'post_s_col12', x: 400, z: 752 },
  { id: 'post_s_col23', x: 752, z: 752 },
  { id: 'post_s_col30', x: 976, z: 752 },

  // West Perimeter T-Junctions
  { id: 'post_w_row11', x: 16, z: 368 },
  { id: 'post_w_row14', x: 16, z: 464 },

  // East Perimeter T-Junctions
  { id: 'post_e_row5',  x: 1136, z: 176 },
  { id: 'post_e_row11', x: 1136, z: 368 },
  { id: 'post_e_row14', x: 1136, z: 464 },

  // Row 5 Junctions & Walkway Openings (Meeting Pods)
  { id: 'post_r5_j31', x: 1008, z: 176 },
  { id: 'post_r5_w2a', x: 1056, z: 176 },
  { id: 'post_r5_w2b', x: 1088, z: 176 },

  // Row 11 Central Hallway Junctions
  { id: 'post_r11_j11', x: 368,  z: 368 },
  { id: 'post_r11_j25', x: 816,  z: 368 },
  { id: 'post_r11_j31', x: 1008, z: 368 },

  // Row 14 Central Hallway Junctions
  { id: 'post_r14_j12', x: 400, z: 464 },
  { id: 'post_r14_j23', x: 752, z: 464 },
  { id: 'post_r14_j30', x: 976, z: 464 },

  // South Vertical Walkway End Posts
  { id: 'post_w_col12_top', x: 400, z: 576 },
  { id: 'post_w_col12_bot', x: 400, z: 640 },
  { id: 'post_w_col23_top', x: 752, z: 576 },
  { id: 'post_w_col23_bot', x: 752, z: 640 },
  { id: 'post_w_col30_top', x: 976, z: 576 },
  { id: 'post_w_col30_bot', x: 976, z: 640 }
];

/**
 * Architectural Glass Doorways matching the surrounding wall height and frame.
 * Jambs connect seamlessly to adjoining wall segments with 0 gap.
 */
export const CANONICAL_DOORWAYS = [
  {
    id: 'door_11_5',
    position: [176, 0, 368],
    rotation: [0, 0, 0],
    isRestricted: false,
    roomSign: { title: 'Conference Room', code: 'Boardroom 01' }
  },
  {
    id: 'door_11_18',
    position: [592, 0, 368],
    rotation: [0, 0, 0],
    isRestricted: false,
    roomSign: { title: 'Team Workspace', code: 'Open Desks' }
  },
  {
    id: 'door_11_28',
    position: [912, 0, 368],
    rotation: [0, 0, 0],
    isRestricted: true,
    roomSign: { title: 'Private Office', code: 'Restricted' }
  },
  {
    id: 'door_11_33',
    position: [1072, 0, 368],
    rotation: [0, 0, 0],
    isRestricted: true,
    roomSign: { title: 'Meeting Pods', code: 'Sound Insulated' }
  },
  {
    id: 'door_14_6',
    position: [208, 0, 464],
    rotation: [0, 0, 0],
    isRestricted: false,
    roomSign: { title: 'Lobby & Reception', code: 'Entrance' }
  },
  {
    id: 'door_14_17',
    position: [560, 0, 464],
    rotation: [0, 0, 0],
    isRestricted: false,
    roomSign: { title: 'Lounge Area', code: 'Relax & Social' }
  },
  {
    id: 'door_14_26',
    position: [848, 0, 464],
    rotation: [0, 0, 0],
    isRestricted: false,
    roomSign: { title: 'Kitchen & Pantry', code: 'Dining Bar' }
  },
  {
    id: 'door_14_32',
    position: [1040, 0, 464],
    rotation: [0, 0, 0],
    isRestricted: false,
    roomSign: { title: 'Breakout Studio', code: 'Creative Area' }
  }
];

/**
 * Slim Architectural Structural Pillars (White/Light Neutral Columns)
 * Positioned where structural support logically exists (major corners, room boundaries, wall intersections)
 * Gives the modern glass office rhythm, physical grounding, and realistic architectural depth.
 */
export const CANONICAL_STRUCTURAL_PILLARS = [
  // 4 Major Outer Building Corners
  { id: 'pillar_c_nw', x: 16,   z: 16 },
  { id: 'pillar_c_ne', x: 1136, z: 16 },
  { id: 'pillar_c_sw', x: 16,   z: 752 },
  { id: 'pillar_c_se', x: 1136, z: 752 },

  // Important Central Corridor Intersections & Room Boundaries
  { id: 'pillar_r11_col11', x: 368,  z: 368 }, // Boardroom / Team Workspace corner
  { id: 'pillar_r11_col25', x: 816,  z: 368 }, // Team Workspace / Private Office corner
  { id: 'pillar_r11_col31', x: 1008, z: 368 }, // Private Office / Pods boundary
  { id: 'pillar_r14_col12', x: 400,  z: 464 }, // Lobby / Lounge corner
  { id: 'pillar_r14_col23', x: 752,  z: 464 }, // Lounge / Pantry corner
  { id: 'pillar_r14_col30', x: 976,  z: 464 }, // Pantry / Breakout corner

  // Major Perimeter Wall / Room Divider Intersections
  { id: 'pillar_n_col11', x: 368,  z: 16 },
  { id: 'pillar_n_col25', x: 816,  z: 16 },
  { id: 'pillar_n_col31', x: 1008, z: 16 },
  { id: 'pillar_s_col12', x: 400,  z: 752 },
  { id: 'pillar_s_col23', x: 752,  z: 752 },
  { id: 'pillar_s_col30', x: 976,  z: 752 },
  { id: 'pillar_w_row11', x: 16,   z: 368 },
  { id: 'pillar_w_row14', x: 16,   z: 464 },
  { id: 'pillar_e_row5',  x: 1136, z: 176 },
  { id: 'pillar_e_row11', x: 1136, z: 368 },
  { id: 'pillar_e_row14', x: 1136, z: 464 },

  // Large Glass-Wall Spans (Midspan Support)
  { id: 'pillar_n_mid',   x: 592,  z: 16 },
  { id: 'pillar_s_mid1',  x: 208,  z: 752 },
  { id: 'pillar_s_mid2',  x: 576,  z: 752 }
];

/**
 * Canonical Room Floor Bounding Polygons
 * Every zone floor terminates EXACTLY at the centerline of its perimeter & interior glass walls.
 * Absolutely NO floor protrusion, NO extension outside the room, and NO overlap with corridors.
 */
export const CANONICAL_ZONE_FLOORS = [
  // 1. Zone 3: Conference Room Boardroom (Northwest)
  {
    id: 'floor_conf',
    name: 'Conference Room',
    zoneId: 3,
    x1: 16, z1: 16, x2: 368, z2: 368,
    materialKey: 'floorConferenceCarpet'
  },
  // 2. Zone 2: Team Workspace (North Central)
  {
    id: 'floor_workspace',
    name: 'Team Workspace',
    zoneId: 2,
    x1: 368, z1: 16, x2: 816, z2: 368,
    materialKey: 'floorWorkspaceCarpet'
  },
  // 3. Zone 5: Private Offices & Meeting Pods (Northeast)
  {
    id: 'floor_private',
    name: 'Private Offices',
    zoneId: 5,
    x1: 816, z1: 16, x2: 1136, z2: 368,
    materialKey: 'floorPrivateOfficeCarpet'
  },
  // 4. Main Central Hallway / Circulation Corridor (West-East between North and South Suites)
  {
    id: 'floor_corridor',
    name: 'Central Corridor',
    zoneId: 1,
    x1: 16, z1: 368, x2: 1136, z2: 464,
    materialKey: 'floorCorridorMarble'
  },
  // 5. Zone 1: Lobby & Reception Entrance (Southwest)
  {
    id: 'floor_lobby',
    name: 'Lobby & Reception',
    zoneId: 1,
    x1: 16, z1: 464, x2: 400, z2: 752,
    materialKey: 'floorLobbyMarble'
  },
  // 6. Zone 6 (West): Relaxed Social Lounge Area (South Central)
  {
    id: 'floor_lounge',
    name: 'Lounge Area',
    zoneId: 6,
    x1: 400, z1: 464, x2: 752, z2: 752,
    materialKey: 'floorLoungeStone'
  },
  // 7. Zone 6 (East): Pantry & Kitchen Dining Suite (South Central-East)
  {
    id: 'floor_kitchen',
    name: 'Pantry & Kitchen',
    zoneId: 6,
    x1: 752, z1: 464, x2: 976, z2: 752,
    materialKey: 'floorKitchenTile'
  },
  // 8. Zone 4: Breakout Creative Studio (Southeast)
  {
    id: 'floor_breakout',
    name: 'Breakout Studio',
    zoneId: 4,
    x1: 976, z1: 464, x2: 1136, z2: 752,
    materialKey: 'floorBreakoutCarpet'
  }
];

export function getOfficeWallLayout() {
  return {
    wallSegments: CANONICAL_WALL_SEGMENTS,
    cornerPosts: CANONICAL_CORNER_POSTS,
    doorways: CANONICAL_DOORWAYS,
    structuralPillars: CANONICAL_STRUCTURAL_PILLARS,
    zoneFloors: CANONICAL_ZONE_FLOORS
  };
}

