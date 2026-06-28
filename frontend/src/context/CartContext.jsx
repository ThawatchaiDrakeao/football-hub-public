import { createContext, useContext, useMemo, useState } from "react";

const CartContext = createContext(null);

const getCartItemKey = (productId, size = "") => {
  return `${productId}-${size || "no-size"}`;
};

const getItemKey = (item) => {
  return item.cartKey || getCartItemKey(item._id, item.size);
};

const parseSavedCart = () => {
  try {
    const savedCart = localStorage.getItem("footyHubCart");
    const parsedCart = savedCart ? JSON.parse(savedCart) : [];

    return Array.isArray(parsedCart)
      ? parsedCart.map((item) => ({
          ...item,
          cartKey: getItemKey(item),
          quantity: Math.max(Number(item.quantity) || 1, 1),
          price: Number(item.price) || 0,
          stock: Number(item.stock) || 0,
        }))
      : [];
  } catch {
    return [];
  }
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(parseSavedCart);

  const saveCart = (nextItems) => {
    setCartItems(nextItems);
    localStorage.setItem("footyHubCart", JSON.stringify(nextItems));
  };

  const addToCart = (product, quantity = 1, size = "") => {
    const productId = product._id || product.id;
    const stock = Number(product.stock) || 0;
    const requestedQuantity = Math.max(Number(quantity) || 1, 1);
    const nextQuantity =
      stock > 0 ? Math.min(requestedQuantity, stock) : requestedQuantity;
    const itemKey = getCartItemKey(productId, size);
    const existingItem = cartItems.find((item) => getItemKey(item) === itemKey);

    if (existingItem) {
      saveCart(
        cartItems.map((item) =>
          getItemKey(item) === itemKey
            ? {
                ...item,
                quantity:
                  stock > 0
                    ? Math.min(item.quantity + nextQuantity, stock)
                    : item.quantity + nextQuantity,
              }
            : item
        )
      );
      return;
    }

    const cartItem = {
      cartKey: itemKey,
      _id: productId,
      name: product.name,
      brand: product.brand || "",
      category: product.category || "",
      price: Number(product.price) || 0,
      stock: Number(product.stock) || 0,
      image: product.images?.[0] || product.image || "",
      size,
      quantity: nextQuantity,
    };

    saveCart([...cartItems, cartItem]);
  };

  const updateQuantity = (productId, size = "", quantity = 1) => {
    const itemKey = getCartItemKey(productId, size);
    const nextQuantity = Number(quantity);

    if (!Number.isFinite(nextQuantity) || nextQuantity <= 0) {
      saveCart(cartItems.filter((item) => getItemKey(item) !== itemKey));
      return;
    }

    saveCart(
      cartItems.map((item) =>
        getItemKey(item) === itemKey ? { ...item, quantity: nextQuantity } : item
      )
    );
  };

  const removeFromCart = (productId, size = "") => {
    const itemKey = getCartItemKey(productId, size);
    saveCart(cartItems.filter((item) => getItemKey(item) !== itemKey));
  };

  const clearCart = () => {
    saveCart([]);
  };

  const cartCount = cartItems.reduce((total, item) => {
    return total + item.quantity;
  }, 0);

  const cartTotal = cartItems.reduce((total, item) => {
    return total + item.price * item.quantity;
  }, 0);

  const value = useMemo(
    () => ({
      cartItems,
      addToCart,
      updateQuantity,
      removeFromCart,
      clearCart,
      cartCount,
      cartTotal,
    }),
    [cartItems, cartCount, cartTotal]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used inside CartProvider");
  }

  return context;
};
