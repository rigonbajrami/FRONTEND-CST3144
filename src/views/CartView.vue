<template>
  <div class="cart-page">
    <div class="container">
      <div v-if="cartItems.length === 0" class="empty-state">
        <div class="empty-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M9 22a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z"/>
            <path d="M20 22a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z"/>
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
          </svg>
        </div>
        <h2>Your cart is empty</h2>
        <p>Add some classes to get started</p>
        <router-link to="/" class="btn-explore">Browse Classes</router-link>
      </div>

      <div v-else class="cart-content">
        <header class="cart-header">
          <div>
            <h1>Cart</h1>
            <p>{{ cartItems.length }} {{ cartItems.length === 1 ? 'item' : 'items' }}</p>
          </div>
          <router-link to="/" class="back-link">← Continue shopping</router-link>
        </header>

        <div class="cart-layout">
          <div class="items-section">
            <div
              v-for="item in cartItems"
              :key="item.id"
              class="cart-item"
            >
              <div class="item-icon">
                <i :class="item.icon"></i>
              </div>
              
              <div class="item-info">
                <h3>{{ item.subject }}</h3>
                <p>{{ item.location }}</p>
              </div>

              <span class="item-price">£{{ item.price }}</span>

              <button class="remove-btn" @click="removeFromCart(item)">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M18 6 6 18M6 6l12 12"/>
                </svg>
              </button>
            </div>
          </div>

          <div class="checkout-section">
            <div class="checkout-card">
              <h2>Checkout</h2>

              <div class="form-group">
                <label>Name</label>
                <input
                  v-model="customerName"
                  type="text"
                  placeholder="Full name"
                  :class="{ error: nameError }"
                  @input="validateName"
                />
                <span v-if="nameError" class="error-msg">Letters only</span>
              </div>

              <div class="form-group">
                <label>Phone</label>
                <input
                  v-model="customerPhone"
                  type="text"
                  placeholder="Phone number"
                  :class="{ error: phoneError }"
                  @input="validatePhone"
                />
                <span v-if="phoneError" class="error-msg">Numbers only</span>
              </div>

              <div class="divider"></div>

              <div class="summary">
                <div class="row">
                  <span>Subtotal</span>
                  <span>£{{ subtotal }}</span>
                </div>
                <div class="row total">
                  <span>Total</span>
                  <span>£{{ subtotal }}</span>
                </div>
              </div>

              <button
                class="checkout-btn"
                :disabled="!isCheckoutValid || isProcessing"
                @click="processCheckout"
              >
                {{ isProcessing ? 'Processing...' : 'Complete Order' }}
              </button>

              <div v-if="errorMessage" class="error-box">
                {{ errorMessage }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="orderSuccess" class="modal-backdrop" @click="orderSuccess = false">
      <div class="modal" @click.stop>
        <div class="modal-icon">✓</div>
        <h2>Order Confirmed</h2>
        <p>Thank you for your purchase</p>
        <router-link to="/" class="modal-btn">Back to Home</router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useCartStore } from '@/services/cartStore';

const cartStore = useCartStore();

const customerName = ref('');
const customerPhone = ref('');
const nameError = ref(false);
const phoneError = ref(false);
const orderSuccess = ref(false);
const isProcessing = ref(false);
const errorMessage = ref('');

const cartItems = computed(() => cartStore.items.value);

const subtotal = computed(() => {
  return cartItems.value.reduce((total, item) => total + item.price, 0);
});

const isCheckoutValid = computed(() => {
  return customerName.value.trim() && 
         customerPhone.value.trim() && 
         !nameError.value && 
         !phoneError.value &&
         cartItems.value.length > 0;
});

// validate name - letters only using regex
const validateName = () => {
  if (!customerName.value) {
    nameError.value = false;
    return;
  }
  nameError.value = !/^[a-zA-Z\s]+$/.test(customerName.value);
};

// validate phone - numbers only using regex
const validatePhone = () => {
  if (!customerPhone.value) {
    phoneError.value = false;
    return;
  }
  phoneError.value = !/^[0-9]+$/.test(customerPhone.value);
};

const removeFromCart = (item) => {
  cartStore.removeFromCart(item);
};

// put request to update lesson spaces
const updateLessonSpaces = async (orderedLessons) => {
  const requests = orderedLessons.map(lesson =>
    fetch(`https://backend-cst3144-eqir.onrender.com/lessons/${lesson.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ updateType: 'decrement', decrementBy: lesson.quantity })
    })
  );
  await Promise.all(requests);
};

// post request to create order
const processCheckout = async () => {
  if (!isCheckoutValid.value) return;
  
  isProcessing.value = true;
  errorMessage.value = '';
  
  try {
    const orderData = {
      name: customerName.value,
      phone: customerPhone.value,
      lessons: cartItems.value.map(item => ({ id: item.id, quantity: 1 }))
    };
    
    const response = await fetch('https://backend-cst3144-eqir.onrender.com/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderData)
    });
    
    if (response.ok) {
      await updateLessonSpaces(orderData.lessons);
      orderSuccess.value = true;
      cartStore.clearCart();
      customerName.value = '';
      customerPhone.value = '';
    } else {
      errorMessage.value = 'Failed to submit order. Please try again.';
    }
  } catch (error) {
    console.error('Checkout error:', error);
    errorMessage.value = 'Cannot connect to server. Please ensure backend is running.';
  } finally {
    isProcessing.value = false;
  }
};
</script>

<style scoped>
.cart-page {
  min-height: calc(100vh - 60px);
  background: var(--gray-50);
}

.container {
  max-width: 1120px;
  margin: 0 auto;
  padding: 48px 20px;
}

.empty-state {
  text-align: center;
  padding: 80px 24px;
}

.empty-icon {
  width: 64px;
  height: 64px;
  margin: 0 auto 24px;
  color: var(--gray-300);
}

.empty-icon svg {
  width: 100%;
  height: 100%;
}

.empty-state h2 {
  font-size: 20px;
  font-weight: 600;
  color: var(--black);
  margin-bottom: 4px;
}

.empty-state p {
  color: var(--gray-500);
  margin-bottom: 24px;
}

.btn-explore {
  display: inline-block;
  padding: 10px 20px;
  font-size: 14px;
  font-weight: 500;
  color: var(--black);
  background: var(--pink);
  border-radius: 8px;
  text-decoration: none;
}

.cart-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 32px;
}

.cart-header h1 {
  font-size: 28px;
  font-weight: 600;
  color: var(--black);
  letter-spacing: -0.5px;
}

.cart-header p {
  font-size: 14px;
  color: var(--gray-500);
}

.back-link {
  font-size: 14px;
  color: var(--gray-500);
  text-decoration: none;
}

.back-link:hover {
  color: var(--black);
}

.cart-layout {
  display: grid;
  grid-template-columns: 1fr 360px;
  gap: 32px;
  align-items: start;
}

.items-section {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.cart-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  background: var(--white);
  border: 1px solid var(--gray-200);
  border-radius: 12px;
}

.item-icon {
  width: 48px;
  height: 48px;
  background: var(--pink-light);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.item-icon i {
  font-size: 18px;
  color: var(--black);
}

.item-info {
  flex: 1;
}

.item-info h3 {
  font-size: 15px;
  font-weight: 600;
  color: var(--black);
}

.item-info p {
  font-size: 13px;
  color: var(--gray-500);
}

.item-price {
  font-size: 16px;
  font-weight: 600;
  color: var(--black);
}

.remove-btn {
  width: 32px;
  height: 32px;
  background: none;
  border: none;
  color: var(--gray-400);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  transition: all 0.15s;
}

.remove-btn:hover {
  background: var(--gray-100);
  color: var(--black);
}

.remove-btn svg {
  width: 18px;
  height: 18px;
}

.checkout-section {
  position: sticky;
  top: 84px;
}

.checkout-card {
  background: var(--white);
  border: 1px solid var(--gray-200);
  border-radius: 12px;
  padding: 24px;
}

.checkout-card h2 {
  font-size: 18px;
  font-weight: 600;
  color: var(--black);
  margin-bottom: 20px;
}

.form-group {
  margin-bottom: 16px;
}

.form-group label {
  display: block;
  font-size: 13px;
  font-weight: 500;
  color: var(--gray-600);
  margin-bottom: 6px;
}

.form-group input {
  width: 100%;
  padding: 10px 12px;
  font-size: 14px;
  border: 1px solid var(--gray-200);
  border-radius: 8px;
  outline: none;
  transition: border-color 0.15s;
}

.form-group input:focus {
  border-color: var(--gray-400);
}

.form-group input.error {
  border-color: #dc2626;
}

.error-msg {
  font-size: 12px;
  color: #dc2626;
  margin-top: 4px;
  display: block;
}

.divider {
  height: 1px;
  background: var(--gray-200);
  margin: 20px 0;
}

.summary .row {
  display: flex;
  justify-content: space-between;
  font-size: 14px;
  color: var(--gray-600);
  margin-bottom: 8px;
}

.summary .row.total {
  font-size: 16px;
  font-weight: 600;
  color: var(--black);
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid var(--gray-200);
}

.checkout-btn {
  width: 100%;
  padding: 12px;
  margin-top: 20px;
  font-size: 14px;
  font-weight: 500;
  color: var(--black);
  background: var(--pink);
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.15s;
}

.checkout-btn:hover:not(:disabled) {
  background: #f08da3;
}

.checkout-btn:disabled {
  background: var(--gray-100);
  color: var(--gray-400);
  cursor: not-allowed;
}

.error-box {
  margin-top: 16px;
  padding: 12px;
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 8px;
  font-size: 13px;
  color: #dc2626;
  text-align: center;
}

.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 200;
  padding: 24px;
}

.modal {
  background: var(--white);
  border-radius: 16px;
  padding: 40px;
  text-align: center;
  max-width: 360px;
  width: 100%;
}

.modal-icon {
  width: 56px;
  height: 56px;
  background: var(--pink);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px;
  font-size: 24px;
  color: var(--black);
}

.modal h2 {
  font-size: 20px;
  font-weight: 600;
  color: var(--black);
  margin-bottom: 4px;
}

.modal p {
  color: var(--gray-500);
  margin-bottom: 24px;
}

.modal-btn {
  display: inline-block;
  padding: 10px 24px;
  font-size: 14px;
  font-weight: 500;
  color: var(--black);
  background: var(--gray-100);
  border-radius: 8px;
  text-decoration: none;
}

.modal-btn:hover {
  background: var(--gray-200);
}

@media (max-width: 768px) {
  .cart-layout {
    grid-template-columns: 1fr;
  }

  .checkout-section {
    position: static;
  }
}

@media (max-width: 640px) {
  .container {
    padding: 32px 16px;
  }

  .cart-item {
    flex-wrap: wrap;
  }

  .item-info {
    flex: 1 1 calc(100% - 64px);
  }

  .item-price {
    margin-left: 64px;
  }
}
</style>
