const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`); //req.originalUrl is the URL entered in the browser
  res.status(404);
  next(error);
};

const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode; //Returns 500 if res.statusCode is 200, otherwise returns res.statusCode
  res.status(statusCode);
  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === "production" ? null : err.stack, //Returns null if in production mode, otherwise returns err.stack
  });

  next();
};

export { notFound, errorHandler };
