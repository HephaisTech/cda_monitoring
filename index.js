
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const Mailgen = require('mailgen');
const express = require('express');
const https = require("https");
const fetch = require('node-fetch');
const nodemailer = require('nodemailer');
const app = express()
const port = 3000
const path = require('path');
const TargetRouter = require('./routers/TargetRoute');
const authRoute = require('./routers/authRoute');
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



const exportEmail = async (req, res, next) => {
    try {
        // create a SMTP  
        let config = {
            service: 'gmail',
            auth: {
                user: 'zandjimarius@gmail.com',
                pass: 'rkmffgpcxifbksft'
            }
        };
        let transporter = nodemailer.createTransport(config);

        let MailGenerator = new Mailgen({
            theme: "default",
            product: {
                name: "Mailgen",
                link: 'https://mailgen.js/'
            }
        });

        let mail = {
            body: {
                name: "Daily Tuition",
                intro: "Your bill has arrived!",
                table: {
                    data: [
                        {
                            item: "Nodemailer Stack Book",
                            description: "A Backend application",
                            price: "$10.99",
                        }
                    ]
                },
                outro: "Looking forward to do more business"
            }
        };

        mail = MailGenerator.generate(mail)

        let message = {
            from: process.env.EMAIL,
            to: 'jiwer75201@mevori.com', //codingchallenge@cda.tg
            subject: "Place Order",
            html: mail,
            attachments: [
                {
                    filename: 'attach.jpg',
                    path: __dirname + '/attach.jpg',
                    cid: 'uniq-attach.jpg'
                }
            ]
        };

        transporter.sendMail(message).then(() => {
            return res.status(201).json({
                msg: "you should receive an email"
            })
        }).catch(error => {
            return res.status(500).json({ err: error, message: error.message, })
        });
    } catch (error) {
        next(error);
    }
}
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    // res.setHeader('Content-Type', 'Application/json');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});
app.use(express.urlencoded({ extended: true }));
app.use(express.json());







app.get('/', async (req, res) => {

    res.status(200).json({ message: 'you rock!' })

})
app.use('/images', imagePath);
app.use('/target', TargetRouter);
app.use('/auth', authRoute);

app.use('*', function (req, res) {

    res.sendFile(path.join(__dirname, '../pages/404.html'));
});


app.use((err, req, res, next) => { res.status(500).json({ message: err.message, statck: err.stack, result: false, user: 1 }); next(); })




app.listen(port, () => { connect(); console.log(`CDA listening on port ${port}!`) })