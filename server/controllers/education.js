const express = require("express");
const Education = require("../models/Education")

const router = express.Router();

router.post("/add", async (req, res) => {
    try {

        const existingEducation = await Education.findOne({institution: req.body.institution})

        if(existingEducation){
            return res.status(409).json({error: "Education already exists!!"})
        }

        const education = await Education.create(req.body);

        return res.status(201).json({message: "Education added sucessfully", education});
    } catch (err) {
        console.error(err)
        res.status(400).json({ error: err.message });
    }

})

router.get("/list", async(req,res) => {
    try {
        const response = await Education.find();
       return res.status(200).json(response)
    } catch (error) {
        console.error(error)
        return res.status(200).json({message: error.message})
        
    }
});

router.get('/count', async (req, res) => {
   try{
     const count = await Education.countDocuments();
    res.status(200).json({ total: count })
   }catch(error){
     console.error(error);
    res.status(500).json({ message: error.message})
   }
});

router.get("/:id", async (req, res) => {
    try {
        const eduacation = await Education.findById(req.params.id)

        if(!eduacation){
            return res.status(404).json({error: "Error finding the education"})
        }

        return res.status(200).json(eduacation)
    } catch (error) {
        console.error(error.message)

        return res.status(200).json({message: error.message})
        
    }
})

router.put('/edit/:id', async (req, res) => {
    const {id} = req.params
    try {
        const updatedEducation = await Education.findByIdAndUpdate(id, req.body, { new: true, runValidators: true})

        if(!updatedEducation){
            return res.json({ mesage: "Education not found!!"}).status(500)
        }

        return res.status(200).json({ message: "Education updated sucessefully ", updatedEducation})
    } catch (error) {

         console.error({Error: error});

        return res.status(500).json({ error: error.message}) 
    }
});

router.delete('/delete/:id', async (req, res) => {
    try {
        const deleteEducation = await Education.findByIdAndDelete(req.params.id)

        if(!deleteEducation){
            return res.status(404).json({ message: "Education to delete not found!!"})
        }

        return res.status(200).json({ message: "Education to deleted sucessefully"})
    } catch (err) {
         console.err(err);
        return res.status(404).json({ error: err.message})        
    }
})
module.exports = router