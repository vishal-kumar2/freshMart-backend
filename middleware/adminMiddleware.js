export const adminMiddleware = (req, res, next) => {
  // authMiddleware must run before this
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({
      success: false,
      message: "Access denied: Admin only",
    });
  }

  next();
};
