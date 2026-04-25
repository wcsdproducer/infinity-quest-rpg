const { queryRef, executeQuery, validateArgsWithOptions, mutationRef, executeMutation, validateArgs } = require('firebase/data-connect');

const connectorConfig = {
  connector: 'default',
  service: 'infinity-quest-rpg',
  location: 'us-central1'
};
exports.connectorConfig = connectorConfig;

const createSectorDryDockRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'createSectorDryDock');
}
createSectorDryDockRef.operationName = 'createSectorDryDock';
exports.createSectorDryDockRef = createSectorDryDockRef;

exports.createSectorDryDock = function createSectorDryDock(dc) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dc, undefined);
  return executeMutation(createSectorDryDockRef(dcInstance, inputVars));
}
;

const createDryDockLocationsRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'createDryDockLocations');
}
createDryDockLocationsRef.operationName = 'createDryDockLocations';
exports.createDryDockLocationsRef = createDryDockLocationsRef;

exports.createDryDockLocations = function createDryDockLocations(dc) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dc, undefined);
  return executeMutation(createDryDockLocationsRef(dcInstance, inputVars));
}
;

const createSectorStellarBurnRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'createSectorStellarBurn');
}
createSectorStellarBurnRef.operationName = 'createSectorStellarBurn';
exports.createSectorStellarBurnRef = createSectorStellarBurnRef;

exports.createSectorStellarBurn = function createSectorStellarBurn(dc) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dc, undefined);
  return executeMutation(createSectorStellarBurnRef(dcInstance, inputVars));
}
;

const createStellarBurnLocationsRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'createStellarBurnLocations');
}
createStellarBurnLocationsRef.operationName = 'createStellarBurnLocations';
exports.createStellarBurnLocationsRef = createStellarBurnLocationsRef;

exports.createStellarBurnLocations = function createStellarBurnLocations(dc) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dc, undefined);
  return executeMutation(createStellarBurnLocationsRef(dcInstance, inputVars));
}
;

const createSectorChopShopRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'createSectorChopShop');
}
createSectorChopShopRef.operationName = 'createSectorChopShop';
exports.createSectorChopShopRef = createSectorChopShopRef;

exports.createSectorChopShop = function createSectorChopShop(dc) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dc, undefined);
  return executeMutation(createSectorChopShopRef(dcInstance, inputVars));
}
;

const createChopShopLocationsRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'createChopShopLocations');
}
createChopShopLocationsRef.operationName = 'createChopShopLocations';
exports.createChopShopLocationsRef = createChopShopLocationsRef;

exports.createChopShopLocations = function createChopShopLocations(dc) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dc, undefined);
  return executeMutation(createChopShopLocationsRef(dcInstance, inputVars));
}
;

const createSectorIceBoxRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'createSectorIceBox');
}
createSectorIceBoxRef.operationName = 'createSectorIceBox';
exports.createSectorIceBoxRef = createSectorIceBoxRef;

exports.createSectorIceBox = function createSectorIceBox(dc) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dc, undefined);
  return executeMutation(createSectorIceBoxRef(dcInstance, inputVars));
}
;

const createIceBoxLocationsRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'createIceBoxLocations');
}
createIceBoxLocationsRef.operationName = 'createIceBoxLocations';
exports.createIceBoxLocationsRef = createIceBoxLocationsRef;

exports.createIceBoxLocations = function createIceBoxLocations(dc) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dc, undefined);
  return executeMutation(createIceBoxLocationsRef(dcInstance, inputVars));
}
;

const createSectorFarmRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'createSectorFarm');
}
createSectorFarmRef.operationName = 'createSectorFarm';
exports.createSectorFarmRef = createSectorFarmRef;

exports.createSectorFarm = function createSectorFarm(dc) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dc, undefined);
  return executeMutation(createSectorFarmRef(dcInstance, inputVars));
}
;

const createFarmLocationsRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'createFarmLocations');
}
createFarmLocationsRef.operationName = 'createFarmLocations';
exports.createFarmLocationsRef = createFarmLocationsRef;

exports.createFarmLocations = function createFarmLocations(dc) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dc, undefined);
  return executeMutation(createFarmLocationsRef(dcInstance, inputVars));
}
;

const createSectorCanyonheavyRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'createSectorCanyonheavy');
}
createSectorCanyonheavyRef.operationName = 'createSectorCanyonheavy';
exports.createSectorCanyonheavyRef = createSectorCanyonheavyRef;

exports.createSectorCanyonheavy = function createSectorCanyonheavy(dc) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dc, undefined);
  return executeMutation(createSectorCanyonheavyRef(dcInstance, inputVars));
}
;

const createCanyonheavyLocationsRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'createCanyonheavyLocations');
}
createCanyonheavyLocationsRef.operationName = 'createCanyonheavyLocations';
exports.createCanyonheavyLocationsRef = createCanyonheavyLocationsRef;

exports.createCanyonheavyLocations = function createCanyonheavyLocations(dc) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dc, undefined);
  return executeMutation(createCanyonheavyLocationsRef(dcInstance, inputVars));
}
;

const createSectorCourtRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'createSectorCourt');
}
createSectorCourtRef.operationName = 'createSectorCourt';
exports.createSectorCourtRef = createSectorCourtRef;

exports.createSectorCourt = function createSectorCourt(dc) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dc, undefined);
  return executeMutation(createSectorCourtRef(dcInstance, inputVars));
}
;

const createCourtLocationsRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'createCourtLocations');
}
createCourtLocationsRef.operationName = 'createCourtLocations';
exports.createCourtLocationsRef = createCourtLocationsRef;

exports.createCourtLocations = function createCourtLocations(dc) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dc, undefined);
  return executeMutation(createCourtLocationsRef(dcInstance, inputVars));
}
;

const createSectorTempestHqRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'createSectorTempestHQ');
}
createSectorTempestHqRef.operationName = 'createSectorTempestHQ';
exports.createSectorTempestHqRef = createSectorTempestHqRef;

exports.createSectorTempestHq = function createSectorTempestHq(dc) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dc, undefined);
  return executeMutation(createSectorTempestHqRef(dcInstance, inputVars));
}
;

const createTempestHqLocationsRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'createTempestHQLocations');
}
createTempestHqLocationsRef.operationName = 'createTempestHQLocations';
exports.createTempestHqLocationsRef = createTempestHqLocationsRef;

exports.createTempestHqLocations = function createTempestHqLocations(dc) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dc, undefined);
  return executeMutation(createTempestHqLocationsRef(dcInstance, inputVars));
}
;

const createSectorDoptownRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'createSectorDoptown');
}
createSectorDoptownRef.operationName = 'createSectorDoptown';
exports.createSectorDoptownRef = createSectorDoptownRef;

exports.createSectorDoptown = function createSectorDoptown(dc) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dc, undefined);
  return executeMutation(createSectorDoptownRef(dcInstance, inputVars));
}
;

const createDoptownLocationsRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'createDoptownLocations');
}
createDoptownLocationsRef.operationName = 'createDoptownLocations';
exports.createDoptownLocationsRef = createDoptownLocationsRef;

exports.createDoptownLocations = function createDoptownLocations(dc) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dc, undefined);
  return executeMutation(createDoptownLocationsRef(dcInstance, inputVars));
}
;

const createSectorChokeRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'createSectorChoke');
}
createSectorChokeRef.operationName = 'createSectorChoke';
exports.createSectorChokeRef = createSectorChokeRef;

exports.createSectorChoke = function createSectorChoke(dc) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dc, undefined);
  return executeMutation(createSectorChokeRef(dcInstance, inputVars));
}
;

const createChokeLocationsRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'createChokeLocations');
}
createChokeLocationsRef.operationName = 'createChokeLocations';
exports.createChokeLocationsRef = createChokeLocationsRef;

exports.createChokeLocations = function createChokeLocations(dc) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dc, undefined);
  return executeMutation(createChokeLocationsRef(dcInstance, inputVars));
}
;

const insertCampaignLoreRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'insertCampaignLore', inputVars);
}
insertCampaignLoreRef.operationName = 'insertCampaignLore';
exports.insertCampaignLoreRef = insertCampaignLoreRef;

exports.insertCampaignLore = function insertCampaignLore(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(insertCampaignLoreRef(dcInstance, inputVars));
}
;

const getLocationDetailsRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetLocationDetails', inputVars);
}
getLocationDetailsRef.operationName = 'GetLocationDetails';
exports.getLocationDetailsRef = getLocationDetailsRef;

exports.getLocationDetails = function getLocationDetails(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, true);
  return executeQuery(getLocationDetailsRef(dcInstance, inputVars), inputOpts && inputOpts.fetchPolicy);
}
;

const getLocationByNameRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetLocationByName', inputVars);
}
getLocationByNameRef.operationName = 'GetLocationByName';
exports.getLocationByNameRef = getLocationByNameRef;

exports.getLocationByName = function getLocationByName(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, true);
  return executeQuery(getLocationByNameRef(dcInstance, inputVars), inputOpts && inputOpts.fetchPolicy);
}
;

const getLocationPathsRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetLocationPaths', inputVars);
}
getLocationPathsRef.operationName = 'GetLocationPaths';
exports.getLocationPathsRef = getLocationPathsRef;

exports.getLocationPaths = function getLocationPaths(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, true);
  return executeQuery(getLocationPathsRef(dcInstance, inputVars), inputOpts && inputOpts.fetchPolicy);
}
;

const getEstablishmentsForLocationRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetEstablishmentsForLocation', inputVars);
}
getEstablishmentsForLocationRef.operationName = 'GetEstablishmentsForLocation';
exports.getEstablishmentsForLocationRef = getEstablishmentsForLocationRef;

exports.getEstablishmentsForLocation = function getEstablishmentsForLocation(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, true);
  return executeQuery(getEstablishmentsForLocationRef(dcInstance, inputVars), inputOpts && inputOpts.fetchPolicy);
}
;

const searchCampaignLoreRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'searchCampaignLore', inputVars);
}
searchCampaignLoreRef.operationName = 'searchCampaignLore';
exports.searchCampaignLoreRef = searchCampaignLoreRef;

exports.searchCampaignLore = function searchCampaignLore(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, true);
  return executeQuery(searchCampaignLoreRef(dcInstance, inputVars), inputOpts && inputOpts.fetchPolicy);
}
;
