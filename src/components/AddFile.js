import React from 'react'
import clsx from 'clsx'
import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import AddIcon from '@material-ui/icons/NoteAdd'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'
import TextField from '@material-ui/core/TextField'
import CircularProgress from '@material-ui/core/CircularProgress'
import { green } from '@material-ui/core/colors'
import { DropzoneArea } from 'material-ui-dropzone'
import ipfs from '../ipfs'

const useStyles = makeStyles(theme => ({
  root: {
    alignSelf: 'flex-end',
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

const AddFile = ({ account, instance }) => {
  const classes = useStyles()
  const [open, setOpen] = React.useState(false)
  const [buffer, setBuffer] = React.useState('')
  const [name, setName] = React.useState('')
  const [description, setDescription] = React.useState('')
  const [price, setPrice] = React.useState('')
  const [loading, setLoading] = React.useState(false)
  const [success, setSuccess] = React.useState(false)

  const captureFile = files => {
    const file = files[0]
    setName(file.name)
    const reader = new window.FileReader()
    reader.readAsArrayBuffer(file)
    reader.onloadend = () => {
      const buffer = Buffer.from(reader.result)
      setBuffer(buffer)
    }
  }

  const handleSubmit = async e => {
    e.preventDefault()
    setSuccess(false)
    setLoading(true)
    const results = await ipfs.add(buffer)
    const hash = results[0].hash
    await instance.methods
      .addFile(hash, name, description, '123456', price)
      .send({ from: account }, () => {
        setSuccess(true)
        setLoading(false)
      })
  }

  const handleClickOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  return (
    <div className={classes.root}>
      <Button
        variant="outlined"
        color="primary"
        startIcon={<AddIcon />}
        onClick={handleClickOpen}
      >
        New File
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">
          Add a new file
        </DialogTitle>
        <DialogContent>
          <DialogContentText></DialogContentText>
          <DropzoneArea
            filesLimit={1}
            showAlerts={false}
            onChange={captureFile}
          />
        </DialogContent>
        <DialogContent>
          <TextField
            margin="dense"
            label="Name"
            type="text"
            variant="outlined"
            fullWidth
            InputLabelProps={{
              shrink: true,
            }}
            required
            value={name}
            onChange={e => setName(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Description"
            type="text"
            variant="outlined"
            fullWidth
            InputLabelProps={{
              shrink: true,
            }}
            value={description}
            onChange={e => setDescription(e.target.value)}
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
            required
            value={price}
            onChange={e => setPrice(e.target.value)}
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
              onClick={handleSubmit}
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

AddFile.propTypes = {
  account: PropTypes.string.isRequired,
  instance: PropTypes.object.isRequired,
}

export default AddFile
