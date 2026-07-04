import fs from 'fs'
import foodModel from '../models/foodModel.js'

//add food item

const addFood = async (req,res) =>{

    let image_filename = `${req.file.filename}`;

    const food = new foodModel({
        name: req.body.name,
        description:req.body.description,
        price:req.body.price,
        category:req.body.category,
        image:image_filename
    })

    try {
        await food.save();
        res.json({success:true,message:'Food Added'})
    } catch (error) {
        console.log(error)
        res.json({success:false, message:'Error'})
    }
}

// All food list

const listFood = async (req,res) =>{
    try {
        const foods = await foodModel.find({});
        res.json({success:true,data:foods})
    } catch (error) {
        console.log(error)
        res.json({success:false, message:'Error'})
    }
}

// remove food item

const removeFood = async (req,res)=>{
    try {
        const food = await foodModel.findById(req.body.id);
        fs.unlink(`uploads/${food.image}`,()=>{})

        await foodModel.findByIdAndDelete(req.body.id)
        res.json({success:true,message:'Food Removed'})
    } catch (error) {
        console.log(error)
        res.json({success:false, message:'Error'})
    }
}

// update food item
const updateFood = async (req, res) => {
    try {
        const id = req.body.id;
        const food = await foodModel.findById(id);
        if (!food) return res.json({ success: false, message: 'Food not found' });

        // if new image uploaded, remove old file and set new filename
        if (req.file) {
            fs.unlink(`uploads/${food.image}`, () => {});
            food.image = req.file.filename;
        }

        // update fields if provided
        if (req.body.name) food.name = req.body.name;
        if (req.body.description) food.description = req.body.description;
        if (req.body.price) food.price = req.body.price;
        if (req.body.category) food.category = req.body.category;

        await food.save();
        res.json({ success: true, message: 'Food Updated' });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: 'Error' });
    }
};

export {addFood, listFood, removeFood, updateFood}