const express = require("express")
const Experience = require('../models/Experience')

const router = express.Router()

router.post('/add', async (req, res) => {
  try {
    // Copy req.body so we don’t mutate it directly
    const data = { ...req.body };

    // ✅ Default endDate to "Present" if not provided or empty
    if (!data.endDate || data.endDate.trim() === "") {
      data.endDate = "Present";
    }

    const newExperience = await Experience.create(data);
    res.status(201).json(newExperience);
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({ error: "Server error" });
  }
});


router.get('/list', async (req, res) => {
    try {
        const experiences = await Experience.find()

        res.status(200).json(experiences)
    } catch (error) {
        console.error({message: "Server error getting the expriences", error})
         return res.status(500).json({error: error.message})
        
    }
})

router.put('/edit/:id', async (req, res) => {
    try {
        const updatedExperience = await Experience.findByIdAndUpdate({_id: req.params.id}, req.body, { new: true, runValidators: true })

        if(!updatedExperience){
            return res.status(404).json({Message: "Error finding the experience to update!!"})
        }

        return res.status(200).json(updatedExperience)
    } catch (error) {

        console.error({message: "Server error while trying to update the experience!!", error})

        return res.status(500).json(error.message)
        
    }
})


router.get('/:id', async (req, res) => {
    try {
        const experience = await Experience.findById(req.params.id)

        if(!experience){
            return res.status(404).json({message: "Error finding the experience!!"})
        }

        return res.status(200).json(experience)
    } catch (error) {
        console.error({Error: "Server error while finding the experience"})
        return res.status(500).json(error.message)
    }
})

router.delete('/delete/:id', async (req, res) => {
    try{
        const deleteExperience = await Experience.findByIdAndDelete(req.params.id)
        
        console.log(req)

        if(!deleteExperience){
            return res.status(404).json({Message: "Error finding the experience to delete!!"})
        }

        return res.status(200).json({Message: "Sucessfully deleted the experience!!"})
    }catch(error){
        console.error({Error: "Server while tring to delete an experience!!"})

        return res.status(500).json(error.message)
    }
})


module.exports = router