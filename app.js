
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

const express = require('express');
const app = express()
const port = 3000
const cors = require('cors');
var bodyParser = require('body-parser');
const path = require('path');
const TargetRouter = require('./routers/TargetRoute');
const authRoute = require('./routers/authRoute');
const userRoute = require('./routers/userRoute');
const { cookieCheck } = require('./controllers/tokenVerify');
dotenv.config();
const imagePath = express.static(path.join(__dirname, './images/'));
const pagepath = express.static(path.join(__dirname, './pages/'));
const guardpath = express.static(path.join(__dirname, './guard/'));

// db connection

mongoose.set('strictQuery', false);
const connect = async () => {
    try {
        await mongoose.connect(process.env.MONGO, { useNewUrlParser: true, useUnifiedTopology: true })
            .then(() => console.log('connected to MongoDB!'));
    } catch (error) {
        console.log('Cannot connet MongoDB ' + error.message);
    }
}
mongoose.connection.on('connected', () => {
    console.log('MongoDB here!')
});




app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    // res.setHeader('Content-Type', 'Application/json');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});
app.use(express.json());
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true, parameterLimit: 50000 }));
app.use(cors());
app.use(cookieParser());

app.use('/guard', guardpath);
app.use('/auth', authRoute);
app.get('/', async (req, res) => {
    res.clearCookie("CDATOKEN");
    res.sendFile(path.join(__dirname, '/guard/login/index.html'));

})




app.use('/images', imagePath);
app.use('/pages', cookieCheck, pagepath);
app.use('/target', TargetRouter);

app.use('/users', userRoute);

app.use('*', function (req, res) {
    res.sendFile(path.join(__dirname, '/guard/404/index.html'));
});



app.use((err, req, res, next) => {
    res.status(500).json({
        message: err.message,
        statck: err.stack,
        result: false,
        user: 1
    });

})




app.listen(port, () => { connect(); console.log(`CDA listening on port ${port}!`) })