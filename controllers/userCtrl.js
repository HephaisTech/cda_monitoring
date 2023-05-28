/**
 * Author : R@mius
 * Date : 23/05/2023
 * To do : webMonitoring
 * 
 * this : manager user Model
 */
const User = require('../models/user');
const fr = require('fs');
const path = require('path');

exports.updateUser = async (req, res, next) => {
    try {
        // let oldUser = await User.findById(req.params.id);
        // req.body.photos = [];
        // console.log(req.files.length);
        // req.files.length > 0 ?
        //     req.files.forEach(element => { req.body.photos.push(`${req.protocol}://${req.get('host')}/images/${element.filename}`); })
        //     : req.body.photos = oldUser.photos;
        // //
        await User.findByIdAndUpdate(req.body.id, req.body, { runValidators: true, context: 'query', new: true })
            .then((newUser) => {
                return newUser ? res.status(200).json({ result: true, message: 'success', data: newUser })
                    : res.status(401).json({ message: 'failed to update User' });
            })
            .catch((err) => { return res.status(403).json({ result: false, message: 'faild!', error: err.message, payload: req.body }) });
    } catch (error) {
        next(error);
    }
}

exports.getUsers = async (req, res, next) => {
    try {
        await User.find().then((Users) => {
            return Users ? res.status(200).json({ result: true, message: 'success', data: Users, })
                : res.status(401).json({ result: true, message: `User not found  ` });
        });
    } catch (error) {
        next(error);
    }

}

exports.getUserid = async (req, res, next) => {
    try {
        await User.findById(req.body.id).then((user) => {
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
                res.status(200).json({
                    result: true,
                    message: 'success',
                })
            } else {
                return res.status(401).json({ message: 'failed fetch User' });
            }
        })
    } catch (error) {
        return next(error);
    }
}

