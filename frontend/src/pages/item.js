import React, { useState } from "react";
import AspectRatio from "@mui/joy/AspectRatio";
import Box from "@mui/joy/Box";
import IconButton from "@mui/joy/IconButton";
import Sheet from "@mui/joy/Sheet";
import Typography from "@mui/joy/Typography";
import Close from "@mui/icons-material/Close";
import { Button, Link } from "@mui/joy";
import Comment from "../components/comment";
import { OwnComment } from "../components/user-comment";

import Avatar from "@mui/joy/Avatar";
import Modal from "@mui/joy/Modal";
import ModalClose from "@mui/joy/ModalClose";
import List from "@mui/joy/List";
import ListItem from "@mui/joy/ListItem";
import ListItemContent from "@mui/joy/ListItemContent";
import ListItemDecorator from "@mui/joy/ListItemDecorator";
import DoneIcon from "@mui/icons-material/Done";
import axios from "axios";
import FormControl from "@mui/joy/FormControl";
import FormLabel from "@mui/joy/FormLabel";

import Input from "@mui/joy/Input";
import { Rating } from "@mui/material";
import { get } from "mongoose";
import CommentView from "../components/user-comment";

export default function LevelOfImportance(props) {
  let counter = props.stat;
  const [open, setOpen] = React.useState(false);
  const [info, setInfo] = useState({ 'reviews': [] }); // 用于存储商品信息
  const [commentNumber, setCommentNumber] = useState(3); // 用于存储商品信息

  // 用于获取商品信息，只在第一次渲染时调用
  React.useEffect(() => {
    fetchData()
  }, []);

  const fetchData = ()=>{
    axios
    .get("http://localhost:5001/api/phones/" + counter.itemInfo.id) // 调用 axios.get 方法，加上 http://
    .then((response) => {
      // 处理成功的响应
      console.log(response.data);
      return response.data; // 返回响应数据
    })
    .then((data) => {
      // 处理响应数据
      setInfo(data); // 设置 info 状态。
      //info 是一个对象，包含了商品的所有信息
      //把 info 解析成 json 格式
      // let info = JSON.stringify(data);
      console.log("!!!!!info:" + JSON.stringify(data));
    })
    .catch((error) => {
      // 处理失败的响应
      console.error(error); // 打印错误信息
      throw error; // 抛出错误
    });
  }

  //遍历评论

  // //
  let comments = [];
  for (let index = 0; index < info.reviews.length; index++) {
    const item = info.reviews[index];
    comments.unshift({
      id: item.reviwerid,
      userName: item.reviewerName,
      content: item.comment,
      hiddenState: item.hidden ==  undefined? false : eval(item.hidden), //用于控制评论的显示与隐藏
      rating: item.rating,
    },)
  };
  console.log('comments', comments);
  return (
    <React.Fragment>
      <Box
        sx={{
          display: "flex",
          width: "98%",
          py: 2,
          px: 2,
          borderRadius: "xs",
        }}
      >
        <Box
          sx={{
            border: "1px solid",
            borderColor: "background.level2",
            alignSelf: "center",
            maxWidth: "100%",
            minWidth: { xs: "100%", sm: "100%" },
            mx: "auto",
            boxShadow: "sm",
            borderRadius: "md",
            overflow: "auto",
          }}
        >
          <Sheet
            sx={{
              borderWidth: "0 0 1px 0",
              display: "flex",
              alignItems: "center",
              p: 2,
              borderBottom: "1px solid",
              borderColor: "background.level2",
            }}
          >
            <IconButton
              size="sm"
              variant="plain"
              color="neutral"
              sx={{ ml: "auto" }}
              onClick={counter.exitItem}
            >
              <Close />
            </IconButton>
          </Sheet>
          <Sheet sx={{ p: 2, display: "flex" }}>
            <Sheet
          
            >
              <AspectRatio
                variant="outlined"
                objectFit="contain"
                ratio={3/3}
                sx={{
                  width: 600,
               
                  bgcolor: "background.level2",
                  borderRadius: "md",
                }}
              >
                <img alt="" src={counter.itemInfo.img} />
              </AspectRatio>
            </Sheet>
            <Sheet  sx={{ mx: 2, my: 4, py: 0,width:600 }}>
              <Typography
                component="h1"
                fontSize="xl4"
                fontWeight="lg"
                color="textPrimary"
                gutterBottom
                sx={{ px: 2 }}
              >
                {counter.itemInfo.title}
              </Typography>
              <Typography
                component="h1"
                fontSize="xl"
                fontWeight="lg"
                color="textPrimary"
                gutterBottom
                sx={{ px:2 }}
              >
                Brand: {info.brand}
              </Typography>
              <Typography
                component="h1"
                fontSize="xl"
                fontWeight="lg"
                color="textPrimary"
                gutterBottom
                sx={{ px:2 }}
              >
                Stock: {info.stock}
              </Typography>
              <Typography
                component="h1"
                fontSize="xl"
                fontWeight="lg"
                color="textPrimary"
                gutterBottom
                sx={{ px:2 }}
              >
                Seller: {info.seller}
              </Typography>
              <Typography
                component="h1"
                fontSize="xl"
                fontWeight="lg"
                color="textPrimary"
                gutterBottom
                sx={{ px:2 }}
              >
                Price: ${info.price}
              </Typography>
                
              <Typography
                component="h2"
                fontSize="l"
                fontWeight="lg"
                color="textPrimary"
                gutterBottom
                sx={{ px:2 }}
              >
                Current added quantity:{" "}
                {counter.cartState.filter((v) => v == info._id).length}
              </Typography>
              <Button
                type="submit"
                color="danger"
                fullWidth
                sx={{ mx: 2, my: 4, py: 2 }}
                onClick={() => { if (counter.loginState) setOpen(true); else counter.toLogin() }}
              >
                <Typography
                  component="h1"
                  fontSize="xl"
                  fontWeight="lg"
                  color="textPrimary"
                  gutterBottom
                >
                  Add to cart
                </Typography>
              </Button>
            </Sheet>
          </Sheet>
          <Sheet sx={{ px: 10, py: 10 }}>
            <Box sx={{ width: "100%" }}>
              <Typography
                id="ellipsis-list-demo"
                level="body1"
                textTransform="uppercase"
                fontWeight="xl"
                mb={5}
                sx={{ letterSpacing: "0.15rem" }}
              >
                Comments
              </Typography>
              <List
                sx={{
                  "--ListItemDecorator-size": "86px",
                  "--List-gap": "10px",
                  "--ListItem-minHeight": "50px",
                  "--ListItem-paddingY": "10px",
                }}
              >
                {comments.slice(0, commentNumber).map((value) => {

                  if (JSON.parse(localStorage.getItem('user'))) {
                    if (value.id != JSON.parse(localStorage.getItem('user'))._id) {
                      return (<CommentView value = {value}></CommentView>);
                    }
                    else {
                      console.log('own');
                      return (<OwnComment value = {value} phoneId = {counter.itemInfo.id}></OwnComment>);
                    }
                  } else {
                    return (<CommentView value = {value}></CommentView>);
                  }
                })}
              </List>
              <Box sx={{ px: 70, width: 100 }}>

                <Link onClick={() => (setCommentNumber(commentNumber + 8 >= comments.length ? comments.length : commentNumber + 8))}>{commentNumber == comments.length ? " " : 'More'}</Link>

              </Box>

            </Box>
            <Comment onRefresh={()=>fetchData()} itemInfo={counter.itemInfo}></Comment>
          </Sheet>
        </Box>
        <Modal
          aria-labelledby="modal-title"
          aria-describedby="modal-desc"
          open={open}
          onClose={() => setOpen(false)}
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Sheet
            variant="outlined"
            sx={{
              maxWidth: 500,
              borderRadius: "md",
              p: 3,
              boxShadow: "lg",
            }}
          >
            <ModalClose
              variant="outlined"
              sx={{
                top: "calc(-1/4 * var(--IconButton-size))",
                right: "calc(-1/4 * var(--IconButton-size))",
                boxShadow: "0 2px 12px 0 rgba(0 0 0 / 0.2)",
                borderRadius: "50%",
                bgcolor: "background.body",
              }}
            />
            <Typography
              component="h2"
              id="modal-title"
              level="h4"
              textColor="inherit"
              fontWeight="lg"
              mb={1}
            >
              Some info
            </Typography>

            <form
              onSubmit={(event) => {
                event.preventDefault();
                const formElements = event.currentTarget.elements;
                var data = [];
                if (
                  parseInt(formElements.numbers.value) ==
                  formElements.numbers.value
                ) {
                  for (
                    let index = 0;
                    index < parseInt(formElements.numbers.value);
                    index++
                  ) {
                    data.unshift(info._id);
                  }
                  counter.addCart(data);
                  alert('Add to cart successfully');
                  setOpen(false);
                }
              }}
            >
              <FormControl required>
                <FormLabel>Total:</FormLabel>
                <Input placeholder="Enter number" type="int" name="numbers" />
              </FormControl>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              ></Box>
              <Box sx={{ display: "flex", flexDirection: "row-reverse" }}>
                <IconButton type="submit" color="none">
                  <DoneIcon></DoneIcon>
                </IconButton>
              </Box>
            </form>
          </Sheet>
        </Modal>
      </Box>
    </React.Fragment>
  );
}
