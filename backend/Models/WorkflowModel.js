const mongoose = require("mongoose");

const workflowSchema = new mongoose.Schema(
{
  type: {
    type: String,
    required: true,
    unique: true, 
    trim: true
  },

  steps: [
    {
      role: {
        type: String,
        enum: ["manager", "hr", "admin", "finance"],
        required: true
      }
    }
  ],

  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  }

},
{ timestamps: true } 
);

module.exports = mongoose.model("Workflow", workflowSchema);