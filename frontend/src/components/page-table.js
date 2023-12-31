import * as React from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/joy/Box';
import Table from '@mui/joy/Table';
import Typography from '@mui/joy/Typography';
import Sheet from '@mui/joy/Sheet';
import Checkbox from '@mui/joy/Checkbox';
import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';
import IconButton from '@mui/joy/IconButton';
import Link from '@mui/joy/Link';
import Tooltip from '@mui/joy/Tooltip';
import Select from '@mui/joy/Select';
import Option from '@mui/joy/Option';
import DeleteIcon from '@mui/icons-material/Delete';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import { visuallyHidden } from '@mui/utils';
import axios from 'axios';
import { useEffect } from 'react';
import { Button } from '@mui/joy';
import Modal from '@mui/joy/Modal';
import ModalClose from '@mui/joy/ModalClose';
import { useState } from 'react';
import Input from '@mui/joy/Input';
import { Switch } from '@mui/material';
import service from '../utils/request';
import { CellDisplay } from './table/display';
function labelDisplayedRows({ from, to, count }) {
  return `${from}–${to} of ${count !== -1 ? count : `more than ${to}`}`;
}

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

// Since 2020 all major browsers ensure sort stability with Array.prototype.sort().
// stableSort() brings sort stability to non-modern browsers (notably IE11). If you
// only support modern browsers you can replace stableSort(exampleArray, exampleComparator)
// with exampleArray.slice().sort(exampleComparator)
function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

const headCells = [
  {
    id: 'Title',
    numeric: false,
    disablePadding: true,
    label: 'Title',
  },
  {
    id: 'Brand',
    numeric: false,
    disablePadding: false,
    label: 'Brand',
    className: 'text-left'
  },
  {
    id: 'Stock',
    numeric: true,
    disablePadding: false,
    label: 'Stock',
    className: 'text-left'
  },
  {
    id: 'Price',
    numeric: true,
    disablePadding: false,
    label: 'Price ',
    className: 'text-left'
  },
  {
    id: 'Disabled',
    numeric: false,
    disablePadding: false,
    label: 'Disabled',
    className: 'text-left'
  }
];

function EnhancedTableHead(props) {
  const { onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } =
    props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <thead>
      <tr>
        <th>
          <Checkbox
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            slotProps={{
              input: {
                'aria-label': 'select all desserts',
              },
            }}
            sx={{ verticalAlign: 'sub' }}
          />
        </th>
        {headCells.map((headCell) => {
          const active = orderBy === headCell.id;
          return (
            <th
              key={headCell.id}
              aria-sort={
                active ? { asc: 'ascending', desc: 'descending' }[order] : undefined
              }
              className={headCell.className}
            >
              {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
              <Link
                underline="none"
                color="neutral"
                textColor={active ? 'primary.plainColor' : undefined}
                component="button"
                onClick={createSortHandler(headCell.id)}
                fontWeight="lg"
                startDecorator={
                  headCell.numeric ? (
                    <ArrowDownwardIcon sx={{ opacity: active ? 1 : 0 }} />
                  ) : null
                }
                endDecorator={
                  !headCell.numeric ? (
                    <ArrowDownwardIcon sx={{ opacity: active ? 1 : 0 }} />
                  ) : null
                }
                sx={{
                  '& svg': {
                    transition: '0.2s',
                    transform:
                      active && order === 'desc' ? 'rotate(0deg)' : 'rotate(180deg)',
                  },
                  '&:hover': { '& svg': { opacity: 1 } },
                }}
              >
                {headCell.label}
                {active ? (
                  <Box component="span" sx={visuallyHidden}>
                    {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                  </Box>
                ) : null}
              </Link>
            </th>
          );
        })}
      </tr>
    </thead>
  );
}

EnhancedTableHead.propTypes = {
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

function EnhancedTableToolbar(props) {
  const { numSelected } = props;

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        py: 1,
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
        ...(numSelected > 0 && {
          bgcolor: 'background.level1',
        }),
        borderTopLeftRadius: 'var(--unstable_actionRadius)',
        borderTopRightRadius: 'var(--unstable_actionRadius)',
      }}
    ><IconButton sx={{ mx: 2 }} color='neutral' onClick={() => { props.setOpen(true) }}>Add</IconButton>
      {numSelected > 0 ? (
        <Typography sx={{ flex: '1 1 100%' }} component="div">
          {numSelected} selected
        </Typography>
      ) : (
        <Typography
          level="h6"
          sx={{ flex: '1 1 100%' }}
          id="tableTitle"
          component="div"
        >
          Item
        </Typography>


      )}
      {numSelected > 0 ? (
        <Tooltip title="Delete">
          <IconButton size="sm" color="danger" variant="solid" onClick={props.func}>
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      ) : (
        <></>
      )}
    </Box>
  );
}
function handleClick() {
  EnhancedTableToolbar.propTypes = {
    numSelected: PropTypes.number.isRequired,
  };
}

export default function TableSortAndSelection(props) {
  const [rows, setRows] = React.useState([]);
  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState('calories');
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [open, setOpen] = React.useState(false);

  const fetchData = () => {
    let myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + localStorage.getItem('token'));
    let requestOptions = {
      method: 'POST',
      headers: myHeaders,
      redirect: 'follow'
    };

    fetch("http://localhost:5001/api/phones/getSellersPhones", requestOptions)
      .then(response => response.text())
      .then(result => {
        setRows(JSON.parse(result));
      })
      .catch(error => console.log('error', error));
  }

  useEffect(() => {
    fetchData()
  }, []);



  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };
  function handleDelete() {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + localStorage.getItem('token'));
    myHeaders.append("Content-Type", "application/json");
    console.log("delete:" + selected.toString())
    for (let index = 0; index < selected.length; index++) {
      const element = selected[index];
      var raw = JSON.stringify({
        "_id": element
      });

      var requestOptions = {
        method: 'DELETE',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
      };

      fetch("http://localhost:5001/api/phones/deletePhone", requestOptions)
        .then(response => response.text())
        .then(result => {
          alert(JSON.parse(result).message);
          fetchData()
        })
        .catch(error => console.log('error', error));
    }

  }

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelected = rows.map((n) => n._id);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, _id) => {
    if(event.target && event.target.className.indexOf('MuiSwitch-input') > -1){
      return false
    }

    const selectedIndex = selected.indexOf(_id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, _id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }

    setSelected(newSelected);
  };

  const handleChangePage = (newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event, newValue) => {
    setRowsPerPage(parseInt(newValue.toString(), 10));
    setPage(0);
  };

  const getLabelDisplayedRowsTo = () => {
    if (rows.length === -1) {
      return (page + 1) * rowsPerPage;
    }
    return rowsPerPage === -1
      ? rows.length
      : Math.min(rows.length, (page + 1) * rowsPerPage);
  };

  const handleAdd = (data) => {
    var config = {
      method: 'post',
      url: 'http://localhost:5001/api/phones/createPhone',
      headers: {
        'Authorization': 'Bearer ' + localStorage.getItem('token'),

        'Content-Type': 'application/json'
      },
      data: data
    };

    axios(config)
      .then(function (response) {
        fetchData()
        if (response.status == 201) {
          alert('Done')

        }
        else {
          alert(response);
        }
      })
      .catch(function (error) {
        alert(error);
      });
  }

  const isSelected = (_id) => selected.indexOf(_id) !== -1;

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  return (
    <React.Fragment>
      <Sheet
        variant="outlined"
        sx={{ width: '100%', boxShadow: 'sm', borderRadius: 'sm' }}
      >
        <EnhancedTableToolbar func={handleDelete} setOpen={setOpen} numSelected={selected.length} />
        <Table
          aria-labelledby="tableTitle"
          hoverRow
          sx={{
            '--TableCell-headBackground': 'transparent',
            '--TableCell-selectedBackground': (theme) =>
              theme.vars.palette.info.softBg,
            '& thead th:nth-child(1)': {
              width: '40px',
            },
            '& thead th:nth-child(2)': {
              width: '30%',
            },
            '& tr > *:nth-child(n+3)': { textAlign: 'right' },
          }}
        >
          <EnhancedTableHead
            numSelected={selected.length}
            order={order}
            orderBy={orderBy}
            onSelectAllClick={handleSelectAllClick}
            onRequestSort={handleRequestSort}
            rowCount={rows.length}
          />
          <tbody>
            {stableSort(rows, getComparator(order, orderBy))
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row, index) => {
                const isItemSelected = isSelected(row._id);
                const labelId = `enhanced-table-checkbox-${index}`;

                return (
                  <tr
                    onClick={(event) => handleClick(event, row._id)}
                    role="checkbox"
                    aria-checked={isItemSelected}
                    tabIndex={-1}
                    key={row._id}
                    selected={isItemSelected}
                    style={
                      isItemSelected
                        ? {
                          '--TableCell-dataBackground':
                            'var(--TableCell-selectedBackground)',
                          '--TableCell-headBackground':
                            'var(--TableCell-selectedBackground)',
                        }
                        : {}
                    }
                  >
                    <th scope="row">
                      <Checkbox
                        checked={isItemSelected}
                        slotProps={{
                          input: {
                            'aria-labelledby': labelId,
                          },
                        }}
                        sx={{ verticalAlign: 'top' }}
                      />
                    </th>
                    <th id={labelId} scope="row">
                      {row.title}
                    </th>
                    <td className='text-left'>{row.brand}</td>
                    <td className='text-left'>{row.stock}</td>
                    <td className='text-left'>{row.price}</td>
                    <td className='text-left'>
                      <CellDisplay phoneId={row._id} hidden={row.disabled} />
                    </td>
                  </tr>
                );
              })}
            {emptyRows > 0 && (
              <tr
                style={{
                  height: `calc(${emptyRows} * 40px)`,
                  '--TableRow-hoverBackground': 'transparent',
                }}
              >
                <td colSpan={6} />
              </tr>
            )}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan={6}>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                    justifyContent: 'flex-end',
                  }}
                >
                  <FormControl orientation="horizontal" size="sm">
                    <FormLabel>Rows per page:</FormLabel>
                    <Select onChange={handleChangeRowsPerPage} value={rowsPerPage}>
                      <Option value={5}>5</Option>
                      <Option value={10}>10</Option>
                      <Option value={25}>25</Option>
                    </Select>
                  </FormControl>
                  <Typography textAlign="center" sx={{ minWidth: 80 }}>
                    {labelDisplayedRows({
                      from: rows.length === 0 ? 0 : page * rowsPerPage + 1,
                      to: getLabelDisplayedRowsTo(),
                      count: rows.length === -1 ? -1 : rows.length,
                    })}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <IconButton
                      size="sm"
                      color="neutral"
                      variant="outlined"
                      disabled={page === 0}
                      onClick={() => handleChangePage(page - 1)}
                      sx={{ bgcolor: 'background.surface' }}
                    >
                      <KeyboardArrowLeftIcon />
                    </IconButton>
                    <IconButton
                      size="sm"
                      color="neutral"
                      variant="outlined"
                      disabled={
                        rows.length !== -1
                          ? page >= Math.ceil(rows.length / rowsPerPage) - 1
                          : false
                      }
                      onClick={() => handleChangePage(page + 1)}
                      sx={{ bgcolor: 'background.surface' }}
                    >
                      <KeyboardArrowRightIcon />
                    </IconButton>
                  </Box>
                </Box>
              </td>
            </tr>
          </tfoot>
        </Table>
      </Sheet>
      <Modal
        aria-labelledby="modal-title"
        aria-describedby="modal-desc"
        open={open}
        onClose={() => setOpen(false)}
        sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
      >
        <Sheet
          variant="outlined"
          sx={{
            maxWidth: 500,
            borderRadius: 'md',
            p: 3,
            boxShadow: 'lg',
          }}
        >
          <ModalClose
            variant="outlined"
            sx={{
              top: 'calc(-1/4 * var(--IconButton-size))',
              right: 'calc(-1/4 * var(--IconButton-size))',
              boxShadow: '0 2px 12px 0 rgba(0 0 0 / 0.2)',
              borderRadius: '50%',
              bgcolor: 'background.body',
            }}
          />
          <Typography
            component="h2"
            id="modal-title"
            level="h4"
            textColor="inherit"
            fontWeight="lg"
            mb={1}
          >
            Some info
          </Typography>
          <form
            onSubmit={(event) => {
              event.preventDefault();
              const formElements = event.currentTarget.elements;
              const data = {
                //_id: formElements.id.value,
                description: formElements.description.value,
                title: formElements.title.value,
                brand: formElements.brand.value,
                stock: parseInt(formElements.stock.value),
                //seller: formElements.seller.value,
                price: parseFloat(formElements.price.value),
              };

              handleAdd(data)

            }}
          >
            <FormControl required>
              <FormLabel>Title</FormLabel>
              <Input
                placeholder="Enter title"
                type="str"
                name="title"
              />
            </FormControl>
            {/* <FormControl >
              <FormLabel>ID</FormLabel>
              <Input
                placeholder="Enter id"
                type="str"
                name="id"
              />
            </FormControl> */}
            <FormControl required>
              <FormLabel>Brand</FormLabel>
              <Input
                placeholder="Enter id"
                type="str"
                name="brand"
              />
            </FormControl>
            <FormControl required>
              <FormLabel>Description</FormLabel>
              <Input
                placeholder="Enter description"
                type="str"
                name="description"
              />
            </FormControl>
            <FormControl required>
              <FormLabel>Price</FormLabel>
              <Input
                placeholder="Enter price"
                type="str"
                name="price"
              />
            </FormControl>
            <FormControl required>
              <FormLabel>Stock</FormLabel>
              <Input
                placeholder="Enter stock"
                type="str"
                name="stock"
              />
            </FormControl>

            {/* <FormControl>
              <FormLabel>Seller</FormLabel>
              <Input placeholder="Enter seller" type="str" name="seller" />
            </FormControl> */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >

            </Box>
            <Button sx={{ my: 3 }} type="submit" color="neutral" fullWidth>
              Add
            </Button>
          </form>
        </Sheet>
      </Modal>
    </React.Fragment>
  );
}
