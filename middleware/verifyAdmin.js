const { ErrorHandler } = require("../helpers/error");

module.exports = (req, res, next) => {
  console.log('user',req.user);
  const { roles } = req.user;

  if (roles && roles.includes("admin")) {
    req.user = {
      ...req.user,
      roles,
    };
    return next();
  } else {
    throw new ErrorHandler(401, "require admin role");
  }
};
