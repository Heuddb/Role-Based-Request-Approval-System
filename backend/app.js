
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const auth = require('./Routes/AuthanticationRoutes');
const workflow = require('./Routes/workflow');
const request = require('./Routes/requestRoute');
const app = express();


app.use(express.json());

app.use("/api/auth",auth)
app.use("/api/workflow",workflow)
app.use('/api/request',request);


const PORT = process.env.PORT || 3000;
mongoose
.connect(process.env.MONGODB_URI)
.then(()=>{
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
})
}).catch((err)=>{
  console.log(err);
})

