import mongoose from "mongoose";
import bcrypt from "bcrypt";
import validator from "validator";

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
});

// static signup method
userSchema.statics.signup = async function (username, password) {
  // validations
  if (!username || !password) {
    throw Error("All fields must be filled");
  }
  // if (!validator.isStrongPassword(password)) {
  //   throw Error(
  //     "Password must be at least 8 characters long and includes at least 1 uppercase letter, 1 number, and 1 special symbol"
  //   );
  // }

  // 1. search in the db if the username already exists
  const exists = await this.findOne({ username });

  // 2. If it already exists, it will throw an error
  if (exists) {
    throw Error(
      "Username is already in use. Please use a different username or consider logging in if this is your account"
    );
  }

  // 3. use bcrypt to create salt for the password
  const salt = await bcrypt.genSalt(10);

  // 4. hash the password
  const hash = await bcrypt.hash(password, salt);

  // 5. Store the username and the hashed password
  const user = await this.create({ username, password: hash });

  // 6. Return the newly created user
  return user;
};

// static login method
userSchema.statics.login = async function (username, password) {
  if (!username || !password) {
    throw Error("All fields must be filled");
  }

  const user = await this.findOne({ username });

  if (!user) {
    throw Error("No account found with this username.");
  }

  // match password to password in db
  const match = await bcrypt.compare(password, user.password);

  if (!match) {
    throw Error("Incorrect Password");
  }

  return user;
};

export default mongoose.model("users", userSchema);
