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
- Use it by adding to config objects either : 
	- insightAPI : 
		- uri
```
const DBH = require('dash-blockchain-helpers')    
var config = {   
    insightAPI:{   
        uri:"http://192.168.0.15:3001/insight-api-dash"   
    }
}   
var blockchain = new DBH(config)   
```
- or : 
	- dashRPC (require to have a dash node running as server mode): 
		- user : The RPC server username
		- password : The RPC server password
		- port : The RPC server port (default to 9998)
		- host : The RPC hostname (default to 127.0.0.1)
```
const DBH = require('dash-blockchain-helpers')    
var config = {   
    dashRPC:{
	    user:'dash',
	    password:'dash',
	    port:9998,
	    host:'127.0.0.1'
    }
}   
var blockchain = new DBH(config)   
```
- Enjoy promises! 

### I hate promises, is there a fun way to use it ? 

Yes ! From NodeJS 7.6, you are able to use await/async superfeatures.  
It will allow you do to stuff like theses :   

```
async function test(){
    var superblockList = await blockchain.getPreviousSuperblockList();
    console.log(superblockList);
}
test();
```

If you are using previous version of node, mind about polyfill like [Asyncawait](https://github.com/yortus/asyncawait)   

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

#### `blockchain.expectNextDifficulty()`

Will return the expected next difficulty (bits) given the last 25 headers.  

#### `blockchain.retrieveBlockHeaders([startingHeight,[numberOfBlockheaders,[direction,]]])`

Will return an array of a defined number of block headers from a starting point (height).   
- startingHeight will be a Number representing the height from which you want to fetch the data.  
- numberOfBlockheaders is the number of continious block headers you want to fetch from that starting point  
- direction is an integer representing the direction of headers to fetch, where 1 is forward and -1 backward.  

Every parameters are optional, if so,  
- startingHeight will be 0  
- numberOfBlock will be 25  
- direction will be 1.   

N.B : It is also possible to use an hash as a starting point.  

#### `blockchain.validateBlockchain(superblockNumber, startingHeight)`

Will validate the blockchain from a specified startingHeight (default will be the last block height) to a set number of superblocks (default is 1).  
If will first validate all block from the starting height to the previous known superblock.  
Then it will validate a superblockNumber of superblock.  

For instance, let's assume the given parameters : `validateBlockchain(2, 632000)`  
Knowing that the two previous superblocks are at height 631408 and 614792.  
It will validate the blockchain on multiple checks : 
- First, it will validate headers using DGW from 632000 to previous superblock (631408)
- Then it will validate headers between two superblocks : 631408 to 614792. 
- Finally it will validate the superblock 614792 it self (from 598176 to 614792)  


#### `blockchain.getNextSuperblockList([height,[nbOfSuperblocks]])`

Will return the defined number of superblocks from a defined height.   
If no parameters are given it will return the next superblock from the last generated block  
If only height parameter are given, it will then return the next superblock from this starting point.  


#### `blockchain.getPreviousSuperblockList([height,[nbOfSuperblocks]])`

Will return the defined number of superblocks from the defined height.  
If no parameters are given it will return all superblocks heights that has been generated from genesis to current block.  
If only height parameter are given, it will then return the solely previous superblock from that starting point  


