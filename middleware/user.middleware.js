const jwt = require('jsonwebtoken');
const User = require("../models/user.model");

const authSchema = async (req, res, next) => {
    try {

        const token = req.cookies.jwt;
        console.log("token-data::", token);
        const verifyUser = jwt.verify(token, 'practicalTask');
        const user = await User.findOne({ _id: verifyUser._id });
        console.log('user:::', user);

        req.token = token;
        req.user = user;
        next();

    } catch (error) {
        res.status(401).send('Not Match Data');
    }
};

module.exports = authSchema;