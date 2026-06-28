const admin = (req, res, next) => {
  if (!req.user) {
    res.status(401);
    return next(new Error("Not authorized, user missing"));
  }

  if (req.user.role !== "admin") {
    res.status(403);
    return next(new Error("Admin access only"));
  }

  next();
};

module.exports = { admin };
