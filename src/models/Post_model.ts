import mongoose, { connect } from "mongoose";
import { ListFormat } from "typescript";

const PostSchema = new mongoose.Schema({
  questionText: {
    type: String,
    required: true,
  },
  moduleName: {
    type: String,
    required: true,
  },
  options: {
    type: [{ optionId: String, optionText: String }],
    required: true,
  },
  correctOptionId: {
    type: Intl,
    required: true,
  },
  updatedDate: {
    type: Date,
    default: Date.now(),
  },
  updatedBy: {
    type: String,
    required: true,
  },
  createdDate: {
    type: Date,
    default: Date.now(),
  },
  createdBy: {
    type: String,
    required: true,
  },
});

const Post = mongoose.model("post", PostSchema);

export { Post };
