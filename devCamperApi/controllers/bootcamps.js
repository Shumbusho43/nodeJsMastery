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
//@desc get all bootcamps
//@routes GET /api/v1/bootcamps
//access public
exports.getBootcamps = asyncHandler(async (req, res, next) => {
  // console.log(req.query);
  let query;

  //copying req.query
  let reqQuery = {
    ...req.query
  }

  //fields to exclude
  const removeField = ['select','sort','page','limit'];

  //loop over removeField and delete them from req.query
  removeField.forEach(param => delete reqQuery[param]);
  
  //creating req.query string
  let queryStr = JSON.stringify(reqQuery)
  //creating operators
  queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`)
  
  //finding resource
  query = bootcamps.find(JSON.parse(queryStr))

  //selecting fields
    if (req.query.select) {
      const fields = req.query.select.split(",").join(" ");
      query=query.select(fields)
      console.log(fields);
  }
  if (req.query.sort) {
      const sortBy = req.query.sort.split(",").join(" ");
      query=query.sort(sortBy)
      console.log(sortBy);
  }
  else {
    query=query.sort('-createdAt')
  }

  //pagination
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 100;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const total=await bootcamps.countDocuments()
  query = query.skip(startIndex).limit(limit);
  
  //executing the query
  const allBootcamps = await query;
  const pagination = {};
  if (endIndex<total) {
    pagination.next = {
      page: page + 1,
      limit
    };
  }
  if (startIndex > 0) {
    pagination.prev = {
      page: page - 1,
      limit
    };
  }
  res.send(
    formatResult({
      status: 200,
      message: "ok",
      count: allBootcamps.length,
      pagination,
      data: allBootcamps
    })
  );

})
//@desc get a single bootcamp
//@routes GET /api/v1/bootcamp/:id
//access public
exports.getBootcamp = async (req, res, next) => {
  try {
    const bootcamp = await bootcamps.findById(req.params.id);
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
  } catch (error) {
    next(error)
  }
}

//@desc create a new bootcamp
//@routes POST /api/v1/bootcamps
//access public
exports.createBootcamp = asyncHandler(
  async (req, res, next) => {
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
  const bootcamp = await bootcamps.findByIdAndUpdate(
    req.params.id,
    req.body, {
      new: true,
      runValidators: true
    }
  );
  if (!bootcamp) {
    return next(new ErrorResponse(`no bootcamp with id: ${req.params.id}`, 404))
  }
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
  const bootcamp = await bootcamps.findByIdAndDelete(
    req.params.id
  );
  if (!bootcamp) {
    return next(new ErrorResponse(`no bootcamp with id: ${req.params.id}`, 404))
  }
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