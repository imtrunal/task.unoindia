const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const userSchema = mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    tokens: [
        {
            token: {
                type: String,
                required: true,
            }
        }
    ]
}, {
    timestamps: true
}, {
    collection: 'user'
});


userSchema.methods.generateauthtoken = async function () {
    try {
        const token = jwt.sign({ _id: this._id.toString() }, 'practicalTask');
        this.tokens = this.tokens.concat({ token: token })
        await this.save();
        return token;
    } catch (error) {
        console.log(error);
    }
}


module.exports = mongoose.model('user', userSchema);