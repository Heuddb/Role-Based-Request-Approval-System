const express = require('express');
const authanticator = require('../Middleware/Authanticator');
const roleMiddleware = require('../Middleware/RoleMiddleware');
const { createWorkflow } = require('../Controller/createWorkflow');

const workflow = express.Router();

workflow.post('/create',authanticator,roleMiddleware("admin"),createWorkflow)



module.exports = workflow;