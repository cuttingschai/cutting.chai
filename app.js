const express = require("express")
const app = express()
const dotenv = require("dotenv")
dotenv.config()
const PORT = 8001

app.use(express.json())
app.get("/", (req, res) => {
    res.send("hello from express")
})

const loginuserRoutes = require('./routes/loginuser_routes');
app.use('/loginuser', loginuserRoutes);
const donationRoutes = require('./routes/donation_routes');
app.use('/donation', donationRoutes);
const providerRoutes = require('./routes/provider_routes');
app.use('/provider', providerRoutes);
const sendotpRoutes = require('./routes/sendotp_routes');
app.use('/sendotp', sendotpRoutes);

app.listen (PORT,() => console.log ('server is runing on $(port)'))