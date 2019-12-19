import React from 'react'
import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/core/styles'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableContainer from '@material-ui/core/TableContainer'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import Paper from '@material-ui/core/Paper'
import View from './View'

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
})

function Files({ account, instance }) {
  const classes = useStyles()
  const [filesCount, setFilesCount] = React.useState(0)
  const [files, setFiles] = React.useState({})

  React.useEffect(() => {
    async function getCount() {
      if (instance === null) {
        return
      }
      const count = await instance.methods.getFilesCount().call()
      setFilesCount(count)
    }
    getCount()
  })

  React.useEffect(() => {
    async function getFiles() {
      if (instance === null) {
        return
      }

      const t = {}
      for (let i = 0; i < filesCount; i++) {
        const hash = await instance.methods.getFileHash(i).call()
        t[hash] = await instance.methods.getFile(hash).call()
      }
      setFiles(t)
    }
    getFiles()
  }, [filesCount, instance])

  if (instance === null || filesCount === 0) {
    return ''
  }

  return (
    <TableContainer component={Paper}>
      <Table className={classes.table} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell align="right">Owner</TableCell>
            <TableCell align="right">Description</TableCell>
            <TableCell align="right">Count</TableCell>
            <TableCell />
          </TableRow>
        </TableHead>
        <TableBody>
          {Object.keys(files).map(key => (
            <TableRow key={key}>
              <TableCell>{files[key].name}</TableCell>
              <TableCell align="right">{files[key].owner}</TableCell>
              <TableCell align="right">
                {files[key].description}
              </TableCell>
              <TableCell align="right">
                {files[key].readersCount}
              </TableCell>
              <TableCell align="right">
                <View
                  account={account}
                  instance={instance}
                  file={files[key]}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

Files.propTypes = {
  account: PropTypes.string.isRequired,
  instance: PropTypes.object.isRequired,
}

export default Files
