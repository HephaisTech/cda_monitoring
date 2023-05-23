const Target = require('../models/target');
const puppeteer = require('puppeteer');
const fs = require('fs');
const axios = require('axios');
const cheerio = require('cheerio');


exports.saveTarget = async (req, res, next) => {
    try {
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

exports.screenshotTarget = async (req, res, next) => {
    try {
        const targetURL = 'https://flutter.dev/';
        const browser = await puppeteer.launch({ headless: "new" });
        const page = await browser.newPage();
        await page.goto(targetURL).then((result) => {
            console.log(targetURL);
        }).catch((err) => {

        });
        const initialScreenshot = await page.screenshot({ path: 'images/screenshot.png', fullPage: true });
        return res.status(200).json({ result: true, message: 'ok', data: `${req.protocol}://${req.get('host')}/images/screenshot.png` });
    } catch (error) {
        next(error);
    }
}

exports.htmlScanTarget = async (req, res, next) => {
    try {
        let currentTarget = await Target.findById(req.body.id);
        if (!currentTarget) { return res.status(404).json({ result: false, message: 'cannot find target' }); };
        const websiteContent = await fetchWebsite(currentTarget.url);
        const analysisResults = analyzeWebsite(websiteContent, currentTarget.initstate);
        res.status(200).json({ results: true, message: analysisResults, data: { old: currentTarget.initstate, new: websiteContent } });
    } catch (error) {
        next(error);
    }
}

async function fetchWebsite(url) {
    try {
        const response = await axios.get(url);
        return response.data;
    } catch (error) {
        console.error('Erreur lors de la récupération du site web :', error);
        return null;
    }
}

function analyzeWebsite(neWcontent, oldContent) {
    const $ = cheerio.load(content);
    return cheerio.load(neWcontent) == cheerio.load(oldContent);
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