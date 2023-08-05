const isStaff = (req, res, next) => {
    const { isStaff } = req.user;
  
    if (isStaff) {
      next(); 
    } else {
      res.status(403).json({ message: "Access denied. You are not a staff member." });
    }
  };
  
  module.exports = isStaff;
  