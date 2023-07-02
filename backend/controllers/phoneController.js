import asynchandler from "express-async-handler"; //用于自动处理异步错误
import Phone from "../models/phoneModel.js";
import Order from "../models/orderModel.js";
import User from "../models/userModel.js";
import { ObjectId } from "mongodb";
import { get } from "mongoose";

//get all phones
//@desc Fetch all phones
//@route GET /api/phones
//@access Public
const getPhones = asynchandler(async (req, res) => {
  const phones = await Phone.find({'disabled': {$ne: 'true'}}); //find is a mongoose method
  res.json(phones);
});

//get phone by id
//@desc Fetch hot phones
//@route GET /api/phones/hot
//@access Public
const getHotPhones = asynchandler(async (req, res) => {
  const query = [
    // filter out disabled phones
    {
      $match: {
        'disabled': {$ne: 'true'},
        $expr: { $gte: [{ $size: "$reviews" }, 2] },
      },
    },
    // calculate average rating
    { $addFields: { average_rating: { $avg: "$reviews.rating" } } },
    // rank by average rating, -1 means descending
    { $sort: { average_rating: -1 } },
    // limit to 5 phones
    { $limit: 5 },
    // only return title and average rating
    //   { $project: { title: 1, average_rating: 1 } },
  ];
  const hot = await Phone.aggregate(query).exec();

  if (hot) {
    res.json(hot);
  } else {
    res.status(404);
    throw new Error("Hot phones not found");
  }
});

//get phone by id
//@desc Fetch end phones
//@route GET /api/phones/end
//@access Public
const getEndPhones = asynchandler(async (req, res) => {
  const end = await Phone.find({
    stock: { $gt: 0 },
    'disabled': {$ne: 'true'},
  })
    .sort({ stock: 1 })
    .limit(5);
  if (end) {
    res.json(end);
  } else {
    res.status(404);
    throw new Error("Sold out phones not found");
  }
});

//get phone by id
//@desc Fetch phones by title
//@route GET /api/phones/getPhonesByTitle?text=
//@access Public
const getPhonesByTitle = asynchandler(async (req, res) => {
  // get the text from the query string
  const text = req.query.text;
  // if no text, return 400 bad request
  if (!text) {
    res.status(400).send("Please enter a text to search");
    return;
  }
  // this is the query object to search for a phone
  const query = { title: new RegExp(text, "i"), 'disabled': {$ne: 'true'} };
  // 执行查询语句，返回一个数组
  const result = await Phone.find(query);

  if (result) {
    res.json(result);
  } else {
    res.status(404);
    throw new Error("No phones found");
  }
});

// create a phone
//@desc create a phone
//@route POST /api/phones/createPhone
//@access Private
const createPhone = asynchandler(async (req, res) => {
  const { title, brand, description, price, stock } = req.body;
  const imageURL = `/${brand}.jpeg`;
  const phone = new Phone({
    title,
    brand,
    image: imageURL,
    description,
    price,
    stock,
    seller: req.user._id,
  });
  const createdPhone = await phone.save();
  res.status(201).json(createdPhone);
});

//detete a phone, only the seller can delete
//@desc delete a phone
//@route DELETE /api/phones/deletePhone
//@access Private
const deletePhone = asynchandler(async (req, res) => {
  // get the current logged in user's id
  const user = req.user._id;
  const { _id } = req.body;

  // find the phone
  const phone = await Phone.findById(_id);

  // if phone exists
  if (phone) {
    // check if the current logged in user is the seller
    if (phone.seller.toString() === user.toString()) {
      // delete the phone
      await phone.deleteOne({ _id: _id });
      res.json({ message: "Phone removed" });
    } else {
      res.status(401);
      throw new Error("You are not the seller");
    }
  } else {
    res.status(404);
    throw new Error("Phone not found");
  }
});

//edt a phone, only the seller can edit
//@desc edit a phone
//@route PUT /api/phones/editPhone
//@access Private
const editPhone = asynchandler(async (req, res) => {
  const user = req.user._id;
  const { _id, title, brand, description, price, stock } = req.body;
  const phone = await Phone.findById(_id);
  if (phone) {
    if (phone.seller.toString() === user.toString()) {
      // update the phone
      phone.title = title;
      phone.brand = brand;
      phone.description = description;

      phone.price = price;
      phone.stock = stock;
      await phone.save();
      res.json({
        _id: phone._id,
        title: phone.title,
        brand: phone.brand,
        description: phone.description,
        price: phone.price,
        stock: phone.stock,
      });
    } else {
      res.status(401);
      throw new Error("You are not the seller");
    }
  } else {
    res.status(404);
    throw new Error("Phone not found");
  }
});

// checkout, only the buyer can checkout
const checkOut = asynchandler(async (req, res) => {
  const { _id, quantity } = req.body; //the _if here is the phone id
  const phone = await Phone.findById(_id);

  if (phone) {
    // verify if the phone has enough stock
    if (phone.stock >= quantity) {
      // update the stock
      phone.stock -= quantity;
      await phone.save();
      // craete an order
      const order = {
        phone: phone._id,
        user: req.user._id, // 使用 req.user._id 来获取当前用户的 id，这个 id 是在登录时生成的，存储在 token 中
        quantity: quantity,
        price: phone.price * quantity,
        status: "delivered", // 默认状态为已送达
      };
      const result = await Order.create(order);

      // return the stock number
      res.json(phone.stock);
    } else {
      res.status(400);
      throw new Error("Not enough stock");
    }
  } else {
    res.status(404);
    throw new Error("Phone not found");
  }
});

// post a comment
// @desc    Post a comment
// @route   POST /api/users/postComment
// @access  Private
const postComment = asynchandler(async (req, res) => {
  //get the phone id, comment and rating from the request body
  const { phoneId, comment, rating } = req.body;
  const userId = req.user._id;

  //check if the user has bought the phone
  const hasReviewed = await Phone.find({
    _id: phoneId,
    "reviews.reviewer": userId,
  });

  //if the user has not bought the phone, throw an error
  const hasBought = await Order.find({ user: userId, phone: phoneId });
  if (hasBought.length === 0) {
    res.status(400);
    throw new Error("You have not bought this phone");
  } else if (hasReviewed.length > 0) {
    res.status(400);
    throw new Error("You have already reviewed this phone");
  } else {
    //find the phone
    const phone = await Phone.findById(phoneId);
    if (phone) {
      const review = {
        reviewer: userId.toString(),
        rating: Number(rating),
        comment,
      };
      //add the review to the phone
      phone.reviews.push(review);
      //update the number of reviews and rating
      phone.numReviews = phone.reviews.length;
      phone.rating =
        phone.reviews.reduce((acc, item) => item.rating + acc, 0) /
        phone.reviews.length;
      //save the phone
      await phone.save();
      res.status(201).json({
        reviewer: userId.toString(),
        rating: Number(rating),
        comment,
      });
    } else {
      res.status(404);
      throw new Error("Phone not found");
    }
  }
});

// change comment hidden
// @desc Hide or show a comment
// @route PUT /api/phones/changeCommentHidden
// @access Private
const changeCommentHidden = asynchandler(async (req, res) => {
  const { phoneId, hidden } = req.body;

  const phone = Phone.findById(phoneId);
  if (phone) {
    const userId = req.user._id;
    try {
      const phone = await Phone.findById(phoneId);
      if (phone) {
        const review = phone.reviews.find(
          (review) => review.reviewer.toString() === userId.toString()
        );
        if (review) {
          review.hidden = hidden;
          await phone.save();
          res.json(phone);
        } else {
          res.status(404);
          throw new Error("Review not found");
        }
      } else {
        res.status(404);
        throw new Error("Phone not found");
      }
    } catch (error) {
      res.status(404);
      throw new Error("Review not found");
    }
  } else {
    res.status(404);
    throw new Error("Phone not found");
  }
});

//get all orders of current user
// @desc Get all orders of current user
// @route GET /api/phones/getBoughtOrders
// @access Private
const getBoughtOrders = asynchandler(async (req, res) => {
  console.log("进来了");
  try {
    const userId = req.user._id;
    const orders = await Order.find({ user: userId });
    res.json(orders);
  } catch (error) {
    res.status(404);
    throw new Error("Orders not found");
  }
});

//Get all phones purchased by current users
//return an array of objects, each object contains the phone information and the order information
// @desc Get all phones of current user
// @route GET /api/phones/getBoughtPhones
// @access Private
const getBoughtPhones = asynchandler(async (req, res) => {
  const userId = req.user._id;
  const orders = await Order.find({ user: userId });
  const phones = await Phone.find({
    _id: { $in: orders.map((order) => order.phone) },
  });
  //判断用户是否有购物记录
  if (phones.length > 0) {
    const result = phones.map((phone) => {
      const order = orders.find(
        (order) => order.phone.toString() === phone._id.toString()
      );
      return {
        phone,
        order,
      };
    });
    res.json(result);
  } else {
    res.status(404);
    throw new Error("Phones not found");
  }
});

//get all phones that current user has reviewed
// @desc Get all phones that current user has reviewed
// @route GET /api/phones/getReviewedPhones
// @access Private
const getReviewedPhones = asynchandler(async (req, res) => {
  const userId = req.user._id;
  const phones = await Phone.find();
  const orders = await Order.find({ user: userId });
  //according to the orders, find the phones that current user has reviewed
  const reviewedPhones = phones.filter((phone) => {
    const order = orders.find(
      (order) => order.phone.toString() === phone._id.toString()
    );
    if (order) {
      const review = phone.reviews.find(
        (review) => review.reviewer.toString() === userId.toString()
      );
      if (review) {
        return true;
      }
    }
    return false;
  });
  res.json(reviewedPhones);
});

//Get all phones that current user has reviewed and bought
//return an array of objects, each object contains the phone information and the review information
// @desc Get all phones that current user has reviewed and bought
// @route POST /api/phones/getReviewedAndBoughtPhones
// @access Private
const getReviewedAndBoughtPhones = asynchandler(async (req, res) => {
  const userId = req.user._id;
  const phones = await Phone.find();
  const orders = await Order.find({ user: userId });
  try {
    const reviewedAndBoughtPhones = orders.map((order) => {
      const phone = phones.find(
        (phone) => phone._id.toString() === order.phone.toString()
      );
      const review = phone.reviews.find(
        (review) => review.reviewer.toString() === userId.toString()
      );
      return {
        _id: phone._id,
        title: phone.title,
        price: phone.price,
        image: phone.image,
        quantity: order.quantity,
        totalPrice: order.totalPrice,
        status: order.status,
        createdAt: order.createdAt,
        //解析 review 的内容，取第一个评论，只显示评分、评论内容、是否隐藏
        review: review
          ? {
            //如果 review 存在，就返回 review 的内容
            rating: review.rating,
            comment: review.comment,
            hidden: review.hidden,
          }
          : null,
      };
    });
  } catch (error) {
    res.status(404);
    throw new Error("Review not found");
  }

  res.json(reviewedAndBoughtPhones);
});

//get all phones that current user has bought

//Enable or disable the phone that current user has posted
// @desc
// @route PUT /api/phones/enableOrDisablePhone
// @access Private
const enableOrDisablePhone = asynchandler(async (req, res) => {
  const userId = req.user._id;
  if (!userId) {
    res.status(401);
    throw new Error("You are not authorized to do this");
  }

  const { phoneId, disabled, reviewId } = req.body;
  const phone = await Phone.findById(phoneId);
  if (phone) {
    //if the current user is the seller of the phone
    if (phone.seller.toString() === userId.toString()) {
      if (reviewId) {
        phone.reviews.forEach(item => {
          item.hidden = disabled
        })
      } else {
        //add the disabled property to the phone
        phone.disabled = disabled;
      }
      await phone.save();
      res.json(phone);
    } else {
      res.status(401);
      throw new Error("You are not authorized to do this");
    }
  } else {
    res.status(404);
    throw new Error("Phone not found");
  }
});

//get seller's phones and comments according to the seller's id
//@desc get seller's phones and comments
//@route POST /api/phones/getSellersPhonesAndComments
//@access Private
const getSellersPhonesAndComments = asynchandler(async (req, res) => {
  const userId = req.user._id;
  const phones = await Phone.find({ seller: userId });
  const reviews = [];

  for (let phone of phones) {
    if (phone.reviews) {
      for (let item of phone.reviews) {
        const review = {
          ...item._doc,
          phone: phone,
          title: phone.title,
          phoneId: phone._id
        }
        reviews.push(review)
      }
    }
  }

  let userIds = reviews.map(item => item.reviewer)
  if (userIds.length) {
    const userList = await User.find({ _id: userIds }).select('-password');
    const userMap = {};
    userList.forEach(item => {
      userMap[item._id] = item
    })
    reviews.forEach(item => {
      item.reviewer = userMap[item.reviewer] || item.reviewer
    })
  }

  console.log(reviews);
  res.json(reviews);
});

//卖家出售的手机，包括正在卖的和已经卖出的
//get seller's phones and comments according to the seller's id
//@desc get seller's phones
//@route POST /api/phones/getSellersPhones
//@access Private
const getSellersPhones = asynchandler(async (req, res) => {
  const userId = req.user._id;
  if (!userId) {
    res.status(401);
    throw new Error("You are not authorized to do this");
  }
  const phones = await Phone.find({ seller: userId });
  if (!phones) {
    res.status(404);
    throw new Error("Phones not found");
  }
  //返回这个卖家出售的手机的信息
  res.json(phones);
});

//View comments received from users selling their phones by id (as a seller)
//@desc View comments received from users selling their phones by id (as a seller)
//@route POST /api/phones/watchComment
//@access Private
const watchComment = asynchandler(async (req, res) => {
  const { _id } = req.body;
  if (_id != null) {
    //compare the seller id in the phone collection with the current user id
    // use aggregate to join the phone collection and the user collection
    const userReview = await Phone.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "seller",
          foreignField: "_id",
          as: "seller_info",
        },
      },
      {
        $match: {
          // use the seller id to match the current user id
          seller: _id,
        },
      },
      {
        $project: {
          //only return the review information
          reviews: 1,
        },
      },
    ]);
    console.log(_id);
    console.log(userReview);
    // return the review information
    res.json(userReview);
  } else {
    res.status(404);
    throw new Error("You do not sell a phone");
  }
});

// Search for phones reviewed by users and related reviews by id (as a buyer)
// @desc    Get phones and comments reviewed by the current user
// @route   GET /api/users/getBuyersPhonesAndComments
// @access  Private
const getBuyersPhonesAndComments = asynchandler(async (req, res) => {
  const { _id } = req.body; //获取用户 id
  if (_id != null) {
    const phonesandcomments = await Phone.aggregate([
      {
        // Relate the users collection to the phones collection, using the _id of users and the reviewer field of each object in the reviews in phones
        $lookup: {
          from: "users",
          localField: "reviews.reviewer", //reviews are arrays with multiple objects, each with a reviewer field
          foreignField: "_id",
          as: "reviewer_info", //Put the user information corresponding to the reviewer field into the reviewer_info array
        },
      },
      {
        // Filter out documents matching the _id of users
        $match: {
          // Use the seller field to match
          "reviews.reviewer": _id,
        },
      },
      {
        // Expand the seller_info field to get a user document
        $project: {
          title: 1,
          brand: 1,
          image: 1,
          stock: 1,
          price: 1,
          reviews: 1,
        },
      },
    ]);
    console.log(_id);
    console.log(phonesandcomments);
    res.json(phonesandcomments);
  } else {
    res.status(404);
    throw new Error("No items found");
  }
});

//根据传入的一系列 phoneid，返回每个 phoneis 对应的 phone 信息
// @desc    Get phones by ids
// @route   GET /api/phones/getPhonesByIds
// @access  Public
// const getPhonesByIds = asynchandler(async (req, res) => {
//   const { phoneIds } = req.body;
//   //phoneIds 是键值对，键是 phoneid，值是数组，里面是每个 phoneid，类型是 string，所以要先转成 ObjectId.
//   const phoneIdsAsObjectId = phoneIds.map((phoneId) =>
//     mongoose.Types.ObjectId(phoneId)
//   );

//   const phones = await Phone.find({ _id: { $in: phoneIdsAsObjectId } });
//   res.json(phones);
// });

//传入 phone_id 列表，返回每个 phone_id 对应的 phone 信息，也是列表
// @desc    Get phones by ids
// @route   GET /api/phones/getPhonesByIds
// @access  Public
const getPhonesByIds = asynchandler(async (req, res) => {
  //通过 body 传入的 phone_id 列表，传入的格式为 [{"phoneId":"64634a77e7d64bd4e9601db7"},{"phoneId":"64634a77e7d64bd4e9601db8"}]
  const { phoneIds } = req.body;
  //phoneIds 是键值对，键是 phoneid，值是数组，里面是每个 phoneid，类型是 string，所以要先转成 ObjectId.
  const phoneIdsAsObjectId = phoneIds.map((phoneId) =>

    //将 phoneid 转成 ObjectId
    mongoose.Types.ObjectId(phoneId.phoneId)
  );

  //通过 phoneid 列表，返回每个 phoneid 对应的 phone 信息，也是列表
  const phones = await Phone.find({ _id: { $in: phoneIdsAsObjectId } });
  res.json(phones);
});


//It has to be at the end, otherwise it will match this route first, and then it won't match further down
// Go to phones for details based on the id of the phone. Then, based on the seller's id, go to users and stitch to get the phone's details
//then based on the reviewer field of the review, go to users to find the information, stitching to get the firstname and lastname of the reviewer
//The final return includes the review, seller (spliced with lastname and firstname), brand,stock, price,title,description,image, reviewer's full name, review content, rating, and whether it is hidden
const getPhoneById = asynchandler(async (req, res) => {
  const phone = await Phone.findById(req.params.id);
  // look up information in users based on the reviewer's id field and stitch to get the firstname and lastname of the reviewer
  const getReviewWithReviewerName = async (review) => {
    const reviewer = await User.findById(review.reviewer);
    if (reviewer) {
      const reviewerName = reviewer.firstname + " " + reviewer.lastname;
      return {
        reviewId: review._id,
        reviwerid: review.reviewer,
        reviewerName: reviewerName,
        rating: review.rating,
        comment: review.comment,
        hidden: review.hidden,
      };
    } else {
      return null; // or return {reviewerName: "Unknown", ...}
    }
  };

  if (phone) {
    const seller = await User.findById(phone.seller);
    const sellerName = seller.firstname + " " + seller.lastname;
    const reviews = await Promise.all(
      phone.reviews.map(getReviewWithReviewerName)
    );
    const filteredReviews = reviews.filter((review) => review !== null); // or skip this step if you use Unknown as default name
    const phoneWithSeller = {
      _id: phone._id,
      title: phone.title,
      brand: phone.brand,
      stock: phone.stock,
      price: phone.price,
      description: phone.description,
      image: phone.image,
      seller: sellerName,
      //filter out the reviews that are null
      reviews: filteredReviews,
    };
    res.json(phoneWithSeller);
  } else {
    res.status(404);
    throw new Error("Phone not found");
  }
});

export {
  getPhones,
  getHotPhones,
  getEndPhones,
  checkOut,
  getPhonesByTitle,
  getPhoneById,
  createPhone,
  // addNewPhone,
  deletePhone,
  editPhone,
  postComment,
  changeCommentHidden,
  getBoughtPhones,
  getBoughtOrders,
  getReviewedPhones,
  getReviewedAndBoughtPhones,
  enableOrDisablePhone,
  getSellersPhonesAndComments,
  getBuyersPhonesAndComments,
  watchComment,
  getPhonesByIds,
  getSellersPhones,
};
