import Product from "../models/productModel";
import HttpError from "../utils/http-error";
import productValidationSchema from "../utils/joiValidators/productValidation";
import { createSellerProducts, deleteSellerProduct, getSellerProduct, getSellerProducts, getSellerProductsByLoggedInSeller, getSellerProductsBySeller, updateSellerProduct } from "./handlerFactory/productsHandlerFactory";

export const createProduct = (req, res, next) => {
    createSellerProducts(Product, productValidationSchema, req, res, next);
}

export const getProducts = (req, res, next) => {
    getSellerProducts(Product, req, res, next);
}

export const getProduct = (req, res, next) => {
    getSellerProduct(Product, req, res, next);
}
  
export const getProductsInStock = async (req, res, next) => {
  try {
    const { _id: id, businessType } = req.user;

    if (businessType !== "products")
      return next(
        new HttpError("Your are not authized to access this route", 402)
      );

    const product = await Product.aggregate([
      { $match: { seller: { $eq: id }, quantity: { $gt: 10 } } },
    ]);

    if (product.length < 1) {
      return next(
        new HttpError(
          "All products are either low in stock or out of stock",
          404
        )
      );
    }

    res.status(200).json({
      message: "success.",
      data: product,
    });
  } catch (error) {
    console.log(error);
    return next(new HttpError("fetching product failed", 500));
  }
};

export const getProductsLowInStock = async (req, res, next) => {
  try {
    const { _id: id, businessType } = req.user;

    if (businessType !== "products")
      return next(
        new HttpError("Your are not authized to access this route", 402)
      );

    const product = await Product.aggregate([
      { $match: { seller: { $eq: id }, quantity: { $gte: 1, $lte: 10 } } },
    ]);

    if (product.length < 1) {
      return next(new HttpError("No product is low in stock", 404));
    }

    res.status(200).json({
      message: "success.",
      data: product,
    });
  } catch (error) {
    console.log(error);
    return next(new HttpError("fetching product failed", 500));
  }
};

export const getProductsOutOfStock = async (req, res, next) => {
  try {
    const { _id: id, businessType} = req.user;

    if (businessType !== "products")
      return next(
        new HttpError("Your are not authized to access this route", 402)
      );

    const product = await Product.aggregate([
      { $match: { seller: { $eq: id }, quantity: { $lt: 1 } } },
    ]);

    if (product.length < 1) {
      return next(new HttpError("No product is out of stock", 404));
    }

    res.status(200).json({
      message: "success.",
      data: product,
    });
  } catch (error) {
    console.log(error);
    return next(new HttpError("fetching product failed", 500));
  }
};

export const getProductsBySeller = (req, res, next) => {
    getSellerProductsBySeller(Product, req, res, next);
}

export const getProductsByLoggedInSeller = (req, res, next) => {
    getSellerProductsByLoggedInSeller(Product, req, res, next);
}

export const updateProduct = (req, res, next) => {
    updateSellerProduct(Product, req, res, next);
}

export const deleteProduct = (req, res, next) => {
    deleteSellerProduct(Product, req, res, next)
}