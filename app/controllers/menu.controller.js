const db = require("../models")

const Menu = db.Menu

//Created
exports.addMenu = (req, res) => {
    const Menu = new Menu({
        label: req.body.label,
        icon: req.body.icon,
        link: req.body.link,
        order: req.body.order,
        roleLevel: req.body.roleLevel,
    })

    User.findOne({ _id: req.body.itemId}, (err, item) => {
        if (!item) {
            res.status(404).send({ message: "No item founded" })
            return
        }

        if (err) {
            res.status(404).send({ message : err})
        }
    })
}

//Read
exports.getAllMenu = (req, res) => {
    Menu.find({}, "")
}

//Create


//Delete

