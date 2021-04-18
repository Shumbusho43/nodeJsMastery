const advancedResult = (model, populate) => async (req, res, next) => {
    let query;

    //copying req.query
    let reqQuery = {
        ...req.query
    }

    //fields to exclude
    const removeField = ['select', 'sort', 'page', 'limit'];

    //loop over removeField and delete them from req.query
    removeField.forEach(param => delete reqQuery[param]);

    //creating req.query string
    let queryStr = JSON.stringify(reqQuery)
    //creating operators
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`)

    //finding resource
    query = model.find(JSON.parse(queryStr));

    //selecting fields
    if (req.query.select) {
        const fields = req.query.select.split(",").join(" ");
        query = query.select(fields)
        console.log(fields);
    }
    if (req.query.sort) {
        const sortBy = req.query.sort.split(",").join(" ");
        query = query.sort(sortBy)
        console.log(sortBy);
    } else {
        query = query.sort('-createdAt')
    }
    
    //populate
    if (populate) {
        query = query.populate(populate)
    }
    //pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 100;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await model.countDocuments()
    query = query.skip(startIndex).limit(limit);

    //executing the query
    const result = await query;
    const pagination = {};
    if (endIndex < total) {
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
    res.advancedResult = {
        success: true,
        count: result.length,
        pagination: pagination,
        data: result
    }
    next();
}
module.exports.advancedResult = advancedResult;