import { queryRef, executeQuery, validateArgsWithOptions, mutationRef, executeMutation, validateArgs } from 'firebase/data-connect';

export const connectorConfig = {
  connector: 'default',
  service: 'infinity-quest-rpg',
  location: 'us-central1'
};
export const createSectorDryDockRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'createSectorDryDock');
}
createSectorDryDockRef.operationName = 'createSectorDryDock';

export function createSectorDryDock(dc) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dc, undefined);
  return executeMutation(createSectorDryDockRef(dcInstance, inputVars));
}

export const createDryDockLocationsRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'createDryDockLocations');
}
createDryDockLocationsRef.operationName = 'createDryDockLocations';

export function createDryDockLocations(dc) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dc, undefined);
  return executeMutation(createDryDockLocationsRef(dcInstance, inputVars));
}

export const createSectorStellarBurnRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'createSectorStellarBurn');
}
createSectorStellarBurnRef.operationName = 'createSectorStellarBurn';

export function createSectorStellarBurn(dc) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dc, undefined);
  return executeMutation(createSectorStellarBurnRef(dcInstance, inputVars));
}

export const createStellarBurnLocationsRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'createStellarBurnLocations');
}
createStellarBurnLocationsRef.operationName = 'createStellarBurnLocations';

export function createStellarBurnLocations(dc) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dc, undefined);
  return executeMutation(createStellarBurnLocationsRef(dcInstance, inputVars));
}

export const createSectorChopShopRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'createSectorChopShop');
}
createSectorChopShopRef.operationName = 'createSectorChopShop';

export function createSectorChopShop(dc) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dc, undefined);
  return executeMutation(createSectorChopShopRef(dcInstance, inputVars));
}

export const createChopShopLocationsRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'createChopShopLocations');
}
createChopShopLocationsRef.operationName = 'createChopShopLocations';

export function createChopShopLocations(dc) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dc, undefined);
  return executeMutation(createChopShopLocationsRef(dcInstance, inputVars));
}

export const createSectorIceBoxRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'createSectorIceBox');
}
createSectorIceBoxRef.operationName = 'createSectorIceBox';

export function createSectorIceBox(dc) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dc, undefined);
  return executeMutation(createSectorIceBoxRef(dcInstance, inputVars));
}

export const createIceBoxLocationsRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'createIceBoxLocations');
}
createIceBoxLocationsRef.operationName = 'createIceBoxLocations';

export function createIceBoxLocations(dc) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dc, undefined);
  return executeMutation(createIceBoxLocationsRef(dcInstance, inputVars));
}

export const createSectorFarmRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'createSectorFarm');
}
createSectorFarmRef.operationName = 'createSectorFarm';

export function createSectorFarm(dc) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dc, undefined);
  return executeMutation(createSectorFarmRef(dcInstance, inputVars));
}

export const createFarmLocationsRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'createFarmLocations');
}
createFarmLocationsRef.operationName = 'createFarmLocations';

export function createFarmLocations(dc) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dc, undefined);
  return executeMutation(createFarmLocationsRef(dcInstance, inputVars));
}

export const createSectorCanyonheavyRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'createSectorCanyonheavy');
}
createSectorCanyonheavyRef.operationName = 'createSectorCanyonheavy';

export function createSectorCanyonheavy(dc) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dc, undefined);
  return executeMutation(createSectorCanyonheavyRef(dcInstance, inputVars));
}

export const createCanyonheavyLocationsRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'createCanyonheavyLocations');
}
createCanyonheavyLocationsRef.operationName = 'createCanyonheavyLocations';

export function createCanyonheavyLocations(dc) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dc, undefined);
  return executeMutation(createCanyonheavyLocationsRef(dcInstance, inputVars));
}

export const createSectorCourtRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'createSectorCourt');
}
createSectorCourtRef.operationName = 'createSectorCourt';

export function createSectorCourt(dc) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dc, undefined);
  return executeMutation(createSectorCourtRef(dcInstance, inputVars));
}

export const createCourtLocationsRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'createCourtLocations');
}
createCourtLocationsRef.operationName = 'createCourtLocations';

export function createCourtLocations(dc) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dc, undefined);
  return executeMutation(createCourtLocationsRef(dcInstance, inputVars));
}

export const createSectorTempestHqRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'createSectorTempestHQ');
}
createSectorTempestHqRef.operationName = 'createSectorTempestHQ';

export function createSectorTempestHq(dc) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dc, undefined);
  return executeMutation(createSectorTempestHqRef(dcInstance, inputVars));
}

export const createTempestHqLocationsRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'createTempestHQLocations');
}
createTempestHqLocationsRef.operationName = 'createTempestHQLocations';

export function createTempestHqLocations(dc) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dc, undefined);
  return executeMutation(createTempestHqLocationsRef(dcInstance, inputVars));
}

export const createSectorDoptownRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'createSectorDoptown');
}
createSectorDoptownRef.operationName = 'createSectorDoptown';

export function createSectorDoptown(dc) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dc, undefined);
  return executeMutation(createSectorDoptownRef(dcInstance, inputVars));
}

export const createDoptownLocationsRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'createDoptownLocations');
}
createDoptownLocationsRef.operationName = 'createDoptownLocations';

export function createDoptownLocations(dc) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dc, undefined);
  return executeMutation(createDoptownLocationsRef(dcInstance, inputVars));
}

export const createSectorChokeRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'createSectorChoke');
}
createSectorChokeRef.operationName = 'createSectorChoke';

export function createSectorChoke(dc) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dc, undefined);
  return executeMutation(createSectorChokeRef(dcInstance, inputVars));
}

export const createChokeLocationsRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'createChokeLocations');
}
createChokeLocationsRef.operationName = 'createChokeLocations';

export function createChokeLocations(dc) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dc, undefined);
  return executeMutation(createChokeLocationsRef(dcInstance, inputVars));
}

export const insertCampaignLoreRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'insertCampaignLore', inputVars);
}
insertCampaignLoreRef.operationName = 'insertCampaignLore';

export function insertCampaignLore(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(insertCampaignLoreRef(dcInstance, inputVars));
}

export const getLocationDetailsRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetLocationDetails', inputVars);
}
getLocationDetailsRef.operationName = 'GetLocationDetails';

export function getLocationDetails(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, true);
  return executeQuery(getLocationDetailsRef(dcInstance, inputVars), inputOpts && inputOpts.fetchPolicy);
}

export const getLocationByNameRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetLocationByName', inputVars);
}
getLocationByNameRef.operationName = 'GetLocationByName';

export function getLocationByName(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, true);
  return executeQuery(getLocationByNameRef(dcInstance, inputVars), inputOpts && inputOpts.fetchPolicy);
}

export const getLocationPathsRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetLocationPaths', inputVars);
}
getLocationPathsRef.operationName = 'GetLocationPaths';

export function getLocationPaths(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, true);
  return executeQuery(getLocationPathsRef(dcInstance, inputVars), inputOpts && inputOpts.fetchPolicy);
}

export const getEstablishmentsForLocationRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetEstablishmentsForLocation', inputVars);
}
getEstablishmentsForLocationRef.operationName = 'GetEstablishmentsForLocation';

export function getEstablishmentsForLocation(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, true);
  return executeQuery(getEstablishmentsForLocationRef(dcInstance, inputVars), inputOpts && inputOpts.fetchPolicy);
}

export const searchCampaignLoreRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'searchCampaignLore', inputVars);
}
searchCampaignLoreRef.operationName = 'searchCampaignLore';

export function searchCampaignLore(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, true);
  return executeQuery(searchCampaignLoreRef(dcInstance, inputVars), inputOpts && inputOpts.fetchPolicy);
}

