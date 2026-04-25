import { ai } from '@/ai/genkit';
import { z } from 'zod';
import {
  getLocationDetails,
  getLocationByName,
  getLocationPaths,
  getEstablishmentsForLocation,
  connectorConfig
} from '@/lib/dataconnect';
import { initializeServerFirebase } from '@/firebase/server-init';
import { getDataConnect } from 'firebase/data-connect';

export const queryLocationTool = ai.defineTool(
  {
    name: 'queryLocation',
    description: 'Fetch specific sub-locations, paths, and accessibility status from the database based on a location name or ID.',
    inputSchema: z.object({
      locationId: z.string().optional().describe('The specific ID of the location to query'),
      locationName: z.string().optional().describe('The name of the location to query if ID is unknown'),
    }),
  },
  async ({ locationId, locationName }) => {
    const { firebaseApp } = initializeServerFirebase();
    const dc = getDataConnect(firebaseApp, connectorConfig);
    
    try {
      let locId = locationId;
      let locationData = null;

      if (locId) {
        const res = await getLocationDetails(dc, { locationId: locId });
        locationData = res.data.location;
      } else if (locationName) {
        const res = await getLocationByName(dc, { name: locationName });
        locationData = res.data.locations[0];
        locId = locationData?.id;
      }

      if (!locationData || !locId) {
        return { error: `Location not found.` };
      }

      const pathsRes = await getLocationPaths(dc, { locationId: locId });
      const establishmentsRes = await getEstablishmentsForLocation(dc, { locationId: locId });

      return {
        location: locationData,
        paths: {
          outbound: pathsRes.data.sourcePaths,
          inbound: pathsRes.data.targetPaths,
        },
        establishments: establishmentsRes.data.establishments,
      };
    } catch (error: any) {
      return { error: `Failed to query location: ${error.message}` };
    }
  }
);
