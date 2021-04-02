const { bootcamps } = require("../models/bootcamp");
const { formatResult } = require("../utils/imports");

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
        count:allBootcamps.length,
        data: allBootcamps
      })
    );
  } catch (error) {
    res.send(
      formatResult({
        status: 400,
        message: error,
      })
    );
  }
};

//@desc get a single bootcamp
//@routes GET /api/v1/bootcamp/:id
//access public
exports.getBootcamp = async (req, res, next) => {
  try {
    const bootcamp = await bootcamps.findById(req.params.id);
    if (!bootcamp) {
      return res.send(
        formatResult({
          status: 400,
          message: "no bootcamp with this id",
        })
      );
    }
    res.send(
      formatResult({
        status: 200,
        message: "success",
        data: bootcamp,
      })
    );
  } catch (error) {
    res.send(
      formatResult({
        status: 400,
        message: error,
      })
    );
  }
};
//@desc create a new bootcamp
//@routes POST /api/v1/bootcamps
//access public
exports.createBootcamp = async (req, res, next) => {
  try {
    const newBootCamp = await bootcamps.create(req.body);
    res.send(
      formatResult({
        status: 201,
        message: "created",
        data: newBootCamp,
      })
    );
  } catch (error) {
    res.send(error.message);
  }
};
//@desc update bootcamp
//@routes POST /api/v1/bootcamps/:id
//access public
exports.updateBootcamp = async (req, res, next) => {
  try {
    const bootcamp = await bootcamps.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!bootcamp) {
      return res.send(
        formatResult({
          status: 400,
          message: "no bootcamp with this id",
        })
      );
    }
    res.send(
      formatResult({
        status: 200,
        message: "updated",
        data: bootcamp
      })
    );
  } catch (error) {
    res.status(500).send(error.message);
  }
};

//@desc deleting bootcamp
//@routes POST /api/v1/bootcamps/:id
//access public
exports.deleteBootcamp = async(req, res, next) => {
    try {
        const bootcamp = await bootcamps.findByIdAndDelete(
          req.params.id
        );
        if (!bootcamp) {
          return res.send(
            formatResult({
              status: 400,
              message: "no bootcamp with this id",
            })
          );
        }
        res.send(
          formatResult({
            status: 200,
            message: "DELETED",
          })
        );
      } catch (error) {
        res.status(500).send(error.message);
      }
};
