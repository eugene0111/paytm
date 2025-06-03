const express = require("express");
const { signup, signin, update } = require("../types");
const { User, Account } = require("../db");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config");
const { authMiddleWare } = require("../middleware");

const userRouter = express.Router();

userRouter.post("/signup", async(req, res) => {
    const { success } = signup.safeParse(req.body);
    if (!success) {
        return res.status(411).json({
            message: "Invalid Inputs",
        });
    }

    const existingUser = await User.findOne({
        userName: req.body.userName
    });

    if (existingUser) {
        return res.status(411).json({
            message: "Username already taken",
        });
    }

    const user = await User.create({
        userName: req.body.userName,
        password: req.body.password,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
    });
    const userId = user._id;

    await Account.create({
        userId: userId,
        balance: 1000,
    });

    const token = jwt.sign({
        userId,
    }, JWT_SECRET);

    res.json({
        message: "User created successfully",
        token: token,
    });
});

userRouter.post("/signin", async(req, res) => {
    const { success } = signin.safeParse(req.body);
    if (!success) {
        res.status(411).json({
            message: "Invalid Inputs",
        });
    }

    const existingUser = await User.findOne({
        userName: req.body.userName,
        password: req.body.password,
    });

    if (existingUser) {
        const token = jwt.sign({
            userId: existingUser._id,
        }, JWT_SECRET);
        return res.status(200).json({
            token: token,
        });
    }

    res.status(411).json({
        message: "Wrong Username/Password",
    });
});

userRouter.put("/update", authMiddleWare, async (req, res) => {
    const { success } = update.safeParse(req.body);
    if (!success) {
        res.status(411).json({
            message: "Invalid Inputs",
        });
    }

    await User.updateOne(
        { _id: req.userId },
        { $set: req.body }
    );

    res.status(200).json({
        message: "Updated Details",
    });
});

userRouter.get("/bulk", async(req, res) => {
    const filter = req.query.filter;
    const users = await User.find({
        $or: [{
            firstName: {
                "$regex": filter
            }
        }, {
            lastName: {
                "$regex": filter
            }
        }]
    });

    res.json({
        user: users.map(user => ({
            userName: user.userName,
            firstName: user.firstName,
            lastName: user.lastName,
            _id: user._id
        }))
    });
});

module.exports = userRouter;