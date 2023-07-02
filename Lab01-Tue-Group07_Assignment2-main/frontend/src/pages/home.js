import React, { useState, useEffect } from "react";
import Grid from "@mui/joy/Grid";
// import PropTypes from "prop-types";

import Sheet from "@mui/joy/Sheet";
import Typography from "@mui/joy/Typography";

import BasicCard from "../components/card";
import RatingCard from "../components/rating-card";
import axios from "axios"; // 导入 axios


export default function Home(props) {
  let counter = props.stat;
  const [soldOutPhones, setSoldOutPhones] = useState([]); // Create a state variable soldOutPhones
  const [bestSellerPhones, setBestSellerPhones] = useState([]); // Create a state variable bestSellerPhones

  useEffect(() => {
    axios
      .get("http://localhost:5001/api/phones/end") // Call the axios.get method with http://
      .then((response) => {
        // Handle a successful response
        return response.data; // return response data
      })
      .then((data) => {
        // Handle response data
        setSoldOutPhones(data); // Update the soldOutPhones state
      })
      .catch((error) => {
        // Handle failed responses
        console.error(error); // print error message
        throw error; // throws an error
      });

    axios
      .get("http://localhost:5001/api/phones/hot") 
      .then((response) => {
        
        return response.data; 
      })
      .then((data) => {
        
        setBestSellerPhones(data); // Update bestSellerPhones status
      })
      .catch((error) => {
        // Handle failed responses
        console.error(error); 
        throw error; 
      });
  }, []); // Pass in an empty array as dependencies and execute it only once

//Get the token in localStorage, if there is a token, put the token in the headers, if not, don't put it, so that you can get the token through the headers on the backend.
  const token = localStorage.getItem("token");
  const config = {
    headers: {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : "",
    },
  };

//If there is a token in localstorage, the user information will be obtained according to the token, if there is user information, put the user information in localsotrage, if not, it will not be put.
  const user = localStorage.getItem("user");
  if (token) {
    axios
      .get("http://localhost:5001/api/users/profile", config)
      .then((response) => {
        localStorage.setItem("user", JSON.stringify(response.data));
      })
      .catch((error) => {
        console.error(error);
        throw error;
      });
  }
  
  //If user exists, the user is logged in. Determine the loginState in the container, if it is false, but the user exists, then set the loginState to true.
  if (user) {
    if (counter.loginState === false) {
      counter.login()
    }
  }
  
  //If loginState is true, display the logged in home state

  return (
    <div className="home">
      <Typography
        component="h1"
        fontSize="xl3"
        fontWeight="lg"
        color="textPrimary"
        gutterBottom
        sx={{ px: 10 }}
      >
        Sold out soon
      </Typography>
      <Grid sx={{ flexGrow: 1 }} container>
        <Grid xs={12}>
          <Grid container justifyContent="center" spacing={2}>
            {soldOutPhones.map((phone) => (
              // Iterate over the soldOutPhones array
              <Grid key={phone._id}>
                <Sheet>
                  <BasicCard
                    stat={counter}
                    title={phone.title} // Render the title of the phone
                    price={phone.price} // Render the price of the phone
                    itemId = {phone._id}
                    reviews = {phone.reviews}
                    imgUrl={require('../pics/phone_default_images' + phone.image)} // Render the image of the phone, dynamically splicing paths
                    pr
                  ></BasicCard>
                </Sheet>
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Grid>

      <Typography
        component="h1"
        fontSize="xl3"
        fontWeight="lg"
        color="textPrimary"
        gutterBottom
        sx={{ px: 10, py: 4 }}
      >
        Best Sellers
      </Typography>
      <Grid sx={{ flexGrow: 1 }} container>
        <Grid xs={12}>
          <Grid container justifyContent="center" spacing={2}>
            {bestSellerPhones.map((phone) => (
             
              <Grid key={phone._id}>
                <Sheet>
                  <RatingCard
                    stat={counter}
                    title={phone.title} 
                    price={phone.price} 
                    itemId = {phone._id}
                    reviews = {phone.reviews}
                    rating = {phone.average_rating}
                    imgUrl={require('../pics/phone_default_images' + phone.image)} 
                    pr
                  ></RatingCard>
                </Sheet>
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
}
