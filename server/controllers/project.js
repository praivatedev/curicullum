const Project = require("../models/Project")
const express = require("express")

const router = express.Router()

router.post("/add", async(req, res) => {
    try{
        const newProject = await Project.create(req.body)

        return res.status(200).json({message: "Project added sucessfully!", newProject})

    } catch(err){
        return res.status(500).json({error: err.message})
    }
});


router.get("/list", async(req, res) => {
    try{
        const projects = await Project.find()

        return res.status(200).json(projects);
    } catch(err){
        return res.status(500).json({error: err.message})
    }
});

router.get("/:id", async(req, res) => {
    try{
        const project = await Project.findById(req.params.id)

        if(!project)
            return res.status(404).json({error: "Error finding project!!"})

        return res.status(200).json(project)
    } catch(err){
        return res.status(500).json({error: err.message})
    }
});

router.put('/edit/:id', async (req, res) => {
    try{
        const updatedProject = await Project.findOneAndUpdate({_id: req.params.id}, req.body, {new: true, runValidators: true})

        if(!updatedProject)
            return res.status(404).json({error: "Prject not found!!"})

        return res.status(200).json({message: "Project updated sucessfully", updatedProject})
    } catch(err){
        return res.status(500).json({error: err.message})
    }
});

router.delete("/delete/:id", async(req, res) => {
    try{
        const project = await Project.findByIdAndDelete(req.params.id)

        if(!project)
            return res.status(404).json({error: "project to delete not found!!"});

        return res.status(200).json({error: err.message})


    } catch(err){
        return res.status(500).json({error: err.message})
    }
});

module.exports = router