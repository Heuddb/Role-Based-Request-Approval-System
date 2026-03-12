const WorkflowModel = require("../Models/WorkflowModel");

const createWorkflow = async (req, res) => {
  try {

    const { type, steps } = req.body;

    if (!type || !Array.isArray(steps) || steps.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Workflow type and steps are required"
      });
    }

    const existingWorkflow = await WorkflowModel.findOne({ type });

    if (existingWorkflow) {
      return res.status(400).json({
        success: false,
        message: "Workflow for this type already exists"
      });
    }

    const workflow = await WorkflowModel.create({
      type,
      steps,
      createdBy: req.user._id
    });

    return res.status(201).json({
      success: true,
      message: "Workflow created successfully",
      workflow
    });

  } catch (error) {

    return res.status(500).json({
      success: false,
      message: error.message
    });

  }
};

module.exports = { createWorkflow };