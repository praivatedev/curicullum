const { default: mongoose } = require("mongoose")

const experienceSchema = new mongoose.Schema({
    company: {
        type: String,
        required: true
    },

    position: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },

    technologies: {
        type: [String],
        required: true,
        default: []
    },

    responsibilities: {
        type: [String],
        required: true,
        default: []
    },

    startDate: {
        type: Date,
        required: true
    },

    endDate: {
        type: mongoose.Schema.Types.Mixed,
        required: false
    }
})

const Experience = mongoose.model("Experience", experienceSchema)

module.exports = Experience