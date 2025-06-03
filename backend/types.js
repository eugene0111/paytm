const zod = require("zod");

const signup = zod.object({
    userName: zod.string().email(),
    password: zod.string(),
    firstName: zod.string(),
    lastName: zod.string(),
});

const signin = zod.object({
    userName: zod.string().email(),
    password: zod.string()
});

const update = zod.object({
    password: zod.string().optional(),
    firstName: zod.string().optional(),
    lastName: zod.string().optional(),
});

module.exports = {
    signup,
    signin,
    update,
};