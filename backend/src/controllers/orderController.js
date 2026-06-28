const Order = require("../models/Order");
const Product = require("../models/Product");

const allowedStatuses = ["pending", "paid", "shipped", "completed", "cancelled"];

const buildOrderItems = async (items) => {
  if (!Array.isArray(items) || items.length === 0) {
    const error = new Error("Order items are required");
    error.statusCode = 400;
    throw error;
  }

  const productIds = items.map((item) => item.product);
  const products = await Product.find({
    _id: { $in: productIds },
    isActive: true,
  });

  const productMap = new Map(
    products.map((product) => [product._id.toString(), product])
  );

  const orderItems = [];
  const requestedQuantityByProduct = new Map();

  for (const item of items) {
    const product = productMap.get(String(item.product));
    const quantity = Number(item.quantity);

    if (!product) {
      const error = new Error("Product not found or inactive");
      error.statusCode = 404;
      throw error;
    }

    if (!Number.isInteger(quantity) || quantity < 1) {
      const error = new Error("Product quantity must be at least 1");
      error.statusCode = 400;
      throw error;
    }

    const productId = product._id.toString();
    const nextRequestedQuantity =
      (requestedQuantityByProduct.get(productId) || 0) + quantity;

    if (product.stock < nextRequestedQuantity) {
      const error = new Error(`Not enough stock for ${product.name}`);
      error.statusCode = 400;
      throw error;
    }

    requestedQuantityByProduct.set(productId, nextRequestedQuantity);

    orderItems.push({
      product: product._id,
      name: product.name,
      price: product.price,
      quantity,
      size: item.size || "",
      image: product.images[0] || "",
    });
  }

  return { orderItems, productMap };
};

const reduceProductStock = async (orderItems, productMap) => {
  for (const item of orderItems) {
    const product = productMap.get(item.product.toString());

    product.stock -= item.quantity;
    await product.save();
  }
};

const createOrder = async (req, res, next) => {
  try {
    const { items, paymentMethod, shippingAddress } = req.body;
    const { orderItems, productMap } = await buildOrderItems(items);

    // Calculate total on the backend so users cannot change prices from the client.
    const totalPrice = orderItems.reduce((total, item) => {
      return total + item.price * item.quantity;
    }, 0);

    await reduceProductStock(orderItems, productMap);

    const order = await Order.create({
      user: req.user._id,
      items: orderItems,
      totalPrice,
      paymentMethod: paymentMethod || "mock",
      shippingAddress,
    });

    res.status(201).json(order);
  } catch (error) {
    if (error.statusCode) {
      res.status(error.statusCode);
    }

    next(error);
  }
};

const getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({
      createdAt: -1,
    });

    res.status(200).json(orders);
  } catch (error) {
    next(error);
  }
};

const getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id).populate(
      "user",
      "name email role"
    );

    if (!order) {
      res.status(404);
      throw new Error("Order not found");
    }

    const isOwner = order.user._id.toString() === req.user._id.toString();
    const isAdmin = req.user.role === "admin";

    if (!isOwner && !isAdmin) {
      res.status(403);
      throw new Error("Not allowed to view this order");
    }

    res.status(200).json(order);
  } catch (error) {
    next(error);
  }
};

const getOrders = async (req, res, next) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email role")
      .sort({ createdAt: -1 });

    res.status(200).json(orders);
  } catch (error) {
    next(error);
  }
};

const updateOrderStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    if (!allowedStatuses.includes(status)) {
      res.status(400);
      throw new Error("Invalid order status");
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!order) {
      res.status(404);
      throw new Error("Order not found");
    }

    res.status(200).json(order);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createOrder,
  getMyOrders,
  getOrderById,
  getOrders,
  updateOrderStatus,
};
