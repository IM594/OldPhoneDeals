import * as React from 'react';
import Box from '@mui/joy/Box';
import Button from '@mui/joy/Button';
import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';
import Textarea from '@mui/joy/Textarea';
import IconButton from '@mui/joy/IconButton';
import Menu from '@mui/joy/Menu';
import MenuItem from '@mui/joy/MenuItem';
import ListItemDecorator from '@mui/joy/ListItemDecorator';
import FormatBold from '@mui/icons-material/FormatBold';
import FormatItalic from '@mui/icons-material/FormatItalic';
import KeyboardArrowDown from '@mui/icons-material/KeyboardArrowDown';
import Check from '@mui/icons-material/Check';
import Rating from '@mui/material/Rating';
import Typography from '@mui/material/Typography';
export default function TextareaValidator(props) {
  const [italic, setItalic] = React.useState(false);
  const [rating, setRating] = React.useState(2);
  const [comment, setComment] = React.useState(' ');

  const [fontWeight, setFontWeight] = React.useState('normal');
  const [anchorEl, setAnchorEl] = React.useState(null);


  const sendComment = (data) => {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + localStorage.getItem('token'));

    myHeaders.append("Content-Type", "application/json");
    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: data,
      redirect: 'follow'
    };

    fetch("http://localhost:5001/api/phones/postComment", requestOptions)
      .then(response => response.text())
      .then(result => {
        if (result[2] != 'r') {
          alert(JSON.parse(result).message)
        } else {
          alert('Done')
          if (props.onRefresh) {
            props.onRefresh()
          }
        }

      })
      .catch(error => console.log('error', error));
  }

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        console.log(props.itemInfo);
        var raw = JSON.stringify({
          "phoneId": props.itemInfo.id,
          "comment": comment,
          "rating": rating,
          'hidden': 'true'
        });
        console.log(raw)
        sendComment(raw)

      }}>
      <FormControl>
        <Box display={'flex'} sx={{ py: 3 }} ><Typography component="legend">Your rating</Typography>
          <Rating
            sx={{ px: 3 }}
            name="simple-controlled"
            value={rating}
            onChange={(event, newValue) => {
              setRating(newValue);
            }}
          /></Box>

        <FormLabel><Typography component="legend">Your comment</Typography></FormLabel>
        <Textarea
          value={comment}
          onChange={(event, newValue) => { setComment(event.target.value) }}
          placeholder="Type something here…"
          minRows={3}
          endDecorator={
            <Box
              sx={{
                display: 'flex',
                gap: 'var(--Textarea-paddingBlock)',
                pt: 'var(--Textarea-paddingBlock)',
                borderTop: '1px solid',
                borderColor: 'divider',
                flex: 'auto',
              }}
            >
              <IconButton
                variant="plain"
                color="neutral"
                onClick={(event) => setAnchorEl(event.currentTarget)}
              >
                <FormatBold />
                <KeyboardArrowDown fontSize="md" />
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={() => setAnchorEl(null)}
                size="sm"
                placement="bottom-start"
                sx={{ '--ListItemDecorator-size': '24px' }}
              >
                {['200', 'normal', 'bold'].map((weight) => (
                  <MenuItem
                    key={weight}
                    selected={fontWeight === weight}
                    onClick={() => {
                      setFontWeight(weight);
                      setAnchorEl(null);
                    }}
                    sx={{ fontWeight: weight }}
                  >
                    <ListItemDecorator>
                      {fontWeight === weight && <Check fontSize="sm" />}
                    </ListItemDecorator>
                    {weight === '200' ? 'lighter' : weight}
                  </MenuItem>
                ))}
              </Menu>
              <IconButton
                variant={italic ? 'soft' : 'plain'}
                color={italic ? 'primary' : 'neutral'}
                aria-pressed={italic}
                onClick={() => setItalic((bool) => !bool)}
              >
                <FormatItalic />
              </IconButton>
              <Button sx={{ ml: 'auto' }} type='submit'>Send</Button>
            </Box>
          }
          sx={{
            minWidth: 300,
            fontWeight,
            fontStyle: italic ? 'italic' : 'initial',
          }}
        />
      </FormControl>
    </form>
  );
}