import { StationGraph, Sector, Location, SectorConnection, LocationConnection } from './types';
import rawGraph from '../../extracted_graph.json';

export function getStationGraph(): StationGraph {
  const sectors: Sector[] = rawGraph.sectors.map((sector: any) => ({
    ...sector,
    isHidden: sector.isHidden ?? false,
    isLocked: sector.isLocked ?? false,
    sectorConnections: (sector.sectorConnections || []).map((conn: any): SectorConnection => ({
      toSectorId: conn.toSectorId,
      corridorName: conn.corridorName || `Passage to ${conn.toSectorId}`,
      travelDescription: conn.travelDescription || `You travel towards ${conn.toSectorId}.`,
      travelMinutes: conn.travelMinutes ?? 15,
      encounterChance: conn.encounterChance ?? 0,
      type: conn.type || 'corridor',
      status: conn.status || (conn.isBlocked ? 'blocked' : 'open'),
      blockedReason: conn.blockedReason,
      encounterTable: conn.encounterTable,
    })),
  }));

  const locations: Location[] = rawGraph.locations.map((loc: any) => ({
    ...loc,
    isHidden: loc.isHidden ?? false,
    isLocked: loc.isLocked ?? false,
    connections: (loc.connections || []).map((conn: any): LocationConnection => ({
      toLocationId: conn.toLocationId,
      toSectorId: conn.toSectorId,
      passageName: conn.passageName || 'A standard passage',
      travelDescription: conn.travelDescription || 'You walk through the passage.',
      travelMinutes: conn.travelMinutes ?? 5,
      encounterChance: conn.encounterChance ?? 0,
      type: conn.type || 'walking',
      status: conn.status || (conn.isBlocked ? 'blocked' : 'open'),
      blockedReason: conn.blockedReason,
      encounterTable: conn.encounterTable,
      requiredItems: conn.requiredItems,
    })),
  }));

  return { sectors, locations };
}
