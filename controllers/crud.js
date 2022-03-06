
const getAll = model => async (req, res) => {
    await model.find({created_by: req.user._id, ...req.query}, (err, result) => {
        res.status(200).json({ data: result })
    }).clone()
}

const getOne = model => async (req, res) => {
    await model.findOne({created_by: req.user._id, _id: req.params.id }, (err, result) => {
        if (!result) {
            res.status(404).end()
        } else {
            res.status(200).json({ data: result })
        }
    }).clone()
}

const addOne = model => async (req, res) => {
    const newOne = await model.create({created_by: req.user._id, ...req.body})
    res.status(201).json({ data: newOne })
}

const updateOne = model => async (req, res) => {
    await model.findOneAndUpdate({ created_by: req.user._id, _id: req.params.id }, req.body, { new: true }, (err, result) => {
        if(!result) {
            res.status(400).end()
        } else {
            res.status(200).json({ data: result })
        }
    }).clone()
}

const removeOne = model => async (req, res) => {
    await model.findOneAndRemove({ created_by: req.user._id, _id: req.params.id }, (err, result) => {
        if (!result) {
            res.status(400).end()
        } else {
            res.status(200).json({ data: result })
        }
    }).clone()
}

const crudControllers = (model) => ({
    getAll: getAll(model),
    addOne: addOne(model),
    getOne: getOne(model),
    updateOne: updateOne(model),
    removeOne: removeOne(model)
})

exports.crudControllers = crudControllers