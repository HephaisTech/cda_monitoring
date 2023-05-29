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
        req.body.initstate = await fetchWebsite(addHttpToURL(req.body.url));
        req.body.userId = req.user.id;
        const newTarget = new Target(req.body);
        await newTarget.save().then((result) => {
            if (!result) {
                return res.status(403).json({ result: false, message: 'unable to save' });
            } else {
                return res.status(200).json({ result: true, message: 'ok', data: result });
            }
        }).catch((err) => {
            return res.status(500).json({ result: false, message: 'unable to save', error: err.message });
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
                let list = [];
                for (const tg of result) {
                    tg.initstate = '';
                    list.push(tg)
                }
                return res.status(200).json({ result: true, message: 'ok', data: list });
            }
        }).catch((err) => {
            return res.status(500).json({ result: false, message: 'unable to get', error: err.message });
        });
    } catch (error) {
        return next(error);
    }

}
exports.getTargetId = async (req, res, next) => {
    try {
        await Target.findById(req.body.id).then((result) => {
            if (!result) {
                result.initstate = '';
                return res.status(403).json({ result: false, message: 'unable to get id' });
            } else {
                return res.status(200).json({ result: true, message: 'ok', data: result });
            }
        }).catch((err) => {
            return res.status(500).json({ result: false, message: 'unable to get id', error: err.message });
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
            return res.status(500).json({ result: false, message: 'unable to update id', error: err.message });
        });
    } catch (error) {
        next(error);
    }
}
//
exports.setSafeTarget = async (req, res, next) => {
    try {
        const websiteContent = await fetchWebsite(addHttpToURL(req.body.url)); // 
        await Target.findByIdAndUpdate(req.body.id, { initstate: websiteContent, isSafe: true }, { runValidators: true, context: 'query', new: true }).then((result) => {
            if (!result) {
                return res.status(403).json({ result: false, message: 'unable to safe id :' + req.body.id });
            } else {
                return res.status(200).json({ result: true, message: 'ok', data: result });
            }
        }).catch((err) => {
            return res.status(500).json({ result: false, message: 'something went wrong', error: err.message });
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
            return res.status(500).json({ result: false, message: 'something went wrong', error: err.message });
        });
    } catch (error) {
        next(error);
    }
}

exports.deleteTargetMany = async (req, res, next) => {
    try {
        await Target.deleteMany().then((result) => {
            if (result) {
                return res.status(200).json({ result: true, message: 'Deleted!', });
            }
        }).catch((err) => {
            return res.status(500).json({ result: false, message: 'something went wrong', error: err.message });
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
        let response = 'a';
        try {
            response = await axios.get(url, { timeout: 100000 });
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
                console.log('Network error:', error.message);
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
    try {
        return neWcontent == oldContent;
    } catch (error) {
        console.log(error.message);
    }

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
        const websiteContent = await fetchWebsite(addHttpToURL(currentTarget.url)); // 
        const analysisResults = analyzeWebsite(websiteContent, currentTarget.initstate);
        // req.target = currentTarget;
        // req.target = await screenshotTarget(req, res, next)
        currentTarget.isSafe = analysisResults;
        currentTarget.currentState = websiteContent;
        if (!analysisResults) {
            await this.exportEmail(currentTarget);
        }
        res.status(200).json({ results: true, target: currentTarget.name, issafe: currentTarget.isSafe, message: 'scan completed', data: { old: currentTarget.initstate, new: websiteContent } });
    } catch (error) {
        next(error);
    }
}

exports.htmlScanAll = async (req, res, next) => {
    try {
        let result = [];
        let changeCount = 0;
        let alertCount = 0; //
        let targetList = await Target.find();
        if (!targetList) { return res.status(404).json({ result: false, message: 'cannot find target' }); };
        for await (var tg of targetList) {
            const websiteContent = await fetchWebsite(addHttpToURL(tg.url)); // 
            const analysisResults = analyzeWebsite(websiteContent, tg.initstate);
            tg.isSafe = analysisResults;
            tg.currentState = websiteContent;
            result.push(tg);
            if (!analysisResults) {
                changeCount++;
                alertCount++;
                await this.exportEmail(tg);
            }
        }
        res.status(200).json({
            results: true, message: 'scan completed', data: {
                changeCount: changeCount,
                alertCount: alertCount,
                targetCount: targetList.length,
                result: result

            }
        });

        // result
    } catch (error) {
        next(error);
    }
};
exports.screenshotTarget = async (req, res, next) => {
    try {
        spawnSync("npx", ["playwright", "install", "chromium"]);
        let currentTarget = await Target.findById(req.body.id);
        let browser = await chromium.launch();

        let page = await browser.newPage();
        await page.setViewportSize({ width: 1080, height: 720 });
        await page.goto(addHttpToURL(currentTarget.url), { timeout: 1000000 });
        await page.screenshot({ path: `images/${currentTarget.name}.png`, fullPage: true });
        await browser.close();
        await Target.findByIdAndUpdate(currentTarget.id, { lastscreenShot: `${req.protocol}://${req.get('host')}/images/${currentTarget.name}.png` },
            { runValidators: true, context: 'query', new: true }).then((result) => {
                if (!result) {
                    return res.status(403).json({ result: false, message: 'failed' })
                } else {
                    return res.status(200).json({ result: true, message: 'ok', data: result.lastscreenShot })
                }

            }).catch((err) => {
                return res.status(403).json({ result: false, message: err.message });
            });

    } catch (error) {
        next(error);
    }
}

exports.screenshotAll = async (req, res, next) => {
    try {
        let result = [];
        let targetList = await Target.find();
        if (!targetList) { return res.status(404).json({ result: false, message: 'cannot find target' }); };
        // prepare chrome 
        spawnSync("npx", ["playwright", "install", "chromium"]);
        let browser = await chromium.launch();
        let page = await browser.newPage();
        await page.setViewportSize({ width: 1080, height: 720 });

        // looping 
        for await (const tg of targetList) {
            await page.goto(addHttpToURL(tg.url), { timeout: 80000 });
            await page.screenshot({ path: `images/${tg.name}.png`, fullPage: true }).then((_) => {
                result.push(`${req.protocol}://${req.get('host')}/images/${tg.name}.png`);
            }).catch((err) => {
                console.log(err.message);
            });
        }
        // close chrome  && return results
        await browser.close();
        return res.status(200).json({ result: true, message: 'ok', data: result })
    } catch (error) {
        next(error);
    }
};

exports.dashboard = async (req, res, next) => {
    try {
        return res.status(200).json({
            result: true, message: 'ok', data: {
                targetCount: 1,
                changeCount: 4,
                alertCount: 4,
            }
        })
    } catch (error) {
        next(error);
    }
};