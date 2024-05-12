const {Product} = require('../models/product');
const express = require('express');
const { Category } = require('../models/category');
const router = express.Router();
const mongoose = require('mongoose');
const multer = require('multer');


const FILE_TYPE_MAP = {
    'image/png': 'png',
    'image/jpeg': 'jpeg',
    'image/jpg': 'jpg'
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const isValid = FILE_TYPE_MAP[file.mimetype];
        let uploadError = new Error('invalid image type');

        if(isValid) {

            uploadError = null;
        }
        cb(uploadError, 'public/upload');
    },
    filename: function (req, file, cb) {
        const fileName = file.originalname.split(' ').join('-');
        const extension = FILE_TYPE_MAP[file.mimetype];
        cb(null, `${fileName}-${Date.now()}.${extension}`)
    }
})

const uploadOptions = multer({ storage: storage});




router.get(`/`, async (req, res) => {
    let filter = {};
    if (req.query.categories) {
        const categoryId = req.query.categories;
        filter = { category: { $in: [categoryId] } }; // Wrap categoryId in an array for $in operator
    }
    
    if (req.query.authors) {
        const authorId = req.query.authors;
        filter.author = authorId;
    }

    try {
        const productList = await Product.find(filter).populate('author category');
        res.send(productList);
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }

    //search
    try {
		const page = parseInt(req.query.page) - 1 || 0;
		const limit = parseInt(req.query.limit) || 9;
		const search = req.query.search || "";
		let sort = req.query.sort || "rating";
		let genre = req.query.genre || "All";

		const genreOptions = [
			"Action",
			"Romance",
			"Fantasy",
			"Drama",
			"Crime",
			"Adventure",
			"Thriller",
			"Sci-fi",
			"Music",
			"Family",
		];

		genre === "All"
			? (genre = [...genreOptions])
			: (genre = req.query.genre.split(","));
		req.query.sort ? (sort = req.query.sort.split(",")) : (sort = [sort]);

		let sortBy = {};
		if (sort[1]) {
			sortBy[sort[0]] = sort[1];
		} else {
			sortBy[sort[0]] = "asc";
		}

		const movies = await products.find({ name: { $regex: search, $options: "i" } })
			.where("genre")
			.in([...genre])
			.sort(sortBy)
			.skip(page * limit)
			.limit(limit);

		const total = await Movie.countDocuments({
			genre: { $in: [...genre] },
			name: { $regex: search, $options: "i" },
		});

		const response = {
			error: false,
			total,
			page: page + 1,
			limit,
			genres: genreOptions,
			movies,
		};

		res.status(200).json(response);
	} catch (err) {
		console.log(err);
		res.status(500).json({ error: true, message: "Internal Server Error" });
	}
    //end search
});



router.get('/:id', async (req, res) => {            //find category with id
    const product = await Product.findById(req.params.id).populate('category author');
    
    if(!product) {
        res.status(500).json({message: 'the product with the id given was not found'});
    }
    res.status(200).send(product); 
})




router.put('/:id', async (req, res) => {   //Update category
                                                    
    if(!mongoose.isValidObjectId(req.params.id)) {
        res.status(400).send('Invalid Product');
    }
    const product = await Product.findByIdAndUpdate(
        req.params.id,
        {
            name: req.body.name,
            image: req.body.image,
            description: req.body.description,
            author: req.body.author,
            category: req.body.category,
            rating: req.body.rating,
            numReviews: req.body.numReviews
        },
        { new: true}
    )
    if(!product) {
        return res.status(404).send('the product cannot be updated');
    }
    
    res.send(product);
})

router.post(`/`, uploadOptions.single('image'), async (req, res) => {

    const category = await Category.findById(req.body.category);
    if(!category) return res.status(400).send('Invalid Category');

    const file = req.file;
    if(!file) return res.status(400).send('No image in the request')
    
    const fileName = req.file.filename;
    const basePath = `${req.protocol}://${req.get('host')}/public/upload/`;

    let product = new Product({         //modeling product
        name: req.body.name,
        image: `${basePath}${fileName}`,
        description: req.body.description,
        author: req.body.author,
        category: req.body.category,
        rating: req.body.rating,
        numReviews: req.body.numReviews
    })

    product = await product.save();

    if(!product) {
        return res.status(500).send('the product cannot be created')    
    }
    res.send(product);
});


router.delete('/:id', (req, res) => {
    Product.findByIdAndDelete(req.params.id).then(product => {            //delete a category by id
        if(product) {
            return res.status(200).json({success: true, message: 'the product has been deleted'});
        }
        else {
            return res.status(404).json({success: false, message: 'product not found'});
        }
    }).catch(err =>{
        return res.status(400).json({success: false, error: err});
    })
})

router.get(`/get/count`, async (req, res) => {
    try {
        const productCount = await Product.countDocuments({});     //count product

        if(!productCount){
            res.status(500).json({success: false})
        }
        res.send({
            productCount: productCount,
        });
    }catch (error) {
        console.error("Error:", error);
        res.status(500).json({ success: false, error: error.message });
    }
    
})


module.exports = router;