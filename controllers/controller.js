const model = require("../models/model"); //importing model for databse

// alias middleware working
/* exports.aliasSortSal = async (req, res, next) => {
  req.query.sort = "-salary";
  req.query.fields = "name";
  next();
}; */

exports.getAllUsers = async (req, res) => {
  try {
    //*1A)filtering
    const queryObj = { ...req.query }; // storing query object
    const excludedFields = ["page", "sort", "limit", "fields"]; // a query/fields we want to delete/exclude
    excludedFields.forEach((el) => delete queryObj[el]); // looping in 'excludedFields' and deleting field from 'req.query'

    //*1B) Advance Filtering
    let qStr = JSON.stringify(queryObj); // convert 'req.query' a js obj to string

    qStr = qStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`); //replacing 'gte,gt,lte,lt' with $gte,$gt,$lte,$lte
    console.log(req.query, JSON.parse(qStr));

    let queryy = model.find(JSON.parse(qStr)); // convert 'req.query' a js object to string */

    //*sorting
    if (req.query.sort) {
      const sortBy = req.query.sort.split(",").join(" ");
      queryy = queryy.sort(sortBy);
    } else {
      queryy = queryy.sort("-salary");
    }

    //*field limiting
    if (req.query.fields) {
      let fld = req.query.fields.split(",").join(" ");
      queryy = queryy.select(fld);
    } else {
      // query = query.select('_age')
    }

    //*pagination
    //  -----------main code-------------------
    let pages = req.query.page * 1 || 1;
    let limits = req.query.limit * 1 || 100;

    let skips = (pages - 1) * limits;
    queryy = queryy.skip(skips).limit(limits);
    //  -----------main code-------------------

    if (req.query.page) {
      let numDoc = await model.countDocuments();
      if (skips > numDoc) throw new Error("page not exist");
    }

    let users = await queryy;
    res.status(200).json({
      count: users.length,
      status: "success",
      users,
    });
  } catch (error) {
    res.status(404).json({
      status:'failed'
    })
  }
};

exports.getUserById = async (req, res) => {
  try {
    const user3 = await model.findById(req.params.ID); // get user by id

    res.status(200).json({
      status: "success",
      result: user3.length,
      data: {
        user3,
      },
    });
  } catch (error) {
     res.status(404).json({
      status:'failed'
    })
  }
};

exports.createUser = async (req, res) => {
  try {
    const user2 = await model.create(req.body); // create user
    res.status(201).json({
      status: "success",
      result: user2.length,
      data: {
        user2,
      },
    });
  } catch (error) {
    res.status(404).json({
      status:'failed',
      message: error.message
    })
  }
};

exports.updateUsers = async (req, res) => {
  try {
    const user4 = await model.findByIdAndUpdate(req.params.ID, req.body, {
      new: true,
      runValidators: true,
    }); // update user
    res.status(202).json({
      status: "success",
      result: user4.length,
      data: {
        user4,
      },
    });
  } catch (error) {
   res.status(404).json({
      status:'failed'
    })
  }
};

exports.deleteUsers = async (req, res) => {
  try {
    const user5 = await model.findByIdAndDelete(req.params.ID); // delete user
    res.status(204).json({
      status: "success",
      result: user5.length,
      data: {
        user5,
      },
    });
  } catch (error) {
     res.status(404).json({
      status:'failed'
    })
  }
};

//note export this file to route folder
exports.getAvgSalary = async (req, res) => {
  try {
    const stats = await model.aggregate([
      // { $match:{salary:{$lt:80000}}},
      // {$group:{avgSalary:{$avg:'$salary'}}}
      {
        $group: {
          _id: null,
          avgSalary: { $avg: "$salary" },
        },
      },
    ]);

    res.status(200).json({
      status: "success",
      stats,
    });
  } catch (error) {
    res.status(404).json({
      status: "fail",
    });
  }
};
exports.getAllName = async (req, res) => {
  try {
    const name = req.params.NAME;
    const stats = await model.aggregate([
      {
        $project: {
          _id: 0,
          name: 1,
          salary: 1,
        },
      },
    ]);

    res.status(200).json({
      status: "success",
      stats,
    });
  } catch (error) {
    res.status(404).json({
      status: "fail",
    });
  }
};

// ===============update me =====================
const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

// exports.updateMe = async(req,res)=>{
//     if (req.body.password || req.body.passwordConfirm) {
//     return next(new AppError('this route is not for user', 400));
//   }

//   const filterBody = filterObj(req.body, 'name', 'email');
//   const updateUser = await userM.findByIdAndUpdate(req.user.id, filterBody, { new: true, runValidators: true });
//   res.status(200).json({
//     status: 'success',
//     data: {
//       user: updateUser,
//     },
//   });
// }
 