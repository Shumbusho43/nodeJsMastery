const mongoose = require("mongoose");
const courseSchema =new mongoose.Schema({
    title: {
        type: String,
        trim: true,
        required:[true,'plz add a course title']
    },
    description: {
        type: String,
        required:[true,'plz add description']
    },
    weeks: {
        type: Number,
        required:[true,'plz add number of weeks']
    },
    tuition: {
        type: Number,
        required:[true,'plz add tuition cost']
    },
    minimumSkills: {
        type: String,
        required: [true, 'plz add a minimum skill'],
        enum:['begginer','intermadiate','advanced']
    },
    scholarshipAvailable: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default:Date.now
    },
    //relation
    bootcamp: {
        type: mongoose.Schema.ObjectId,
        ref: 'BootCamp',
        required: true
    }
})
module.exports.courses=mongoose.model('Courses',courseSchema)