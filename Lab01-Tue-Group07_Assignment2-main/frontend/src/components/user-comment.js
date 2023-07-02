import React, { useState } from "react";
import {Switch} from "@mui/joy";
import Box from "@mui/joy/Box";

import Typography from "@mui/joy/Typography";


import Avatar from "@mui/joy/Avatar";

import ListItem from "@mui/joy/ListItem";
import ListItemContent from "@mui/joy/ListItemContent";
import ListItemDecorator from "@mui/joy/ListItemDecorator";

import { Rating } from "@mui/material";
import { Link } from "@mui/joy";

export default function CommentView(props) {
    var [more,setMore] = useState(false);
    var value = props.value;

    var phoneId = props.phoneId;
    return (<ListItem><ListItemDecorator sx={{ alignSelf: "flex-start" }}>
        <Avatar src={value.userIcon} />
    </ListItemDecorator>
        <ListItemContent   sx={{width : 500, }}   >
            <Typography
                textColor={
                    "neutral.700"
                }
                component="h1"
                fontSize="xl"
                fontWeight="lg"
                color="textPrimary"
                gutterBottom

            >
                {value.userName}
            </Typography>
            <Typography

                textColor={
                    "neutral.700"
                }
                level="body2"
                noWrap={!more} 
            >
                {value.content}
            </Typography>
            {value.content.length>100?more?<Link onClick = {()=>(setMore(!more))}>Less</Link>:<Link onClick = {()=>(setMore(!more))}>More</Link>:<></>}
        </ListItemContent>
        <ListItemDecorator sx={{ alignSelf: "flex-start" }}>
            <Box sx={{ mx: 3 }}>
                {" "}
                <Rating value={value.rating} readOnly></Rating>
            </Box>


        </ListItemDecorator>
        <ListItemDecorator sx={{ alignSelf: "flex-start" }}>
            <Box sx={{ mx: 3 }}>
            </Box>
        </ListItemDecorator>
    </ListItem>);
}
export function OwnComment(props){
    var [more,setMore] = useState(false);
    var value = props.value;
    var [checked,setChecked] = useState(value.hiddenState);

    console.log('hiddenState', value)

    var phoneId = props.phoneId;
    return (<ListItem><ListItemDecorator sx={{ alignSelf: "flex-start" }}>
        <Avatar src={value.userIcon} />
    </ListItemDecorator>
        <ListItemContent   sx={{width : 480, }}   >
            <Typography
                textColor={!checked?
                    "neutral.700":"neutral.100"
                }
                component="h1"
                fontSize="xl"
                fontWeight="lg"
                color="textPrimary"
                gutterBottom

            >
                {value.userName}
            </Typography>
            <Typography

                textColor={!checked?
                    "neutral.700":"neutral.100"
                }
                level="body2"
                noWrap={!more} 
            >
                {value.content}
            </Typography>
            {value.content.length>100?more?<Link onClick = {()=>(setMore(!more))}>Less</Link>:<Link onClick = {()=>(setMore(!more))}>More</Link>:<></>}
        </ListItemContent>
        <ListItemDecorator sx={{ alignSelf: "flex-start" }}>
            <Box sx={{ mx: 3 }}>
                {" "}
                <Rating value={value.rating} readOnly></Rating>
            </Box>

            <ListItemDecorator><Switch checked = {checked} onChange={(event)=>{onChange(event,phoneId);setChecked(!checked
            );
            }}></Switch></ListItemDecorator>
        </ListItemDecorator>
    </ListItem>);
}

function onChange(event,value){
    var myHeaders = new Headers();
myHeaders.append("Authorization", "Bearer "+localStorage.getItem('token'));
myHeaders.append("Content-Type", "application/json");

var raw = JSON.stringify({
   "phoneId": value,
   "hidden": event.target.checked ? 'true': 'false'
});
console.log(raw);
var requestOptions = {
   method: 'PUT',
   headers: myHeaders,
   body: raw,
   redirect: 'follow'
};

fetch("http://localhost:5001/api/phones/changeCommentHidden", requestOptions)
   .then(response => response.text())
   .then(result => console.log(result))
   .catch(error => console.log('error', error));
}