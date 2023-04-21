import { model, Schema, models } from "mongoose";

const UserSchema = new Schema({
  name: { type: String },
  email: { type: String },
  image: { type: String },
  emailVerified: { type: Boolean },
});

const User = models.User || model("User", UserSchema);
module.exports = { User };
