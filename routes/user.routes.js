const router = require("express").Router();
const auth = require("../middleware/user.middleware");

const {
    signup,
    signin,
    userProfile,
    logout
} = require("../controllers/user.controller");

router.post("/signup", signup);
router.post("/signin", signin);
router.get("/me", userProfile);
router.post("/logout", auth, logout);

module.exports = router;