const Product = require('../models/Product.model')


exports.create = async (req, res) => {
    try {
        const product = await new Product(req.body).save();
        res.json({ message: "เพิ่มสินค้าสำเร็จ" })
        // res.send(product);
    } catch (error) {
        console.log(error)
        res.status(500).send('create product error!')
    }
}

exports.list = async (req, res) => {
    try {
        const count = parseInt(req.params.count)
        const product = await Product.find().limit(count).populate('category').sort([["createdAt", "desc"]])
        res.send(product);
        // res.json({ message: "เพิ่มสินค้าสำเร็จ" })
    } catch (error) {
        console.log(error)
        res.status(500).send('list product error!')
    }
}

exports.listColor = async (req, res) => {
    try {
        const color = await Product.distinct("color")
        res.send(color);
    } catch (error) {
        console.log(error)
        res.status(500).send('list product error!')
    }
}

exports.remove = async (req, res) => {
    try {
        const deleteProduct = await Product.findOneAndRemove({ _id: req.params.id }).exec();
        res.send(deleteProduct);
    } catch (error) {
        console.log(error)
        res.status(500).send('remove product error!')
    }
}

exports.read = async (req, res) => {
    try {
        const product = await Product.findOne({ _id: req.params.id }).populate('category').exec()
        res.send(product);
    } catch (error) {
        console.log(error)
        res.status(500).send('read product error!')
    }
}

exports.update = async (req, res) => {
    try {
        const product = await Product.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true }).exec()
        res.send(product);
    } catch (error) {
        console.log(error)
        res.status(500).send('update product error!')
    }
}

exports.listBy = async (req, res) => {
    try {
        const { sort, order, limit } = req.body;

        const product = await Product.find().limit(limit).populate('category').sort([[sort, order]])
        res.send(product);
        // res.json({ message: "เพิ่มสินค้าสำเร็จ" })
    } catch (error) {
        console.log(error)
        res.status(500).send('ListBy product error!')
    }
}

exports.searchFilters = async (req, res) => {
    const { selectFilter } = req.body;

    if (selectFilter?.category === undefined && selectFilter?.color === undefined) {
        let products = await Product.find({

            price: { $gte: selectFilter?.price[0], $lte: selectFilter?.price[1] }

        })
            .populate('category', "_id name");
        res.send(products)
    }

    if (selectFilter?.category !== undefined && selectFilter?.color === undefined) {
        let products = await Product.find({
            $and: [
                { category: { $in: selectFilter.category } },
                { price: { $gte: selectFilter?.price[0], $lte: selectFilter?.price[1] } }
            ]
        })
            .populate('category', "_id name");
        res.send(products)
    }

    if (selectFilter?.category === undefined && selectFilter?.color !== undefined) {
        let products = await Product.find({
            $and: [
                { color: { $in: selectFilter.color } },
                { price: { $gte: selectFilter?.price[0], $lte: selectFilter?.price[1] } }
            ]
        })
            .populate('category', "_id name");
        res.send(products)
    }

    if (selectFilter?.category !== undefined && selectFilter?.color !== undefined) {
        let products = await Product.find({
            $and: [
                { category: { $in: selectFilter.category } },
                { color: { $in: selectFilter.color } },
                { price: { $gte: selectFilter?.price[0], $lte: selectFilter?.price[1] } }
            ]
        })
            .populate('category', "_id name");
        res.send(products)
    }

}

