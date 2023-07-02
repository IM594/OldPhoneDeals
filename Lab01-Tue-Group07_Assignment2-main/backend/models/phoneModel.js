import mongoose from "mongoose";

const reviewsSchema = new mongoose.Schema(
  {
    reviewer: {
        type: String,
        require: true,
        ref: "User",
    },
    // reviews: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   require: true,
    //   ref: "User",
    // },
    rating: {
      type: Number,
      require: true,
    },
    comment: {
      type: String,
      require: true,
    },
    hidden: {
      type: String,
      require: false,
    },
  },
  {
    timestamps: true,
  }
);

const phoneSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    brand: {
      type: String,
      require: true,
    },
    image: {
      type: String,
      require: true,
    },
    price: {
      type: Number,
      require: true,
    },
    stock: {
      type: Number,
      require: true,
    },
    disabled: {
      type: String,
      require: false,
    },
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      require: true,
      ref: "User", 
    },
    reviews: [reviewsSchema],
    aveRating: {
      type: Number,
      require: false,
    },
  },
  {
    timestamps: true,
  }
);

const Phone = mongoose.model("Phone", phoneSchema);

export default Phone;
