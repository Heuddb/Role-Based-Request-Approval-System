const express = require('express');
const authanticator = require('../Middleware/Authanticator');
const roleMiddleware = require('../Middleware/RoleMiddleware');
const { createRequest, approveRequest, getAllPendingRequest } = require('../Controller/RequestContoller');

const request = express.Router();

request.post('/create-request',authanticator,roleMiddleware("employee", "manager"),createRequest)
request.post('/approve-req',authanticator,roleMiddleware("admin","manager","hr"),approveRequest)
request.get('/getAllPendingRequest',authanticator,roleMiddleware("manager", "admin", "finance", "hr"),getAllPendingRequest);
request.get('/your-request',authanticator,)

module.exports = request;