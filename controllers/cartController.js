import Cart from "../models/cartModel";
import Product from "../models/productModel";
import Service from "../models/serviceModel";
import HttpError from "../utils/http-error";
import cartValidationSchema from "../utils/joiValidators/cartValidation";
import { getTotalCartItemPrice } from "../utils/utils";

export const addToCart = async (req, res, next) => {
  try {
    const { _id: id } = req.user;
    const { productId } = req.params;

    const { error } = await cartValidationSchema.validate(req.body);

    if (error) {
      const err = new HttpError(error.details[0].message, 404);
      return next(err);
    }

    let isProductInCart = await Cart.find({ product: { $eq: productId } });

    if (isProductInCart.length > 0) {
      return next(
        new HttpError("this product is already added to your shoping cart", 422)
      );
    }

    let selectedProduct;
    if (req.body.product_type === "product") {
      selectedProduct = await Product.findById(productId);
    } else {
      selectedProduct = await Service.findById(productId);
    }

    if (!selectedProduct) {
      return next(
        new HttpError("No product found with the provided productId", 404)
      );
    }

    const { seller, price } = selectedProduct;
    const total_price = (+price * req.body.quantity).toString();

    const buyerRequest = {
      ...req.body,
      total_price,
      buyer: id,
      product: productId,
      seller,
    };
    const newCartItem = await new Cart(buyerRequest);
    await newCartItem.save();

    res.status(200).json({
      message: "success",
      data: newCartItem,
    });
  } catch (error) {
    const err = new HttpError(
      "Could not add Item to cart, please try again.",
      500
    );

    return next(err);
  }
};

export const getCartItems = async (req, res, next) => {
  try {
    const { _id: id } = req.user;

    const cartItems = await Cart.find({ buyer: { $eq: id } });

    let total_cost = 0;
    if (cartItems.length === 1) {
      total_cost = cartItems[0].total_price;
    }

    if (cartItems.length > 1) {
      total_cost = getTotalCartItemPrice(cartItems).toString();
    }

    res.status(200).json({
      message: "success",
      total_cost: total_cost,
      data: cartItems,
    });
  } catch (error) {
    const err = new HttpError(
      "Fetching cart items failed, please try again.",
      500
    );

    return next(err);
  }
};

export const updateCartItem = async (req, res, next) => {
  try {
    const { itemId: id } = req.params;
    const updateRequest = { ...req.body };

    const updatedCartItem = await Cart.findByIdAndUpdate(id, updateRequest, {
      new: true,
      runValidators: true,
    });

    if (!updatedCartItem) {
      return next(new HttpError("in valid cart ItemId", 404));
    }

    res.status(200).json({
      message: "success",
      data: updatedCartItem,
    });
  } catch (error) {
    const err = new HttpError(
      "Could not update cart item, please try again.",
      500
    );

    return next(err);
  }
};

export const removeFromCart = async (req, res, next) => {
  try {
    const { _id: id } = req.user;
    const { itemId } = req.params;

    const removedCartItem = await Cart.findByIdAndDelete({
      _id: itemId,
      buyer: { $eq: id },
    });

    if (!removedCartItem) {
      return next(
        new HttpError(
          "No cart item found with the provided itemId or you didnt add this item to cart",
          404
        )
      );
    }

    res.status(200).json({
      message: "success",
      data: null,
    });
  } catch (error) {
    const err = new HttpError(
      "Could not remove Item from cart, please try again.",
      500
    );

    return next(err);
  }
};

export const clearUserCart = async (req, res, next) => {
  try {
    const { _id: id } = req.user;

    const removedCartItems = await Cart.deleteMany({
      buyer: { $eq: id },
    });

    if (!removedCartItems.deletedCount) {
      return next(new HttpError("you do not have any item in your cart", 404));
    }

    res.status(200).json({
      message: "success",
      data: null,
    });
  } catch (error) {
    const err = new HttpError(
      "Could not clear cart items, please try again.",
      500
    );

    return next(err);
  }
};
