import React from 'react'
import clsx from 'clsx'
import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import TextField from '@material-ui/core/TextField'
import DialogActions from '@material-ui/core/DialogActions'
import CircularProgress from '@material-ui/core/CircularProgress'
import { green } from '@material-ui/core/colors'
import ipfs from '../ipfs'

const useStyles = makeStyles(theme => ({
  button: {
    margin: theme.spacing(1),
  },
  img: {
    width: '100%',
    marginBottom: theme.spacing(1),
  },
  wrapper: {
    marginRight: theme.spacing(2),
    marginBottom: theme.spacing(1),
    position: 'relative',
  },
  buttonSuccess: {
    backgroundColor: green[500],
    '&:hover': {
      backgroundColor: green[700],
    },
  },
  buttonProgress: {
    color: green[500],
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -12,
    marginLeft: -12,
  },
}))

const View = ({ account, instance, file }) => {
  const classes = useStyles()
  const [open, setOpen] = React.useState(false)
  const [base64Data, setBase64Data] = React.useState('')
  const [displayPayment, setDisplayPayment] = React.useState(false)
  const [duration, setDuration] = React.useState('')
  const [amount, setAmount] = React.useState('')
  const [loading, setLoading] = React.useState(false)
  const [success, setSuccess] = React.useState(false)

  const handleClickOpen = async () => {
    const {
      0: hasPermission,
      1: accessKey,
    } = await instance.methods
      .checkPermission(file.ipfsHash, account)
      .call({ from: account })

    if (!hasPermission) {
      setDisplayPayment(true)
      return
    }
    setOpen(true)
    const results = await ipfs.get(file.ipfsHash)
    console.log(hasPermission, accessKey)
    setBase64Data(results[0].content.toString('base64'))
  }

  const handleClose = () => {
    setOpen(false)
    setDisplayPayment(false)
  }

  const handleOpenChannel = async () => {
    setSuccess(false)
    setLoading(true)
    await instance.methods
      .createPaymentChannel(
        account,
        file.ipfsHash,
        file.owner,
        file.price,
        duration,
      )
      .send({ from: account, value: amount }, () => {
        setSuccess(true)
        setLoading(false)
      })
  }

  const handleCloseChannel = async () => {
    setSuccess(false)
    setLoading(true)
    await instance.methods
      .closePaymentChannel(file.ipfsHash, account)
      .send({ from: account }, () => {
        setSuccess(true)
        setLoading(false)
      })
  }

  return (
    <div>
      <Button
        variant="outlined"
        color="primary"
        className={classes.button}
        onClick={handleClickOpen}
      >
        View
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{file.name}</DialogTitle>
        <DialogContent>
          <img
            className={classes.img}
            src={`data:image/png;base64, ${base64Data}`}
          />
        </DialogContent>
        {account !== file.owner.toLowerCase() && (
          <DialogActions>
            <div className={classes.wrapper}>
              <Button
                variant="contained"
                color="primary"
                disabled={loading}
                onClick={handleCloseChannel}
                className={clsx({
                  [classes.buttonSuccess]: success,
                })}
              >
                Close channel
              </Button>
              {loading && (
                <CircularProgress
                  size={24}
                  className={classes.buttonProgress}
                />
              )}
            </div>
          </DialogActions>
        )}
      </Dialog>
      <Dialog open={displayPayment} onClose={handleClose}>
        <DialogTitle>Open a payment channel</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="From"
            type="text"
            variant="outlined"
            fullWidth
            InputLabelProps={{
              shrink: true,
            }}
            readOnly
            value={account}
          />
          <TextField
            margin="dense"
            label="Recipient"
            type="text"
            variant="outlined"
            fullWidth
            InputLabelProps={{
              shrink: true,
            }}
            readOnly
            value={file.owner}
          />
          <TextField
            margin="dense"
            label="Price per hour"
            type="number"
            variant="outlined"
            fullWidth
            InputLabelProps={{
              shrink: true,
            }}
            readOnly
            value={file.price}
          />
          <TextField
            margin="dense"
            label="Duration (hour)"
            type="number"
            variant="outlined"
            fullWidth
            InputLabelProps={{
              shrink: true,
            }}
            value={duration}
            onChange={e => setDuration(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Amount"
            type="number"
            variant="outlined"
            fullWidth
            InputLabelProps={{
              shrink: true,
            }}
            value={amount}
            onChange={e => setAmount(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <div className={classes.wrapper}>
            <Button
              variant="contained"
              color="primary"
              disabled={loading}
              onClick={handleOpenChannel}
              className={clsx({
                [classes.buttonSuccess]: success,
              })}
            >
              Submit
            </Button>
            {loading && (
              <CircularProgress
                size={24}
                className={classes.buttonProgress}
              />
            )}
          </div>
        </DialogActions>
      </Dialog>
    </div>
  )
}

View.propTypes = {
  account: PropTypes.string.isRequired,
  instance: PropTypes.object.isRequired,
  file: PropTypes.object.isRequired,
}

export default View
