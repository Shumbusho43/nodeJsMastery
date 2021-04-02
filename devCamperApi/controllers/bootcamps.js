//@desc get all bootcamps
//@routes GET /api/v1/bootcamps
//access public
exports.getBootcamps = (req, res,next) => {
    res.status(200).send({
        success: true,
        msg: "show all bootcamps",
    });
}
//@desc get a single bootcamp
//@routes GET /api/v1/bootcamp/:id
//access public
exports.getBootcamp = (req, res,next) => {
    res.status(200).send({
        success: true,
        msg: `show a single bootcamp with id: ${req.params.id}`
    });
}
//@desc create a new bootcamp
//@routes POST /api/v1/bootcamps
//access public
exports.createBootcamp = (req, res, next) => {
    res.status(200).send({
        success: true,
        msg: "create new bootcamp"
    });
}
//@desc update bootcamp
//@routes POST /api/v1/bootcamps/:id
//access public
exports.updateBootcamp = (req, res, next) => {
    res.status(200).send({
        success: true,
        msg: `update a bootcamp with id: ${req.params.id}`
    });
}
//@desc deleting bootcamp
//@routes POST /api/v1/bootcamps/:id
//access public
exports.deleteBootcamp = (req, res, next) => {
    res.status(200).send({
        success: true,
        msg: `delete bootcamp with id: ${req.params.id}`
    });
}