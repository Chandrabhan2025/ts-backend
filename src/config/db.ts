import mongoose, { connect } from "mongoose";

function connects() {
  return connect(
    "mongodb+srv://chandrabhans2002:9ZfPFZxTHlEoTzw9@cluster0.okm7bny.mongodb.net/?retryWrites=true&w=majority"
  )
    .then(() => {
      console.log("connected");
    })
    .catch((error: any) => {
      console.log(error);
    });
}

export default connects;
