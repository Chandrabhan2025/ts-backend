import mongoose, { connect } from "mongoose";
import { ListFormat } from "typescript";

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    default: null,
  },
  email: {
    type: String,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  token: {
    type: String,
  },
});

const User = mongoose.model("user", UserSchema);

export { User };
