import * as React from 'react';
import AspectRatio from '@mui/joy/AspectRatio';
import Box from '@mui/joy/Box';
import Button from '@mui/joy/Button';
import Card from '@mui/joy/Card';

import Typography from '@mui/joy/Typography';

export default function BasicCard(props) {
  let counter = props.stat;
  function handleMore(){
    counter.toItem();
    counter.setItemInfo({'title':props.title,'img':props.imgUrl,'price':props.price,'id':props.itemId,reviews:props.reviews})
  }
  return (
    <Card variant="outlined" sx={{ width: 240}}>
      <Typography level="h2" fontSize="md" sx={{ mb: 0.5 }}>
      
      </Typography>
      <Typography  level="h6" noWrap = 'true'>{props.title}</Typography>

      <AspectRatio minHeight="260px" maxHeight="300px" sx={{ my: 2 }}>
        <img
          src= {props.imgUrl}
          loading="lazy"
          alt=""
        />
      </AspectRatio>
      <Box sx={{ display: 'flex' }}>
        <div>
          <Typography level="body3">Total price:</Typography>
          <Typography fontSize="lg" fontWeight="lg">
          ${props.price}
          </Typography>
        </div>
        <Button
          variant="solid"
          size="sm"
          color="neutral"
          sx={{ ml: 'auto', fontWeight: 1000 }}
          onClick={handleMore}
        >
          More
        </Button>
      </Box>
    </Card>
  );

}
