## Requirements

- [Truffle](https://www.trufflesuite.com/truffle)
- [Ganache](https://www.trufflesuite.com/ganache)
- [IPFS](https://docs.ipfs.io/guides/guides/install/) (On Windows you may need to copy the execution file into $PATH folder)
- [Metamask chrome extension](https://metamask.io/)

## Running

### Set up Ganache
The fisrt thing you need to do is create a new workspace in Ganache.
Open Ganache app and click New Workspace button, add the truffle-config.js file to the Workspace.
After click Save Workspace you'll be taken to the the screen of the workspace just created

![alt text](https://raw.githubusercontent.com/luongdn/eth-ppu/master/images/ganache-config-workspace.PNG)


### Configure IPFS API CORS headers

After installing IPFS, run the following command to configure your IPFS API at http://127.0.0.1:5001 to allow cross-origin request from http://localhost:3000 which is where the app will be running
```
ipfs config --json API.HTTPHeaders.Access-Control-Allow-Origin '["http://localhost:3000"]'
ipfs config --json API.HTTPHeaders.Access-Control-Allow-Methods '["PUT", "GET", "POST"]'
```

### Import accounts into Metamask
After installing metamask, open it, follow the steps and create an account.
Click the Main Ethereum Network on top of the window to change the network. We'll be running Ganache on http://127.0.0.1:7545
so click Custom RPC and fill up:

![alt text](https://raw.githubusercontent.com/luongdn/eth-ppu/master/images/metamask-custom-rpc.PNG)

Next, import a couple of accounts into metamask to test our app.
Click the button with the key icon, copy the private key and paste it into metamask

![alt text](https://raw.githubusercontent.com/luongdn/eth-ppu/master/images/ganache-private-key.PNG)

![alt text](https://raw.githubusercontent.com/luongdn/eth-ppu/master/images/metamask-import-account.PNG)


### Install dependencies
```
npm install
```
or if you use yarn
```
yarn install
```

### Runnning on local
In order to run the app on local, you need to run the 3 commands.
The command to deploy all the contracts in contracts folder
```
truffle migrate
```
(or truffle migrate --reset if you want to modify the contract and deploy it again)

This command to run IPFS daemon in your computer
```
ipfs daemon
```

And finally, to run the client app with react
```
npm run start
```
or with yarn
```
yarn start
```
