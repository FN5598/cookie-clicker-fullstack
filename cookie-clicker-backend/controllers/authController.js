const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require("../model/userSchema");

//@desc Register a user
//@route POST auth/register
//@access public
const register = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        if (!username || !email || !password) {
            return res.status(400).json({ message: "All fields are mandatory" })
        }
        const avalibleUser = await User.findOne({ email });
        if (avalibleUser) {
            return res.status(400).json({ message: "User already exists" });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({
            username,
            email,
            password: hashedPassword
        });
        console.log(user);

        if (user) {
            res.status(201).json({ id: user._id, email: user.email });
        } else {
            res.status(400).json({ message: "User data is not valid" });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json(err);
    }
}

//@desc Login with an existing account and give jwt
//@route POST /auth/login
//@access public
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: "All fields are mandatory" })
        }
        const user = await User.findOne({ email });
        if (user && (await bcrypt.compare(password, user.password))) {
            const payload = {
                user: {
                    username: user.username,
                    email: user.email,
                    id: user._id
                }
            }

            const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: process.env.ACCESS_TOKEN_EXPIRE });

            const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, { expiresIn: process.env.REFRESH_TOKEN_EXPIRe });

            await User.findOneAndUpdate(
                { email },
                { refreshToken },
                { new: true }
            );

            res.cookie('accessToken', accessToken, {
                httpOnly: true,
                secure: true,
                sameSite: 'lax',
                maxAge: 60 * 60 * 1000
            });
            res.status(200).json({ refreshToken, accessToken, user: { id: user._id } });
        } else {
            res.status(401).json({ message: "Invalid credentials" });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json(err);
    }
}

//@desc Log out of account
//@route POST /auth/logout
//@access public
const logout = async (req, res) => {
    const refreshToken = req.cookies.refreshToken;

    await User.findOneAndUpdate({ refreshToken }, { refreshToken: null });

    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');
    res.json({ success: 'Successfully logged out' });
}

//@desc Refresh user access token
//@route POST api/refresh
//@access public
const refresh = async (req, res) => {
    const refreshToken = req.cookies.refreshToken;

    const user = await User.findOne({ refreshToken });
    if (!user) return res.status(403).json({ message: "Invalid refresh token" });

    const payload = {
        user: {
            username: user.username,
            email: user.email,
            id: user._id
        }
    }

    const newAccessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: process.env.ACCESS_TOKEN_EXPIRE});

    res.cookie('accessToken', newAccessToken, {
        httpOnly: true,
        maxAge: 60 * 60 * 1000
    });
    res.status(200).json({ message: "Successfully updated access token"});
}

module.exports = {
    register,
    login,
    logout,
    refresh
}