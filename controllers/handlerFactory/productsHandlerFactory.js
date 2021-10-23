import { getUploadedImages } from "../../middle-wares/multerConfig";
import Service from "../../models/serviceModel";
import HttpError from "../../utils/http-error";

export const createSellerProducts = async (Model, validationSchema , req, res, next) => {
  try {
    const { _id: id } = req.user;

    if (!req.files || req.files.length < 1) {
      const err = new HttpError(
        "A product/service must have atleast 1 image and at most 4 images",
        404
      );
      return next(err);
    }

    let productImages = await getUploadedImages(req.files);

    req.body.productImages = productImages;

    const productRequest = { ...req.body, seller: id };

    const { error } = await validationSchema.validate(req.body);

    if (error) {
      const err = new HttpError(error.details[0].message, 404);
      return next(err);
    }

    const newProduct = await new Model(productRequest);
    await newProduct.save();

    res.status(200).json({
      message: "success.",
      data: newProduct,
    });
  } catch (error) {
    const err = new HttpError(
      "Could not create product/service, please try again.",
      500
    );

    return next(err);
  }
};

export const getSellerProducts = async (Model, req, res, next) => {
  try {
    let products = await Model.find({});

    if (products.length < 1) {
      products = "No products added yet";
    }

    res.status(200).json({
      message: "success.",
      data: products,
    });
  } catch (error) {
    return next(new HttpError("fetching products failed", 500));
  }
};

export const getSellerProduct = async (Model, req, res, next) => {
  try {
    const { productId: id } = req.params;

    const { _id } = req.user;

      const product = await Model.findById(id);
      
      if (!product) {
        return next(new HttpError("No product found with this Id", 404));
      }

    if (
      product.seller.toString() !== _id.toString()
    ) {
      return next(
        new HttpError("Your are not authized to access this route", 402)
      );
    }

    res.status(200).json({
      message: "success.",
      data: product,
    });
  } catch (error) {
    //   console.log(error);
    return next(new HttpError("fetching product failed", 500));
  }
};

export const getSellerProductsBySeller = async (Model, req, res, next) => {
  try {
    const { sellerId: id } = req.params;

    const products = await Model.find({ seller: { $eq: id } });

    res.status(200).json({
      message: "success.",
      data: products,
    });
  } catch (error) {
    console.log(error);
    return next(new HttpError("fetching products failed", 500));
  }
};

export const getSellerProductsByLoggedInSeller = async (Model, req, res, next) => {
  try {
    const { _id: id } = req.user;

    const products = await Model.find({ seller: { $eq: id } });

    if (products.length < 1) {
      return next(new HttpError("You have not added any product", 404));
    }

    res.status(200).json({
      message: "success.",
      data: products,
    });
  } catch (error) {
    return next(new HttpError("fetching products failed", 500));
  }
};

export const updateSellerProduct = async (Model, req, res, next) => {
  try {
    const { _id } = req.user;
    const { productId: id } = req.params;

    const product = await Model.findById(id);

    if (product.seller.toString() !== _id.toString()) {
      return next(
        new HttpError("Your are not authorized to access this route", 402)
      );
    }

    if (req.body.files) {
      let productImages = await getUploadedImages(req.files);

      req.body.productImages = productImages;
    }

    const updateRequest = { ...req.body };

    const updatedProduct = await Model.findByIdAndUpdate(id, updateRequest, {
      new: true,
      runValidators: true,
    });

    if (!updatedProduct) {
      return next(new HttpError("No product found with that ID", 404));
    }

    res.status(200).json({
      status: "success",
      data: updatedProduct,
    });
  } catch (error) {
    return next(new HttpError("Updating product failed", 500));
  }
};

export const deleteSellerProduct = async (Model, req, res, next) => {
  try {
    const { _id } = req.user;
    const { productId: id } = req.params;

    const product = await Model.findById(id);

    if (product.seller.toString() !== _id.toString()) {
      return next(
        new HttpError("Your are not authized to access this route", 402)
      );
    }

    const deletedproduct = await Service.findByIdAndDelete(id);

    if (!deletedProduct) {
      return next(new HttpError("No product found with that ID", 404));
    }

    res.status(200).json({
      status: "success",
      data: null,
    });
  } catch (error) {
    return next(new HttpError("Deleting product failed", 500));
  }
};
