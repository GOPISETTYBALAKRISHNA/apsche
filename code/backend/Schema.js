const mongoose = require("mongoose");
const bcrypt = require("bcrypt"); // Make sure to uncomment this

/////////////////user///////////////////////////////
const userSchema = new mongoose.Schema({ // Use 'new mongoose.Schema' for consistency
  name: { type: String, required: [true, 'Name is required'] }, // Use array syntax for custom messages
  email: { type: String, required: [true, 'Email is required'], unique: true }, // Add unique index for emails
  password: { type: String, required: [true, 'Password is required'] },
  phone: { type: Number, required: [true, 'Phone is required'] },
  userType: { type: String, required: [true, 'UserType is required'], enum: ['admin', 'agent', 'user'] }, // Use enum for user types
}, {
  timestamps: true,
});

// IMPORTANT: Correct and uncomment the pre-save hook for password hashing
userSchema.pre("save", async function (next) {
  // Use a standard function to get correct 'this' context
  if (!this.isModified("password")) {
    return next();
  }
  try {
    const salt = await bcrypt.genSalt(10); // Generate a salt
    this.password = await bcrypt.hash(this.password, salt); // Hash the password
    next();
  } catch (error) {
    return next(error);
  }
});

// Use consistent naming conventions (singular, uppercase for models)
const User = mongoose.model("User", userSchema);

///////////////complaint///////////////////
const complaintSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" }, // Correct ref name
  name: { type: String, required: true },
  address: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  pincode: { type: Number, required: true },
  comment: { type: String, required: true },
  status: { type: String, required: true, default: "pending" }, // Add a default status
}, { timestamps: true });

const Complaint = mongoose.model("Complaint", complaintSchema);

///////////assigned complaint schema////////////////////////
const assignedComplaintSchema = new mongoose.Schema({ // Use consistent naming
  agentId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
  complaintId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "Complaint" }, // Correct ref name
  status: { type: String, required: true },
  agentName: { type: String, required: true },
}, { timestamps: true });

const AssignedComplaint = mongoose.model("AssignedComplaint", assignedComplaintSchema);

////////////////////chatWindow schema/////////////////////////
const messageSchema = new mongoose.Schema({ // Use 'new mongoose.Schema' for consistency
  name: { type: String, required: true }, // Changed required message for consistency
  message: { type: String, required: true },
  complaintId: { type: mongoose.Schema.Types.ObjectId, ref: "AssignedComplaint" } // Correct ref name
}, { timestamps: true });

const Message = mongoose.model('Message', messageSchema);

module.exports = {
  User,
  Complaint,
  AssignedComplaint,
  Message,
};
