const Category = require('../models/Category.model')


exports.list = async (req, res) => {
    try {
        const category = await Category.find({}).exec()
        res.send(category);
    } catch (error) {
        console.log(error)
        res.status(500).send('server error')
    }
}

exports.create = async (req, res) => {
    try {
        const { nameCategory } = req.body
        const category = await new Category({name:nameCategory}).save()
        res.json({ message: "เพิ่มหมวดหมู่สินค้าสำเร็จ" })

    } catch (error) {
        console.log(error)
        res.status(500).send('server error')
    }
}

exports.read = async (req, res) => {
    try {
        const id = req.params.id;
        const category = await Category.findOne({_id:id}).exec();
        res.send(category);
    } catch (error) {
        console.log(error)
        res.status(500).send('server error')
    }
}

exports.update = async (req, res) => {
    try {
        const id = req.params.id;
        const { nameCategory } = req.body;
        const category = await Category.findOneAndUpdate({_id:id}, {name:nameCategory});
        res.json({ message: "เเก้ไขหมวดหมู่สินค้าสำเร็จ" })
    } catch (error) {
        console.log(error)
        res.status(500).send('server error')
    }
}

exports.remove = async (req, res) => {
    try {
        const id = req.params.id;
        const category = await Category.findOneAndDelete({_id:id});
        res.send(category);
    } catch (error) {
        console.log(error)
        res.status(500).send('server error')
    }
}