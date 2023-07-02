import * as React from 'react';
import Select from '@mui/joy/Select';
import Option from '@mui/joy/Option';
import IconButton from '@mui/joy/IconButton';
import CloseRounded from '@mui/icons-material/CloseRounded';
import Sheet from '@mui/joy/Sheet';
import { Slider,Box} from '@mui/joy';
import Typography from '@mui/joy/Typography';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

export default function FilterBar(props) {
  let counter = props.stat;
  console.log(counter.brandFilter);
  const handleChange = (event, newValue) => {
    counter.setPriceFilter(newValue);
  };
  const action = React.useRef(null);

  return (
    <Sheet
      variant="solid"
      color='default'
      invertedColors
      className="filter-bar"
      sx={{
        display: 'flex',
        alignItems: 'center',
        flexGrow: 1,
        p: 2,
        mx: 0,
        my: 0,
        borderRadius: { xs: 0, sm: 'xs' },
        minWidth: 'min-content',

      }}
    >
      <IconButton color='none' onClick={counter.exitSearch} sx={{ px: 2 }}><ArrowBackIcon /></IconButton>
      <Typography component="h3" fontSize="xl" fontWeight="md">
        0
      </Typography>


      <Box className="silder" sx={{ px:2 }}>
        <Slider
          getAriaLabel={() => 'Temperature range'}
          min={0}
          max={1000}
          value={counter.priceFilter}
          track = 'normal'
          color='neutral'
          onChange={handleChange}
          valueLabelDisplay="auto"
          getAriaValueText={valueText}
        />
      </Box>
      <Typography component="h3" fontSize="xl" fontWeight="md">
        1000
      </Typography>
      <Select
        borderRadius='50%'
        action={action}
        value={counter.brandFilter}
        placeholder="Filter by brand…"
        onChange={(e, newValue) => counter.setBrandFilter(newValue)}
        {...(counter.brandFilter!=''&&counter.brandFilter!=null && {
          // display the button and remove select indicator
          // when user has selected a value
          endDecorator: (
            <IconButton
              size="sm"
              variant="plain"
              color="neutral"
              onMouseDown={(event) => {
                // don't open the popup when clicking on this button
                event.stopPropagation();
              }}
              onClick={() => {
                counter.setBrandFilter('');
                action.current?.focusVisible();
              }}
            >
              <CloseRounded />
            </IconButton>
          ),
          indicator: null,
        })}
        sx={{ minWidth: 160, px: 5, mx: 2 }}
      >
        {props.brands.map((brand, index) => (<Option value={brand}>{brand}</Option>))}
      </Select>
    </Sheet>

  );
}
function valueText(value) {
  return `${value}°C`;
}
