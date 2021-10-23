import Service from "../models/serviceModel";
import HttpError from "../utils/http-error";
import serviceValidationSchema from "../utils/joiValidators/serviceValidation";
import { createSellerProducts, deleteSellerProduct, getSellerProduct, getSellerProducts, getSellerProductsByLoggedInSeller, updateSellerProduct } from "./handlerFactory/productsHandlerFactory";

export const createService = (req, res, next) => {
    createSellerProducts(Service, serviceValidationSchema, req, res, next);
}

export const getServices = (req, res, next) => { 
    getSellerProducts(Service, req, res, next);
}

export const getService = (req, res, next) => {
    getSellerProduct(Service, req, res, next);
}

export const getUnpricedServices = async (req, res, next) => {
  try {
    const { _id: id, businessType } = req.user;

    if (businessType !== "services")
      return next(
        new HttpError("Your are not authized to access this route", 402)
      );

    const services = await Service.aggregate([
      { $match: { seller: { $eq: id }, status: { $eq: 'unpriced' } } },
    ]);

    if (services.length < 1) {
      return next(
        new HttpError(
          "No Unpriced service at the moment",
          404
        )
      );
    }

    res.status(200).json({
      message: "success.",
      data: services,
    });
  } catch (error) {
    console.log(error);
    return next(new HttpError("fetching services failed", 500));
  }
};

export const getPricedServices = async (req, res, next) => {
  try {
    const { _id: id, businessType } = req.user;

    if (businessType !== "services")
      return next(
        new HttpError("Your are not authized to access this route", 402)
      );

    const services = await Service.aggregate([
      { $match: { seller: { $eq: id }, status: { $eq: 'priced'} } },
    ]);

    if (services.length < 1) {
      return next(new HttpError("No Priced service at the moment", 404));
    }

    res.status(200).json({
      message: "success.",
      data: services,
    });
  } catch (error) {
    console.log(error);
    return next(new HttpError("fetching services failed", 500));
  }
};

export const getServicesBySeller = (req, res, next) => {
    
    getSellerProductsBySeller(Service, req, res, next);
}

export const getServicesByLoggedInSeller = (req, res, next) => {
    getSellerProductsByLoggedInSeller(Service, req, res, next);
}

export const updateService = (req, res, next) => {
    
    updateSellerProduct(Service, req, res, next)
}

export const deleteService = (req, res, next) => {
    
    deleteSellerProduct(Service, req, res, next);
}