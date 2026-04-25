import { ConnectorConfig, DataConnect, QueryRef, QueryPromise, ExecuteQueryOptions, MutationRef, MutationPromise } from 'firebase/data-connect';

export const connectorConfig: ConnectorConfig;

export type TimestampString = string;
export type UUIDString = string;
export type Int64String = string;
export type DateString = string;




export interface CampaignLore_Key {
  id: UUIDString;
  __typename?: 'CampaignLore_Key';
}

export interface CreateCanyonheavyLocationsData {
  location_insertMany: Location_Key[];
}

export interface CreateChokeLocationsData {
  location_insertMany: Location_Key[];
}

export interface CreateChopShopLocationsData {
  location_insertMany: Location_Key[];
}

export interface CreateCourtLocationsData {
  location_insertMany: Location_Key[];
}

export interface CreateDoptownLocationsData {
  location_insertMany: Location_Key[];
}

export interface CreateDryDockLocationsData {
  location_insertMany: Location_Key[];
}

export interface CreateFarmLocationsData {
  location_insertMany: Location_Key[];
}

export interface CreateIceBoxLocationsData {
  location_insertMany: Location_Key[];
}

export interface CreateSectorCanyonheavyData {
  sector_insert: Sector_Key;
}

export interface CreateSectorChokeData {
  sector_insert: Sector_Key;
}

export interface CreateSectorChopShopData {
  sector_insert: Sector_Key;
}

export interface CreateSectorCourtData {
  sector_insert: Sector_Key;
}

export interface CreateSectorDoptownData {
  sector_insert: Sector_Key;
}

export interface CreateSectorDryDockData {
  sector_insert: Sector_Key;
}

export interface CreateSectorFarmData {
  sector_insert: Sector_Key;
}

export interface CreateSectorIceBoxData {
  sector_insert: Sector_Key;
}

export interface CreateSectorStellarBurnData {
  sector_insert: Sector_Key;
}

export interface CreateSectorTempestHqData {
  sector_insert: Sector_Key;
}

export interface CreateStellarBurnLocationsData {
  location_insertMany: Location_Key[];
}

export interface CreateTempestHqLocationsData {
  location_insertMany: Location_Key[];
}

export interface Establishment_Key {
  id: UUIDString;
  __typename?: 'Establishment_Key';
}

export interface GetEstablishmentsForLocationData {
  establishments: ({
    id: UUIDString;
    name: string;
    type: string;
    description?: string | null;
    prices?: string | null;
    npcHooks?: string | null;
    isProcedural: boolean;
    isLocked: boolean;
    lockRequirements?: string | null;
  } & Establishment_Key)[];
}

export interface GetEstablishmentsForLocationVariables {
  locationId: string;
}

export interface GetLocationByNameData {
  locations: ({
    id: string;
    name: string;
    description?: string | null;
    mapCoordinates?: string | null;
    isLocked: boolean;
    lockRequirements?: string | null;
    sector: {
      id: string;
      name: string;
    } & Sector_Key;
  } & Location_Key)[];
}

export interface GetLocationByNameVariables {
  name: string;
}

export interface GetLocationDetailsData {
  location?: {
    id: string;
    name: string;
    description?: string | null;
    mapCoordinates?: string | null;
    isLocked: boolean;
    lockRequirements?: string | null;
    sector: {
      id: string;
      name: string;
      description?: string | null;
    } & Sector_Key;
  } & Location_Key;
}

export interface GetLocationDetailsVariables {
  locationId: string;
}

export interface GetLocationPathsData {
  sourcePaths: ({
    id: UUIDString;
    targetNodeId: string;
    targetNodeType: string;
    type: string;
    accessibility?: string | null;
    travelTimeMinutes?: number | null;
    dangerLevel?: number | null;
  } & Path_Key)[];
    targetPaths: ({
      id: UUIDString;
      sourceNodeId: string;
      sourceNodeType: string;
      type: string;
      accessibility?: string | null;
      travelTimeMinutes?: number | null;
      dangerLevel?: number | null;
    } & Path_Key)[];
}

export interface GetLocationPathsVariables {
  locationId: string;
}

export interface InsertCampaignLoreData {
  campaignLore_insert: CampaignLore_Key;
}

export interface InsertCampaignLoreVariables {
  content: string;
  metadata?: unknown | null;
}

export interface Location_Key {
  id: string;
  __typename?: 'Location_Key';
}

export interface Path_Key {
  id: UUIDString;
  __typename?: 'Path_Key';
}

export interface SearchCampaignLoreData {
  campaignLores_embedding_similarity: ({
    id: UUIDString;
    content: string;
    metadata?: unknown | null;
  } & CampaignLore_Key)[];
}

export interface SearchCampaignLoreVariables {
  query: string;
}

export interface Sector_Key {
  id: string;
  __typename?: 'Sector_Key';
}

interface CreateSectorDryDockRef {
  /* Allow users to create refs without passing in DataConnect */
  (): MutationRef<CreateSectorDryDockData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): MutationRef<CreateSectorDryDockData, undefined>;
  operationName: string;
}
export const createSectorDryDockRef: CreateSectorDryDockRef;

export function createSectorDryDock(): MutationPromise<CreateSectorDryDockData, undefined>;
export function createSectorDryDock(dc: DataConnect): MutationPromise<CreateSectorDryDockData, undefined>;

interface CreateDryDockLocationsRef {
  /* Allow users to create refs without passing in DataConnect */
  (): MutationRef<CreateDryDockLocationsData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): MutationRef<CreateDryDockLocationsData, undefined>;
  operationName: string;
}
export const createDryDockLocationsRef: CreateDryDockLocationsRef;

export function createDryDockLocations(): MutationPromise<CreateDryDockLocationsData, undefined>;
export function createDryDockLocations(dc: DataConnect): MutationPromise<CreateDryDockLocationsData, undefined>;

interface CreateSectorStellarBurnRef {
  /* Allow users to create refs without passing in DataConnect */
  (): MutationRef<CreateSectorStellarBurnData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): MutationRef<CreateSectorStellarBurnData, undefined>;
  operationName: string;
}
export const createSectorStellarBurnRef: CreateSectorStellarBurnRef;

export function createSectorStellarBurn(): MutationPromise<CreateSectorStellarBurnData, undefined>;
export function createSectorStellarBurn(dc: DataConnect): MutationPromise<CreateSectorStellarBurnData, undefined>;

interface CreateStellarBurnLocationsRef {
  /* Allow users to create refs without passing in DataConnect */
  (): MutationRef<CreateStellarBurnLocationsData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): MutationRef<CreateStellarBurnLocationsData, undefined>;
  operationName: string;
}
export const createStellarBurnLocationsRef: CreateStellarBurnLocationsRef;

export function createStellarBurnLocations(): MutationPromise<CreateStellarBurnLocationsData, undefined>;
export function createStellarBurnLocations(dc: DataConnect): MutationPromise<CreateStellarBurnLocationsData, undefined>;

interface CreateSectorChopShopRef {
  /* Allow users to create refs without passing in DataConnect */
  (): MutationRef<CreateSectorChopShopData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): MutationRef<CreateSectorChopShopData, undefined>;
  operationName: string;
}
export const createSectorChopShopRef: CreateSectorChopShopRef;

export function createSectorChopShop(): MutationPromise<CreateSectorChopShopData, undefined>;
export function createSectorChopShop(dc: DataConnect): MutationPromise<CreateSectorChopShopData, undefined>;

interface CreateChopShopLocationsRef {
  /* Allow users to create refs without passing in DataConnect */
  (): MutationRef<CreateChopShopLocationsData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): MutationRef<CreateChopShopLocationsData, undefined>;
  operationName: string;
}
export const createChopShopLocationsRef: CreateChopShopLocationsRef;

export function createChopShopLocations(): MutationPromise<CreateChopShopLocationsData, undefined>;
export function createChopShopLocations(dc: DataConnect): MutationPromise<CreateChopShopLocationsData, undefined>;

interface CreateSectorIceBoxRef {
  /* Allow users to create refs without passing in DataConnect */
  (): MutationRef<CreateSectorIceBoxData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): MutationRef<CreateSectorIceBoxData, undefined>;
  operationName: string;
}
export const createSectorIceBoxRef: CreateSectorIceBoxRef;

export function createSectorIceBox(): MutationPromise<CreateSectorIceBoxData, undefined>;
export function createSectorIceBox(dc: DataConnect): MutationPromise<CreateSectorIceBoxData, undefined>;

interface CreateIceBoxLocationsRef {
  /* Allow users to create refs without passing in DataConnect */
  (): MutationRef<CreateIceBoxLocationsData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): MutationRef<CreateIceBoxLocationsData, undefined>;
  operationName: string;
}
export const createIceBoxLocationsRef: CreateIceBoxLocationsRef;

export function createIceBoxLocations(): MutationPromise<CreateIceBoxLocationsData, undefined>;
export function createIceBoxLocations(dc: DataConnect): MutationPromise<CreateIceBoxLocationsData, undefined>;

interface CreateSectorFarmRef {
  /* Allow users to create refs without passing in DataConnect */
  (): MutationRef<CreateSectorFarmData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): MutationRef<CreateSectorFarmData, undefined>;
  operationName: string;
}
export const createSectorFarmRef: CreateSectorFarmRef;

export function createSectorFarm(): MutationPromise<CreateSectorFarmData, undefined>;
export function createSectorFarm(dc: DataConnect): MutationPromise<CreateSectorFarmData, undefined>;

interface CreateFarmLocationsRef {
  /* Allow users to create refs without passing in DataConnect */
  (): MutationRef<CreateFarmLocationsData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): MutationRef<CreateFarmLocationsData, undefined>;
  operationName: string;
}
export const createFarmLocationsRef: CreateFarmLocationsRef;

export function createFarmLocations(): MutationPromise<CreateFarmLocationsData, undefined>;
export function createFarmLocations(dc: DataConnect): MutationPromise<CreateFarmLocationsData, undefined>;

interface CreateSectorCanyonheavyRef {
  /* Allow users to create refs without passing in DataConnect */
  (): MutationRef<CreateSectorCanyonheavyData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): MutationRef<CreateSectorCanyonheavyData, undefined>;
  operationName: string;
}
export const createSectorCanyonheavyRef: CreateSectorCanyonheavyRef;

export function createSectorCanyonheavy(): MutationPromise<CreateSectorCanyonheavyData, undefined>;
export function createSectorCanyonheavy(dc: DataConnect): MutationPromise<CreateSectorCanyonheavyData, undefined>;

interface CreateCanyonheavyLocationsRef {
  /* Allow users to create refs without passing in DataConnect */
  (): MutationRef<CreateCanyonheavyLocationsData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): MutationRef<CreateCanyonheavyLocationsData, undefined>;
  operationName: string;
}
export const createCanyonheavyLocationsRef: CreateCanyonheavyLocationsRef;

export function createCanyonheavyLocations(): MutationPromise<CreateCanyonheavyLocationsData, undefined>;
export function createCanyonheavyLocations(dc: DataConnect): MutationPromise<CreateCanyonheavyLocationsData, undefined>;

interface CreateSectorCourtRef {
  /* Allow users to create refs without passing in DataConnect */
  (): MutationRef<CreateSectorCourtData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): MutationRef<CreateSectorCourtData, undefined>;
  operationName: string;
}
export const createSectorCourtRef: CreateSectorCourtRef;

export function createSectorCourt(): MutationPromise<CreateSectorCourtData, undefined>;
export function createSectorCourt(dc: DataConnect): MutationPromise<CreateSectorCourtData, undefined>;

interface CreateCourtLocationsRef {
  /* Allow users to create refs without passing in DataConnect */
  (): MutationRef<CreateCourtLocationsData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): MutationRef<CreateCourtLocationsData, undefined>;
  operationName: string;
}
export const createCourtLocationsRef: CreateCourtLocationsRef;

export function createCourtLocations(): MutationPromise<CreateCourtLocationsData, undefined>;
export function createCourtLocations(dc: DataConnect): MutationPromise<CreateCourtLocationsData, undefined>;

interface CreateSectorTempestHqRef {
  /* Allow users to create refs without passing in DataConnect */
  (): MutationRef<CreateSectorTempestHqData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): MutationRef<CreateSectorTempestHqData, undefined>;
  operationName: string;
}
export const createSectorTempestHqRef: CreateSectorTempestHqRef;

export function createSectorTempestHq(): MutationPromise<CreateSectorTempestHqData, undefined>;
export function createSectorTempestHq(dc: DataConnect): MutationPromise<CreateSectorTempestHqData, undefined>;

interface CreateTempestHqLocationsRef {
  /* Allow users to create refs without passing in DataConnect */
  (): MutationRef<CreateTempestHqLocationsData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): MutationRef<CreateTempestHqLocationsData, undefined>;
  operationName: string;
}
export const createTempestHqLocationsRef: CreateTempestHqLocationsRef;

export function createTempestHqLocations(): MutationPromise<CreateTempestHqLocationsData, undefined>;
export function createTempestHqLocations(dc: DataConnect): MutationPromise<CreateTempestHqLocationsData, undefined>;

interface CreateSectorDoptownRef {
  /* Allow users to create refs without passing in DataConnect */
  (): MutationRef<CreateSectorDoptownData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): MutationRef<CreateSectorDoptownData, undefined>;
  operationName: string;
}
export const createSectorDoptownRef: CreateSectorDoptownRef;

export function createSectorDoptown(): MutationPromise<CreateSectorDoptownData, undefined>;
export function createSectorDoptown(dc: DataConnect): MutationPromise<CreateSectorDoptownData, undefined>;

interface CreateDoptownLocationsRef {
  /* Allow users to create refs without passing in DataConnect */
  (): MutationRef<CreateDoptownLocationsData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): MutationRef<CreateDoptownLocationsData, undefined>;
  operationName: string;
}
export const createDoptownLocationsRef: CreateDoptownLocationsRef;

export function createDoptownLocations(): MutationPromise<CreateDoptownLocationsData, undefined>;
export function createDoptownLocations(dc: DataConnect): MutationPromise<CreateDoptownLocationsData, undefined>;

interface CreateSectorChokeRef {
  /* Allow users to create refs without passing in DataConnect */
  (): MutationRef<CreateSectorChokeData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): MutationRef<CreateSectorChokeData, undefined>;
  operationName: string;
}
export const createSectorChokeRef: CreateSectorChokeRef;

export function createSectorChoke(): MutationPromise<CreateSectorChokeData, undefined>;
export function createSectorChoke(dc: DataConnect): MutationPromise<CreateSectorChokeData, undefined>;

interface CreateChokeLocationsRef {
  /* Allow users to create refs without passing in DataConnect */
  (): MutationRef<CreateChokeLocationsData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): MutationRef<CreateChokeLocationsData, undefined>;
  operationName: string;
}
export const createChokeLocationsRef: CreateChokeLocationsRef;

export function createChokeLocations(): MutationPromise<CreateChokeLocationsData, undefined>;
export function createChokeLocations(dc: DataConnect): MutationPromise<CreateChokeLocationsData, undefined>;

interface InsertCampaignLoreRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: InsertCampaignLoreVariables): MutationRef<InsertCampaignLoreData, InsertCampaignLoreVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: InsertCampaignLoreVariables): MutationRef<InsertCampaignLoreData, InsertCampaignLoreVariables>;
  operationName: string;
}
export const insertCampaignLoreRef: InsertCampaignLoreRef;

export function insertCampaignLore(vars: InsertCampaignLoreVariables): MutationPromise<InsertCampaignLoreData, InsertCampaignLoreVariables>;
export function insertCampaignLore(dc: DataConnect, vars: InsertCampaignLoreVariables): MutationPromise<InsertCampaignLoreData, InsertCampaignLoreVariables>;

interface GetLocationDetailsRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetLocationDetailsVariables): QueryRef<GetLocationDetailsData, GetLocationDetailsVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetLocationDetailsVariables): QueryRef<GetLocationDetailsData, GetLocationDetailsVariables>;
  operationName: string;
}
export const getLocationDetailsRef: GetLocationDetailsRef;

export function getLocationDetails(vars: GetLocationDetailsVariables, options?: ExecuteQueryOptions): QueryPromise<GetLocationDetailsData, GetLocationDetailsVariables>;
export function getLocationDetails(dc: DataConnect, vars: GetLocationDetailsVariables, options?: ExecuteQueryOptions): QueryPromise<GetLocationDetailsData, GetLocationDetailsVariables>;

interface GetLocationByNameRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetLocationByNameVariables): QueryRef<GetLocationByNameData, GetLocationByNameVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetLocationByNameVariables): QueryRef<GetLocationByNameData, GetLocationByNameVariables>;
  operationName: string;
}
export const getLocationByNameRef: GetLocationByNameRef;

export function getLocationByName(vars: GetLocationByNameVariables, options?: ExecuteQueryOptions): QueryPromise<GetLocationByNameData, GetLocationByNameVariables>;
export function getLocationByName(dc: DataConnect, vars: GetLocationByNameVariables, options?: ExecuteQueryOptions): QueryPromise<GetLocationByNameData, GetLocationByNameVariables>;

interface GetLocationPathsRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetLocationPathsVariables): QueryRef<GetLocationPathsData, GetLocationPathsVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetLocationPathsVariables): QueryRef<GetLocationPathsData, GetLocationPathsVariables>;
  operationName: string;
}
export const getLocationPathsRef: GetLocationPathsRef;

export function getLocationPaths(vars: GetLocationPathsVariables, options?: ExecuteQueryOptions): QueryPromise<GetLocationPathsData, GetLocationPathsVariables>;
export function getLocationPaths(dc: DataConnect, vars: GetLocationPathsVariables, options?: ExecuteQueryOptions): QueryPromise<GetLocationPathsData, GetLocationPathsVariables>;

interface GetEstablishmentsForLocationRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetEstablishmentsForLocationVariables): QueryRef<GetEstablishmentsForLocationData, GetEstablishmentsForLocationVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetEstablishmentsForLocationVariables): QueryRef<GetEstablishmentsForLocationData, GetEstablishmentsForLocationVariables>;
  operationName: string;
}
export const getEstablishmentsForLocationRef: GetEstablishmentsForLocationRef;

export function getEstablishmentsForLocation(vars: GetEstablishmentsForLocationVariables, options?: ExecuteQueryOptions): QueryPromise<GetEstablishmentsForLocationData, GetEstablishmentsForLocationVariables>;
export function getEstablishmentsForLocation(dc: DataConnect, vars: GetEstablishmentsForLocationVariables, options?: ExecuteQueryOptions): QueryPromise<GetEstablishmentsForLocationData, GetEstablishmentsForLocationVariables>;

interface SearchCampaignLoreRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: SearchCampaignLoreVariables): QueryRef<SearchCampaignLoreData, SearchCampaignLoreVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: SearchCampaignLoreVariables): QueryRef<SearchCampaignLoreData, SearchCampaignLoreVariables>;
  operationName: string;
}
export const searchCampaignLoreRef: SearchCampaignLoreRef;

export function searchCampaignLore(vars: SearchCampaignLoreVariables, options?: ExecuteQueryOptions): QueryPromise<SearchCampaignLoreData, SearchCampaignLoreVariables>;
export function searchCampaignLore(dc: DataConnect, vars: SearchCampaignLoreVariables, options?: ExecuteQueryOptions): QueryPromise<SearchCampaignLoreData, SearchCampaignLoreVariables>;

