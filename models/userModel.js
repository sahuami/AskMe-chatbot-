const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const JWT = require("jsonwebtoken");
const cookie = require("cookie");

// Define a new schema for users in MongoDB
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "USername is Required"], // Username is a required field
  },
  email: {
    type: String,
    required: [true, "Email is required"],    // Email is a required field
    unique: true, // Ensure email is unique for each user
  },
  password: {
    type: String,
    required: [true, "Password is required"], // Password is a required field
    minlength: [6, "Password length should be 6 characters long"], // Minimum password length is 6 characters
  },
  customerId: {
    type: String,
    default: "",  // Default empty value for customerId field
  },
  subscription: {
    type: String,
    default: "",  // Default empty value for subscription field
  },
});

// Middleware to hash the password before saving to the database
userSchema.pre("save", async function (next) {
  // If the password is not modified, move to the next middleware or save operation
  if (!this.isModified("password")) {
    next();
  }
  // Generate salt and hash the password
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt); // Store the hashed password
  next(); // Continue to save
});

// Method to compare the entered password with the stored hashed password
userSchema.methods.matchPassword = async function (password) {
  return await bcrypt.compare(password, this.password); // Return true if the password matches, false otherwise
};

// Method to sign and return a JWT access token and set a refresh token as a cookie in the response
userSchema.methods.getSignedToken = function (res) {
  // Sign access token with user's ID, using JWT secret and expiration from environment variables
  const acccesToken = JWT.sign(
    { id: this._id },
    process.env.JWT_ACCESS_SECRET,
    { expiresIn: process.env.JWT_ACCESS_EXPIREIN }
  );
  // Sign refresh token with user's ID
  const refreshToken = JWT.sign(
    { id: this._id },
    process.env.JWT_REFRESH_TOKEN,
    { expiresIn: process.env.JWT_REFRESH_EXIPREIN }
  );
  // Set refresh token in cookies, with httpOnly flag for security
  res.cookie("refreshToken", `${refreshToken}`, {
    maxAge: 86400 * 7000, // Token valid for 7000 days
    httpOnly: true, // Cookie is only accessible by the server (not JavaScript)
  });
};

// Create a Mongoose model named 'User' based on the userSchema
const User = mongoose.model("User", userSchema);

// Export the User model for use in other parts of the application
module.exports = User;
