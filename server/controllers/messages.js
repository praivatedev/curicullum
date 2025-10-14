const express = require("express");
const Message = require("../models/Message")

const router = express.Router()

router.post("/add", async(req, res) => {
    try{
        const message = await Message.create(req.body)

        return res.status(201).json({message: "Message sent sucessfully"});

    } catch(err){
        return res.status(500).json({error: err.message})
    }
});

router.get("/list", async(req, res) => {
    try{
        const messages = await Message.find()

        if(!messages)
            return res.status(404).json({error: "No messages found!!"})

        return res.status(200).json(messages)
    
    } catch(err){
        return res.status(500).json({error: err.message})
    }
});

router.get("/:id", async(req, res) => {
    try{
        const message = await Message.findById({_id: req.params.id})

        if(!message)
            return res.status(404).json({error: "Message not found"});

        return res.status(200).json(message)
    } catch(err){
        return res.status(500).json({error: err.message})
    }
});

module.exports = router