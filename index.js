
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

const express = require('express');
const app = express()
const port = 3000
const path = require('path');
const TargetRouter = require('./routers/TargetRoute');
const authRoute = require('./routers/authRoute');
const userRoute = require('./routers/userRoute');
dotenv.config();
const imagePath = express.static(path.join(__dirname, './images/'));


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
app.use(express.urlencoded({ extended: true }));
app.use(express.json());



app.use(cookieParser());



app.get('/', async (req, res) => {

    res.status(200).json({ message: 'you rock!' })

})
app.use('/images', imagePath);
app.use('/target', TargetRouter);
app.use('/auth', authRoute);
app.use('/users', userRoute);

app.use('*', function (req, res) {

    res.sendFile(path.join(__dirname, '../pages/404.html'));
});


app.use((err, req, res, next) => { res.status(500).json({ message: err.message, statck: err.stack, result: false, user: 1 }); next(); })




app.listen(port, () => { connect(); console.log(`CDA listening on port ${port}!`) })