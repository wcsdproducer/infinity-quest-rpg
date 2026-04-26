
import { LocationConnection, MediaURL, Location } from './types';

/**
 * Resolves the best media URL to display for a navigation option.
 * It prioritizes state-specific imagery (Locked/Blocked/Open) if a base path is provided.
 */
export function resolveNavigationMedia(
    connection: LocationConnection,
    targetLocation: Location | undefined,
    defaultMedia: MediaURL[] = []
): MediaURL[] {
    // 1. If the connection has a status-aware base path, construct the specific URL
    if (connection.navigationMediaBase) {
        const status = connection.status || 'open';
        const extension = connection.navigationMediaBase.endsWith('.mp4') ? '' : '.webp';
        
        // We assume the base path is a folder in Storage
        // e.g., "navigation/docking-bay-gate/" -> "navigation/docking-bay-gate/locked.webp"
        const stateUrl = `${connection.navigationMediaBase.replace(/\/$/, '')}/${status}${extension}`;
        
        return [{ url: stateUrl, loop: true }];
    }

    // 2. Fallback to target location's own media
    if (targetLocation?.mediaUrls && targetLocation.mediaUrls.length > 0) {
        return targetLocation.mediaUrls;
    }

    // 3. Last resort fallback
    return defaultMedia;
}

/**
 * Determines if a connection is currently traversable by the party.
 * Used for UI hints and Warden narration logic.
 */
export function canTraverse(
    connection: LocationConnection,
    characterCredits: number = 0,
    characterInventory: string[] = []
): { canPass: boolean; reason?: string } {
    if (connection.status === 'blocked') {
        return { canPass: false, reason: connection.blockedReason || 'The path is completely blocked.' };
    }

    if (connection.status === 'locked') {
        // Check if character has required items
        if (connection.requiredItems && connection.requiredItems.length > 0) {
            const missingItems = connection.requiredItems.filter(item => !characterInventory.includes(item));
            if (missingItems.length > 0) {
                return { canPass: false, reason: `Requires: ${missingItems.join(', ')}` };
            }
        }
        return { canPass: false, reason: 'The way is locked.' };
    }

    if (connection.cost && characterCredits < connection.cost) {
        return { canPass: false, reason: `Insufficient credits. Cost: ${connection.cost}` };
    }

    return { canPass: true };
}

/**
 * Calculates the transit cost between two sectors on the 10-module ring.
 * - Same Sector: 20 Cr
 * - Adjacent Sector: 50 Cr
 * - Distant Sector: 100 Cr
 */
export function calculateTransitCost(currentSectorId?: string, targetSectorId?: string): number {
    if (!currentSectorId || !targetSectorId) return 0;
    if (currentSectorId === targetSectorId) return 20;

    // Extract module numbers from IDs (e.g., "sector-01-dry-dock" -> 1)
    const getNum = (id: string) => parseInt(id.match(/sector-(\d+)/)?.[1] || '0', 10);
    const s1 = getNum(currentSectorId);
    const s2 = getNum(targetSectorId);

    if (s1 === 0 || s2 === 0) return 100; // Fallback for malformed IDs

    // Calculate distance on a ring of 10
    const diff = Math.abs(s1 - s2);
    const distance = Math.min(diff, 10 - diff);

    if (distance === 1) return 50;
    return 100;
}
