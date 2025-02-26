module.exports.Authorization = (req, res, next) => {
    const authHeader = req.header("Authorization");
    const token = authHeader && authHeader.split(" ")[1];
    if (!token) {
      return res.json({
        code: 401,
      });
    }
    try {
      next();
    } catch (error) {
      console.log(error);
      res.sendStatus(403);
    }
  };
  