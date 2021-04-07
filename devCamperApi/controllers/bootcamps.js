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

//@desc get all bootcamps
//@routes GET /api/v1/bootcamps
//access public
exports.getBootcamps = async (req, res, next) => {
  try {
    const allBootcamps = await bootcamps.find();
    res.send(
      formatResult({
        status: 200,
        message: "ok",
        count: allBootcamps.length,
        data: allBootcamps
      })
    );
  } catch (error) {
    next(error)
  };
}
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