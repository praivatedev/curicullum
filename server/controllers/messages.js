const express = require("express");
const Message = require("../models/Message")

const router = express.Router()

router.post("/add", async (req, res) => {
    try {
        const newMessage = new Message({
            name: req.body.name,
            email: req.body.email,
            message: req.body.message,
        });
        await newMessage.save();

        return res.status(201).json(newMessage1);

    } catch (err) {
        return res.status(500).json({ error: err.message })
    }
});

router.get("/list", async (req, res) => {
    try {
        const messages = await Message.find()

        if (!messages)
            return res.status(404).json({ error: "No messages found!!" })

        return res.status(200).json(messages)

    } catch (err) {
        return res.status(500).json({ error: err.message })
    }
});

router.get("/:id", async (req, res) => {
    try {
        const message = await Message.findById({ _id: req.params.id })

        if (!message)
            return res.status(404).json({ error: "Message not found" });

        return res.status(200).json(message)
    } catch (err) {
        return res.status(500).json({ error: err.message })
    }
});

router.delete("/delete/:id", async (req, res) => {
    try {
        // Find message by ID
        const existingMessage = await Message.findById(req.params.id);

        // If not found
        if (!existingMessage) {
            return res.status(404).json({ error: "Message not found!!" });
        }

        // Delete the message
        await Message.findByIdAndDelete(req.params.id);

        // Respond to client
        return res.status(200).json({ message: "Message deleted successfully" });
    } catch (err) {
        console.error("Error deleting message:", err);
        return res.status(500).json({ error: err.message });
    }
});


router.patch("/read/:id", async (req, res) => {
    try {
        const message = await Message.findByIdAndUpdate(
            req.params.id,
            { read: true },
            { new: true }
        );
        if (!message) return res.status(404).json({ error: "Message not found" });
        return res.status(200).json(message);
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
});

module.exports = router