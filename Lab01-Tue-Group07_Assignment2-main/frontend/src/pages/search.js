import React, { useEffect, useState } from 'react';
import Grid from '@mui/joy/Grid';

import Sheet from '@mui/joy/Sheet';
import Typography from '@mui/joy/Typography';

import Select from '@mui/joy/Select';
import Option from '@mui/joy/Option';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';

import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';
import IconButton from '@mui/joy/IconButton';

import BasicCard from '../components/card';

import 'rc-pagination/assets/index.css'
import { Box } from '@mui/joy';
export default function SearchResult(props) {
    let counter = props.stat;
    var searchItems = counter.searchItems;

    let minPrice = counter.priceFilter[0]<counter.priceFilter[1]?counter.priceFilter[0]:counter.priceFilter[1];
    let maxPrice = counter.priceFilter[0]>counter.priceFilter[1]?counter.priceFilter[0]:counter.priceFilter[1];
    searchItems = searchItems.filter((v)=>(parseFloat(v.price) >=minPrice && parseFloat(v.price) <=maxPrice && (v.brand == counter.brandFilter||counter.brandFilter ==''||counter.brandFilter ==null)));

    function labelDisplayedRows({ from, to, count }) {
        return `${from}–${to} of ${count !== -1 ? count : `more than ${to}`}`;
    }
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const [page, setPage] = React.useState(0);

    const handleChangePage = (newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event, newValue) => {
        setRowsPerPage(parseInt(newValue.toString(), 10));
        setPage(0);
    };
    const getLabelDisplayedRowsTo = () => {
        if (searchItems.length === -1) {
            return (page + 1) * rowsPerPage;
        }
        return rowsPerPage === -1
            ? searchItems.length
            : Math.min(searchItems.length, (page + 1) * rowsPerPage);
    };
    const emptyRows =
        page > 0 ? Math.max(0, (1 + page) * rowsPerPage - searchItems.length) : 0;

    if (searchItems.length != 0) {
        return (<>
            <Typography component="h1" fontSize="xl3" fontWeight="lg" color="textPrimary" gutterBottom sx={{ px: 10 }}>
                Search Result </Typography>
            <Grid sx={{ flexGrow: 1 }} container >
    
                <Grid xs={12}>
                    <Grid container justifyContent="center" spacing={2}>
                        {searchItems.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((value) => {
                         
                                return (  <Grid key={value._id}>
                                    <Sheet
                                    ><BasicCard  reviews = {value.reviews} itemId = {value._id} stat={counter} title={value.title} price={value.price} imgUrl={require('../pics/phone_default_images' + value.image)} // Render the image of the phone, dynamically splicing the path
                                        pr ></BasicCard></Sheet>
                                </Grid>);
    })}
                    </Grid>
                </Grid>
            </Grid>
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    mx: 10,
                    my: 2
                }}
            >
    <Box
            sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                justifyContent: 'flex-end',
            }}
        >
            <FormControl orientation="horizontal" size="sm">
                <FormLabel>searchItems  per page:</FormLabel>
                <Select onChange={handleChangeRowsPerPage} value={rowsPerPage}>
                    <Option value={5}>5</Option>
                    <Option value={10}>10</Option>
                    <Option value={25}>25</Option>
                </Select>
            </FormControl>
            <Typography textAlign="center" sx={{ minWidth: 80 }}>
                {labelDisplayedRows({
                    from: searchItems.length === 0 ? 0 : page * rowsPerPage + 1,
                    to: getLabelDisplayedRowsTo(),
                    count: searchItems.length === -1 ? -1 : searchItems.length,
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
                        searchItems.length !== -1
                            ? page >= Math.ceil(searchItems.length / rowsPerPage) - 1
                            : false
                    }
                    onClick={() => handleChangePage(page + 1)}
                    sx={{ bgcolor: 'background.surface' }}
                >
                    <KeyboardArrowRightIcon />
                </IconButton>
            </Box>
        </Box>
               
            </Box>
            
        </>
        );


    }
    return (<>
        <Typography component="h1" fontSize="xl3" fontWeight="lg" color="textPrimary" gutterBottom sx={{ px: 10 }}>
            No Result </Typography>
    </>);
}