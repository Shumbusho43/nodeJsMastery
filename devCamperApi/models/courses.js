const mongoose = require("mongoose");
const courseSchema = new mongoose.Schema({
    title: {
        type: String,
        trim: true,
        required: [true, 'plz add a course title'],
        unique: true
    },
    description: {
        type: String,
        required: [true, 'plz add description']
    },
    weeks: {
        type: Number,
        required: [true, 'plz add number of weeks']
    },
    tuition: {
        type: Number,
        required: [true, 'plz add tuition cost']
    },
    minimumSkill: {
        type: String,
        required: [true, 'plz add a minimum skill'],
        enum: ['beginner', 'intermediate', 'advanced']
    },
    scholarshipAvailable: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    //relation
    bootcamp: {
        type: mongoose.Schema.ObjectId,
        ref: 'BootCamp',
        required: true
    }
})
//static method to get avg of course on tuitions
courseSchema.statics.getAverageCost = async function (bootcampId) {
    //console.log('calculating averageCost....'.blue);
    const obj = await this.aggregate([{
            $match: {
                bootcamp: bootcampId
            }
    },
        {

            $group: {
                _id: '$bootcamp',
                averageCost: {
                    $avg: '$tuition'
                }
            }
        }
            
])
// console.log(obj);
try {
   await this.model('BootCamp').findByIdAndUpdate(bootcampId,{
       averageCost:Math.ceil(obj[0].averageCost/10)*10
   }) 
} catch (error) {
    console.log(error);
}
}
//call getAverageCost after save
courseSchema.post('save', function (next) {
    this.constructor.getAverageCost(this.bootcamp)
})

//call getAverageCost before remove
courseSchema.pre('remove', function (next) {
    this.constructor.getAverageCost(this.bootcamp)

})
module.exports.courses = mongoose.model('Courses', courseSchema)