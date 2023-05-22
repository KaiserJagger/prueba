import mongoose from "mongoose";

const prodCollection = 'products'

const prodSchema = mongoose.Schema({
    title: {
        type: String,
        required: true,
      },
      description: {
        type: String,
        required: true,
      },
      price: {
        type: Number,
        required: true,
      },
      status: {
        type: String,
        required: true,
      },
      category: {
        type: String,
        required: true,
      },
      thumbnails: {
        type: [String],
        required: true,
      },
      code: {
        type: String,
        required: true,
      },
      stock: {
        type: Number,
        required: true,
      },
    });

const prodModel = mongoose.model(prodCollection, prodSchema)

export default prodModel