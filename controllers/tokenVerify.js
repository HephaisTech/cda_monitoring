
const Jwt = require("jsonwebtoken");


exports.tokenVerify = (req, res, next) => {
    try {

        if (!req.cookies.CDATOKEN) return res.status(403).json({ result: false, message: "You are not authenticated!" });
        let token = req.cookies.CDATOKEN;

        Jwt.verify(token, process.env.JWTKEY, (err, user) => {
            if (user) {
                req.user = user;
                return next();
            }
            return res.status(403).json({ result: false, message: "Token is invalid !" });
        })
    } catch (error) {
        next(error);
    }

}
//

exports.cookieCheck = (req, res, next) => {
    try {

        if (!req.cookies.CDATOKEN) return res.redirect('/');
        let token = req.cookies.CDATOKEN;

        Jwt.verify(token, process.env.JWTKEY, (err, user) => {
            if (user) {
                req.user = user;
                return next();
            }
            return res.redirect('/');
        })
    } catch (error) {
        next(error);
    }

}

// exports.userVerify = (req, res, next) => {
//     try {
//         this.tokenVerify(req, res, () => {
//             if (req.user.id === req.body.userId || req.user.isAdmin) {
//                 return next();
//             }
//             return res.status(403).json({ message: `User not authorised `, currentUser: req.user.id, operationUser: req.body.userId });
//         });
//     } catch (error) {
//         next(error);
//     }
// }

exports.adminVerify = (req, res, next) => {
    try {
        this.tokenVerify(req, res, () => {
            if (req.user.isAdmin) {
                return next();
            }
            return res.status(403).json({ message: `User not authorised ` });
        });
    } catch (error) {
        next(error);
    }
}