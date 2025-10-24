const { findByIdAndUpdate, findById } = require('../model/factorySchema');
const User = require('../model/userSchema');
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
        const { username, email, password,  } = req.body;
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
    if(!user) {
        return res.status(404).json({message: "User doesn't exist"});
    }
    res.status(200).json(user);
}

//@desc Update user
//@route PUT /api/users/:id
//@access public
const updateUser = async (req, res) => {
    const { id } = req.params;
    const user = await User.findById(id);
    if(!user) {
        return res.status(404).json({ message: "User not found"});
    }
    const updatedUser = await User.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
    );

    res.status(200).json(updatedUser);
}

const deleteUser = async (req, res) => {
    const { id } = req.params;
    const user = await User.findById(id);
    if(!user) {
        return res.status(404).json({message: "User not found"});
    }
    const deletedUser = await User.findByIdAndDelete(id);
    
    res.status(200).json(deletedUser);
}


module.exports = {
    allUsers,
    createUser,
    getUser,
    updateUser,
    deleteUser
}