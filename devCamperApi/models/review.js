const mongoose = require("mongoose");
const reviewSchema = new mongoose.Schema({
    title: {
        type: String,
        trim: true,
        required: [true, 'plz add a title for review'],
    },
    text: {
        type: String,
        required: [true, 'plz add some text'],
        max: 100
    },
    rating: {
        type: Number,
        min: 1,
        max: 10,
        required: true
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
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true
    }
})
//preventing user from providing more than one review per bootcamp
reviewSchema.index({
    bootcamp: 1,
    user: 1
}, {
    unique: true
})
//static method to get avg of rating
reviewSchema.statics.getAverageRating = async function (bootcampId) {
    //console.log('calculating averageRating....'.blue);
    const obj = await this.aggregate([{
            $match: {
                bootcamp: bootcampId
            }
        },
        {

            $group: {
                _id: '$bootcamp',
                averageRating: {
                    $avg: '$rating'
                }
            }
        }

    ])
    // console.log(obj);
    try {
        await this.model('BootCamp').findByIdAndUpdate(bootcampId, {
            averageRating: obj[0].averageRating
        })
    } catch (error) {
        console.log(error);
    }
}
//call getAverageCost after save
reviewSchema.post('save', function (next) {
    this.constructor.getAverageRating(this.bootcamp)
})

//call getAverageRating before remove
reviewSchema.pre('remove', function (next) {
    this.constructor.getAverageRating(this.bootcamp)

})
module.exports.reviews = mongoose.model('Reviews', reviewSchema)