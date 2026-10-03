import { playerState } from '../state/playerState.js';

export class ZoneSystem {
  static getRosters() {
    return playerState.getZoneRoster();
  }
}
