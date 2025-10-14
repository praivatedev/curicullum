const express = require("express")
const Experience = require('../models/Experience')

const router = express.Router()

router.post('/add', async (req, res) => {
    try{
        const newExperience = await Experience.create(req.body)

        res.status(201).json(newExperience)
    }catch(error){
        console.error({error: "Server error", error})
        res.status(500).json({error: error})
    }
})

router.get('/list', async (req, res) => {
    try {
        const experiences = await Experience.find()

        res.status(200).json(experiences)
    } catch (error) {
        console.error({message: "Server error getting the expriences", error})
         return res.status(500).json({error: error.message})
        
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

router.post('/edit/:id', async (req, res) => {
    try {
        const updatedExperience = await Experience.findOneByIdAndUpdate({_id: req.params.id}, req.body, { new: true, runValidators: true })

        if(!updatedExperience){
            return res.status(404).json({Message: "Error finding the experience to update!!"})
        }

        return res.status(200).json(updatedExperience)
    } catch (error) {

        console.error({message: "Server error while trying to update the experience!!", error})

        return res.status(500).json(error.message)
        
    }
})

router.post('/delete/:id', async (req, res) => {
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