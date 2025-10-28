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

//@desc Update user factories
//@route PUT /api/users/factories/:id
//@access private
const updateUserFactories = async (req, res) => {
    try {
        const { id } = req.params;
        const { factoryId, factoryAmount } = req.body;

        if (!factoryId) {
            return res.status(400).json({
                message: "Please provide a valid factory ID.",
                received: factoryId
            });
        }

        if (!factoryAmount || factoryAmount <= 0) {
            return res.status(400).json({
                message: "Please provide a valid factory amount.",
                received: factoryAmount
            });
        }

        console.log('Received request:', { id, factoryId, factoryAmount });

        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const currentTime = Date.now();
        const lastUpdateTime = new Date(user.updatedAt).getTime();
        const timePassed = currentTime - lastUpdateTime;
        const cookiesEarned = (user.cookiesPerSecond * timePassed) / 1000;

        user.totalCookies += cookiesEarned;

        const factoryToUpdate = user.factories.find(f => f._id === factoryId);

        if (!factoryToUpdate) return res.status(404).json({ message: "Factory not found in user's factories" });


        const currentAmount = factoryToUpdate.amount
        let totalCost = 0;

        for (let i = 0; i < factoryAmount; i++) {
            const priceForThisFactory = factoryToUpdate.startingPrice * Math.pow(1.15, currentAmount + i);
            totalCost += priceForThisFactory;
        }

        if (user.totalCookies < totalCost) {
            await user.save();
            return res.status(400).json({
                message: "Not enough cookies",
                needed: totalCost.toFixed(2),
                available: user.totalCookies.toFixed(2)
            });
        }

        factoryToUpdate.amount += factoryAmount;
        factoryToUpdate.currentPrice = factoryToUpdate.startingPrice * Math.pow(1.15, factoryToUpdate.amount);
        user.totalCookies -= totalCost;
        user.cookiesPerSecond += factoryToUpdate.productionRate * factoryAmount;

        const updatedUser = await user.save();
        res.status(200).json({
            totalCookies: updatedUser.totalCookies,
            cookiesPerSecond: updatedUser.cookiesPerSecond,
            factories: updatedUser.factories,
            totalCookies: updatedUser.totalCookies
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Internal server error" });
    }
}


//@desc Auto save user data on page change
//@route PUT /api/users/auto-save/:id
//@access private
const autoSave = async (req, res) => {
    try {
        const { id } = req.params;

        const { totalCookies, cookiesPerSecond, factories } = req.body;

        if (!totalCookies) {
            console.log("Total cookies not found");
            res.status(404);
        };

        if (!cookiesPerSecond) {
            console.log("Cookies per second not found");
            res.status(404);
        };

        if (!factories) {
            console.log("User factories not found");
            res.status(404);
        }

        const user = await User.findById(id);
        if (!user) return res.status(400).json({ message: "User not found" });

        user.totalCookies = totalCookies;
        user.cookiesPerSecond = cookiesPerSecond;
        user.factories = factories;

        const updatedUser = await user.save();

        res.status(200).json({
            totalCookies: updatedUser.totalCookies,
            cookiesPerSecond: updatedUser.cookiesPerSecond
        });
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
    deleteUser,
    updateUserFactories,
    autoSave
}