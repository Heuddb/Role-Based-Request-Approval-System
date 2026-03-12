const { request } = require("express");
const RequestModel = require("../Models/RequestModel");
const WorkflowModel = require("../Models/WorkflowModel");

const createRequest = async (req, res) => {
  try {
    const { title, description, type } = req.body;

    if (!title || !description || !type) {
      return res.status(400).json({
        success: false,
        message: "title, description and type are required",
      });
    }

    // find workflow based on request type
    const workflow = await WorkflowModel.findOne({ type });

    if (!workflow) {
      return res.status(404).json({
        success: false,
        message: "No workflow configured for this request type",
      });
    }

    const request = await RequestModel.create({
      title,
      description,
      workflow: workflow._id,
      requestedBy: req.user._id,
    });

    return res.status(201).json({
      success: true,
      message: "Request created successfully",
      request,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const approveRequest = async (req, res) => {
  try {
    const { requestId, action } = req.body;

    const request = await RequestModel.findById(requestId);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Request not found",
      });
    }

    if (request.status !== "pending") {
      return res.status(400).json({
        success: false,
        message: "Request already processed",
      });
    }

    const workflow = await WorkflowModel.findById(request.workflow);

    const currentStep = workflow.steps[request.currentStep];

    if (!currentStep) {
      return res.status(400).json({
        success: false,
        message: "Invalid workflow step",
      });
    }

    // check correct approver
    if (req.user.role !== currentStep.role) {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to approve this request",
      });
    }

    if (action === "reject") {
      request.status = "rejected";
      await request.save();

      return res.json({
        success: true,
        message: "Request rejected",
      });
    }

    // move to next step
    request.currentStep += 1;

    if (request.currentStep >= workflow.steps.length) {
      request.status = "approved";
    }

    await request.save();

    return res.json({
      success: true,
      message: "Request approved successfully",
      request,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getAllPendingRequest = async (req, res, next) => {
  try {
    const userRole = req.user.role;

    const requests = await RequestModel.find({ status: "pending" })
      .populate("workflow")
      .populate("requestedBy", "name email");

    const pendingForUser = requests.filter((reqItem) => {
      const step = reqItem.workflow.steps[reqItem.currentStep];
      return step && step.role === userRole;
    });

    return res.json({
      success: true,
      requests: pendingForUser,
    });
  } catch (error) {
    return res.status(500).json({ message: "something went wrong" });
  }
};

const getYourRequest = async (req, res) => {
  try {
    const user = req.user?._id;

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }

    const requestDoc = await RequestModel.find({
      requestedBy: user,
    });

    if (requestDoc.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No requests found for this user",
      });
    }

    let status = requestDoc.map((reqItm) => {
      let message = "Pending approval";
      if (reqItm.status === "approved") {
        message = "your request was approved";
      } else if (reqItm.status === "rejected") {
        message = "your request was rejected";
      } else {
        let nextStep = reqItm.workflow.steps[reqItm.currentStep];

        if (nextStep) {
          message = `Waiting for ${nextStep.role} approval`;
        }
      }

      return {
        id: reqItm._id,
        title: reqItm.title,
        description: reqItm.description,
        status: reqItm.status,
        progress: message,
      };
    });
    return res.status(200).json({
      success: true,
      message: "Requests fetched successfully",
      requestData: requestDoc,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createRequest,
  approveRequest,
  getAllPendingRequest,
};
