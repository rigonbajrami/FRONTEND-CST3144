import { ref } from 'vue';

const cartItems = ref([]);

// cart store using composition api
export const useCartStore = () => {
  const addToCart = (lesson) => {
    const exists = cartItems.value.find(item => item.id === lesson.id);
    if (!exists) {
      cartItems.value.push({ ...lesson });
    }
  };

  const removeFromCart = (item) => {
    const index = cartItems.value.findIndex(cartItem => cartItem.id === item.id);
    if (index > -1) {
      cartItems.value.splice(index, 1);
    }
  };

  const clearCart = () => {
    cartItems.value = [];
  };

  const getCartCount = () => cartItems.value.length;

  const getCartTotal = () => {
    return cartItems.value.reduce((total, item) => total + item.price, 0);
  };

  return {
    items: cartItems,
    addToCart,
    removeFromCart,
    clearCart,
    getCartCount,
    getCartTotal
  };
};
