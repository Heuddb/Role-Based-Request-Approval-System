# Role-Based Request Approval System

A backend system that manages multi-step request approvals based on user roles.  
Users can create requests and the system routes them through configurable approval workflows (e.g., Manager → Finance → Admin).

----

## Features

- User Authentication with JWT
- Role-Based Access Control (RBAC)
- Multi-Step Workflow Approval System
- Request Creation and Tracking
- Role-based Pending Request Dashboard
- Input Validation using express-validator

---

## Tech Stack

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- Express Validator
- bcryptjs

---

## System Architecture

User → Request → Workflow → Approval Steps

Example workflow:

Leave Request  
Employee → Manager → Admin

Expense Claim  
Employee → Manager → Finance → Admin

---

##  API Endpoints

### Authentication

POST /api/auth/signup  
POST /api/auth/sign-in  

---

### Workflow

POST /api/workflow/create  

Create approval workflows for request types.

Example:

{
"type": "leave",
"steps": [
{ "role": "manager" },
{ "role": "admin" }
]
}

---

### Requests

POST /api/request/create-request
Create a new request.

Example:

{
"type": "leave",
"title": "Leave Request",
"description": "Need leave for 3 days"
}

---

GET /api/request/getAllPendingRequest
Fetch requests waiting for the logged-in role.

GET /api/request/your-request
Fetch requests created by the logged-in user.

---

POST /api/request/approve-req  

Approve or reject requests.

Example:

{
"requestId": "REQUEST_ID",
"action": "approve"
}

---

##  Deployment

Backend deployed on Render.

Live API:  
https://your-render-url.onrender.com

---

##  Author

Anubhav Dubey
