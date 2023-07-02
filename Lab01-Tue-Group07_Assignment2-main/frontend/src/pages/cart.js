import React, { useState } from "react";

import List from "@mui/joy/List";
import ListItem from "@mui/joy/ListItem";

import ListItemDecorator from "@mui/joy/ListItemDecorator";
import axios from "axios";
import { useEffect } from "react";
import ListItemContent from "@mui/joy/ListItemContent";
import Typography from "@mui/joy/Typography";
import Box from "@mui/joy/Box";
import Add from '@mui/icons-material/Add';
import Remove from '@mui/icons-material/Remove';
import { Avatar, CircularProgress, Icon } from "@mui/material";
import { Button, IconButton, Sheet } from "@mui/joy";
import DeleteIcon from '@mui/icons-material/Delete';

export default function CartView(props) {

    let info = Array.from(new Set(props.stat.cartState));
    var dataList = countArr(props.stat.cartState);
    var [flag, setFlag] = useState(false);
    var [infoList, setInfoList] = useState([]);
    var [cartViewNumber, setNumber] = useState(0);
    const [totalPrice, setTotalPrice] = useState(0)

    const calcTotal = (items = []) => {
        let total_count = 0;
        let total_price = 0;
        for (let item of items) {
            let count = parseInt(dataList.get(item._id))
            total_count += count
            total_price += count * parseFloat(item.price)
        }
        setNumber(total_count)
        setTotalPrice(total_price)
    }

    const fetchData = async () => {
        const items = []//手机id
        for (let item of info) {
            try {
                const { data } = await axios.get("http://localhost:5001/api/phones/" + item)//购物车获取购买手机信息
                items.push(data)
            } catch (e) {
                console.log('fetch data fail', e)
            }
        }
        setInfoList(items)
        calcTotal(items)
        if (items.length === info.length) {
            setFlag(true)
        } else {
            setFlag(false)
        }
    }

    function SubmitCart(props) {
        var dataList = countArr(props.cartState);

        const checkData = [...dataList.keys()]
        let submitCount = checkData.length;
        console.log(dataList, submitCount);
        checkData.map((key) => {
            var data = JSON.stringify({
                _id: key,
                quantity: dataList.get(key),
            });

            var config = {
                method: "post",
                url: "http://localhost:5001/api/phones/checkOut",
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("token"),
                    "Content-Type": "application/json",
                },
                data: data,
            };

            axios(config)
                .then(function (response) {
                    if (response.status != 200) {
                        alert(JSON.stringify(response.data));
                    } else {
                        submitCount--;
                        handleDelete({_id: key})
                        console.log('props.cartState', props.cartState, submitCount)
                        if (submitCount < 1) {
                            alert('Done');
                            props.exitCart();
                        }
                    }
                })
                .catch(function (error) {
                    alert('check failed');
                });
        });
    }


    useEffect(() => {
        if (!flag) {
            fetchData().then(() => {
                console.log('fetchData ok')
            })
        }
    }, [flag]);

    const addNumber = (value) => {
        props.stat.addCart([value._id])
        dataList.set(value._id, dataList.get(value._id) + 1)
        calcTotal(infoList)
    }

    const decreaseNumber = (value) => {
        props.stat.removeCart(value._id);
        props.stat.addCart([])
        let count = dataList.get(value._id) - 1
        dataList.set(value._id, count)
        if (count === 0) {
            const items = infoList.filter(item => item._id !== value._id);
            setInfoList(items);
            calcTotal(items)
        } else {
            calcTotal(infoList)
        }
    }

    const handleDelete = (value)=>{
        const items = infoList.filter(item => item._id !== value._id);
        setInfoList(items);
        calcTotal(items)
        props.stat.clearCart(value._id);
    }

    return (
        <Sheet
            variant="outlined"
            sx={{ width: "80%", boxShadow: "sm", borderRadius: "sm", px: 10, mx: 10 }}
            className="cart-container"
        >
            {flag ? (
                <List
                    sx={{
                        "--ListItemDecorator-size": "86px",
                        "--List-gap": "10px",
                        "--ListItem-minHeight": "50px",
                        "--ListItem-paddingY": "10px",
                    }}
                >
                    {infoList.map((value) => (
                        <ListItem>
                            <ListItemDecorator sx={{ alignSelf: "flex-start" }}>
                                <Avatar
                                    src={require("../pics/phone_default_images" + value.image)}
                                />
                            </ListItemDecorator>

                            <ListItemContent>{value.title}</ListItemContent>
                            <ListItemContent>${value.price}</ListItemContent>
                           
                            <ListItemDecorator sx={{ alignSelf: "flex-start" }}>
                                <IconButton color="neural" onClick={() => addNumber(value)}><Add></Add></IconButton>
                                <Typography>{dataList.get(value._id)}</Typography>
                                <IconButton color="neural" onClick={() => decreaseNumber(value)}><Remove></Remove></IconButton>

                            </ListItemDecorator>
                            <IconButton size="sm" color="danger" variant="solid" onClick={()=>handleDelete(value)}>
                                <DeleteIcon />
                            </IconButton>
                        </ListItem>
                    ))}
                </List>
            ) : (
                <CircularProgress></CircularProgress>
            )}

            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                    justifyContent: "flex-end",
                }}
            >
                <Typography level="h4">
                    Total Quantity: {cartViewNumber}
                </Typography>
                <Typography level="h4">
                    Total Price: ${totalPrice}
                </Typography>
                <Button
                    onClick={() => {
                        SubmitCart(props.stat);
                    }}
                >
                    Check
                </Button>
            </Box>
        </Sheet>
    );
}


function countArr(arr) {
    var hash = new Map();
    arr.forEach((element) => {
        if (!hash.get(element)) {
            hash.set(element, 1);
        } else {
            hash.set(element, hash.get(element) + 1);
        }
    });
    return hash;
}
