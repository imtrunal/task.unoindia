const User = require("../models/user.model");
const status = require('http-status');

exports.signup = async (req, res) => {
    try {

        let email = req.body.email;
        const getData = await User.findOne({ email: email });
        console.log("getData::", getData);

        if (getData == null) {

            const userData = User({
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                email: email,
                password: req.body.password
            });
            const saveData = await userData.save();

            res.status(status.CREATED).json({
                message: "User Registered Successfully",
                status: 201,
                data: saveData
            })

        } else {

            res.status(status.CONFLICT).json({
                message: "Email Already Exist",
                status: 409
            })

        }


    } catch (error) {
        res.status(status.INTERNAL_SERVER_ERROR).json({
            message: "Something Went Wrong",
            status: 500
        })
    }
};

exports.signin = async (req, res) => {
    try {

        let email = req.body.email;
        let password = req.body.password;
        const data = await User.findOne({ email: email });

        if (password == data.password) {

            if (data.tokens[0] == undefined) {

                const token = await data.generateauthtoken();
                res.cookie("jwt", token, {
                    expires: new Date(Date.now() + 30 * 24 * 3600 * 10000),
                    httpOnly: true,
                });

                res.status(status.OK).json({
                    message: "User Signin Succesfully",
                    status: 201,
                    token: token,
                    id: data._id
                })

            } else {

                res.status(status.OK).json({
                    message: "User Signin Succesfully",
                    status: 201,
                    token: data.tokens[0].token,
                    id: data._id
                })

            }


        } else {

            res.status(status.UNAUTHORIZED).json({
                message: "Credential Not Match",
                status: 401
            })

        }

    } catch (error) {
        res.status(status.INTERNAL_SERVER_ERROR).json({
            message: "Something Went Wrong",
            status: 500
        })
    }
}

exports.userProfile = async (req, res) => {
    try {

        const authToken = req.headers.authorization;
        console.log("authToken::", authToken);

        const data = await User.findOne({
            tokens: {
                $elemMatch: {
                    token: authToken
                }
            }
        });
        console.log('data::', data);

        if (data == null) {

            res.status(status.NOT_FOUND).json({
                message: "User Profile Not Found",
                status: 409
            })

        } else {

            const response = {
                _id: data._id,
                firstName: data.firstName,
                lastName: data.lastName,
                email: data.email,
                password: data.password,
                token: data.tokens[0].token
            }

            res.status(status.NOT_FOUND).json({
                message: "Get User Profile",
                status: 409,
                data: response
            })

        }

    } catch (error) {
        console.log('error::', error);
        res.status(status.INTERNAL_SERVER_ERROR).json({
            message: "Something Went Wrong",
            status: 500
        })

    }
}

exports.logout = async (req, res) => {
    try {

        req.user.tokens = req.user.tokens.filter((curelement) => {
            return curelement.token !== req.token;
        });
        res.clearCookie("jwt");
        await req.user.save();

        res.status(201).json({
            message: "Logout Successfully",
            status: 201,
        });

    } catch (error) {
        res.status(201).json({
            message: "Please Try Again..",
            status: 401,
        });
    }
};