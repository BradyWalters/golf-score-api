const getAll = model => (req, res) => {
    model.find(req.query, (err, result) => {
        if(!result[0]) {
            res.status(404).end()
        } else {
            res.status(200).json({ data: result })
        }
    }) 
}

const getOne = model => (req, res) => {
    model.findOne({ _id: req.params.id }, (err, result) => {
        if(err) {
            res.status(404).end()
        } else {
            res.status(200).json({ data: result})
        }
    })
}

const addOne = model => (req, res) => {
    const newOne = model.create(req.body)
    res.status(201).json({ data: newOne })
}

const updateOne = model => (req, res) => {
    model.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true }, (err, result) => {
            if(err) {
                res.status(400).end()
            } else {
                res.status(200).json({ data: result })
            }
        })
}

const removeOne = model => (req, res) => {
    model.findOneAndRemove({ _id: req.params.id }, (err, result) => {
        if(err || !result) {
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