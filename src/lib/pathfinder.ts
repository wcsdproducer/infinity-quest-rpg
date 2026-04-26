/**
 * pathfinder.ts
 * BFS-based pathfinder for Prospero's Dream station graph.
 * Used by the Warden AI to narrate travel between locations.
 */

import type { StationGraph, Location, Sector, Destination } from './types';

// ─── Route Types ──────────────────────────────────────────────────────────────

export type RouteStep = {
  fromId: string;
  fromName: string;
  toId: string;
  toName: string;
  passageName: string;
  travelDescription: string;
  travelMinutes: number;
  encounterChance: number;
  encounterTable?: string;
  crossesSectorBoundary: boolean;
  fromSectorId?: string;
  toSectorId?: string;
};

export type Route = {
  found: boolean;
  steps: RouteStep[];
  totalMinutes: number;
  /** Combined probability of at least one encounter (1 - product of no-encounter chances) */
  encounterProbability: number;
  wardenSummary: string;
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getLocation(graph: StationGraph, id: string): Location | undefined {
  return graph.locations.find((l) => l.uuid === id);
}

function getSector(graph: StationGraph, id: string): Sector | undefined {
  return graph.sectors.find((s) => s.id === id);
}

function getDestination(graph: StationGraph, id: string): Destination | undefined {
  return graph.destinations.find((d) => d.uuid === id);
}

/**
 * Build a synthetic location ID for a sector entry-point.
 * When pathfinding between sectors we treat the sector itself as a node
 * if no specific location is provided.
 */
function sectorEntryId(sectorId: string): string {
  return `__sector_entry__${sectorId}`;
}

// ─── BFS ──────────────────────────────────────────────────────────────────────

/**
 * Find the shortest path (fewest hops) between two location UUIDs.
 * Works across sector boundaries by treating inter-sector corridor edges
 * as virtual location connections.
 */
export function findRoute(
  fromLocationId: string,
  toLocationId: string,
  graph: StationGraph
): Route {
  if (fromLocationId === toLocationId) {
    return {
      found: true,
      steps: [],
      totalMinutes: 0,
      encounterProbability: 0,
      wardenSummary: 'The party is already at that location.',
    };
  }

  // BFS state: queue of { currentId, path[] }
  const queue: { currentId: string; path: RawEdge[] }[] = [
    { currentId: fromLocationId, path: [] },
  ];
  const visited = new Set<string>([fromLocationId]);

  while (queue.length > 0) {
    const { currentId, path } = queue.shift()!;

    const currentLoc = getLocation(graph, currentId);
    if (!currentLoc) continue;

    const neighbors = buildNeighbors(currentId, graph);

    for (const edge of neighbors) {
      if (visited.has(edge.toId)) continue;
      visited.add(edge.toId);

      const newPath = [...path, edge];

      if (edge.toId === toLocationId) {
        return buildRoute(newPath, graph);
      }

      queue.push({ currentId: edge.toId, path: newPath });
    }
  }

  return {
    found: false,
    steps: [],
    totalMinutes: 0,
    encounterProbability: 0,
    wardenSummary: `No passable route found between ${fromLocationId} and ${toLocationId}. The path may be blocked or require special access.`,
  };
}

// ─── Neighbor Resolution ──────────────────────────────────────────────────────

type RawEdge = {
  fromId: string;
  toId: string;
  passageName: string;
  travelDescription: string;
  travelMinutes: number;
  encounterChance: number;
  encounterTable?: string;
  isBlocked: boolean;
  crossesSectorBoundary: boolean;
  fromSectorId?: string;
  toSectorId?: string;
};

function buildNeighbors(locationId: string, graph: StationGraph): RawEdge[] {
  const edges: RawEdge[] = [];
  const loc = getLocation(graph, locationId);
  if (!loc) return edges;

  // Direct location-to-location connections
  for (const conn of loc.connections ?? []) {
    const toId = conn.toLocationId || conn.toDestinationId;
    if (!toId) continue;

    const isActuallyBlocked = conn.status === 'blocked' || conn.status === 'locked' || conn.status === 'hidden';
    if (isActuallyBlocked) continue;

    edges.push({
      fromId: locationId,
      toId: toId,
      passageName: conn.passageName,
      travelDescription: conn.travelDescription,
      travelMinutes: conn.travelMinutes,
      encounterChance: conn.encounterChance,
      encounterTable: conn.encounterTable,
      isBlocked: isActuallyBlocked,
      crossesSectorBoundary: !!conn.toSectorId,
      fromSectorId: loc.sectorId,
      toSectorId: conn.toSectorId ?? loc.sectorId,
    });
  }

  // Sector-level connections: if this location's sector connects to another,
  // bridge to the first non-hidden location in that target sector.
  if (loc.sectorId) {
    const sector = getSector(graph, loc.sectorId);
    for (const sconn of sector?.sectorConnections ?? []) {
      const isActuallyBlocked = sconn.status === 'blocked' || sconn.status === 'locked' || sconn.status === 'hidden';
      if (isActuallyBlocked) continue;

      // Find the first accessible entry location in the target sector
      const targetSector = getSector(graph, sconn.toSectorId);
      if (!targetSector) continue;
      const entryLocId = targetSector.locationIds.find((lid) => {
        const l = getLocation(graph, lid);
        return l && !l.isLocked && l.isHidden !== true;
      });
      if (!entryLocId) continue;

      edges.push({
        fromId: locationId,
        toId: entryLocId,
        passageName: sconn.passageName,
        travelDescription: sconn.travelDescription,
        travelMinutes: sconn.travelMinutes,
        encounterChance: sconn.encounterChance,
        encounterTable: sconn.encounterTable,
        isBlocked: isActuallyBlocked,
        crossesSectorBoundary: true,
        fromSectorId: loc.sectorId,
        toSectorId: sconn.toSectorId,
      });
    }
  }

  return edges;
}

// ─── Route Builder ────────────────────────────────────────────────────────────

function buildRoute(rawPath: RawEdge[], graph: StationGraph): Route {
  const steps: RouteStep[] = rawPath.map((edge) => {
    const fromLoc = getLocation(graph, edge.fromId);
    const toLoc = getLocation(graph, edge.toId);
    return {
      fromId: edge.fromId,
      fromName: fromLoc?.name ?? edge.fromId,
      toId: edge.toId,
      toName: toLoc?.name ?? edge.toId,
      passageName: edge.passageName,
      travelDescription: edge.travelDescription,
      travelMinutes: edge.travelMinutes,
      encounterChance: edge.encounterChance,
      encounterTable: edge.encounterTable,
      crossesSectorBoundary: edge.crossesSectorBoundary,
      fromSectorId: edge.fromSectorId,
      toSectorId: edge.toSectorId,
    };
  });

  const totalMinutes = steps.reduce((sum, s) => sum + s.travelMinutes, 0);
  // P(at least one encounter) = 1 - P(no encounters on any leg)
  const noEncounterProb = steps.reduce(
    (prod, s) => prod * (1 - s.encounterChance / 100),
    1
  );
  const encounterProbability = Math.round((1 - noEncounterProb) * 100);

  const sectorsCrossed = steps
    .filter((s) => s.crossesSectorBoundary)
    .map((s) => s.toSectorId)
    .filter(Boolean);

  const wardenSummary = [
    `Route: ${steps.map((s) => s.toName).join(' → ')}`,
    `Total travel time: ~${totalMinutes} minutes.`,
    `Encounter probability: ${encounterProbability}%.`,
    sectorsCrossed.length > 0
      ? `Passes through ${sectorsCrossed.length} sector transition(s).`
      : null,
  ]
    .filter(Boolean)
    .join(' ');

  return { found: true, steps, totalMinutes, encounterProbability, wardenSummary };
}

// ─── Warden Narration Helper ──────────────────────────────────────────────────

/**
 * Formats a Route as a Warden-ready narration string.
 * Pass this into the AI prompt when a player declares travel.
 */
export function formatRouteForWarden(route: Route): string {
  if (!route.found) return route.wardenSummary;
  if (route.steps.length === 0) return 'The party is already here.';

  const lines = [
    `**Travel Route** (${route.totalMinutes} min total, ${route.encounterProbability}% encounter chance):`,
    '',
  ];

  for (let i = 0; i < route.steps.length; i++) {
    const step = route.steps[i];
    lines.push(
      `**Step ${i + 1}** — via *${step.passageName}*${step.crossesSectorBoundary ? ' [SECTOR TRANSITION]' : ''}:`
    );
    lines.push(step.travelDescription);
    if (step.encounterChance > 0) {
      lines.push(`*(${step.encounterChance}% chance of encounter — table: ${step.encounterTable ?? 'general'})*`);
    }
    lines.push('');
  }

  return lines.join('\n');
}

/**
 * Builds a localized context block for the AI Warden prompt.
 * Focuses strictly on the immediate environment and accessible paths,
 * labeling locked/blocked paths clearly.
 */
export function buildLocalContext(
  currentLocationId: string, 
  graph: StationGraph,
  currentSectorId?: string,
  currentDestinationId?: string
): string {
  const currentLoc = getLocation(graph, currentLocationId);
  if (!currentLoc) return 'Error: Current location not found.';

  const sector = currentSectorId ? getSector(graph, currentSectorId) : (currentLoc.sectorId ? getSector(graph, currentLoc.sectorId) : undefined);
  const destination = currentDestinationId ? getDestination(graph, currentDestinationId) : undefined;

  const lines: string[] = [];
  lines.push(`**CURRENT SECTOR**: ${sector ? sector.name : 'Unknown'}`);
  lines.push(`**CURRENT LOCATION**: ${currentLoc.name}`);
  
  if (destination) {
    lines.push(`**CURRENT DESTINATION**: ${destination.name}`);
    if (destination.context) {
      lines.push(`**DESTINATION DESCRIPTION**: ${destination.context}`);
    }
    if (destination.wardenNotes) {
      lines.push(`**WARDEN NOTES (DESTINATION)**: ${destination.wardenNotes}`);
    }
  } else {
    if (currentLoc.context) {
      lines.push(`**LOCATION DESCRIPTION**: ${currentLoc.context}`);
    }
    if (currentLoc.wardenNotes) {
      lines.push(`**WARDEN NOTES (LOCATION)**: ${currentLoc.wardenNotes}`);
    }
  }

  // ENTERABLE DESTINATIONS (if at location level)
  if (!destination && currentLoc.destinationIds && currentLoc.destinationIds.length > 0) {
    lines.push(`\n**ENTERABLE AREAS**:`);
    for (const destId of currentLoc.destinationIds) {
      const dest = getDestination(graph, destId);
      if (!dest || dest.isHidden) continue;
      
      const lockStr = dest.isLocked ? ' [LOCKED]' : '';
      lines.push(`- **${dest.name}**${lockStr}`);
      if (dest.narrative) {
          lines.push(`  *Observed*: ${dest.narrative}`);
      }
    }
  }

  lines.push(`\n**ADJACENT PATHS (EXITING/TRAVELING)**:`);
  let hasPaths = false;

  // If in a destination, the primary "path" is to exit back to the location
  if (destination) {
    hasPaths = true;
    lines.push(`- **Exit ${destination.name}** -> Back to ${currentLoc.name}`);
    
    // Also include specific destination connections if they exist
    for (const conn of destination.connections ?? []) {
        const targetId = conn.toDestinationId || conn.toLocationId;
        if (!targetId) continue;

        const targetDest = getDestination(graph, targetId);
        if (!targetDest || targetDest.isHidden || conn.status === 'hidden') continue;
        
        let statusPrefix = '';
        if (conn.status === 'locked' || targetDest.isLocked) statusPrefix = ' [LOCKED]';
        lines.push(`- **${targetDest.name}**${statusPrefix} via *${conn.passageName || 'Passage'}*`);
    }
  } else {
    // Direct location connections
    for (const conn of currentLoc.connections ?? []) {
      if (!conn.toLocationId) continue;
      const targetLoc = getLocation(graph, conn.toLocationId);
      if (!targetLoc || targetLoc.isHidden || conn.status === 'hidden') continue;

      hasPaths = true;
      
      let statusPrefix = '';
      if (conn.status === 'locked' || targetLoc.isLocked) statusPrefix = ' [LOCKED]';
      else if (conn.status === 'blocked') statusPrefix = ' [BLOCKED/IMPASSABLE]';
      
      const transitInfo = conn.transitLine ? ` (${conn.transitLine})` : '';
      const costInfo = conn.cost ? ` [Cost: ${conn.cost} credits]` : '';
      const reqItems = conn.requiredItems && conn.requiredItems.length > 0 ? ` (Requires: ${conn.requiredItems.join(', ')})` : '';

      lines.push(`- **${targetLoc.name}**${statusPrefix}${transitInfo}${costInfo} via *${conn.passageName || 'Passage'}*${reqItems}`);
      if (conn.travelDescription) {
        lines.push(`  *Travel*: ${conn.travelDescription} (~${conn.travelMinutes ?? 5} mins)`);
      }
    }

    // Sector-level connections leading out
    if (sector) {
      for (const sconn of sector.sectorConnections ?? []) {
        const targetSector = getSector(graph, sconn.toSectorId);
        if (!targetSector || targetSector.isHidden) continue;

        hasPaths = true;
        const lockedStr = targetSector.isLocked ? ' [LOCKED SECTOR]' : '';
        const blockedStr = sconn.status === 'blocked' ? ' [BLOCKED]' : '';
        const costStr = sconn.cost ? ` [Cost: ${sconn.cost} credits]` : '';

        lines.push(`- **Sector: ${targetSector.name}**${lockedStr}${blockedStr}${costStr} [SECTOR TRANSITION] via *${sconn.passageName}*`);
        if (sconn.travelDescription) {
          lines.push(`  *Travel*: ${sconn.travelDescription} (~${sconn.travelMinutes ?? 15} mins)`);
        }
      }
    }
  }

  if (!hasPaths) {
    lines.push('No obvious paths lead out from here.');
  }

  return lines.join('\n');
}
