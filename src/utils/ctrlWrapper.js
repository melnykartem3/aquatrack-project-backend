const ctrlWrapper = (controller) => {
  const funcWrapper = async (req, res, next) => {
    try {
      await controller(req, res, next);
    } catch (error) {
      next(error);
    }
  };
  return funcWrapper;
};

export default ctrlWrapper;
