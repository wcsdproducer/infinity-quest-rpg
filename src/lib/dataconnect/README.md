# Generated TypeScript README
This README will guide you through the process of using the generated JavaScript SDK package for the connector `default`. It will also provide examples on how to use your generated SDK to call your Data Connect queries and mutations.

***NOTE:** This README is generated alongside the generated SDK. If you make changes to this file, they will be overwritten when the SDK is regenerated.*

# Table of Contents
- [**Overview**](#generated-javascript-readme)
- [**Accessing the connector**](#accessing-the-connector)
  - [*Connecting to the local Emulator*](#connecting-to-the-local-emulator)
- [**Queries**](#queries)
  - [*GetLocationDetails*](#getlocationdetails)
  - [*GetLocationByName*](#getlocationbyname)
  - [*GetLocationPaths*](#getlocationpaths)
  - [*GetEstablishmentsForLocation*](#getestablishmentsforlocation)
  - [*searchCampaignLore*](#searchcampaignlore)
- [**Mutations**](#mutations)
  - [*createSectorDryDock*](#createsectordrydock)
  - [*createDryDockLocations*](#createdrydocklocations)
  - [*createSectorStellarBurn*](#createsectorstellarburn)
  - [*createStellarBurnLocations*](#createstellarburnlocations)
  - [*createSectorChopShop*](#createsectorchopshop)
  - [*createChopShopLocations*](#createchopshoplocations)
  - [*createSectorIceBox*](#createsectoricebox)
  - [*createIceBoxLocations*](#createiceboxlocations)
  - [*createSectorFarm*](#createsectorfarm)
  - [*createFarmLocations*](#createfarmlocations)
  - [*createSectorCanyonheavy*](#createsectorcanyonheavy)
  - [*createCanyonheavyLocations*](#createcanyonheavylocations)
  - [*createSectorCourt*](#createsectorcourt)
  - [*createCourtLocations*](#createcourtlocations)
  - [*createSectorTempestHQ*](#createsectortempesthq)
  - [*createTempestHQLocations*](#createtempesthqlocations)
  - [*createSectorDoptown*](#createsectordoptown)
  - [*createDoptownLocations*](#createdoptownlocations)
  - [*createSectorChoke*](#createsectorchoke)
  - [*createChokeLocations*](#createchokelocations)
  - [*insertCampaignLore*](#insertcampaignlore)

# Accessing the connector
A connector is a collection of Queries and Mutations. One SDK is generated for each connector - this SDK is generated for the connector `default`. You can find more information about connectors in the [Data Connect documentation](https://firebase.google.com/docs/data-connect#how-does).

You can use this generated SDK by importing from the package `@infinity-quest/dataconnect` as shown below. Both CommonJS and ESM imports are supported.

You can also follow the instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#set-client).

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@infinity-quest/dataconnect';

const dataConnect = getDataConnect(connectorConfig);
```

## Connecting to the local Emulator
By default, the connector will connect to the production service.

To connect to the emulator, you can use the following code.
You can also follow the emulator instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#instrument-clients).

```typescript
import { connectDataConnectEmulator, getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@infinity-quest/dataconnect';

const dataConnect = getDataConnect(connectorConfig);
connectDataConnectEmulator(dataConnect, 'localhost', 9399);
```

After it's initialized, you can call your Data Connect [queries](#queries) and [mutations](#mutations) from your generated SDK.

# Queries

There are two ways to execute a Data Connect Query using the generated Web SDK:
- Using a Query Reference function, which returns a `QueryRef`
  - The `QueryRef` can be used as an argument to `executeQuery()`, which will execute the Query and return a `QueryPromise`
- Using an action shortcut function, which returns a `QueryPromise`
  - Calling the action shortcut function will execute the Query and return a `QueryPromise`

The following is true for both the action shortcut function and the `QueryRef` function:
- The `QueryPromise` returned will resolve to the result of the Query once it has finished executing
- If the Query accepts arguments, both the action shortcut function and the `QueryRef` function accept a single argument: an object that contains all the required variables (and the optional variables) for the Query
- Both functions can be called with or without passing in a `DataConnect` instance as an argument. If no `DataConnect` argument is passed in, then the generated SDK will call `getDataConnect(connectorConfig)` behind the scenes for you.

Below are examples of how to use the `default` connector's generated functions to execute each query. You can also follow the examples from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#using-queries).

## GetLocationDetails
You can execute the `GetLocationDetails` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
getLocationDetails(vars: GetLocationDetailsVariables, options?: ExecuteQueryOptions): QueryPromise<GetLocationDetailsData, GetLocationDetailsVariables>;

interface GetLocationDetailsRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetLocationDetailsVariables): QueryRef<GetLocationDetailsData, GetLocationDetailsVariables>;
}
export const getLocationDetailsRef: GetLocationDetailsRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getLocationDetails(dc: DataConnect, vars: GetLocationDetailsVariables, options?: ExecuteQueryOptions): QueryPromise<GetLocationDetailsData, GetLocationDetailsVariables>;

interface GetLocationDetailsRef {
  ...
  (dc: DataConnect, vars: GetLocationDetailsVariables): QueryRef<GetLocationDetailsData, GetLocationDetailsVariables>;
}
export const getLocationDetailsRef: GetLocationDetailsRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getLocationDetailsRef:
```typescript
const name = getLocationDetailsRef.operationName;
console.log(name);
```

### Variables
The `GetLocationDetails` query requires an argument of type `GetLocationDetailsVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetLocationDetailsVariables {
  locationId: string;
}
```
### Return Type
Recall that executing the `GetLocationDetails` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetLocationDetailsData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
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
```
### Using `GetLocationDetails`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getLocationDetails, GetLocationDetailsVariables } from '@infinity-quest/dataconnect';

// The `GetLocationDetails` query requires an argument of type `GetLocationDetailsVariables`:
const getLocationDetailsVars: GetLocationDetailsVariables = {
  locationId: ..., 
};

// Call the `getLocationDetails()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getLocationDetails(getLocationDetailsVars);
// Variables can be defined inline as well.
const { data } = await getLocationDetails({ locationId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getLocationDetails(dataConnect, getLocationDetailsVars);

console.log(data.location);

// Or, you can use the `Promise` API.
getLocationDetails(getLocationDetailsVars).then((response) => {
  const data = response.data;
  console.log(data.location);
});
```

### Using `GetLocationDetails`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getLocationDetailsRef, GetLocationDetailsVariables } from '@infinity-quest/dataconnect';

// The `GetLocationDetails` query requires an argument of type `GetLocationDetailsVariables`:
const getLocationDetailsVars: GetLocationDetailsVariables = {
  locationId: ..., 
};

// Call the `getLocationDetailsRef()` function to get a reference to the query.
const ref = getLocationDetailsRef(getLocationDetailsVars);
// Variables can be defined inline as well.
const ref = getLocationDetailsRef({ locationId: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getLocationDetailsRef(dataConnect, getLocationDetailsVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.location);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.location);
});
```

## GetLocationByName
You can execute the `GetLocationByName` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
getLocationByName(vars: GetLocationByNameVariables, options?: ExecuteQueryOptions): QueryPromise<GetLocationByNameData, GetLocationByNameVariables>;

interface GetLocationByNameRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetLocationByNameVariables): QueryRef<GetLocationByNameData, GetLocationByNameVariables>;
}
export const getLocationByNameRef: GetLocationByNameRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getLocationByName(dc: DataConnect, vars: GetLocationByNameVariables, options?: ExecuteQueryOptions): QueryPromise<GetLocationByNameData, GetLocationByNameVariables>;

interface GetLocationByNameRef {
  ...
  (dc: DataConnect, vars: GetLocationByNameVariables): QueryRef<GetLocationByNameData, GetLocationByNameVariables>;
}
export const getLocationByNameRef: GetLocationByNameRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getLocationByNameRef:
```typescript
const name = getLocationByNameRef.operationName;
console.log(name);
```

### Variables
The `GetLocationByName` query requires an argument of type `GetLocationByNameVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetLocationByNameVariables {
  name: string;
}
```
### Return Type
Recall that executing the `GetLocationByName` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetLocationByNameData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
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
```
### Using `GetLocationByName`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getLocationByName, GetLocationByNameVariables } from '@infinity-quest/dataconnect';

// The `GetLocationByName` query requires an argument of type `GetLocationByNameVariables`:
const getLocationByNameVars: GetLocationByNameVariables = {
  name: ..., 
};

// Call the `getLocationByName()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getLocationByName(getLocationByNameVars);
// Variables can be defined inline as well.
const { data } = await getLocationByName({ name: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getLocationByName(dataConnect, getLocationByNameVars);

console.log(data.locations);

// Or, you can use the `Promise` API.
getLocationByName(getLocationByNameVars).then((response) => {
  const data = response.data;
  console.log(data.locations);
});
```

### Using `GetLocationByName`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getLocationByNameRef, GetLocationByNameVariables } from '@infinity-quest/dataconnect';

// The `GetLocationByName` query requires an argument of type `GetLocationByNameVariables`:
const getLocationByNameVars: GetLocationByNameVariables = {
  name: ..., 
};

// Call the `getLocationByNameRef()` function to get a reference to the query.
const ref = getLocationByNameRef(getLocationByNameVars);
// Variables can be defined inline as well.
const ref = getLocationByNameRef({ name: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getLocationByNameRef(dataConnect, getLocationByNameVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.locations);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.locations);
});
```

## GetLocationPaths
You can execute the `GetLocationPaths` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
getLocationPaths(vars: GetLocationPathsVariables, options?: ExecuteQueryOptions): QueryPromise<GetLocationPathsData, GetLocationPathsVariables>;

interface GetLocationPathsRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetLocationPathsVariables): QueryRef<GetLocationPathsData, GetLocationPathsVariables>;
}
export const getLocationPathsRef: GetLocationPathsRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getLocationPaths(dc: DataConnect, vars: GetLocationPathsVariables, options?: ExecuteQueryOptions): QueryPromise<GetLocationPathsData, GetLocationPathsVariables>;

interface GetLocationPathsRef {
  ...
  (dc: DataConnect, vars: GetLocationPathsVariables): QueryRef<GetLocationPathsData, GetLocationPathsVariables>;
}
export const getLocationPathsRef: GetLocationPathsRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getLocationPathsRef:
```typescript
const name = getLocationPathsRef.operationName;
console.log(name);
```

### Variables
The `GetLocationPaths` query requires an argument of type `GetLocationPathsVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetLocationPathsVariables {
  locationId: string;
}
```
### Return Type
Recall that executing the `GetLocationPaths` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetLocationPathsData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
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
```
### Using `GetLocationPaths`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getLocationPaths, GetLocationPathsVariables } from '@infinity-quest/dataconnect';

// The `GetLocationPaths` query requires an argument of type `GetLocationPathsVariables`:
const getLocationPathsVars: GetLocationPathsVariables = {
  locationId: ..., 
};

// Call the `getLocationPaths()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getLocationPaths(getLocationPathsVars);
// Variables can be defined inline as well.
const { data } = await getLocationPaths({ locationId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getLocationPaths(dataConnect, getLocationPathsVars);

console.log(data.sourcePaths);
console.log(data.targetPaths);

// Or, you can use the `Promise` API.
getLocationPaths(getLocationPathsVars).then((response) => {
  const data = response.data;
  console.log(data.sourcePaths);
  console.log(data.targetPaths);
});
```

### Using `GetLocationPaths`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getLocationPathsRef, GetLocationPathsVariables } from '@infinity-quest/dataconnect';

// The `GetLocationPaths` query requires an argument of type `GetLocationPathsVariables`:
const getLocationPathsVars: GetLocationPathsVariables = {
  locationId: ..., 
};

// Call the `getLocationPathsRef()` function to get a reference to the query.
const ref = getLocationPathsRef(getLocationPathsVars);
// Variables can be defined inline as well.
const ref = getLocationPathsRef({ locationId: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getLocationPathsRef(dataConnect, getLocationPathsVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.sourcePaths);
console.log(data.targetPaths);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.sourcePaths);
  console.log(data.targetPaths);
});
```

## GetEstablishmentsForLocation
You can execute the `GetEstablishmentsForLocation` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
getEstablishmentsForLocation(vars: GetEstablishmentsForLocationVariables, options?: ExecuteQueryOptions): QueryPromise<GetEstablishmentsForLocationData, GetEstablishmentsForLocationVariables>;

interface GetEstablishmentsForLocationRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetEstablishmentsForLocationVariables): QueryRef<GetEstablishmentsForLocationData, GetEstablishmentsForLocationVariables>;
}
export const getEstablishmentsForLocationRef: GetEstablishmentsForLocationRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getEstablishmentsForLocation(dc: DataConnect, vars: GetEstablishmentsForLocationVariables, options?: ExecuteQueryOptions): QueryPromise<GetEstablishmentsForLocationData, GetEstablishmentsForLocationVariables>;

interface GetEstablishmentsForLocationRef {
  ...
  (dc: DataConnect, vars: GetEstablishmentsForLocationVariables): QueryRef<GetEstablishmentsForLocationData, GetEstablishmentsForLocationVariables>;
}
export const getEstablishmentsForLocationRef: GetEstablishmentsForLocationRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getEstablishmentsForLocationRef:
```typescript
const name = getEstablishmentsForLocationRef.operationName;
console.log(name);
```

### Variables
The `GetEstablishmentsForLocation` query requires an argument of type `GetEstablishmentsForLocationVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetEstablishmentsForLocationVariables {
  locationId: string;
}
```
### Return Type
Recall that executing the `GetEstablishmentsForLocation` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetEstablishmentsForLocationData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
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
```
### Using `GetEstablishmentsForLocation`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getEstablishmentsForLocation, GetEstablishmentsForLocationVariables } from '@infinity-quest/dataconnect';

// The `GetEstablishmentsForLocation` query requires an argument of type `GetEstablishmentsForLocationVariables`:
const getEstablishmentsForLocationVars: GetEstablishmentsForLocationVariables = {
  locationId: ..., 
};

// Call the `getEstablishmentsForLocation()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getEstablishmentsForLocation(getEstablishmentsForLocationVars);
// Variables can be defined inline as well.
const { data } = await getEstablishmentsForLocation({ locationId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getEstablishmentsForLocation(dataConnect, getEstablishmentsForLocationVars);

console.log(data.establishments);

// Or, you can use the `Promise` API.
getEstablishmentsForLocation(getEstablishmentsForLocationVars).then((response) => {
  const data = response.data;
  console.log(data.establishments);
});
```

### Using `GetEstablishmentsForLocation`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getEstablishmentsForLocationRef, GetEstablishmentsForLocationVariables } from '@infinity-quest/dataconnect';

// The `GetEstablishmentsForLocation` query requires an argument of type `GetEstablishmentsForLocationVariables`:
const getEstablishmentsForLocationVars: GetEstablishmentsForLocationVariables = {
  locationId: ..., 
};

// Call the `getEstablishmentsForLocationRef()` function to get a reference to the query.
const ref = getEstablishmentsForLocationRef(getEstablishmentsForLocationVars);
// Variables can be defined inline as well.
const ref = getEstablishmentsForLocationRef({ locationId: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getEstablishmentsForLocationRef(dataConnect, getEstablishmentsForLocationVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.establishments);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.establishments);
});
```

## searchCampaignLore
You can execute the `searchCampaignLore` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
searchCampaignLore(vars: SearchCampaignLoreVariables, options?: ExecuteQueryOptions): QueryPromise<SearchCampaignLoreData, SearchCampaignLoreVariables>;

interface SearchCampaignLoreRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: SearchCampaignLoreVariables): QueryRef<SearchCampaignLoreData, SearchCampaignLoreVariables>;
}
export const searchCampaignLoreRef: SearchCampaignLoreRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
searchCampaignLore(dc: DataConnect, vars: SearchCampaignLoreVariables, options?: ExecuteQueryOptions): QueryPromise<SearchCampaignLoreData, SearchCampaignLoreVariables>;

interface SearchCampaignLoreRef {
  ...
  (dc: DataConnect, vars: SearchCampaignLoreVariables): QueryRef<SearchCampaignLoreData, SearchCampaignLoreVariables>;
}
export const searchCampaignLoreRef: SearchCampaignLoreRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the searchCampaignLoreRef:
```typescript
const name = searchCampaignLoreRef.operationName;
console.log(name);
```

### Variables
The `searchCampaignLore` query requires an argument of type `SearchCampaignLoreVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface SearchCampaignLoreVariables {
  query: string;
}
```
### Return Type
Recall that executing the `searchCampaignLore` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `SearchCampaignLoreData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface SearchCampaignLoreData {
  campaignLores_embedding_similarity: ({
    id: UUIDString;
    content: string;
    metadata?: unknown | null;
  } & CampaignLore_Key)[];
}
```
### Using `searchCampaignLore`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, searchCampaignLore, SearchCampaignLoreVariables } from '@infinity-quest/dataconnect';

// The `searchCampaignLore` query requires an argument of type `SearchCampaignLoreVariables`:
const searchCampaignLoreVars: SearchCampaignLoreVariables = {
  query: ..., 
};

// Call the `searchCampaignLore()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await searchCampaignLore(searchCampaignLoreVars);
// Variables can be defined inline as well.
const { data } = await searchCampaignLore({ query: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await searchCampaignLore(dataConnect, searchCampaignLoreVars);

console.log(data.campaignLores_embedding_similarity);

// Or, you can use the `Promise` API.
searchCampaignLore(searchCampaignLoreVars).then((response) => {
  const data = response.data;
  console.log(data.campaignLores_embedding_similarity);
});
```

### Using `searchCampaignLore`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, searchCampaignLoreRef, SearchCampaignLoreVariables } from '@infinity-quest/dataconnect';

// The `searchCampaignLore` query requires an argument of type `SearchCampaignLoreVariables`:
const searchCampaignLoreVars: SearchCampaignLoreVariables = {
  query: ..., 
};

// Call the `searchCampaignLoreRef()` function to get a reference to the query.
const ref = searchCampaignLoreRef(searchCampaignLoreVars);
// Variables can be defined inline as well.
const ref = searchCampaignLoreRef({ query: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = searchCampaignLoreRef(dataConnect, searchCampaignLoreVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.campaignLores_embedding_similarity);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.campaignLores_embedding_similarity);
});
```

# Mutations

There are two ways to execute a Data Connect Mutation using the generated Web SDK:
- Using a Mutation Reference function, which returns a `MutationRef`
  - The `MutationRef` can be used as an argument to `executeMutation()`, which will execute the Mutation and return a `MutationPromise`
- Using an action shortcut function, which returns a `MutationPromise`
  - Calling the action shortcut function will execute the Mutation and return a `MutationPromise`

The following is true for both the action shortcut function and the `MutationRef` function:
- The `MutationPromise` returned will resolve to the result of the Mutation once it has finished executing
- If the Mutation accepts arguments, both the action shortcut function and the `MutationRef` function accept a single argument: an object that contains all the required variables (and the optional variables) for the Mutation
- Both functions can be called with or without passing in a `DataConnect` instance as an argument. If no `DataConnect` argument is passed in, then the generated SDK will call `getDataConnect(connectorConfig)` behind the scenes for you.

Below are examples of how to use the `default` connector's generated functions to execute each mutation. You can also follow the examples from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#using-mutations).

## createSectorDryDock
You can execute the `createSectorDryDock` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
createSectorDryDock(): MutationPromise<CreateSectorDryDockData, undefined>;

interface CreateSectorDryDockRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): MutationRef<CreateSectorDryDockData, undefined>;
}
export const createSectorDryDockRef: CreateSectorDryDockRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createSectorDryDock(dc: DataConnect): MutationPromise<CreateSectorDryDockData, undefined>;

interface CreateSectorDryDockRef {
  ...
  (dc: DataConnect): MutationRef<CreateSectorDryDockData, undefined>;
}
export const createSectorDryDockRef: CreateSectorDryDockRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createSectorDryDockRef:
```typescript
const name = createSectorDryDockRef.operationName;
console.log(name);
```

### Variables
The `createSectorDryDock` mutation has no variables.
### Return Type
Recall that executing the `createSectorDryDock` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateSectorDryDockData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateSectorDryDockData {
  sector_insert: Sector_Key;
}
```
### Using `createSectorDryDock`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createSectorDryDock } from '@infinity-quest/dataconnect';


// Call the `createSectorDryDock()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createSectorDryDock();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createSectorDryDock(dataConnect);

console.log(data.sector_insert);

// Or, you can use the `Promise` API.
createSectorDryDock().then((response) => {
  const data = response.data;
  console.log(data.sector_insert);
});
```

### Using `createSectorDryDock`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createSectorDryDockRef } from '@infinity-quest/dataconnect';


// Call the `createSectorDryDockRef()` function to get a reference to the mutation.
const ref = createSectorDryDockRef();

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createSectorDryDockRef(dataConnect);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.sector_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.sector_insert);
});
```

## createDryDockLocations
You can execute the `createDryDockLocations` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
createDryDockLocations(): MutationPromise<CreateDryDockLocationsData, undefined>;

interface CreateDryDockLocationsRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): MutationRef<CreateDryDockLocationsData, undefined>;
}
export const createDryDockLocationsRef: CreateDryDockLocationsRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createDryDockLocations(dc: DataConnect): MutationPromise<CreateDryDockLocationsData, undefined>;

interface CreateDryDockLocationsRef {
  ...
  (dc: DataConnect): MutationRef<CreateDryDockLocationsData, undefined>;
}
export const createDryDockLocationsRef: CreateDryDockLocationsRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createDryDockLocationsRef:
```typescript
const name = createDryDockLocationsRef.operationName;
console.log(name);
```

### Variables
The `createDryDockLocations` mutation has no variables.
### Return Type
Recall that executing the `createDryDockLocations` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateDryDockLocationsData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateDryDockLocationsData {
  location_insertMany: Location_Key[];
}
```
### Using `createDryDockLocations`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createDryDockLocations } from '@infinity-quest/dataconnect';


// Call the `createDryDockLocations()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createDryDockLocations();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createDryDockLocations(dataConnect);

console.log(data.location_insertMany);

// Or, you can use the `Promise` API.
createDryDockLocations().then((response) => {
  const data = response.data;
  console.log(data.location_insertMany);
});
```

### Using `createDryDockLocations`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createDryDockLocationsRef } from '@infinity-quest/dataconnect';


// Call the `createDryDockLocationsRef()` function to get a reference to the mutation.
const ref = createDryDockLocationsRef();

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createDryDockLocationsRef(dataConnect);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.location_insertMany);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.location_insertMany);
});
```

## createSectorStellarBurn
You can execute the `createSectorStellarBurn` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
createSectorStellarBurn(): MutationPromise<CreateSectorStellarBurnData, undefined>;

interface CreateSectorStellarBurnRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): MutationRef<CreateSectorStellarBurnData, undefined>;
}
export const createSectorStellarBurnRef: CreateSectorStellarBurnRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createSectorStellarBurn(dc: DataConnect): MutationPromise<CreateSectorStellarBurnData, undefined>;

interface CreateSectorStellarBurnRef {
  ...
  (dc: DataConnect): MutationRef<CreateSectorStellarBurnData, undefined>;
}
export const createSectorStellarBurnRef: CreateSectorStellarBurnRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createSectorStellarBurnRef:
```typescript
const name = createSectorStellarBurnRef.operationName;
console.log(name);
```

### Variables
The `createSectorStellarBurn` mutation has no variables.
### Return Type
Recall that executing the `createSectorStellarBurn` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateSectorStellarBurnData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateSectorStellarBurnData {
  sector_insert: Sector_Key;
}
```
### Using `createSectorStellarBurn`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createSectorStellarBurn } from '@infinity-quest/dataconnect';


// Call the `createSectorStellarBurn()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createSectorStellarBurn();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createSectorStellarBurn(dataConnect);

console.log(data.sector_insert);

// Or, you can use the `Promise` API.
createSectorStellarBurn().then((response) => {
  const data = response.data;
  console.log(data.sector_insert);
});
```

### Using `createSectorStellarBurn`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createSectorStellarBurnRef } from '@infinity-quest/dataconnect';


// Call the `createSectorStellarBurnRef()` function to get a reference to the mutation.
const ref = createSectorStellarBurnRef();

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createSectorStellarBurnRef(dataConnect);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.sector_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.sector_insert);
});
```

## createStellarBurnLocations
You can execute the `createStellarBurnLocations` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
createStellarBurnLocations(): MutationPromise<CreateStellarBurnLocationsData, undefined>;

interface CreateStellarBurnLocationsRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): MutationRef<CreateStellarBurnLocationsData, undefined>;
}
export const createStellarBurnLocationsRef: CreateStellarBurnLocationsRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createStellarBurnLocations(dc: DataConnect): MutationPromise<CreateStellarBurnLocationsData, undefined>;

interface CreateStellarBurnLocationsRef {
  ...
  (dc: DataConnect): MutationRef<CreateStellarBurnLocationsData, undefined>;
}
export const createStellarBurnLocationsRef: CreateStellarBurnLocationsRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createStellarBurnLocationsRef:
```typescript
const name = createStellarBurnLocationsRef.operationName;
console.log(name);
```

### Variables
The `createStellarBurnLocations` mutation has no variables.
### Return Type
Recall that executing the `createStellarBurnLocations` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateStellarBurnLocationsData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateStellarBurnLocationsData {
  location_insertMany: Location_Key[];
}
```
### Using `createStellarBurnLocations`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createStellarBurnLocations } from '@infinity-quest/dataconnect';


// Call the `createStellarBurnLocations()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createStellarBurnLocations();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createStellarBurnLocations(dataConnect);

console.log(data.location_insertMany);

// Or, you can use the `Promise` API.
createStellarBurnLocations().then((response) => {
  const data = response.data;
  console.log(data.location_insertMany);
});
```

### Using `createStellarBurnLocations`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createStellarBurnLocationsRef } from '@infinity-quest/dataconnect';


// Call the `createStellarBurnLocationsRef()` function to get a reference to the mutation.
const ref = createStellarBurnLocationsRef();

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createStellarBurnLocationsRef(dataConnect);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.location_insertMany);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.location_insertMany);
});
```

## createSectorChopShop
You can execute the `createSectorChopShop` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
createSectorChopShop(): MutationPromise<CreateSectorChopShopData, undefined>;

interface CreateSectorChopShopRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): MutationRef<CreateSectorChopShopData, undefined>;
}
export const createSectorChopShopRef: CreateSectorChopShopRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createSectorChopShop(dc: DataConnect): MutationPromise<CreateSectorChopShopData, undefined>;

interface CreateSectorChopShopRef {
  ...
  (dc: DataConnect): MutationRef<CreateSectorChopShopData, undefined>;
}
export const createSectorChopShopRef: CreateSectorChopShopRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createSectorChopShopRef:
```typescript
const name = createSectorChopShopRef.operationName;
console.log(name);
```

### Variables
The `createSectorChopShop` mutation has no variables.
### Return Type
Recall that executing the `createSectorChopShop` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateSectorChopShopData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateSectorChopShopData {
  sector_insert: Sector_Key;
}
```
### Using `createSectorChopShop`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createSectorChopShop } from '@infinity-quest/dataconnect';


// Call the `createSectorChopShop()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createSectorChopShop();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createSectorChopShop(dataConnect);

console.log(data.sector_insert);

// Or, you can use the `Promise` API.
createSectorChopShop().then((response) => {
  const data = response.data;
  console.log(data.sector_insert);
});
```

### Using `createSectorChopShop`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createSectorChopShopRef } from '@infinity-quest/dataconnect';


// Call the `createSectorChopShopRef()` function to get a reference to the mutation.
const ref = createSectorChopShopRef();

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createSectorChopShopRef(dataConnect);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.sector_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.sector_insert);
});
```

## createChopShopLocations
You can execute the `createChopShopLocations` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
createChopShopLocations(): MutationPromise<CreateChopShopLocationsData, undefined>;

interface CreateChopShopLocationsRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): MutationRef<CreateChopShopLocationsData, undefined>;
}
export const createChopShopLocationsRef: CreateChopShopLocationsRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createChopShopLocations(dc: DataConnect): MutationPromise<CreateChopShopLocationsData, undefined>;

interface CreateChopShopLocationsRef {
  ...
  (dc: DataConnect): MutationRef<CreateChopShopLocationsData, undefined>;
}
export const createChopShopLocationsRef: CreateChopShopLocationsRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createChopShopLocationsRef:
```typescript
const name = createChopShopLocationsRef.operationName;
console.log(name);
```

### Variables
The `createChopShopLocations` mutation has no variables.
### Return Type
Recall that executing the `createChopShopLocations` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateChopShopLocationsData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateChopShopLocationsData {
  location_insertMany: Location_Key[];
}
```
### Using `createChopShopLocations`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createChopShopLocations } from '@infinity-quest/dataconnect';


// Call the `createChopShopLocations()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createChopShopLocations();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createChopShopLocations(dataConnect);

console.log(data.location_insertMany);

// Or, you can use the `Promise` API.
createChopShopLocations().then((response) => {
  const data = response.data;
  console.log(data.location_insertMany);
});
```

### Using `createChopShopLocations`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createChopShopLocationsRef } from '@infinity-quest/dataconnect';


// Call the `createChopShopLocationsRef()` function to get a reference to the mutation.
const ref = createChopShopLocationsRef();

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createChopShopLocationsRef(dataConnect);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.location_insertMany);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.location_insertMany);
});
```

## createSectorIceBox
You can execute the `createSectorIceBox` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
createSectorIceBox(): MutationPromise<CreateSectorIceBoxData, undefined>;

interface CreateSectorIceBoxRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): MutationRef<CreateSectorIceBoxData, undefined>;
}
export const createSectorIceBoxRef: CreateSectorIceBoxRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createSectorIceBox(dc: DataConnect): MutationPromise<CreateSectorIceBoxData, undefined>;

interface CreateSectorIceBoxRef {
  ...
  (dc: DataConnect): MutationRef<CreateSectorIceBoxData, undefined>;
}
export const createSectorIceBoxRef: CreateSectorIceBoxRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createSectorIceBoxRef:
```typescript
const name = createSectorIceBoxRef.operationName;
console.log(name);
```

### Variables
The `createSectorIceBox` mutation has no variables.
### Return Type
Recall that executing the `createSectorIceBox` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateSectorIceBoxData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateSectorIceBoxData {
  sector_insert: Sector_Key;
}
```
### Using `createSectorIceBox`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createSectorIceBox } from '@infinity-quest/dataconnect';


// Call the `createSectorIceBox()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createSectorIceBox();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createSectorIceBox(dataConnect);

console.log(data.sector_insert);

// Or, you can use the `Promise` API.
createSectorIceBox().then((response) => {
  const data = response.data;
  console.log(data.sector_insert);
});
```

### Using `createSectorIceBox`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createSectorIceBoxRef } from '@infinity-quest/dataconnect';


// Call the `createSectorIceBoxRef()` function to get a reference to the mutation.
const ref = createSectorIceBoxRef();

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createSectorIceBoxRef(dataConnect);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.sector_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.sector_insert);
});
```

## createIceBoxLocations
You can execute the `createIceBoxLocations` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
createIceBoxLocations(): MutationPromise<CreateIceBoxLocationsData, undefined>;

interface CreateIceBoxLocationsRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): MutationRef<CreateIceBoxLocationsData, undefined>;
}
export const createIceBoxLocationsRef: CreateIceBoxLocationsRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createIceBoxLocations(dc: DataConnect): MutationPromise<CreateIceBoxLocationsData, undefined>;

interface CreateIceBoxLocationsRef {
  ...
  (dc: DataConnect): MutationRef<CreateIceBoxLocationsData, undefined>;
}
export const createIceBoxLocationsRef: CreateIceBoxLocationsRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createIceBoxLocationsRef:
```typescript
const name = createIceBoxLocationsRef.operationName;
console.log(name);
```

### Variables
The `createIceBoxLocations` mutation has no variables.
### Return Type
Recall that executing the `createIceBoxLocations` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateIceBoxLocationsData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateIceBoxLocationsData {
  location_insertMany: Location_Key[];
}
```
### Using `createIceBoxLocations`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createIceBoxLocations } from '@infinity-quest/dataconnect';


// Call the `createIceBoxLocations()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createIceBoxLocations();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createIceBoxLocations(dataConnect);

console.log(data.location_insertMany);

// Or, you can use the `Promise` API.
createIceBoxLocations().then((response) => {
  const data = response.data;
  console.log(data.location_insertMany);
});
```

### Using `createIceBoxLocations`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createIceBoxLocationsRef } from '@infinity-quest/dataconnect';


// Call the `createIceBoxLocationsRef()` function to get a reference to the mutation.
const ref = createIceBoxLocationsRef();

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createIceBoxLocationsRef(dataConnect);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.location_insertMany);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.location_insertMany);
});
```

## createSectorFarm
You can execute the `createSectorFarm` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
createSectorFarm(): MutationPromise<CreateSectorFarmData, undefined>;

interface CreateSectorFarmRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): MutationRef<CreateSectorFarmData, undefined>;
}
export const createSectorFarmRef: CreateSectorFarmRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createSectorFarm(dc: DataConnect): MutationPromise<CreateSectorFarmData, undefined>;

interface CreateSectorFarmRef {
  ...
  (dc: DataConnect): MutationRef<CreateSectorFarmData, undefined>;
}
export const createSectorFarmRef: CreateSectorFarmRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createSectorFarmRef:
```typescript
const name = createSectorFarmRef.operationName;
console.log(name);
```

### Variables
The `createSectorFarm` mutation has no variables.
### Return Type
Recall that executing the `createSectorFarm` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateSectorFarmData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateSectorFarmData {
  sector_insert: Sector_Key;
}
```
### Using `createSectorFarm`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createSectorFarm } from '@infinity-quest/dataconnect';


// Call the `createSectorFarm()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createSectorFarm();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createSectorFarm(dataConnect);

console.log(data.sector_insert);

// Or, you can use the `Promise` API.
createSectorFarm().then((response) => {
  const data = response.data;
  console.log(data.sector_insert);
});
```

### Using `createSectorFarm`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createSectorFarmRef } from '@infinity-quest/dataconnect';


// Call the `createSectorFarmRef()` function to get a reference to the mutation.
const ref = createSectorFarmRef();

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createSectorFarmRef(dataConnect);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.sector_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.sector_insert);
});
```

## createFarmLocations
You can execute the `createFarmLocations` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
createFarmLocations(): MutationPromise<CreateFarmLocationsData, undefined>;

interface CreateFarmLocationsRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): MutationRef<CreateFarmLocationsData, undefined>;
}
export const createFarmLocationsRef: CreateFarmLocationsRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createFarmLocations(dc: DataConnect): MutationPromise<CreateFarmLocationsData, undefined>;

interface CreateFarmLocationsRef {
  ...
  (dc: DataConnect): MutationRef<CreateFarmLocationsData, undefined>;
}
export const createFarmLocationsRef: CreateFarmLocationsRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createFarmLocationsRef:
```typescript
const name = createFarmLocationsRef.operationName;
console.log(name);
```

### Variables
The `createFarmLocations` mutation has no variables.
### Return Type
Recall that executing the `createFarmLocations` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateFarmLocationsData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateFarmLocationsData {
  location_insertMany: Location_Key[];
}
```
### Using `createFarmLocations`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createFarmLocations } from '@infinity-quest/dataconnect';


// Call the `createFarmLocations()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createFarmLocations();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createFarmLocations(dataConnect);

console.log(data.location_insertMany);

// Or, you can use the `Promise` API.
createFarmLocations().then((response) => {
  const data = response.data;
  console.log(data.location_insertMany);
});
```

### Using `createFarmLocations`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createFarmLocationsRef } from '@infinity-quest/dataconnect';


// Call the `createFarmLocationsRef()` function to get a reference to the mutation.
const ref = createFarmLocationsRef();

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createFarmLocationsRef(dataConnect);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.location_insertMany);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.location_insertMany);
});
```

## createSectorCanyonheavy
You can execute the `createSectorCanyonheavy` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
createSectorCanyonheavy(): MutationPromise<CreateSectorCanyonheavyData, undefined>;

interface CreateSectorCanyonheavyRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): MutationRef<CreateSectorCanyonheavyData, undefined>;
}
export const createSectorCanyonheavyRef: CreateSectorCanyonheavyRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createSectorCanyonheavy(dc: DataConnect): MutationPromise<CreateSectorCanyonheavyData, undefined>;

interface CreateSectorCanyonheavyRef {
  ...
  (dc: DataConnect): MutationRef<CreateSectorCanyonheavyData, undefined>;
}
export const createSectorCanyonheavyRef: CreateSectorCanyonheavyRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createSectorCanyonheavyRef:
```typescript
const name = createSectorCanyonheavyRef.operationName;
console.log(name);
```

### Variables
The `createSectorCanyonheavy` mutation has no variables.
### Return Type
Recall that executing the `createSectorCanyonheavy` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateSectorCanyonheavyData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateSectorCanyonheavyData {
  sector_insert: Sector_Key;
}
```
### Using `createSectorCanyonheavy`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createSectorCanyonheavy } from '@infinity-quest/dataconnect';


// Call the `createSectorCanyonheavy()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createSectorCanyonheavy();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createSectorCanyonheavy(dataConnect);

console.log(data.sector_insert);

// Or, you can use the `Promise` API.
createSectorCanyonheavy().then((response) => {
  const data = response.data;
  console.log(data.sector_insert);
});
```

### Using `createSectorCanyonheavy`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createSectorCanyonheavyRef } from '@infinity-quest/dataconnect';


// Call the `createSectorCanyonheavyRef()` function to get a reference to the mutation.
const ref = createSectorCanyonheavyRef();

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createSectorCanyonheavyRef(dataConnect);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.sector_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.sector_insert);
});
```

## createCanyonheavyLocations
You can execute the `createCanyonheavyLocations` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
createCanyonheavyLocations(): MutationPromise<CreateCanyonheavyLocationsData, undefined>;

interface CreateCanyonheavyLocationsRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): MutationRef<CreateCanyonheavyLocationsData, undefined>;
}
export const createCanyonheavyLocationsRef: CreateCanyonheavyLocationsRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createCanyonheavyLocations(dc: DataConnect): MutationPromise<CreateCanyonheavyLocationsData, undefined>;

interface CreateCanyonheavyLocationsRef {
  ...
  (dc: DataConnect): MutationRef<CreateCanyonheavyLocationsData, undefined>;
}
export const createCanyonheavyLocationsRef: CreateCanyonheavyLocationsRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createCanyonheavyLocationsRef:
```typescript
const name = createCanyonheavyLocationsRef.operationName;
console.log(name);
```

### Variables
The `createCanyonheavyLocations` mutation has no variables.
### Return Type
Recall that executing the `createCanyonheavyLocations` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateCanyonheavyLocationsData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateCanyonheavyLocationsData {
  location_insertMany: Location_Key[];
}
```
### Using `createCanyonheavyLocations`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createCanyonheavyLocations } from '@infinity-quest/dataconnect';


// Call the `createCanyonheavyLocations()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createCanyonheavyLocations();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createCanyonheavyLocations(dataConnect);

console.log(data.location_insertMany);

// Or, you can use the `Promise` API.
createCanyonheavyLocations().then((response) => {
  const data = response.data;
  console.log(data.location_insertMany);
});
```

### Using `createCanyonheavyLocations`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createCanyonheavyLocationsRef } from '@infinity-quest/dataconnect';


// Call the `createCanyonheavyLocationsRef()` function to get a reference to the mutation.
const ref = createCanyonheavyLocationsRef();

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createCanyonheavyLocationsRef(dataConnect);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.location_insertMany);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.location_insertMany);
});
```

## createSectorCourt
You can execute the `createSectorCourt` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
createSectorCourt(): MutationPromise<CreateSectorCourtData, undefined>;

interface CreateSectorCourtRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): MutationRef<CreateSectorCourtData, undefined>;
}
export const createSectorCourtRef: CreateSectorCourtRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createSectorCourt(dc: DataConnect): MutationPromise<CreateSectorCourtData, undefined>;

interface CreateSectorCourtRef {
  ...
  (dc: DataConnect): MutationRef<CreateSectorCourtData, undefined>;
}
export const createSectorCourtRef: CreateSectorCourtRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createSectorCourtRef:
```typescript
const name = createSectorCourtRef.operationName;
console.log(name);
```

### Variables
The `createSectorCourt` mutation has no variables.
### Return Type
Recall that executing the `createSectorCourt` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateSectorCourtData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateSectorCourtData {
  sector_insert: Sector_Key;
}
```
### Using `createSectorCourt`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createSectorCourt } from '@infinity-quest/dataconnect';


// Call the `createSectorCourt()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createSectorCourt();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createSectorCourt(dataConnect);

console.log(data.sector_insert);

// Or, you can use the `Promise` API.
createSectorCourt().then((response) => {
  const data = response.data;
  console.log(data.sector_insert);
});
```

### Using `createSectorCourt`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createSectorCourtRef } from '@infinity-quest/dataconnect';


// Call the `createSectorCourtRef()` function to get a reference to the mutation.
const ref = createSectorCourtRef();

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createSectorCourtRef(dataConnect);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.sector_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.sector_insert);
});
```

## createCourtLocations
You can execute the `createCourtLocations` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
createCourtLocations(): MutationPromise<CreateCourtLocationsData, undefined>;

interface CreateCourtLocationsRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): MutationRef<CreateCourtLocationsData, undefined>;
}
export const createCourtLocationsRef: CreateCourtLocationsRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createCourtLocations(dc: DataConnect): MutationPromise<CreateCourtLocationsData, undefined>;

interface CreateCourtLocationsRef {
  ...
  (dc: DataConnect): MutationRef<CreateCourtLocationsData, undefined>;
}
export const createCourtLocationsRef: CreateCourtLocationsRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createCourtLocationsRef:
```typescript
const name = createCourtLocationsRef.operationName;
console.log(name);
```

### Variables
The `createCourtLocations` mutation has no variables.
### Return Type
Recall that executing the `createCourtLocations` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateCourtLocationsData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateCourtLocationsData {
  location_insertMany: Location_Key[];
}
```
### Using `createCourtLocations`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createCourtLocations } from '@infinity-quest/dataconnect';


// Call the `createCourtLocations()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createCourtLocations();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createCourtLocations(dataConnect);

console.log(data.location_insertMany);

// Or, you can use the `Promise` API.
createCourtLocations().then((response) => {
  const data = response.data;
  console.log(data.location_insertMany);
});
```

### Using `createCourtLocations`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createCourtLocationsRef } from '@infinity-quest/dataconnect';


// Call the `createCourtLocationsRef()` function to get a reference to the mutation.
const ref = createCourtLocationsRef();

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createCourtLocationsRef(dataConnect);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.location_insertMany);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.location_insertMany);
});
```

## createSectorTempestHQ
You can execute the `createSectorTempestHQ` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
createSectorTempestHq(): MutationPromise<CreateSectorTempestHqData, undefined>;

interface CreateSectorTempestHqRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): MutationRef<CreateSectorTempestHqData, undefined>;
}
export const createSectorTempestHqRef: CreateSectorTempestHqRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createSectorTempestHq(dc: DataConnect): MutationPromise<CreateSectorTempestHqData, undefined>;

interface CreateSectorTempestHqRef {
  ...
  (dc: DataConnect): MutationRef<CreateSectorTempestHqData, undefined>;
}
export const createSectorTempestHqRef: CreateSectorTempestHqRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createSectorTempestHqRef:
```typescript
const name = createSectorTempestHqRef.operationName;
console.log(name);
```

### Variables
The `createSectorTempestHQ` mutation has no variables.
### Return Type
Recall that executing the `createSectorTempestHQ` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateSectorTempestHqData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateSectorTempestHqData {
  sector_insert: Sector_Key;
}
```
### Using `createSectorTempestHQ`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createSectorTempestHq } from '@infinity-quest/dataconnect';


// Call the `createSectorTempestHq()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createSectorTempestHq();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createSectorTempestHq(dataConnect);

console.log(data.sector_insert);

// Or, you can use the `Promise` API.
createSectorTempestHq().then((response) => {
  const data = response.data;
  console.log(data.sector_insert);
});
```

### Using `createSectorTempestHQ`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createSectorTempestHqRef } from '@infinity-quest/dataconnect';


// Call the `createSectorTempestHqRef()` function to get a reference to the mutation.
const ref = createSectorTempestHqRef();

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createSectorTempestHqRef(dataConnect);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.sector_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.sector_insert);
});
```

## createTempestHQLocations
You can execute the `createTempestHQLocations` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
createTempestHqLocations(): MutationPromise<CreateTempestHqLocationsData, undefined>;

interface CreateTempestHqLocationsRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): MutationRef<CreateTempestHqLocationsData, undefined>;
}
export const createTempestHqLocationsRef: CreateTempestHqLocationsRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createTempestHqLocations(dc: DataConnect): MutationPromise<CreateTempestHqLocationsData, undefined>;

interface CreateTempestHqLocationsRef {
  ...
  (dc: DataConnect): MutationRef<CreateTempestHqLocationsData, undefined>;
}
export const createTempestHqLocationsRef: CreateTempestHqLocationsRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createTempestHqLocationsRef:
```typescript
const name = createTempestHqLocationsRef.operationName;
console.log(name);
```

### Variables
The `createTempestHQLocations` mutation has no variables.
### Return Type
Recall that executing the `createTempestHQLocations` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateTempestHqLocationsData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateTempestHqLocationsData {
  location_insertMany: Location_Key[];
}
```
### Using `createTempestHQLocations`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createTempestHqLocations } from '@infinity-quest/dataconnect';


// Call the `createTempestHqLocations()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createTempestHqLocations();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createTempestHqLocations(dataConnect);

console.log(data.location_insertMany);

// Or, you can use the `Promise` API.
createTempestHqLocations().then((response) => {
  const data = response.data;
  console.log(data.location_insertMany);
});
```

### Using `createTempestHQLocations`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createTempestHqLocationsRef } from '@infinity-quest/dataconnect';


// Call the `createTempestHqLocationsRef()` function to get a reference to the mutation.
const ref = createTempestHqLocationsRef();

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createTempestHqLocationsRef(dataConnect);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.location_insertMany);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.location_insertMany);
});
```

## createSectorDoptown
You can execute the `createSectorDoptown` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
createSectorDoptown(): MutationPromise<CreateSectorDoptownData, undefined>;

interface CreateSectorDoptownRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): MutationRef<CreateSectorDoptownData, undefined>;
}
export const createSectorDoptownRef: CreateSectorDoptownRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createSectorDoptown(dc: DataConnect): MutationPromise<CreateSectorDoptownData, undefined>;

interface CreateSectorDoptownRef {
  ...
  (dc: DataConnect): MutationRef<CreateSectorDoptownData, undefined>;
}
export const createSectorDoptownRef: CreateSectorDoptownRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createSectorDoptownRef:
```typescript
const name = createSectorDoptownRef.operationName;
console.log(name);
```

### Variables
The `createSectorDoptown` mutation has no variables.
### Return Type
Recall that executing the `createSectorDoptown` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateSectorDoptownData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateSectorDoptownData {
  sector_insert: Sector_Key;
}
```
### Using `createSectorDoptown`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createSectorDoptown } from '@infinity-quest/dataconnect';


// Call the `createSectorDoptown()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createSectorDoptown();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createSectorDoptown(dataConnect);

console.log(data.sector_insert);

// Or, you can use the `Promise` API.
createSectorDoptown().then((response) => {
  const data = response.data;
  console.log(data.sector_insert);
});
```

### Using `createSectorDoptown`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createSectorDoptownRef } from '@infinity-quest/dataconnect';


// Call the `createSectorDoptownRef()` function to get a reference to the mutation.
const ref = createSectorDoptownRef();

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createSectorDoptownRef(dataConnect);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.sector_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.sector_insert);
});
```

## createDoptownLocations
You can execute the `createDoptownLocations` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
createDoptownLocations(): MutationPromise<CreateDoptownLocationsData, undefined>;

interface CreateDoptownLocationsRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): MutationRef<CreateDoptownLocationsData, undefined>;
}
export const createDoptownLocationsRef: CreateDoptownLocationsRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createDoptownLocations(dc: DataConnect): MutationPromise<CreateDoptownLocationsData, undefined>;

interface CreateDoptownLocationsRef {
  ...
  (dc: DataConnect): MutationRef<CreateDoptownLocationsData, undefined>;
}
export const createDoptownLocationsRef: CreateDoptownLocationsRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createDoptownLocationsRef:
```typescript
const name = createDoptownLocationsRef.operationName;
console.log(name);
```

### Variables
The `createDoptownLocations` mutation has no variables.
### Return Type
Recall that executing the `createDoptownLocations` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateDoptownLocationsData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateDoptownLocationsData {
  location_insertMany: Location_Key[];
}
```
### Using `createDoptownLocations`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createDoptownLocations } from '@infinity-quest/dataconnect';


// Call the `createDoptownLocations()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createDoptownLocations();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createDoptownLocations(dataConnect);

console.log(data.location_insertMany);

// Or, you can use the `Promise` API.
createDoptownLocations().then((response) => {
  const data = response.data;
  console.log(data.location_insertMany);
});
```

### Using `createDoptownLocations`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createDoptownLocationsRef } from '@infinity-quest/dataconnect';


// Call the `createDoptownLocationsRef()` function to get a reference to the mutation.
const ref = createDoptownLocationsRef();

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createDoptownLocationsRef(dataConnect);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.location_insertMany);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.location_insertMany);
});
```

## createSectorChoke
You can execute the `createSectorChoke` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
createSectorChoke(): MutationPromise<CreateSectorChokeData, undefined>;

interface CreateSectorChokeRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): MutationRef<CreateSectorChokeData, undefined>;
}
export const createSectorChokeRef: CreateSectorChokeRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createSectorChoke(dc: DataConnect): MutationPromise<CreateSectorChokeData, undefined>;

interface CreateSectorChokeRef {
  ...
  (dc: DataConnect): MutationRef<CreateSectorChokeData, undefined>;
}
export const createSectorChokeRef: CreateSectorChokeRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createSectorChokeRef:
```typescript
const name = createSectorChokeRef.operationName;
console.log(name);
```

### Variables
The `createSectorChoke` mutation has no variables.
### Return Type
Recall that executing the `createSectorChoke` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateSectorChokeData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateSectorChokeData {
  sector_insert: Sector_Key;
}
```
### Using `createSectorChoke`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createSectorChoke } from '@infinity-quest/dataconnect';


// Call the `createSectorChoke()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createSectorChoke();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createSectorChoke(dataConnect);

console.log(data.sector_insert);

// Or, you can use the `Promise` API.
createSectorChoke().then((response) => {
  const data = response.data;
  console.log(data.sector_insert);
});
```

### Using `createSectorChoke`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createSectorChokeRef } from '@infinity-quest/dataconnect';


// Call the `createSectorChokeRef()` function to get a reference to the mutation.
const ref = createSectorChokeRef();

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createSectorChokeRef(dataConnect);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.sector_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.sector_insert);
});
```

## createChokeLocations
You can execute the `createChokeLocations` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
createChokeLocations(): MutationPromise<CreateChokeLocationsData, undefined>;

interface CreateChokeLocationsRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): MutationRef<CreateChokeLocationsData, undefined>;
}
export const createChokeLocationsRef: CreateChokeLocationsRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createChokeLocations(dc: DataConnect): MutationPromise<CreateChokeLocationsData, undefined>;

interface CreateChokeLocationsRef {
  ...
  (dc: DataConnect): MutationRef<CreateChokeLocationsData, undefined>;
}
export const createChokeLocationsRef: CreateChokeLocationsRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createChokeLocationsRef:
```typescript
const name = createChokeLocationsRef.operationName;
console.log(name);
```

### Variables
The `createChokeLocations` mutation has no variables.
### Return Type
Recall that executing the `createChokeLocations` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateChokeLocationsData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateChokeLocationsData {
  location_insertMany: Location_Key[];
}
```
### Using `createChokeLocations`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createChokeLocations } from '@infinity-quest/dataconnect';


// Call the `createChokeLocations()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createChokeLocations();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createChokeLocations(dataConnect);

console.log(data.location_insertMany);

// Or, you can use the `Promise` API.
createChokeLocations().then((response) => {
  const data = response.data;
  console.log(data.location_insertMany);
});
```

### Using `createChokeLocations`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createChokeLocationsRef } from '@infinity-quest/dataconnect';


// Call the `createChokeLocationsRef()` function to get a reference to the mutation.
const ref = createChokeLocationsRef();

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createChokeLocationsRef(dataConnect);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.location_insertMany);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.location_insertMany);
});
```

## insertCampaignLore
You can execute the `insertCampaignLore` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
insertCampaignLore(vars: InsertCampaignLoreVariables): MutationPromise<InsertCampaignLoreData, InsertCampaignLoreVariables>;

interface InsertCampaignLoreRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: InsertCampaignLoreVariables): MutationRef<InsertCampaignLoreData, InsertCampaignLoreVariables>;
}
export const insertCampaignLoreRef: InsertCampaignLoreRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
insertCampaignLore(dc: DataConnect, vars: InsertCampaignLoreVariables): MutationPromise<InsertCampaignLoreData, InsertCampaignLoreVariables>;

interface InsertCampaignLoreRef {
  ...
  (dc: DataConnect, vars: InsertCampaignLoreVariables): MutationRef<InsertCampaignLoreData, InsertCampaignLoreVariables>;
}
export const insertCampaignLoreRef: InsertCampaignLoreRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the insertCampaignLoreRef:
```typescript
const name = insertCampaignLoreRef.operationName;
console.log(name);
```

### Variables
The `insertCampaignLore` mutation requires an argument of type `InsertCampaignLoreVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface InsertCampaignLoreVariables {
  content: string;
  metadata?: unknown | null;
}
```
### Return Type
Recall that executing the `insertCampaignLore` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `InsertCampaignLoreData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface InsertCampaignLoreData {
  campaignLore_insert: CampaignLore_Key;
}
```
### Using `insertCampaignLore`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, insertCampaignLore, InsertCampaignLoreVariables } from '@infinity-quest/dataconnect';

// The `insertCampaignLore` mutation requires an argument of type `InsertCampaignLoreVariables`:
const insertCampaignLoreVars: InsertCampaignLoreVariables = {
  content: ..., 
  metadata: ..., // optional
};

// Call the `insertCampaignLore()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await insertCampaignLore(insertCampaignLoreVars);
// Variables can be defined inline as well.
const { data } = await insertCampaignLore({ content: ..., metadata: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await insertCampaignLore(dataConnect, insertCampaignLoreVars);

console.log(data.campaignLore_insert);

// Or, you can use the `Promise` API.
insertCampaignLore(insertCampaignLoreVars).then((response) => {
  const data = response.data;
  console.log(data.campaignLore_insert);
});
```

### Using `insertCampaignLore`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, insertCampaignLoreRef, InsertCampaignLoreVariables } from '@infinity-quest/dataconnect';

// The `insertCampaignLore` mutation requires an argument of type `InsertCampaignLoreVariables`:
const insertCampaignLoreVars: InsertCampaignLoreVariables = {
  content: ..., 
  metadata: ..., // optional
};

// Call the `insertCampaignLoreRef()` function to get a reference to the mutation.
const ref = insertCampaignLoreRef(insertCampaignLoreVars);
// Variables can be defined inline as well.
const ref = insertCampaignLoreRef({ content: ..., metadata: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = insertCampaignLoreRef(dataConnect, insertCampaignLoreVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.campaignLore_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.campaignLore_insert);
});
```

