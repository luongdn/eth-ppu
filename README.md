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

![ganache-config-workspace](https://user-images.githubusercontent.com/40640560/71676796-fc70f800-2d35-11ea-8524-8d136be362d2.png)


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

![metamask-custom-rpc](https://user-images.githubusercontent.com/40640560/71676869-24f8f200-2d36-11ea-84a5-6dc5125b8475.png)

Next, import a couple of accounts into metamask to test our app.
Click the button with the key icon, copy the private key and paste it into metamask

![ganache-private-key](https://user-images.githubusercontent.com/40640560/71676880-2aeed300-2d36-11ea-9037-ad93801a00a2.png)

Click the import account button to import account from private key

![metamask-import-account](https://user-images.githubusercontent.com/40640560/71676886-2cb89680-2d36-11ea-8d83-78a0e2cc8f26.png)


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

![result](https://user-images.githubusercontent.com/40640560/71676889-2e825a00-2d36-11ea-802d-9bd3989a8b4c.png)
