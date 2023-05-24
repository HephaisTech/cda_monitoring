const Target = require('../models/target');
const puppeteer = require('puppeteer');
const fs = require('fs');
const axios = require('axios');
const cheerio = require('cheerio');
const Mailgen = require('mailgen');
const nodemailer = require('nodemailer');
const http = require("http");
const Agent = require('agentkeepalive');
const { chromium } = require("playwright");
const { spawnSync } = require("child_process");

exports.saveTarget = async (req, res, next) => {
    try {
        req.body.initstate = await fetchWebsite(req.body.url);
        req.body.userId = req.user.id;
        const newTarget = new Target(req.body);
        await newTarget.save().then((result) => {
            if (!result) {
                return res.status(403).json({ result: false, message: 'unable to save' });
            } else {
                return res.status(200).json({ result: true, message: 'ok', data: result });
            }
        }).catch((err) => {
            return res.status(500).json(err);
        });
    } catch (error) {
        next(error);
    }
};

exports.getTarget = async (req, res, next) => {
    try {
        await Target.find().then((result) => {
            if (!result) {
                return res.status(403).json({ result: false, message: 'unable to get' });
            } else {
                return res.status(200).json({ result: true, message: 'ok', data: result });
            }
        }).catch((err) => {
            return res.status(500).json(err);
        });
    } catch (error) {
        return next(error);
    }

}
exports.getTargetId = async (req, res, next) => {
    try {
        await Target.findById(req.body.id).then((result) => {
            if (!result) {
                return res.status(403).json({ result: false, message: 'unable to get id' });
            } else {
                return res.status(200).json({ result: true, message: 'ok', data: result });
            }
        }).catch((err) => {
            return res.status(500).json(err);
        });
    } catch (error) {
        next(error);
    }
}
exports.updateTarget = async (req, res, next) => {
    try {
        await Target.findByIdAndUpdate(req.body.id, req.body, { runValidators: true, context: 'query', new: true }).then((result) => {
            if (!result) {
                return res.status(403).json({ result: false, message: 'unable to update id :' + req.body.id });
            } else {
                return res.status(200).json({ result: true, message: 'ok', data: result });
            }
        }).catch((err) => {
            return res.status(500).json(err);
        });
    } catch (error) {
        next(error);
    }
}

exports.deleteTarget = async (req, res, next) => {
    try {
        await Target.findByIdAndDelete(req.body.id).then((result) => {
            if (result) {
                return res.status(200).json({ result: true, message: 'Deleted!', });
            }
        }).catch((err) => {
            return res.status(500).json(err);
        });
    } catch (error) {
        next(error);
    }
}




exports.exportEmail = async (target) => {
    try {
        // create a SMTP  
        let config = {
            service: 'gmail',
            auth: {
                user: `${process.env.EMAIL}`,
                pass: `${process.env.PASSWORD}`,
            }
        };
        let transporter = nodemailer.createTransport(config);

        let MailGenerator = new Mailgen({
            theme: "default",
            product: {
                name: "Mailgen",
                link: 'https://R@mius.js/'
            }
        });

        let mail = {
            body: {
                name: "CDA monitoring scan report",
                intro: "Defacement detected!",
                table: {
                    data: [
                        // {
                        //     Target: target.name,
                        //     URL: target.url,
                        //     changeCount: target.changeCount,
                        // }
                    ]
                },
                outro: "Looking forward to be more vigilant"
            }
        };

        mail = MailGenerator.generate(mail)

        let message = {
            from: process.env.EMAIL,
            to: 'zandjimarius@gmail.com', //codingchallenge@cda.tg
            subject: "CDA monitoring scan report",
            html: mail,
            attachments: [
                {
                    filename: `${target.name}.png`,
                    path: __dirname + `/../images/${target.name}.png`,
                    cid: 'uniq-attach.png'
                }
            ]
        };

        await transporter.sendMail(message);
    } catch (error) {
        console.error(error);
    }
}
async function fetchWebsite(url) {
    try {
        console.log(url);
        // url = new URL(url).hostname;
        console.log(url);
        let response = 'a';
        try {
            response = await axios.get(url, { timeout: 8000 });
            // Handle successful response here
        } catch (error) {
            if (error.code === 'ECONNABORTED') {
                // Handle timeout error
                console.log('Request timed out');
            } else if (error.response) {
                // Handle HTTP error status codes
                console.log('HTTP error:', error.response.status);
            } else if (error.request) {
                // Handle network errors
                console.log('Network error:', error.request);
            } else {
                // Handle other errors
                console.log('Error:', error.message);
            }
        }


        return response.data;
    } catch (error) {
        console.error('Erreur lors de la récupération du site web :', error);
        return null;
    }
}

function analyzeWebsite(neWcontent, oldContent) {
    return cheerio.load(neWcontent) == cheerio.load(oldContent);
    // const $ = cheerio.load(content);
    // $('img').each((index, element) => {
    //     const src = $(element).attr('src');
    // });
    // $('a').each((index, element) => {
    //     const href = $(element).attr('href');
    // });
    // $('script').each((index, element) => {
    //     const src = $(element).attr('src');
    // });
}

function addHttpToURL(url) {
    if (!url.startsWith("http://") && !url.startsWith("https://")) {
        url = "http://" + url;
    }
    return url;
}
exports.htmlScanTarget = async (req, res, next) => {
    try {
        let currentTarget = await Target.findById(req.body.id);
        if (!currentTarget) { return res.status(404).json({ result: false, message: 'cannot find target' }); };
        const websiteContent = await fetchWebsite(addHttpToURL('https://www.cda.tg/')); //
        const analysisResults = analyzeWebsite(websiteContent, currentTarget.initstate);
        req.target = currentTarget;
        req.target = await screenshotTarget(req, res, next)
        if (!analysisResults) {
            await this.exportEmail(req.target);
        }
        res.status(200).json({ results: analysisResults, target: req.target, message: 'scan completed', data: { old: currentTarget.initstate, new: websiteContent } });
    } catch (error) {
        next(error);
    }
}
async function screenshotTarget(req, res, next) {
    try {
        // const targetURL = addHttpToURL(req.target.url);
        // const browser = await puppeteer.launch({ headless: "new" });
        // const page = await browser.newPage();
        // await page.goto(targetURL);

        // const initialScreenshot = await page.screenshot({ path: `images/${req.target.name}.png`, fullPage: true });
        // return await Target.findByIdAndUpdate(req.target.id, { lastscreenShot: `${req.protocol}://${req.get('host')}/images/${req.target.name}.png` },
        //     { runValidators: true, context: 'query', new: true });
        spawnSync("npx", ["playwright", "install", "chromium"]); 4

        let browser = await chromium.launch();

        let page = await browser.newPage();
        await page.setViewportSize({ width: 1280, height: 1080 });
        await page.goto(addHttpToURL(req.target.url));
        await page.screenshot({ path: `images/${req.target.name}.png`, fullPage: true });
        await browser.close();
        return await Target.findByIdAndUpdate(req.target.id, { lastscreenShot: `${req.protocol}://${req.get('host')}/images/${req.target.name}.png` },
            { runValidators: true, context: 'query', new: true });

    } catch (error) {
        next(error);
    }
}