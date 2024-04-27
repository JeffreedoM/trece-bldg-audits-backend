import mongoose from "mongoose";
import bcrypt from "bcrypt";
import validator from "validator";

const userSchema = new mongoose.Schema({
  email: {
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
userSchema.statics.signup = async function (email, password) {
  // validations
  if (!email || !password) {
    throw Error("All fields must be filled");
  }
  if (!validator.isEmail(email)) {
    throw Error("Email is not valid");
  }
  if (!validator.isStrongPassword(password)) {
    throw Error(
      "Password must be at least 8 characters long and includes at least 1 uppercase letter, 1 number, and 1 special symbol"
    );
  }

  // 1. search in the db if the email already exists
  const exists = await this.findOne({ email });

  // 2. If it already exists, it will throw an error
  if (exists) {
    throw Error(
      "Email is already in use. Please use a different email or consider logging in if this is your account"
    );
  }

  // 3. use bcrypt to create salt for the password
  const salt = await bcrypt.genSalt(10);

  // 4. hash the password
  const hash = await bcrypt.hash(password, salt);

  // 5. Store the email and the hashed password
  const user = await this.create({ email, password: hash });

  // 6. Return the newly created user
  return user;
};

// static login method
userSchema.statics.login = async function (email, password) {
  if (!email || !password) {
    throw Error("All fields must be filled");
  }

  const user = await this.findOne({ email });

  if (!user) {
    throw Error(
      "No account found with this email address. Please double-check your email or consider signing up if you don't have an account."
    );
  }

  // match password to password in db
  const match = await bcrypt.compare(password, user.password);

  if (!match) {
    throw Error("Incorrect Password");
  }

  return user;
};

export default mongoose.model("users", userSchema);
