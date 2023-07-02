import React, { useEffect, useState } from "react";

import List from "@mui/joy/List";
import ListItem from "@mui/joy/ListItem";
import Switch from "@mui/joy/Switch";
import { Rating } from "@mui/material";
import ListItemDecorator, {
  listItemDecoratorClasses,
} from "@mui/joy/ListItemDecorator";
import { CssVarsProvider } from "@mui/joy/styles";
import GlobalStyles from "@mui/joy/GlobalStyles";
import CssBaseline from "@mui/joy/CssBaseline";
import IconButton from "@mui/joy/IconButton";
import axios from "axios";
import Select from "@mui/joy/Select";
import Option from "@mui/joy/Option";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import TableSortAndSelection from "../components/page-table";
import SellerTable from "../components/seller-table";
import Button from "@mui/joy/Button";

import FormControl from "@mui/joy/FormControl";
import FormLabel, { formLabelClasses } from "@mui/joy/FormLabel";
import Input from "@mui/joy/Input";

import ListItemContent from "@mui/joy/ListItemContent";
import ListItemButton from "@mui/joy/ListItemButton";
import Typography from "@mui/joy/Typography";
import Box from "@mui/joy/Box";
import InboxIcon from "@mui/icons-material/Person";
import Star from "@mui/icons-material/Edit";
import People from "@mui/icons-material/Settings";
import Info from "@mui/icons-material/Message";

import { Avatar } from "@mui/material";
import { Sheet } from "@mui/joy";
import service from "../utils/request";
export default function ExampleGmailList(props) {
  let counter = props.stat;
  let initialUser = JSON.parse(localStorage.getItem("user"));
  const [user,setUser] = useState(initialUser || {})
  let token = localStorage.getItem("token");
  console.log(user);

  
  if(!user){
    user = {}
  }

  useEffect(()=>{
    if(!user._id){
      service
      .get("http://localhost:5001/api/users/profile")
      .then((response) => {
        if(response.data){
          localStorage.setItem("user", JSON.stringify(response.data));
          setUser(response.data)
        }
      })
      .catch((error) => {
        console.error('fetch user',error);
      });
    }
  },[])

  const [index, setIndex] = React.useState(0);
  return (
    <>
      <Box sx={{ py: 2, pr: 2, display: "flex" }}>
        <Box sx={{ py: 2, pr: 2, width: 320, display: "flex" }}>
          <List
            aria-label="Sidebar"
            sx={{
              height: 1000,
              "--ListItem-paddingLeft": "0px",
              "--ListItemDecorator-size": "64px",
              "--ListItemDecorator-color": (theme) =>
                theme.vars.palette.text.secondary,
              "--ListItem-minHeight": "64px",
              "--List-nestedInsetStart": "13px",
              [`& .${listItemDecoratorClasses.root}`]: {
                justifyContent: "flex-end",
                pr: "18px",
              },
              '& [role="button"]': {
                borderRadius: "0 20px 20px 0",
              },
            }}
          >
            <ListItem sx={{ mx: 10 }}>
              <ListItemDecorator sx={{ alignSelf: "flex-start" }}>
                <Avatar src="" />
              </ListItemDecorator>
              <ListItemContent>
                <Typography>{user.firstname + " " + user.lastname}</Typography>
              </ListItemContent>
            </ListItem>
            <ListItem>
              <ListItemButton
                selected={index === 0}
                variant={index === 0 ? "soft" : "plain"}
                color={index === 0 ? "danger" : undefined}
                onClick={() => setIndex(0)}
              >
                <ListItemDecorator>
                  <InboxIcon fontSize="lg" />
                </ListItemDecorator>
                <ListItemContent>User profile</ListItemContent>
              </ListItemButton>
            </ListItem>
            <ListItem>
              <ListItemButton
                selected={index === 1}
                variant={index === 1 ? "soft" : "plain"}
                color={index === 1 ? "neutral" : undefined}
                onClick={() => setIndex(1)}
              >
                <ListItemDecorator>
                  <Star fontSize="lg" />
                </ListItemDecorator>
                <ListItemContent>Change password</ListItemContent>
              </ListItemButton>
            </ListItem>
            <ListItem nested>
              <ListItem>
                <ListItemButton
                  selected={index === 2}
                  variant={index === 2 ? "soft" : "plain"}
                  color={index === 2 ? "primary" : undefined}
                  onClick={() => setIndex(2)}
                >
                  <ListItemDecorator>
                    <People fontSize="lg" />
                  </ListItemDecorator>
                  <ListItemContent>Manage listings</ListItemContent>
                </ListItemButton>
              </ListItem>
              <ListItem>
                <ListItemButton
                  selected={index === 3}
                  variant={index === 3 ? "soft" : "plain"}
                  color={index === 3 ? "warning" : undefined}
                  onClick={() => setIndex(3)}
                >
                  <ListItemDecorator>
                    <Info fontSize="lg" />
                  </ListItemDecorator>
                  <ListItemContent>View comments</ListItemContent>
                </ListItemButton>
              </ListItem>
            </ListItem>
          </List>
        </Box>
        <Sheet>
          {index == 0 ? (
            <ChangeName stat={counter} user={user} token={token} />
          ) : index == 1 ? (
            <ChangePassword stat={counter} user={user} token={token} />
          ) : index == 2 ? (
            <DataTable stat={counter} user={user} token={token}></DataTable>
          ) : (
            <>
              <Typography level="h2">Selled Phone Comment</Typography>
              <SellerTable></SellerTable>
            </>
          )}
        </Sheet>
      </Box>
    </>
  );
}

function DataTable(props) {
  return <TableSortAndSelection></TableSortAndSelection>;
}
function ChangeName(props) {
  let counter = props.stat;
  return (
    <CssVarsProvider disableTransitionOnChange>
      <CssBaseline />
      <GlobalStyles
        styles={{
          ":root": {
            "--Collapsed-breakpoint": "769px", // form will stretch when viewport is below `769px`
            //   '  --Form-maxWidth': '700px',
            "--Transition-duration": "0.4s", // set to `none` to disable transition
          },
        }}
      />
      <Box
        sx={(theme) => ({
          width:
            "clamp(100vw - var(--Cover-width), (var(--Collapsed-breakpoint) - 100vw) * 999, 100vw)",
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
            px: 35,
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
              <Typography component="h2" fontSize="xl2" fontWeight="lg">
                Update
              </Typography>
            </div>
            <form
              onSubmit={(event) => {
                event.preventDefault();
                const formElements = event.currentTarget.elements;
                const data = {
                  firstname: formElements.first.value,
                  lastname: formElements.last.value,
                  password: formElements.password.value,
                  email: formElements.email.value,
                };
                var myHeaders = new Headers();
                myHeaders.append(
                  "Authorization",
                  "Bearer " + localStorage.getItem("token")
                );

                myHeaders.append("Content-Type", "application/json");

                var requestOptions = {
                  method: "PUT",
                  headers: myHeaders,
                  body: JSON.stringify(data),
                  redirect: "follow",
                };

                fetch("http://localhost:5001/api/users/profile", requestOptions)
                  .then((response) => response.text())
                  .then((result) => {
                    if (!JSON.parse(result).message) alert("Done");
                    else alert(JSON.parse(result).message);
                  })
                  .catch((error) => alert("error " + error));
              }}
            >
              <FormControl required>
                <FormLabel>First Name</FormLabel>
                <Input defaultValue={props.user.firstname} type="str" name="first" />
              </FormControl>
              <FormControl required>
                <FormLabel>Last Name</FormLabel>
                <Input defaultValue={props.user.lastname} type="str" name="last" />
              </FormControl>
              <FormControl required>
                <FormLabel>Email</FormLabel>
                <Input defaultValue={props.user.email} type="email" name="email" />
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
              ></Box>
              <Button type="submit" color="neutral" fullWidth>
                Update
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
    </CssVarsProvider>
  );
}

function ChangePassword(props) {
  let counter = props.stat;
  return (
    <CssVarsProvider disableTransitionOnChange>
      <CssBaseline />
      <GlobalStyles
        styles={{
          ":root": {
            "--Collapsed-breakpoint": "769px", // form will stretch when viewport is below `769px`
            //   '  --Form-maxWidth': '700px',
            "--Transition-duration": "0.4s", // set to `none` to disable transition
          },
        }}
      />
      <Box
        sx={(theme) => ({
          width:
            "clamp(100vw - var(--Cover-width), (var(--Collapsed-breakpoint) - 100vw) * 999, 100vw)",
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
            px: 35,
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
              <Typography component="h2" fontSize="xl2" fontWeight="lg">
                Update
              </Typography>
            </div>
            <form
              onSubmit={(event) => {
                event.preventDefault();
                const formElements = event.currentTarget.elements;
                const data = {
                  password: formElements.password.value,
                  newPassword: formElements.password2.value,
                };
                var config = {
                  method: "put",
                  url: "http://localhost:5001/api/users/profile",
                  headers: {
                    Authorization: "Bearer " + localStorage.getItem("token"),
                    "User-Agent": "Apifox/1.0.0 (https://www.apifox.cn)",
                    "Content-Type": "application/json",
                  },
                  data: data,
                };

                axios(config)
                  .then(function (response) {
                    alert(response.data.message || 'update password ok');
                  })
                  .catch(function (error) {
                    let resp = error.response;
                    if(resp.data && resp.data.message){
                      alert(resp.data.message);
                    }else{
                      alert('Update Password failed')
                    }
                    
                  });
              }}
            >
              <FormControl required>
                <FormLabel>Current Password</FormLabel>
                <Input placeholder="•••••••" type="password" name="password" />
              </FormControl>
              <FormControl required>
                <FormLabel>New Password</FormLabel>
                <Input placeholder="•••••••" type="password" name="password2" />
              </FormControl>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              ></Box>
              <Button type="submit" color="neutral" fullWidth>
                Update
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
    </CssVarsProvider>
  );
}
function CommentView1(props) {
  var myHeaders = new Headers();
  let [infoList, setInfoList] = useState("[]");
  myHeaders.append("Authorization", "Bearer " + localStorage.getItem("token"));

  var requestOptions = {
    method: "POST",
    headers: myHeaders,
    redirect: "follow",
  };

  fetch(
    "http://localhost:5001/api/phones/getUsersPhonesAndComments",
    requestOptions
  )
    .then((response) => response.text())
    .then((result) => {
      setInfoList(result);
    })
    .catch((error) => console.log("error", error));

  let comments = [];
  infoList = JSON.parse(infoList);
  console.log(infoList);

  for (let index = 0; index < infoList.length; index++) {
    console.log(infoList[index]);
    const item = infoList[index];
    comments.unshift({
      userIcon: require("../pics/phone_default_images" + item.image),
      _id: item._id,
      userName: item.review ? item.review.comment : "尚未评论",
      content: item.title,
      commentState: item.review
        ? item.review.hidden == undefined
          ? false
          : eval(item.review.hidden)
        : false, //用于控制评论的显示与隐藏
      rating: item.review ? item.review.comment : "0",
    });
  }
  console.log(comments);

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
    if (comments.length === -1) {
      return (page + 1) * rowsPerPage;
    }
    return rowsPerPage === -1
      ? comments.length
      : Math.min(comments.length, (page + 1) * rowsPerPage);
  };
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - comments.length) : 0;

  return (
    <Sheet
      variant="outlined"
      sx={{ width: "200", boxShadow: "sm", borderRadius: "sm", px: 2, mx: 2 }}
    >
      <List
        sx={{
          "--ListItemDecorator-size": "86px",
          "--List-gap": "10px",
          "--ListItem-minHeight": "50px",
          "--ListItem-paddingY": "10px",
        }}
      >
        {comments
          .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
          .map((value) => (
            <ListItem>
              <ListItemDecorator sx={{ alignSelf: "flex-start" }}>
                <Avatar src={value.userIcon} />
              </ListItemDecorator>
              <ListItemContent>
                <Typography
                  textColor={"neutral.700"}
                  component="h1"
                  fontSize="xl"
                  fontWeight="lg"
                  color="textPrimary"
                  gutterBottom
                  noWrap
                >
                  {" "}
                  {value.userName}
                </Typography>
                <Typography
                  textColor={"neutral.700"}
                  sx={{ width: 480 }}
                  level="body2"
                  noWrap
                >
                  {value.content}
                </Typography>
              </ListItemContent>
              <ListItemDecorator sx={{ alignSelf: "flex-start" }}>
                <Box sx={{ mx: 3 }}>
                  {" "}
                  <Rating value={value.rating} readOnly></Rating>
                </Box>
              </ListItemDecorator>

              <ListItemDecorator sx={{ alignSelf: "flex-start" }}>
                <Box sx={{ mx: 3 }}>
                  {" "}
                  <Switch
                    checked={value.commentState}
                    onChange={() => {
                      value.commentState = !value.commentState;
                      console.log(value.commentState);
                      var myHeaders = new Headers();
                      myHeaders.append(
                        "Authorization",
                        "Bearer " + localStorage.getItem("token")
                      );
                      myHeaders.append("Content-Type", "application/json");

                      var raw = JSON.stringify({
                        phoneId: value._id,
                        hidden: value.commentState,
                      });
                      var requestOptions = {
                        method: "PUT",
                        headers: myHeaders,
                        body: raw,
                        redirect: "follow",
                      };

                      fetch(
                        "http://localhost:5001/api/phones/changeCommentHidden",
                        requestOptions
                      )
                        .then((response) => response.text())
                        .then((result) => {
                          if (JSON.parse(result).message != undefined)
                            value.commentState = !value.commentState;
                        })
                        .catch((error) => {
                          value.commentState = !value.commentState;
                          console.log("error", error);
                        });
                    }}
                  >
                    {" "}
                  </Switch>
                </Box>
              </ListItemDecorator>
            </ListItem>
          ))}
      </List>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 2,
          justifyContent: "flex-end",
        }}
      >
        <FormControl orientation="horizontal" size="sm">
          <FormLabel>comments per page:</FormLabel>
          <Select onChange={handleChangeRowsPerPage} value={rowsPerPage}>
            <Option value={5}>5</Option>
            <Option value={10}>10</Option>
            <Option value={25}>25</Option>
          </Select>
        </FormControl>
        <Typography textAlign="center" sx={{ minWidth: 80 }}>
          {labelDisplayedRows({
            from: comments.length === 0 ? 0 : page * rowsPerPage + 1,
            to: getLabelDisplayedRowsTo(),
            count: comments.length === -1 ? -1 : comments.length,
          })}
        </Typography>
        <Box sx={{ display: "flex", gap: 1 }}>
          <IconButton
            size="sm"
            color="neutral"
            variant="outlined"
            disabled={page === 0}
            onClick={() => handleChangePage(page - 1)}
            sx={{ bgcolor: "background.surface" }}
          >
            <KeyboardArrowLeftIcon />
          </IconButton>
          <IconButton
            size="sm"
            color="neutral"
            variant="outlined"
            disabled={
              comments.length !== -1
                ? page >= Math.ceil(comments.length / rowsPerPage) - 1
                : false
            }
            onClick={() => handleChangePage(page + 1)}
            sx={{ bgcolor: "background.surface" }}
          >
            <KeyboardArrowRightIcon />
          </IconButton>
        </Box>
      </Box>
    </Sheet>
  );
}

function CommentView2(props) {
  var myHeaders = new Headers();
  let [infoList, setInfoList] = useState("[]");
  myHeaders.append("Authorization", "Bearer " + localStorage.getItem("token"));

  var requestOptions = {
    method: "POST",
    headers: myHeaders,
    redirect: "follow",
  };

  fetch("http://localhost:5001/api/phones/getSellersPhones", requestOptions)
    .then((response) => response.text())
    .then((result) => {
      setInfoList(result);
    })
    .catch((error) => console.log("error", error));
  console.log("我卖出的");
  infoList = JSON.parse(infoList);

  console.log(infoList);

  let comments = [];
  for (let index = 0; index < infoList.length; index++) {
    console.log(infoList[index]);
    const item = infoList[index];
    comments.unshift({
      userName: item.review ? item.review.comment : "暂无评论",
      content: item.title,
      commentState: item.review
        ? item.review.hidden == undefined
          ? false
          : eval(item.hidden)
        : false, //用于控制评论的显示与隐藏
      rating: item.review ? item.review.rating : 0,
    });
  }
  console.log(comments);

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
    if (comments.length === -1) {
      return (page + 1) * rowsPerPage;
    }
    return rowsPerPage === -1
      ? comments.length
      : Math.min(comments.length, (page + 1) * rowsPerPage);
  };
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - comments.length) : 0;

  return (
    <Sheet
      variant="outlined"
      sx={{ width: "300", boxShadow: "sm", borderRadius: "sm", px: 0, mx: 2 }}
    >
      <List
        sx={{
          "--ListItemDecorator-size": "86px",
          "--List-gap": "10px",
          "--ListItem-minHeight": "50px",
          "--ListItem-paddingY": "10px",
        }}
      >
        {comments
          .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
          .map((value) => (
            <ListItem>
              <ListItemDecorator sx={{ alignSelf: "flex-start" }}>
                <Avatar src={value.userIcon} />
              </ListItemDecorator>
              <ListItemContent>
                <Typography
                  textColor={"neutral.700"}
                  component="h1"
                  fontSize="xl"
                  fontWeight="lg"
                  color="textPrimary"
                  gutterBottom
                  noWrap
                >
                  {" "}
                  {value.userName}
                </Typography>
                <Typography
                  textColor={"neutral.700"}
                  sx={{ width: 480 }}
                  level="body2"
                  noWrap
                >
                  {value.content}
                </Typography>
              </ListItemContent>
              <ListItemDecorator sx={{ alignSelf: "flex-start" }}>
                <Box sx={{ mx: 3 }}>
                  {" "}
                  <Rating value={value.rating} readOnly></Rating>
                </Box>
              </ListItemDecorator>
            </ListItem>
          ))}
      </List>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 2,
          justifyContent: "flex-end",
        }}
      >
        <FormControl orientation="horizontal" size="sm">
          <FormLabel>comments per page:</FormLabel>
          <Select onChange={handleChangeRowsPerPage} value={rowsPerPage}>
            <Option value={5}>5</Option>
            <Option value={10}>10</Option>
            <Option value={25}>25</Option>
          </Select>
        </FormControl>
        <Typography textAlign="center" sx={{ minWidth: 80 }}>
          {labelDisplayedRows({
            from: comments.length === 0 ? 0 : page * rowsPerPage + 1,
            to: getLabelDisplayedRowsTo(),
            count: comments.length === -1 ? -1 : comments.length,
          })}
        </Typography>
        <Box sx={{ display: "flex", gap: 1 }}>
          <IconButton
            size="sm"
            color="neutral"
            variant="outlined"
            disabled={page === 0}
            onClick={() => handleChangePage(page - 1)}
            sx={{ bgcolor: "background.surface" }}
          >
            <KeyboardArrowLeftIcon />
          </IconButton>
          <IconButton
            size="sm"
            color="neutral"
            variant="outlined"
            disabled={
              comments.length !== -1
                ? page >= Math.ceil(comments.length / rowsPerPage) - 1
                : false
            }
            onClick={() => handleChangePage(page + 1)}
            sx={{ bgcolor: "background.surface" }}
          >
            <KeyboardArrowRightIcon />
          </IconButton>
        </Box>
      </Box>
    </Sheet>
  );
}
