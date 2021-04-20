const {
  asyncHandler
} = require("../middleware/async");
const {
  bootcamps
} = require("../models/bootcamp");
const {
  ErrorResponse
} = require("../utils/errorResponse");
const {
  formatResult
} = require("../utils/imports");
const {
  geocoder
} = require("../utils/geocoder");
const path = require('path');
//@desc get all bootcamps
//@routes GET /api/v1/bootcamps
//access public
exports.getBootcamps = asyncHandler(async (req, res, next) => {
  // console.log(req.query);

  res.status(200).json(res.advancedResult)
})
//@desc get a single bootcamp
//@routes GET /api/v1/bootcamp/:id
//access public
exports.getBootcamp = asyncHandler(async (req, res, next) => {

  const bootcamp = await bootcamps.findById(req.params.id).populate('courses');
  if (!bootcamp) {
    return next(new ErrorResponse(`no bootcamp with id: ${req.params.id}`, 404))
  }
  res.send(
    formatResult({
      status: 200,
      message: "success",
      data: bootcamp,
    })
  );
})

//@desc create a new bootcamp
//@routes POST /api/v1/bootcamps
//access public
exports.createBootcamp = asyncHandler(
  async (req, res, next) => {
    //adding user to req.body
    req.body.user = req.user.id;

    //check for published bootcamp
    const publishedBootcamp = await bootcamps.findOne({ user: req.user.id })
    //if user is not an admin, then he/she is only allowed to add one bootcamp
    if (publishedBootcamp && req.user.role!='admin') {
      return next(new ErrorResponse(`user with id: ${req.user.id} already published a bootcamp`,400))
    }
    const newBootCamp = await bootcamps.create(req.body);
    console.log(req.params);
    res.send(
      formatResult({
        status: 201,
        message: "created",
        data: newBootCamp,
      })
    );
  }
)
//@desc update bootcamp
//@routes POST /api/v1/bootcamps/:id
//access public
exports.updateBootcamp = asyncHandler(async (req, res, next) => {
  let bootcamp = await bootcamps.findById(req.params.id);
  if (!bootcamp) {
    return next(new ErrorResponse(`no bootcamp with id: ${req.params.id}`, 404))
  }

  //making sure that logged in user is the owner of bootcamp
  if (req.user.id !== bootcamp.user.toString() && req.user.role!=='admin') {
    console.log(bootcamp.user);
    return next(new ErrorResponse(`user with this id: ${req.user.id} is not the owner`,400))
  }
  bootcamp = await bootcamps.findByIdAndUpdate(req.params.id,req.body,{
    new: true,
    runValidators: true
})
  res.send(
    formatResult({
      status: 200,
      message: "updated",
      data: bootcamp
    })
  );
})

//@desc deleting bootcamp
//@routes POST /api/v1/bootcamps/:id
//access public
exports.deleteBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await bootcamps.findById(
    req.params.id
  );
  if (!bootcamp) {
    return next(new ErrorResponse(`no bootcamp with id: ${req.params.id}`, 404))
  }
  //making sure that logged in user is the owner of bootcamp
  if (req.user.id !== bootcamp.user.toString() && req.user.role !== 'admin') {
    return next(new ErrorResponse(`user with this id: ${req.user.id} is not authorized to delete this bootcamp`, 400))
  }
  bootcamp.remove();
  res.send(
    formatResult({
      status: 200,
      message: "DELETED",
    })
  );
})
//@desc getting a bootcamp with in a radius
//@routes Get /api/v1/bootcamps/radius/:zipcode/:distance
//access public
exports.getBootcampWithInRadius = asyncHandler(async (req, res, next) => {
  const {
    zipcode,
    distance
  } = req.params
  //getting latitude and longitude from geocoder
  const loc = await geocoder.geocode(zipcode)
  const longitude = loc[0].longitude
  const latitude = loc[0].latitude
  //calculating raadius using radians
  //divide radius of the earth by distance 
  //radius=3963mi or 6378km
  const radius = distance / 3963
  const bootcamp = await bootcamps.find({
    location: {
      $geoWithin: {
        $centerSphere: [
          [`${longitude}`, `${latitude}`], radius
        ]
      }
    }
  })
  res.send(formatResult({
    status: 200,
    message: 'OK',
    count: bootcamp.length,
    data: bootcamp
  }));
})

//@desc  bootcamp photo upload
//@routes PUT /api/v1/bootcamps/:id/photo
//access public
exports.bootcampPhotoUpload = asyncHandler(async (req, res, next) => {
  const bootcamp = await bootcamps.findById(
    req.params.id
  );
  if (!bootcamp) {
    return next(new ErrorResponse(`no bootcamp with id: ${req.params.id}`, 404))
  }
  //making sure that logged in user is the owner of bootcamp
  if (req.user.id !== bootcamp.user.toString() && req.user.role !== 'admin') {
    return next(new ErrorResponse(`user with this id: ${req.user.id} is not authorized to upload a photo for this bootcamp`, 400))
  }
  if (!req.files) {
    return next(new ErrorResponse(`choose file first`, 400))
  }
  //console.log(req.files.file);
  const file = req.files.file;
  //check if file is an image
  if (!file.mimetype.startsWith('image')) {
    return next(new ErrorResponse(`file uploaded is not an image`), 400)
  }
  if (!file.size > process.env.MaxFileUpload) {
    return next(new ErrorResponse(`file must be less than ${process.env.MaxFileUpload} bites`), 400)
  }
  //creating custom filename
  file.name = `photo_${bootcamp._id}${path.parse(file.name).ext}`
  console.log(file.name);
  file.mv(`${process.env.FileUploadPath}/${file.name}`, async err => {
    if (err) {
      console.log(err);
      return next(new ErrorResponse(`problem with fie upload`, 500))
    }
    await bootcamps.findByIdAndUpdate(req.params.id, {
      photo: file.name
    })
    res.status(200).json({
      success: true,
      message: 'file uploaded',
      data: file.name
    })
  })
})