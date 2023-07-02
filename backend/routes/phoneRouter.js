import express from "express";
import {
  getPhones,
  getHotPhones,
  getEndPhones,
  checkOut,
  getPhoneById,
  getPhonesByTitle,
  // addNewPhone,
  changeCommentHidden,
  postComment,
  deletePhone,
  editPhone,
  createPhone,
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
} from "../controllers/phoneController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

//@desc Fetch all phones
//@route GET /api/phones
//@access Public
router.route("/").get(getPhones);

//@desc Fetch hot phones
//@route GET /api/phones/hot
//@access Public
router.route("/hot").get(getHotPhones);

//@desc Fetch end phones
//@route GET /api/phones/end
//@access Public
router.route("/end").get(getEndPhones);

//@desc check out the shopping cart
//@route POST /api/phones/checkOut
//@access Private
router.route("/checkOut").post(protect, checkOut);

//@desc Fetch single phone by title
//@route GET /api/phones/getPhoneByTitle
//@access Public
router.route("/getPhonesByTitle").get(getPhonesByTitle);

//@desc Fetch single phone by id
//@route GET /api/phones/:id
//@access Public
router.route("/:id").get(getPhoneById);


router.route("/createPhone").post(protect, createPhone);


router.route("/deletePhone").delete(protect, deletePhone);

router.route("/editPhone").put(protect,editPhone);

router.route("/postComment").post(protect, postComment);

router.route("/changeCommentHidden").put(protect, changeCommentHidden);

router.route("/getBoughtOrders").post(protect, getBoughtOrders);

router.route("/getBoughtPhones").post(protect, getBoughtPhones);

router.route("/getReviewedPhones").post(protect, getReviewedPhones);

router.route("/getUsersPhonesAndComments").post(protect ,getReviewedAndBoughtPhones);

router.route("/enableOrDisablePhone").put(protect, enableOrDisablePhone);

router.route("/getSellersPhonesAndComments").post(protect,getSellersPhonesAndComments);

router.route("/watchComment").get(watchComment);

router.route("/getPhonesByIds").get(getPhonesByIds);

router.route("/getSellersPhones").post(protect,getSellersPhones);


export default router;
