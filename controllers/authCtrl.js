
const bcrypt = require("bcrypt");
const Jwt = require("jsonwebtoken");
const User = require("../models/user");

exports.register = async (req, res, next) => {
    try {
        // let photos = [];
        // if (req.files.length > 0) {
        //     req.files.forEach(element => {
        //         photos.push(`${req.protocol}://${req.get('host')}/images/${element.filename}`);
        //     });
        //     req.body.photos = photos;
        // }
        //
        const salt = bcrypt.genSaltSync(7);
        const hash = bcrypt.hashSync(req.body.password, salt);

        //
        const newUser = new User({
            username: req.body.username,
            email: req.body.email,
            password: hash,
            // photos: photos
        });
        // await newUser.save();
        // return res.status(201).json({ resulte: newUser });
        await newUser.save().then((user) => {
            return res.status(201).json({
                result: true,
                message: 'successfully  registered !',
                data: { id: user._id, email: user.email }
            })
        }).catch((err) => {
            return res.status(403).json({ result: false, message: 'faild!', error: err.message, payload: req.body })
        });
    } catch (error) {
        return next(error);
    }
}
exports.login = async (req, res, next) => {
    try {
        //search user
        const user = await User.findOne({ email: req.body.email })
        // if user is not found return error
        if (!user) return res.status(401).json({ message: "email or password incorrect !" });
        // if user , check pwd
        const valid = await bcrypt.compare(req.body.password, user.password);
        // if pwd incorrect return error
        if (!valid) return res.status(401).json({ message: "email or password incorrect !" });

        // return user

        const token = Jwt.sign({ id: user._id, isAdmin: user.isAdmin }, process.env.JWTKEY, { expiresIn: "2h" });

        const { password, isAdmin, ...newUser } = user._doc;
        res.cookie("CDATOKEN", token, {
            httpOnly: true,
        }).status(200).json({
            result: true,
            message: `welcome ${newUser.email} !`,
            data: newUser,
        })

    } catch (error) {
        next(error);
    }

}

exports.registerAdmin = async (req, res, next) => {
    try {
        // let photos = [];
        // if (req.files.length > 0) {
        //     req.files.forEach(element => {
        //         photos.push(`${req.protocol}://${req.get('host')}/images/${element.filename}`);
        //     });
        //     req.body.photos = photos;
        // }
        //
        const salt = bcrypt.genSaltSync(7);
        const hash = bcrypt.hashSync(req.body.password, salt);

        //
        const newUser = new User({
            username: req.body.username,
            email: req.body.email,
            password: hash,
            isAdmin: true,
            role: 'sysAdmin'
            // photos: photos
        });
        // await newUser.save();
        // return res.status(201).json({ resulte: newUser });
        await newUser.save().then((user) => {
            return res.status(201).json({
                result: true,
                message: 'successfully  registered !',
                data: { id: user._id, email: user.email }
            })
        }).catch((err) => {
            return res.status(403).json({ result: false, message: 'faild!', error: err.message, payload: req.body })
        });
    } catch (error) {
        return next(error);
    }
}