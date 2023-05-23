const User = require('../models/user');
const fr = require('fs');
const path = require('path');

exports.updateUser = async (req, res, next) => {
    try {
        let oldUser = await User.findById(req.params.id);
        req.body.photos = [];
        console.log(req.files.length);
        req.files.length > 0 ?
            req.files.forEach(element => { req.body.photos.push(`${req.protocol}://${req.get('host')}/images/${element.filename}`); })
            : req.body.photos = oldUser.photos;
        //
        await User.findByIdAndUpdate(req.params.id, req.body, { runValidators: true, context: 'query', new: true })
            .then((newUser) => {
                if (req.files.length > 0) {
                    for (var img of oldUser.photos) {
                        fs.unlink(path.join(__dirname, `../images/${path.basename(img)}`), function (err) {
                            err ? console.error(err.message) : console.info(`removed ${img}`);
                        });
                    }
                }
                return newUser ? res.status(200).json({ result: true, message: 'success', data: newUser, old: oldUser }) : res.status(401).json({ message: 'failed to update User' });
            })
            .catch((err) => { return res.status(403).json({ result: false, message: 'faild!', error: err.message, payload: req.body }) });
    } catch (error) {
        res.status(401).json({ message: error.message, payload: req.body });
        return;
    }
}

exports.getUsers = async (req, res, next) => {
    try {
        await User.find().then((Users) => {
            return Users ? res.status(200).json({ result: true, message: 'success', data: Users, })
                : res.status(401).json({ message: `User not found  ` });
        });
    } catch (error) {
        next(error);
    }

}

exports.getUserid = async (req, res, next) => {
    try {
        await User.findById(req.body.userId).then((user) => {
            if (user) {
                const { password, isAdmin, role, ...newUser } = user._doc;
                return res.status(200).json({
                    result: true,
                    message: 'success',
                    data: newUser,
                })
            } else {
                return res.status(401).json({ message: `User not found for ${req.params.id}` });
            }
        });
    } catch (error) {
        next(error);
    }
}

exports.deleteUser = async (req, res, next) => {
    try {
        // delete the User
        await User.findByIdAndDelete(req.body.id).then((User) => {
            if (User) {
                // delete the photos
                for (var img of User.photos) {
                    fs.unlink(path.join(__dirname, `../images/${path.basename(img)}`), function (err) {
                        err ? console.error(err.message) : console.info(`removed ${img}`);
                    });
                }
                return res.redirect('/api/Users')
            } else {
                return res.status(401).json({ message: 'failed fetch User' });
            }
        })
    } catch (error) {
        return next(error);
    }
}

/// if has hotel next()
exports.userHasHotel = async (req, res, next) => {
    try {
        await Hotel.find({ userId: req.user.id }).then((result) => {
            if (result && result.length > 0) {
                req.userHotels = result; next();
                // res.status(404).json({ message: ' Hotel!', data: req.userHotels });
            }
            else { res.status(404).json({ message: 'User user has no Hotel!' }); return; }
        })
    } catch (error) {
        return res.status(401).json({ message: error.message });
    }
}