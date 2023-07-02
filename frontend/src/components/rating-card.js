import * as React from 'react';
import AspectRatio from '@mui/joy/AspectRatio';
import Box from '@mui/joy/Box';
import Button from '@mui/joy/Button';
import Card from '@mui/joy/Card';

import Typography from '@mui/joy/Typography';

import { Rating } from '@mui/material';
export default function RatingCard(props) {

  let counter = props.stat;
  function handleMore(){
    counter.toItem();
    counter.setItemInfo({'title':props.title,'img':props.imgUrl,'price':props.price,'id':props.itemId,reviews:props.reviews})
  }
  
  return (
    <Card variant="outlined" sx={{ width: 240}}>
    <Typography level="h2" fontSize="md" sx={{ mb: 0.5 }}>
    
    </Typography>
    <Typography  level="h4" noWrap = 'true'>{props.title}</Typography>
      <AspectRatio minHeight="120px" maxHeight="200px" sx={{ my: 2 }}>
        <img
          src= {props.imgUrl}
          loading="lazy"
          alt=""
        />
      </AspectRatio>
      <Box sx={{ display: 'flex' }}>
       <Rating value={props.rating} readOnly></Rating>
      </Box>
      <Button
          variant="solid"
          size="sm"
          color="neutral"
          sx={{ ml: 'auto', fontWeight: 1000 }}
          onClick={handleMore}
        >
          More
        </Button>
    </Card>
  );
}
