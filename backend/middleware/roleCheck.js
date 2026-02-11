/**
 * Role-based access control - restrict to coordinator or student
 */
export const coordinatorOnly = (req, res, next) => {
  if (req.user?.role !== 'coordinator') {
    return res.status(403).json({ success: false, message: 'Coordinator access required' });
  }
  next();
};

export const studentOnly = (req, res, next) => {
  if (req.user?.role !== 'student') {
    return res.status(403).json({ success: false, message: 'Student access required' });
  }
  next();
};
