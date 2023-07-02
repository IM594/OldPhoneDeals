import mongoose from "mongoose";

// Define the schema for the order model
const orderSchema = mongoose.Schema(
  {
    phone: {
      type: String,
      required: true,
      ref: "Phone", 
    },
    user: {
      type:String,
      required: true,
      ref: "User", 
    },
    quantity: {
      type: Number,
      required: true,
      min: 1, 
    },
    price: {
      type: Number,
      required: true,
      min: 0, 
    },
    status: {
      type: String,
      required: true,
      enum: ["pending", "paid", "shipped", "delivered", "cancelled"], 
    },
  },
  {
    timestamps: true, // 
  }
);

// Create the model from the schema and export it
const Order = mongoose.model("Order", orderSchema);

export default Order;
