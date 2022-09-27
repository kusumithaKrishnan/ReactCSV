import { useState } from "react";
import Papa from "papaparse";

import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Input from "@material-ui/core/Input";
import Paper from "@material-ui/core/Paper";
import IconButton from "@material-ui/core/IconButton";
// Icons
import EditIcon from "@material-ui/icons/EditOutlined";
import DoneIcon from "@material-ui/icons/DoneAllTwoTone";
import RevertIcon from "@material-ui/icons/NotInterestedOutlined";
import {useStyles} from './style'

const CustomTableCell = ({ row, name, onChange }) => {
  const classes = useStyles();
  const { isEditMode } = row;
  return (
    <TableCell align="left" className={classes.tableCell}>
      {isEditMode ? (
        <Input
          value={row[name]}
          name={name}
          onChange={(e) => onChange(e, row)}
          className={classes.input}
        />
      ) : (
        row[name]
      )}
    </TableCell>
  );
};

function App() {
  // const [parsedData, setParsedData] = useState([]);
  const [rows, setTableRows] = useState([]);
  // const [values, setValues] = useState([]);
  const [previous, setPrevious] = useState({});
  const [headers, setHeaders] = useState([])
  const classes = useStyles();

  const onToggleEditMode = (id) => {
    setTableRows((state) => {
      return rows.map((row) => {
        if (row.id === id) {  
          return { ...row, isEditMode: !row.isEditMode };
        }
        return row;
      });
    });
  };

  const onRevert = (id) => {
    const newRows = rows.map((row) => {
      if (row.id === id) {
        return previous[id] ? previous[id] : row;
      }
      return row;
    });
    setTableRows(newRows);
    setPrevious((state) => {
      delete state[id];
      return state;
    });
    onToggleEditMode(id);
  };

  const onChange = (e, row) => {
    if (!previous[row.id]) {
      setPrevious((state) => ({ ...state, [row.id]: row }));
    }
    const value = e.target.value;
    const name = e.target.name;
    const { id } = row;
    const newRows = rows.map((row) => {
      if (row.id === id) {
        return { ...row, [name]: value };
      }
      return row;
    });
    setTableRows(newRows);
  };

  const changeHandler = (event) => {
    Papa.parse(event.target.files[0], {
      header: true,
      skipEmptyLines: true,
      complete: function (results) {
        // const rowsArray = [];
        // const valuesArray = [];
        console.log('results', results)
        setHeaders(Object.keys(results.data[0]))
        // results.data.forEach((d) => {
        //   rowsArray.push(Object.keys(d));
        //   valuesArray.push(Object.values(d));
        // });

        // setParsedData(results.data);
        setTableRows(results.data);
        // setValues(valuesArray);
      },
    });
  };

  return (
    <>
      <input
        type="file"
        name="file"
        onChange={changeHandler}
        accept=".csv"
        style={{ display: "block", margin: "10px auto" }}
      />
      {rows.length ? (
        <Paper className={classes.root}>
          <Table aria-label="caption table" className={classes.table}>
            <TableHead>
              <TableRow>
                <TableCell align="left" />
                {headers.map((header) =>  <TableCell key={header} align="left">{header}</TableCell>)}
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row) => (
                <TableRow key={row}>
                  <TableCell className={classes.selectTableCell}>
                    {row.isEditMode ? (
                      <>
                        <IconButton
                          aria-label="done"
                          onClick={() => onToggleEditMode(Object.keys(row)[0])}
                        >
                          <DoneIcon />
                        </IconButton>
                        <IconButton
                          aria-label="revert"
                          onClick={() => onRevert(Object.keys(row)[0])}
                        >
                          <RevertIcon />
                        </IconButton>
                      </>
                    ) : (
                      <IconButton
                        aria-label="delete"
                        onClick={() => onToggleEditMode(row.id)}
                      >
                        <EditIcon />
                      </IconButton>
                    )}
                  </TableCell>
                  {headers.map((header) =>  <CustomTableCell key={header} {...{ row, name: header, onChange }} />)}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      ) : null}
    </>
  );
}

export default App;
