import * as React from "react";
import { CssVarsProvider } from "@mui/joy/styles";
import GlobalStyles from "@mui/joy/GlobalStyles";
import CssBaseline from "@mui/joy/CssBaseline";
import Box from "@mui/joy/Box";
import Button from "@mui/joy/Button";

import FormControl from "@mui/joy/FormControl";
import FormLabel, { formLabelClasses } from "@mui/joy/FormLabel";

import Link from "@mui/joy/Link";
import Input from "@mui/joy/Input";
import Typography from "@mui/joy/Typography";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";

import Retrieve from "./retrieve";

import logo from "../pics/logo.png";
import { IconButton } from "@mui/joy";

import axios from "axios";
import { Stepper } from "@mui/material";


export default function Account(props) {
  console.log(localStorage.getItem("token"));
  //counter 是一个对象，包含了两个属性，一个是 forgetPage，一个是 registerPage,props.stat 来自于 App.js
  let counter = props.stat;
  //If props.stat.forgetPage is true, return the Retrieve component, otherwise return the SignUp component
  if (counter.forgetPage) {
    return <Retrieve stat={counter}></Retrieve>; //The Retrieve component is the forgot password page
  }
  if (counter.registerPage) {
    return <SignUp stat={counter}></SignUp>; //The SignUp component is the signup page
  } else {
    return (
      //Here is the login page
       //CssVarsProvider is a component used to set global variables, disableTransitionOnChange is a property, set to true, which means do not perform transition animation when the variable changes
      <CssVarsProvider disableTransitionOnChange>
        <CssBaseline />
        <GlobalStyles
          styles={{
            ":root": {
              "--Collapsed-breakpoint": "769px", // form will stretch when viewport is below `769px`
              "--Cover-width": "40vw", // must be `vw` only
              "--Form-maxWidth": "700px",
              "--Transition-duration": "0.4s", // set to `none` to disable transition
            },
          }}
        />
        <Box
          sx={(theme) => ({
            width:
              "clamp(100vw - var(--Cover-width), (var(--Collapsed-breakpoint) - 100vw) * 999, 100vw)",
            transition: "width var(--Transition-duration)",
            transitionDelay: "calc(var(--Transition-duration) + 0.1s)",
            position: "relative",
            zIndex: 1,
            display: "flex",
            justifyContent: "flex-end",
            backdropFilter: "blur(4px)",
            backgroundColor: "rgba(255 255 255 / 0.6)",
            [theme.getColorSchemeSelector("dark")]: {
              backgroundColor: "rgba(19 19 24 / 0.4)",
            },
          })}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              minHeight: "100dvh",
              width:
                "clamp(var(--Form-maxWidth), (var(--Collapsed-breakpoint) - 100vw) * 999, 100%)",
              maxWidth: "100%",
              px: 2,
            }}
          >
            <Box
              component="header"
              sx={{
                py: 3,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            ></Box>
            <Box
              component="main"
              sx={{
                my: "auto",
                py: 2,
                pb: 5,
                display: "flex",
                flexDirection: "column",
                gap: 2,
                width: 400,
                maxWidth: "100%",
                mx: "auto",
                borderRadius: "sm",
                "& form": {
                  display: "flex",
                  flexDirection: "column",
                  gap: 2,
                },
                [`& .${formLabelClasses.asterisk}`]: {
                  visibility: "hidden",
                },
              }}
            >
              <div>
                <IconButton color="neutral" onClick={counter.exitLogin}>
                  <ArrowBackIcon />
                </IconButton>

                <Typography component="h2" fontSize="xl2" fontWeight="lg">
                  Sign In
                </Typography>
              </div>
              <form
                // Declare the handleSubmit function as an async function
                onSubmit={async (event) => {
                  event.preventDefault(); 
                  const formElements = event.currentTarget.elements; //Get form elements
                  // get form data
                  // const data = getFormData(formElements);
                  const data = {
                    email: formElements.email.value, // Get the mailbox, the value entered by the user
                    password: formElements.password.value, // Get the password, the value entered by the user
                  };
                  // alert(JSON.stringify(data, null, 2));
                  // Verify the form data, and log in if the verification is passed
                   // Use the await keyword to handle the promise object returned by the verifyAccount function
                  login(data, counter);
                  // const result = await verifyAccount(data);
                  // console.log(typeof result);
                  // console.log("result:" + result);
                  // if (result) {
                  //   //登录成功
                  //   console.log("Login success");
                  //   console.log("loginState:" + counter.loginState);
                  //   counter.login(); //登录成功，设置登录状态为 true
                  //   counter.exitLogin(); //跳转到另一个页面，这里是退出登录页面
                  // } else {
                  //   //登录失败
                  //   console.log("Login failed");
                  //   alert("Email or password is wrong, please try again.");
                  // }
                }}
              >
                <FormControl required>
                  <FormLabel>Email</FormLabel>
                  <Input
                    placeholder="Enter your email"
                    type="email"
                    name="email"
                  />
                </FormControl>
                <FormControl required>
                  <FormLabel>Password</FormLabel>
                  <Input
                    placeholder="•••••••"
                    type="password"
                    name="password"
                  />
                </FormControl>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Link
                    fontSize="sm"
                    color="neutral"
                    href="#replace-with-a-link"
                    fontWeight="lg"
                    onClick={counter.toRegister}
                  >
                    Sign up
                  </Link>
                  <Link
                    fontSize="sm"
                    color="neutral"
                    href="#replace-with-a-link"
                    fontWeight="lg"
                    onClick={counter.toForget}
                  >
                    Forgot password
                  </Link>
                </Box>
                <Button type="submit" color="neutral" fullWidth>
                  Sign in
                </Button>
              </form>
            </Box>
            <Box component="footer" sx={{ py: 3 }}>
              <Typography level="body3" textAlign="center">
                Copyright © 2023 Group 07. All Rights Reserved
              </Typography>
            </Box>
          </Box>
        </Box>
        <Box
          align="center"
          sx={(theme) => ({
            height: "100%",

            position: "fixed",
            right: 0,
            top: 0,
            bottom: 0,
            paddingTop: 40,
            left: "clamp(0px, (100vw - var(--Collapsed-breakpoint)) * 999, 100vw - var(--Cover-width))",
            transition:
              "background-image var(--Transition-duration), left var(--Transition-duration) !important",
            transitionDelay: "calc(var(--Transition-duration) + 0.1s)",
            backgroundColor: "background.level1",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            
          })}
        >
          <img src={logo} width="300" height="50" alt="OldPhoneDealslogo" />
        </Box>
      </CssVarsProvider>
    );
  }
}

const SignUpSteps = ['Sign Up', 'Verify Email'];

//这个是注册页面
function SignUp(props) {
  let counter = props.stat;

  const [page,setPage] = React.useState('Sign Up')

  const toVerify = ()=>{
    setPage('Verify Email')
  }

  const toSignUp = ()=>{
    setPage('Sign Up')
  }


  //定义注册的函数
const register = async (data, counter) => {
  try {
    const response = await axios.post("http://localhost:5001/api/users", data);
  
    console.log(response);

    if (response.status === 201) {
      alert(
        "Register success, please verify your email via the link we sent to you!"
      );
      toVerify()
      return true;
    } else if(response.status === 400){
      alert("User already exists");
      toVerify()
    }
    else if(response.status == 401){
      alert("Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one numeric digit, and one special character.");
    }else{
      alert("User already exists");
    }
    return false;

  } catch (error) {
    const respData = error.response && error.response.data;
    if(respData && respData.message){
      alert(respData.message)
    }else{
      alert('register fail,please retry')
    }

    if(error.response && error.response.status === 400){
      alert("User already exists");
      toVerify()
    }
    return false;
  }
};


  return (
    <CssVarsProvider disableTransitionOnChange>
      <CssBaseline />
      <GlobalStyles
        styles={{
          ":root": {
            "--Collapsed-breakpoint": "769px", // form will stretch when viewport is below `769px`
            "--Cover-width": "40vw", // must be `vw` only
            "--Form-maxWidth": "700px",
            "--Transition-duration": "0.4s", // set to `none` to disable transition
          },
        }}
      />

      <Box
        sx={(theme) => ({
          width:
            "clamp(100vw - var(--Cover-width), (var(--Collapsed-breakpoint) - 100vw) * 999, 100vw)",
          transition: "width var(--Transition-duration)",
          transitionDelay: "calc(var(--Transition-duration) + 0.1s)",
          position: "relative",
          zIndex: 1,
          display: "flex",
          justifyContent: "flex-end",
          backdropFilter: "blur(4px)",
          backgroundColor: "rgba(255 255 255 / 0.6)",
          [theme.getColorSchemeSelector("dark")]: {
            backgroundColor: "rgba(19 19 24 / 0.4)",
          },
        })}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            minHeight: "100dvh",
            width:
              "clamp(var(--Form-maxWidth), (var(--Collapsed-breakpoint) - 100vw) * 999, 100%)",
            maxWidth: "100%",
            px: 2,
          }}
        >
          <Box
            component="header"
            sx={{
              py: 3,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          ></Box>
          <Box
            component="main"
            sx={{
              my: "auto",
              py: 2,
              pb: 5,
              display: "flex",
              flexDirection: "column",
              gap: 2,
              width: 400,
              maxWidth: "100%",
              mx: "auto",
              borderRadius: "sm",
              "& form": {
                display: "flex",
                flexDirection: "column",
                gap: 2,
              },
              [`& .${formLabelClasses.asterisk}`]: {
                visibility: "hidden",
              },
            }}
          >
            <div>
              <IconButton color="nerual" onClick={counter.exitRegister}>
                <ArrowBackIcon />
              </IconButton>

              <Typography component="h2" fontSize="xl2" fontWeight="lg">
                Sign Up
              </Typography>
            </div>
            <form
              onSubmit={(event) => {
                event.preventDefault();
                const formElements = event.currentTarget.elements;
                const data = {
                  firstname: formElements.first.value,
                  lastname: formElements.last.value,
                  email: formElements.email.value,
                  password: formElements.password.value,
                };
                console.log(data);
                register(data, counter);
                // alert(JSON.stringify(data, null, 2));
              }}
            >
              <FormControl required>
                <FormLabel>First Name</FormLabel>
                <Input
                  placeholder="Enter your first name"
                  type="str"
                  name="first"
                />
              </FormControl>
              <FormControl required>
                <FormLabel>Last Name</FormLabel>
                <Input
                  placeholder="Enter your last name"
                  type="str"
                  name="last"
                />
              </FormControl>
              <FormControl required>
                <FormLabel>Email Address</FormLabel>
                <Input
                  placeholder="Enter your email"
                  type="email"
                  name="email"
                />
              </FormControl>

              <FormControl required>
                <FormLabel>Password</FormLabel>
                <Input placeholder="•••••••" type="password" name="password" />
              </FormControl>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Link
                  fontSize="sm"
                  color="neutral"
                  href="#replace-with-a-link"
                  fontWeight="lg"
                  onClick={counter.exitRegister}
                >
                  Sign in
                </Link>
              </Box>
              <Button type="submit" color="neutral" fullWidth>
                Sign up
              </Button>
            </form>
          </Box>
          <Box component="footer" sx={{ py: 3 }}>
            <Typography level="body3" textAlign="center">
              Copyright © 2023 Group 07. All Rights Reserved
            </Typography>
          </Box>
        </Box>
      </Box>
      <Box
        align="center"
        sx={(theme) => ({
          height: "100%",

          position: "fixed",
          right: 0,
          top: 0,
          bottom: 0,
          paddingTop: 40,
          left: "clamp(0px, (100vw - var(--Collapsed-breakpoint)) * 999, 100vw - var(--Cover-width))",
          transition:
            "background-image var(--Transition-duration), left var(--Transition-duration) !important",
          transitionDelay: "calc(var(--Transition-duration) + 0.1s)",
          backgroundColor: "background.level1",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        })}
      >
        <img src={logo} width="300" height="50" alt="OldPhoneDealslogo" />
      </Box>
    </CssVarsProvider>
  );
}

// 定义登录的函数
const login = async (data, counter) => {
  // 这里调用 verifyAccount 函数，并处理返回的结果
  const result = await verifyAccount(data);

  if (result.status === 200) {
    console.log("Login success");
    // alert("Login success");
    redirectToLastPage(counter); //跳转到登录成功页面（也就是上一个页面）。这里要传入 counter。
    //把 token 存入 localStorage
    localStorage.setItem("token", result.data.token);
    //查看 localStorage 中的 token
    console.log(localStorage.getItem("token"));
  } else if (result === 401) {
    console.log("Invalid email or password");
    alert("Invalid email or password");
  } else if (result === 400) {
    console.log("Please verify your email first");
    alert("Please verify your email first");
  } else {
    console.log("Unknown error");
    alert("Unknown error");
  }
 
};

//A function to obtain backend data and verify user login information, used in conjunction with login()
async function verifyAccount(data) {
  console.log(data);
  //Use axios to send data to the backend
  try {
    // Use the await keyword to wait for the result of axios.post. Pass in data as the request body.
    const response = await axios.post(
      "http://localhost:5001/api/users/login",
      data
    );
    return response; //Return response, including status and data, where token is in data
  } catch (error) {
    console.log(error.response.status);
    return error.response.status; 
  }
}



// Define the jump function, used with login()
const redirectToLastPage = (counter) => {
  counter.login(); // Jump to another page, here is the login success page
  counter.exitLogin(); // Jump to another page, here is to leave the login page
};


//The function of obtaining back-end data and verifying user registration information, used in conjunction with register()
async function createAccount(data) {
  
}

// Define the jump function, use it with register()
const redirectToLoginPage = (counter) => {
  counter.exitRegister(); 
  counter.toLogin(); 
};
