const User = require('../model/userSchema');
const Factory = require('../model/factorySchema');
const bcrypt = require('bcrypt');

//@desc Get all users from DB
//@route GET /api/users
//@access public
const allUsers = async (req, res) => {
    try {
        const users = await User.find();
        if (!users) {
            res.status(404).json("No users found");
        }
        if (users.length <= 0) {
            return res.status(200).json({ message: "No users exist yet!" });
        }

        res.status(200).json(users);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Server Error" });
    }
}

//@desc Create user and update to DB
//@route POST /api/users
//@access public
const createUser = async (req, res) => {
    try {
        const { username, email, password, } = req.body;
        if (!username || !email || !password) {
            return res.status(400).json({ message: "All fields are mandatory" });
        }
        const user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = {
            username,
            email,
            password: hashedPassword
        }
        await User.create(newUser)

        res.status(201).json(newUser);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: err });
    }
}

//@desc Get user
//@route GET /api/users/:id
//access public
const getUser = async (req, res) => {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) {
        return res.status(404).json({ message: "User doesn't exist" });
    }
    res.status(200).json(user);
}

//@desc Update user cookies
//@route PUT /api/users/cookies/:id
//@access private
const updateUserCookies = async (req, res) => {
    const { id } = req.params;

    const { cookies } = req.body;
    if (!cookies || cookies <= 0) return res.status(400).json({ message: "Give valid cookies amount" });

    const user = await User.findById(id);
    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }

    const updatedUser = await User.findByIdAndUpdate(
        req.params.id,
        {
            $inc: { totalCookies: cookies }
        },
        { new: true }
    );

    res.status(200).json({ totalCookies: updatedUser.totalCookies });
}

//@desc Update user factories
//@route PUT /api/users/factories/:id
//@access private
const updateUserFactories = async (req, res) => {
    try {
        const { id } = req.params;

        const { factoryId, factoryAmount } = req.body;
        if (!factoryId) return res.status(400).json({ message: "Please provide a valid factory ID." });


        const user = await User.findById(id);
        const factory = await Factory.findById(factoryId);
        if (!user || !factory) {
            return res.status(404).json({ message: "User or factory not found" });
        }

        const factoryToUpdate = user.factories.find(f => f._id === factoryId);
        let totalCost = 0;
        for (let i = 0; i < factoryAmount; i++) {
            const priceForThisFactory = factoryToUpdate.startingPrice * Math.pow(1.15, (factoryToUpdate.amount - 1) + i);
            totalCost += priceForThisFactory;
        }

        if (user.totalCookies < totalCost) {
            return res.status(400).json({ message: "Not enough cookies" });
        }

        factoryToUpdate.amount += factoryAmount;
        factoryToUpdate.currentPrice = factoryToUpdate.startingPrice * Math.pow(1.15, factoryToUpdate.amount);
        user.totalCookies -= totalCost;

        const updatedUser = await user.save();

        console.log(updatedUser.totalCookies);
        res.status(200).json(updatedUser);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Internal server error" });
    }
}


//@desc Delete a user
//@route DELETE /api/users/:id
//@access private
const deleteUser = async (req, res) => {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }
    const deletedUser = await User.findByIdAndDelete(id);

    res.status(200).json(deletedUser);
}


module.exports = {
    allUsers,
    createUser,
    getUser,
    updateUserCookies,
    deleteUser,
    updateUserFactories
}