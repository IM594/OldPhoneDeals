import * as React from "react";
import { useState } from "react";
import Badge from "@mui/joy/Badge";
import Box from "@mui/joy/Box";

import Input from "@mui/joy/Input";
import IconButton from "@mui/joy/IconButton";
import Typography from "@mui/joy/Typography";
import Sheet from "@mui/joy/Sheet";

import ListItemContent from '@mui/joy/ListItemContent';
import { CircularProgress, ListItemDecorator } from "@mui/joy";
import ExitIcon from "@mui/icons-material/ExitToApp";
import NotificationsIcon from "@mui/icons-material/ShoppingCart";
import SearchIcon from "@mui/icons-material/Search";
import PersonIcon from "@mui/icons-material/Person";
import Modal from "@mui/joy/Modal";
import ModalDialog from "@mui/joy/ModalDialog";
import ModalClose from "@mui/joy/ModalClose";
import FilterBar from "./filter-bar";
import List from "@mui/joy/List";
import ListItem from "@mui/joy/ListItem";
import DoneIcon from "@mui/icons-material/Done";
import logo from "../pics/logo.png";
import axios from "axios"; // 导入 axios

import ExitUserIcon from "@mui/icons-material/ArrowBack";
import { ListItemAvatar } from "@mui/material";
import { Avatar } from "@mui/joy";

export default function ColorInversionHeader(props) {
  let [cartLoadFinish, setFinish] = React.useState(false);
  let [open, setOpenState] = React.useState(false);
  let counter = props.stat;
  let cartList = countArr(counter.cartState);

  console.log('header', counter)

  async function handleSearch(event) {

    if (window.event.keyCode == 13) {
      if (event.target.value != '')
        axios
          .get("http://localhost:5001/api/phones/getPhonesByTitle/?text=" + event.target.value) // 调用 axios.get 方法，加上 http://
          .then((response) => {
            // 处理成功的响应
            return response.data; // 返回响应数据
          })
          .then((data) => {
            // 处理响应数据
            counter.setSearchItems(data); // 更新 soldOutPhones 状态

            counter.toSearch();
          })
          .catch((error) => {
            // 处理失败的响应
            console.error(error); // 打印错误信息
            throw error; // 抛出错误
          });
      else
        axios
          .get("http://localhost:5001/api/phones/") // 调用 axios.get 方法，加上 http://
          .then((response) => {
            console.log(response.data)
            // 处理成功的响应
            return response.data; // 返回响应数据
          })
          .then((data) => {
            // 处理响应数据
            counter.setSearchItems(data); // 更新 soldOutPhones 状态

            counter.toSearch();
          })
          .catch((error) => {
            // 处理失败的响应
            console.error(error); // 打印错误信息
            throw error; // 抛出错误
          });
    }
  }

    //如果点击了退出登录，则清楚 localstorage 中的数据，然后跳转到 home 页
    function logout(counter) {
      console.log('logout start')
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      counter.logout();
      counter.exitLogin();
      counter.exitItem();
      counter.exitUser();
      counter.exitRegister();
      counter.exitSearch();
      counter.exitForget();
      console.log('logout end')
    }

  return (
    <React.Fragment>
      <Sheet
        variant="solid"
        color="default"
        invertedColors
        className="header-header"
        sx={{
          display: "flex",
          alignItems: "center",
          flexGrow: 1,
          p: 2,
          mx: 0,
          my: 0,
          borderRadius: { xs: 0, sm: "xs" },
          minWidth: "min-content",
        }}
      >
        <Box sx={{ display: "flex", gap: 1, px: 2 }}>
          <img src={logo} width="300" height="50" alt="OldPhoneDealslogo" />
        </Box>
        <div className="search-bar">
          {counter.searchPage ? <FilterBar stat={counter} brands={props.brandsList}></FilterBar> : <div />}
        </div>
        <Box
          sx={{ display: "flex", flexDirection: "row-reverse", flexShrink: 0 }}
        >
          <Box sx={{ display: "flex", gap: 2 }}>
            <Input
              placeholder="Search..."
              variant="outlined"
              size="sm"
              onKeyDown={handleSearch}
              endDecorator={
                <Typography
                  component="span"
                  variant="soft"
                  level="body3"
                  sx={{ bgcolor: "background.surface", mx: 0 }}
                >
                  <SearchIcon />
                </Typography>
              }
              sx={{
                "--Input-radius": "40px",
                "--Input-paddingInline": "12px",
                width: 160,
                display: { xs: "none", lg: "flex" },
              }}
            />{counter.cartPage ? (
              <IconButton
                sx={{ borderRadius: "xl" }}
                onClick={counter.exitCart}
              >
                <ExitUserIcon></ExitUserIcon>
              </IconButton>
            ) : <Badge
              badgeContent={counter.cartState.length}
              variant="solid"
              color="danger"
            >
              <IconButton
                sx={{ borderRadius: "xl" }}
                onClick={() => {
                  !counter.loginState ? counter.toLogin() :
                    counter.toCart();
                }}
              >
                <NotificationsIcon></NotificationsIcon>
              </IconButton>
            </Badge>}

            {counter.userPage ? (
              <IconButton
                sx={{ borderRadius: "xl" }}
                onClick={counter.exitUser}
              >
                <ExitUserIcon></ExitUserIcon>
              </IconButton>
            ) : (
              <IconButton
                sx={{ borderRadius: "xl" }}
                onClick={() => {
                  counter.loginState ? counter.toUser() : counter.toLogin();
                }}
              >
                <PersonIcon></PersonIcon>
              </IconButton>
            )}

            {counter.loginState ? (
              <IconButton
                sx={{ borderRadius: "xl" }}
                onClick={
                  //如果点击了exit,则清楚 localstorage 中的数据，然后跳转到 home 页
                  () => logout(counter)
                }
              >
                <ExitIcon></ExitIcon>
              </IconButton>
            ) : (
              <div></div>
            )}
          </Box>
        </Box>
      </Sheet>
    </React.Fragment>
  );



  function countArr(arr) {
    var hash = new Map();
    arr.forEach((element) => {
      if (!hash.get(element)) {
        hash.set(element, 1);
      }
      else {
        hash.set(element, hash.get(element) + 1);
      }
    });
    return hash;
  }

  function countArr(arr) {
    var hash = new Map();
    arr.forEach((element) => {
      if (!hash.get(element)) {
        hash.set(element, 1);
      }
      else {
        hash.set(element, hash.get(element) + 1);
      }
    });
    return hash;
  }
}
