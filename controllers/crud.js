const { reset } = require("nodemon")

const getAll = model => async (req, res) => {
    await model.find(req.query, (err, result) => {
        res.status(200).json({ data: result })
    }).clone()
}

const getOne = model => async (req, res) => {
    await model.findOne({ _id: req.params.id }, (err, result) => {
        if (!result) {
            res.status(404).end()
        } else {
            res.status(200).json({ data: result })
        }
    })
}

const addOne = model => async (req, res) => {
    console.log(req.user._id)
    const newOne = await model.create(req.body)
    res.status(201).json({ data: newOne })
}

const updateOne = model => async (req, res) => {
    await model.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true }, (err, result) => {
        if(!result) {
            res.status(400).end()
        } else {
            res.status(200).json({ data: result })
        }
    })
}

const removeOne = model => async (req, res) => {
    await model.findOneAndRemove({ _id: req.params.id }, (err, result) => {
        if (!result) {
            res.status(400).end()
        } else {
            res.status(200).json({ data: result })
        }
    })
}

const crudControllers = (model) => ({
    getAll: getAll(model),
    addOne: addOne(model),
    getOne: getOne(model),
    updateOne: updateOne(model),
    removeOne: removeOne(model)
})

exports.crudControllers = crudControllers