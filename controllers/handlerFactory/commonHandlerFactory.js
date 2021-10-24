import HttpError from "../../utils/http-error";

export const createController = async (
  Model,
  validationSchema,
  controllerType,
  req,
  res,
  next
) => {
  try {
    const { _id: id } = req.user;

    const userRequest = req.params.postId
      ? { ...req.body, user: id, post: req.params.postId }
      : { ...req.body, user: id };

    const { error } = await validationSchema.validate(req.body);

    if (error) {
      const err = new HttpError(error.details[0].message, 404);
      return next(err);
    }

    const savedRequest = await new Model(userRequest);
    await savedRequest.save();

    res.status(200).json({
      message: "success.",
      data: savedRequest,
    });
  } catch (error) {
    const err = new HttpError(
      `Could not create ${controllerType}, please try again.`,
      500
    );

    return next(err);
  }
};

export const getAllDataController = async (
  Model,
  controllerType,
  queryData,
  res,
  next
) => {
  try {
    
    let data = await Model.find(queryData);

    if (data.length < 1) {
      data = `No ${controllerType} added yet`;
    }

    res.status(200).json({
      message: "success.",
      data: data,
    });
  } catch (error) {
    return next(new HttpError(`fetching ${controllerType} failed`, 500));
  }
};

export const getDataController = async (
  Model,
  dataId,
  controllerType,
  res,
  next
) => {
  try {
    const data = await Model.findById(dataId);

    if (!data) {
      return next(
        new HttpError(`No ${controllerType} found with this Id`, 404)
      );
    }

    res.status(200).json({
      message: "success.",
      data: data,
    });
  } catch (error) {
    //   console.log(error);
    return next(new HttpError(`fetching ${controllerType} failed`, 500));
  }
};

export const updateDataController = async (
  Model,
  dataId,
  controllerType,
  req,
  res,
  next
) => {
  try {
    const { _id: id } = req.user;

    const data = await Model.findById(dataId);

    if (data.user._id.toString() !== id.toString()) {
      return next(
        new HttpError("Your are not authorized to access this route", 402)
      );
    }

    const updateRequest = { ...req.body };

    const updatedData = await Model.findByIdAndUpdate(dataId, updateRequest, {
      new: true,
      runValidators: true,
    });

    if (!updatedData) {
      return next(new HttpError(`No ${controllerType} found with that ID`, 404));
    }

    res.status(200).json({
      status: "success",
      data: updatedData,
    });
  } catch (error) {
    console.log(error)
    return next(new HttpError(`Updating ${controllerType} failed`, 500));
  }
};

export const deleteDataController = async (
  Model,
  dataId,
  controllerType,
  req,
  res,
  next
) => {
  try {
    const { _id: id } = req.user;

    const data = await Model.findById(dataId);

    if (data.user._id.toString() !== id.toString()) {
      return next(
        new HttpError("Your are not authized to access this route", 402)
      );
    }

    const deletedData = await Model.findByIdAndDelete(dataId);

    if (!deletedData) {
      return next(new HttpError(`No ${controllerType} found with that ID`, 404));
    }

    res.status(200).json({
      status: "success",
      data: null,
    });
  } catch (error) {
    return next(new HttpError(`Deleting ${controllerType} failed`, 500));
  }
};
