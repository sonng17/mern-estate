//Create controller for router
export const test = (req, res, next) => {
  console.log(req.body);
  res.json({
    message: "Hello nhe",
  });
}; //
