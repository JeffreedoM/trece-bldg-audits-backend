import User from "../models/UserModel.js";
import jwt from "jsonwebtoken";

const createToken = (_id) => {
  return jwt.sign({ _id }, process.env.SECRET, { expiresIn: "3d" });
};

// login user
export const loginUser = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.login(username, password);

    // create token
    const token = createToken(user._id);

    return res.status(200).json({ username, token });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

// signup user
export const signupUser = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.signup(username, password);

    // create token
    const token = createToken(user._id);

    return res.status(200).json({ username, token });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};
