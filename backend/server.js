const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");  // Import cors
const connectdb = require("./config/db");
const kycRoutes = require("./routes/kycRoutes");
const app = express();
app.use(express.json());
dotenv.config();

app.use(cors());             // Enable CORS for all origins during development
app.use(express.json());

connectdb();
app.use('/api/kyc',kycRoutes);

app.get('/',(req,res)=>{
    res.send("Api is working");
});
const PORT = process.env.PORT || 6500;
app.listen(PORT,()=>{
    console.log("server is running 6500");
});