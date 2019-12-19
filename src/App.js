import React from 'react'
import logo from './logo.svg'
import FilesContractJson from './contracts/Files.json'
import getWeb3 from './getWeb3'
import ipfs from './ipfs'

const address = ''

function App() {
  const [web3, setWeb3] = React.useState(null)
  const [account, setAccount] = React.useState(null)
  const [
    filesContractInstance,
    setFilesContractInstance,
  ] = React.useState(null)

  React.useEffect(() => {
    async function initState() {
      const web3 = await getWeb3()
      const account = await web3.eth.getCoinbase()
      console.log('Address: ', account)
      setWeb3(web3)
      setAccount(account)
      const FilesContract = new web3.eth.Contract(
        FilesContractJson.abi,
      )
      console.log(FilesContract.at(address))
      setFilesContractInstance(FilesContract.at(address))
    }
    initState()
  }, [])

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  )
}

export default App
