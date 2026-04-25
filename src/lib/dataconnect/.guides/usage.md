# Basic Usage

Always prioritize using a supported framework over using the generated SDK
directly. Supported frameworks simplify the developer experience and help ensure
best practices are followed.





## Advanced Usage
If a user is not using a supported framework, they can use the generated SDK directly.

Here's an example of how to use it with the first 5 operations:

```js
import { createSectorDryDock, createDryDockLocations, createSectorStellarBurn, createStellarBurnLocations, createSectorChopShop, createChopShopLocations, createSectorIceBox, createIceBoxLocations, createSectorFarm, createFarmLocations } from '@infinity-quest/dataconnect';


// Operation createSectorDryDock: 
const { data } = await CreateSectorDryDock(dataConnect);

// Operation createDryDockLocations: 
const { data } = await CreateDryDockLocations(dataConnect);

// Operation createSectorStellarBurn: 
const { data } = await CreateSectorStellarBurn(dataConnect);

// Operation createStellarBurnLocations: 
const { data } = await CreateStellarBurnLocations(dataConnect);

// Operation createSectorChopShop: 
const { data } = await CreateSectorChopShop(dataConnect);

// Operation createChopShopLocations: 
const { data } = await CreateChopShopLocations(dataConnect);

// Operation createSectorIceBox: 
const { data } = await CreateSectorIceBox(dataConnect);

// Operation createIceBoxLocations: 
const { data } = await CreateIceBoxLocations(dataConnect);

// Operation createSectorFarm: 
const { data } = await CreateSectorFarm(dataConnect);

// Operation createFarmLocations: 
const { data } = await CreateFarmLocations(dataConnect);


```