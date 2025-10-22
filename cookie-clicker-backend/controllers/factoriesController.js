const Factory = require('../model/factorySchema');

//@desc Get all factories from DB
//@route GET /api/factories
//@access public
const allFactories = async (req, res) => {
    try {
        const factories = await Factory.find();
        if (!factories) {
            res.status(404).json("No factories found");
        }
        if (factories.length <= 0) {
            return res.status(200).json({ message: "No factories exist yet!" });
        }

        res.status(200).json(factories);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Server Error" });
    }
}

//@desc Update a factory and update to DB
//@route GET /api/factories/:id
//@access public
const getFactory = async (req, res) => {
    const { id } = req.params;
    if (!id) {
        return res.status(400).json({ message: "The id is required" });
    }
    const factory = await Factory.findById(id);
    if (!factory) {
        return res.status(404).json({ message: "Factory not found" });
    }

    res.status(200).json(factory);
}

//@desc Create factory and update to DB
//@route POST /api/factories
//@access public
const createFactory = async (req, res) => {
    try {
        const { name, startingPrice, currentPrice, factoryLore } = req.body;
        if (!name || !startingPrice || !currentPrice || !factoryLore) {
            return res.status(400).json({ message: "All fields are mandatory" });
        }
        const factory = await Factory.findOne({ name });
        if (factory) {
            return res.status(400).json({ message: "Factory already exists" });
        }
        const newFactory = {
            name,
            startingPrice,
            currentPrice,
            factoryLore
        }
        await Factory.create(newFactory)

        res.status(201).json(newFactory);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: err });
    }
}

//@desc Update a factory and update to DB
//@route PUT /api/factories/:id
//@access public
const updateFactory = async (req, res) => {
    const { id } = req.params;
    if (!id) {
        return res.status(400).json({ message: "The id is required" });
    }
    const factory = await Factory.findById(id);
    if (!factory) {
        return res.status(404).json({ message: "Factory not found" });
    }

    const updatedFactory = await Factory.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true}
    );

    res.status(200).json(updatedFactory);
}

//@desc Delete a factory and update to DB
//@route DELETE /api/factories/:id
//@access public
const deleteFactory = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ message: "The id is required" });
        }
        const factory = await Factory.findById(id);
        if (!factory) {
            return res.status(404).json({ message: "Factory not found" });
        }

        const deletedFactory = await Factory.findOneAndDelete(id);

        res.status(200).json({ message: `Successfully deleted factory` });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: err });
    }
}

module.exports = {
    allFactories,
    getFactory,
    createFactory,
    updateFactory,
    deleteFactory
};