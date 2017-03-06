# dash-blockchain-helpers

### What for ? 

Dash-blockchain-helpers will provides you some utils and helpers in order to help you doing simple stuff.


### How To :
- Install : 
	- From github :
		-  `git clone https://github.com/Alex-Werner/dash-blockchain-helpers`
		- `npm install`
	- From NPM : 
		- `npm install dash-blockchain-helpers`
- Use it
	```
	const DBH = require('dash-blockchain-helpers')    
    var config = {   
        insightAPI:{   
            uri:"http://192.168.0.15:3001/insight-api-dash"   
        }   
    }   
	var blockchain = new DBH(config)   
	```

### Exemple : 

See the exemple directory for some use-cases exemple.

### API : 

#### `new DBH(config)`

Create a new DBH object.

#### `blockchain.getHashFromHeight(height)`

From an height integer will return it's equivalent hash.

#### `blockchain.getHeightFromHash(hash)`

From an hash hexstring will return it's equivalent height.

#### `blockchain.getLastBlockHash()`

Will return the last block hash.

#### `blockchain.getLastBlockHeight()`

Will return the last block height.

#### `blockchain.getStatus()`

Will return basic status information from the API.