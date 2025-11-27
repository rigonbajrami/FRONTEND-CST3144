<script setup>
import { onMounted } from 'vue';
import { useCartStore } from '@/services/cartStore';
import { useAuthStore } from '@/services/authStore';

const cartStore = useCartStore();
const authStore = useAuthStore();

onMounted(() => {
  authStore.checkAuth();
});
</script>

<template>
  <div id="app">
    <nav class="nav">
      <div class="nav-inner">
        <router-link to="/" class="logo">educart</router-link>
        
        <div class="nav-actions">
          <router-link 
            to="/cart" 
            class="cart-btn"
            :class="{ disabled: cartStore.getCartCount() === 0 }"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
              <line x1="3" y1="6" x2="21" y2="6"/>
              <path d="M16 10a4 4 0 0 1-8 0"/>
            </svg>
            <span v-if="cartStore.getCartCount() > 0" class="cart-badge">
              {{ cartStore.getCartCount() }}
            </span>
          </router-link>

          <template v-if="authStore.loggedIn.value">
            <button class="btn-ghost" @click="authStore.logout()">Sign out</button>
          </template>
          <template v-else>
            <router-link to="/login" class="btn-ghost">Sign in</router-link>
            <router-link to="/register" class="btn-fill">Get Started</router-link>
          </template>
        </div>
      </div>
    </nav>
    
    <main>
      <router-view />
    </main>
  </div>
</template>

<style>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap');

:root {
  --black: #000;
  --white: #fff;
  --gray-50: #fafafa;
  --gray-100: #f5f5f5;
  --gray-200: #e5e5e5;
  --gray-300: #d4d4d4;
  --gray-400: #a3a3a3;
  --gray-500: #737373;
  --gray-600: #525252;
  --pink: #f4a5b8;
  --pink-light: #fce4ec;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  background: var(--white);
  color: var(--black);
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  -webkit-font-smoothing: antialiased;
}

#app {
  min-height: 100vh;
}

.nav {
  position: sticky;
  top: 0;
  z-index: 100;
  background: var(--white);
  border-bottom: 1px solid var(--gray-200);
}

.nav-inner {
  max-width: 1120px;
  margin: 0 auto;
  padding: 0 20px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.logo {
  font-size: 18px;
  font-weight: 600;
  color: var(--black);
  text-decoration: none;
  letter-spacing: -0.4px;
}

.nav-actions {
  display: flex;
  align-items: center;
  gap: 6px;
}

.cart-btn {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  color: var(--black);
  border-radius: 8px;
  transition: background 0.15s;
}

.cart-btn:hover {
  background: var(--gray-100);
}

.cart-btn.disabled {
  color: var(--gray-400);
  pointer-events: none;
}

.cart-badge {
  position: absolute;
  top: 4px;
  right: 4px;
  min-width: 16px;
  height: 16px;
  padding: 0 4px;
  font-size: 10px;
  font-weight: 600;
  color: var(--black);
  background: var(--pink);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-ghost {
  font-size: 14px;
  font-weight: 500;
  color: var(--gray-600);
  background: none;
  border: none;
  padding: 8px 14px;
  border-radius: 8px;
  text-decoration: none;
  cursor: pointer;
  transition: all 0.15s;
}

.btn-ghost:hover {
  color: var(--black);
  background: var(--gray-100);
}

.btn-fill {
  font-size: 14px;
  font-weight: 500;
  color: var(--black);
  background: var(--pink);
  padding: 8px 16px;
  border-radius: 8px;
  text-decoration: none;
  transition: background 0.15s;
}

.btn-fill:hover {
  background: #f08da3;
}

@media (max-width: 480px) {
  .nav-inner {
    padding: 0 16px;
  }
  
  .btn-ghost {
    display: none;
  }
}
</style>
