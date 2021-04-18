const mongoose = require("mongoose");
const slugify = require("slugify");
const {
  geocoder
} = require("../utils/geocoder");
const bootcampSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "bootcamp name is required"],
    unique: [true, "this name is taken"],
    trim: true,
    maxlength: [50, "name can not go beyond 50 characters"],
    minlength: [5, "name can not be below 5 characters"],
  },
  slug: String,
  description: {
    type: String,
    required: [true, "description is required"],
    maxlength: [500, "description can not go beyond 500 characters"],
    minlength: [10, "description can not be below 5 characters"],
  },
  website: {
    type: String,
    match: [
      /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/,
      "please use a valid url which starts with http/https",
    ],
  },
  phone: {
    type: String,
    max: [20, "phone number must not exceed 20 numbers"],
  },
  email: {
    type: String,
    match: [
      /^([0-9a-zA-Z]([-_\\.]*[0-9a-zA-Z]+)*)@([0-9a-zA-Z]([-_\\.]*[0-9a-zA-Z]+)*)[\\.]([a-zA-Z]{2,9})$/,
      "please enter a valid email address",
    ],
    unique: true,
    required: true
  },
  address: {
    type: String,
    required: [true, "please provide your address"],
  },
  location: {
    //using GEOJSON
    type: {
      type: String, // Don't do `{ location: { type: String } }`
      enum: ["Point"], // 'location.type' must be 'Point'
      //required: true,
    },
    coordinates: {
      type: [Number],
      //required: true,
      index: "2dsphere",
    },
    formattedAddress: String,
    street: String,
    city: String,
    state: String,
    zipcode: String,
    country: String,
  },
  careers: {
    type: [String],
    require: true,
    enum: ["Web Development", "Codemasters", "Mobile Development", "Data Science", "UI/UX", "Business", "others"],
  },
  averageRating: {
    type: Number,
    min: [1, "rating must be >0"],
    max: [10, "rating must be <11"]
  },
  averageCost: Number,
  photo: {
    type: String,
    default: "./noPhoto.png"
  },
  housing: {
    type: Boolean,
    default: false
  },
  jobAssistance: {
    type: Boolean,
    default: false
  },
  jobGuarantee: {
    type: Boolean,
    default: false
  },
  acceptGi: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
   user: {
     type: mongoose.Schema.ObjectId,
     ref: 'User',
     required: true
   }
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

//creatingbootcammp slug from name of bootcamp provided
bootcampSchema.pre('save', function (next) {
  // console.log("slugify is running ", this.name);
  this.slug = slugify(this.name, {
    lowercase: true
  });
  next();
})

//geo code and create location field
bootcampSchema.pre('save', async function (next) {
  const loc = await geocoder.geocode(this.address)
  this.location = {
    type: 'Point',
    coordinates: [loc[0].longitude, loc[0].latitude],
    formattedAddress: loc[0].formattedAddress,
    street: loc[0].streetName,
    city: loc[0].city,
    state: loc[0].stateCode,
    zipcode: loc[0].zipcode,
    country: loc[0].countryCode,
  }
  //don't save address
  this.address = undefined;
  next()
})

//cascade delete courses when a bootcamp is deleted
bootcampSchema.pre('remove', async function (req, res, next) {
  console.log(`courses being removed from bootcamp ${this._id}`);
  await this.model('Courses').deleteMany({ bootcamp: this._id })
  next();
})
//Reverse populate with virtuals
bootcampSchema.virtual('courses', {
  ref: 'Courses',
  localField: '_id',
  foreignField: 'bootcamp',
  justOne:false
})
module.exports.bootcamps = mongoose.model("BootCamp", bootcampSchema);