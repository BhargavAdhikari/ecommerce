export const validateReqBody = (validationSchema) => {
  return async (req, res, next) => {
    let newValues = req.body;
    // console.log(newProduct);

    try {
      req.body = await validationSchema.validate(newValues);

      next();
    } catch (error) {
      return res.status(401).send(error.message);
    }
  };
};
