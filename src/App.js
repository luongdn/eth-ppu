import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import CssBaseline from '@material-ui/core/CssBaseline'
import Container from '@material-ui/core/Container'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import FilesContractJson from './contracts/Files.json'
import getWeb3 from './getWeb3'
import AddFile from './components/AddFile'
import Files from './components/Files'

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    minHeight: '100vh',
    flexDirection: 'column',
    '& > *': {
      marginTop: theme.spacing(4),
    },
  },
  account: {
    padding: theme.spacing(3, 2),
  },
}))

function App() {
  const classes = useStyles()

  const [account, setAccount] = React.useState(null)
  const [instance, setInstance] = React.useState(null)

  React.useEffect(() => {
    async function initState() {
      const web3 = await getWeb3()
      const account = await web3.eth.getCoinbase()
      console.log('Address: ', account.toLowerCase())
      setAccount(account)
      const networkId = await web3.eth.net.getId()
      const deployedNetwork = FilesContractJson.networks[networkId]
      const instance = new web3.eth.Contract(
        FilesContractJson.abi,
        deployedNetwork && deployedNetwork.address,
      )
      setInstance(instance)
    }

    try {
      initState()
    } catch (error) {
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      )
      console.error(error)
    }
  }, [])

  if (!account || !instance) {
    return <div>Loading....</div>
  }

  return (
    <React.Fragment>
      <CssBaseline />
      <Container className={classes.root}>
        <Paper className={classes.account}>
          <Typography variant="h5" component="h3">
            Your Account: {account}
          </Typography>
        </Paper>
        <AddFile account={account} instance={instance} />
        <Files account={account} instance={instance} />
      </Container>
    </React.Fragment>
  )
}

export default App
