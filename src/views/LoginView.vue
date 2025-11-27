<template>
  <div class="auth-page">
    <div class="auth-container">
      <div class="auth-card">
        <h1>Sign in</h1>
        <p class="subtitle">Welcome back to educart</p>

        <form @submit.prevent="handleLogin" class="auth-form">
          <div class="form-group">
            <label>Email</label>
            <input
              v-model="email"
              type="email"
              placeholder="your@email.com"
              required
            />
          </div>

          <div class="form-group">
            <label>Password</label>
            <div class="password-field">
              <input
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                placeholder="Enter password"
                required
              />
              <button type="button" class="toggle-btn" @click="showPassword = !showPassword">
                {{ showPassword ? 'Hide' : 'Show' }}
              </button>
            </div>
          </div>

          <div v-if="errorMessage" class="error-box">
            {{ errorMessage }}
          </div>

          <button type="submit" class="submit-btn" :disabled="isLoading">
            {{ isLoading ? 'Signing in...' : 'Sign in' }}
          </button>
        </form>

        <div class="auth-footer">
          <span>Don't have an account?</span>
          <router-link to="/register">Create one</router-link>
        </div>

        <div class="divider">
          <span>or</span>
        </div>

        <button class="guest-btn" @click="$router.push('/')">
          Continue as guest
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/services/authStore';

const router = useRouter();
const authStore = useAuthStore();

const email = ref('');
const password = ref('');
const showPassword = ref(false);
const isLoading = ref(false);
const errorMessage = ref('');

const handleLogin = async () => {
  errorMessage.value = '';
  isLoading.value = true;

  const result = await authStore.login(email.value, password.value);
  
  isLoading.value = false;

  if (result.success) {
    router.push('/');
  } else {
    errorMessage.value = result.message || 'Invalid credentials';
  }
};
</script>

<style scoped>
.auth-page {
  min-height: calc(100vh - 60px);
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--gray-50);
  padding: 48px 20px;
}

.auth-container {
  width: 100%;
  max-width: 380px;
}

.auth-card {
  background: var(--white);
  border: 1px solid var(--gray-200);
  border-radius: 16px;
  padding: 40px 32px;
}

.auth-card h1 {
  font-size: 24px;
  font-weight: 600;
  color: var(--black);
  margin-bottom: 4px;
  letter-spacing: -0.5px;
}

.subtitle {
  color: var(--gray-500);
  font-size: 14px;
  margin-bottom: 32px;
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.form-group label {
  font-size: 13px;
  font-weight: 500;
  color: var(--gray-600);
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

.password-field {
  position: relative;
}

.password-field input {
  padding-right: 60px;
}

.toggle-btn {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 13px;
  color: var(--gray-500);
  background: none;
  border: none;
  cursor: pointer;
}

.toggle-btn:hover {
  color: var(--black);
}

.error-box {
  padding: 12px;
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 8px;
  font-size: 13px;
  color: #dc2626;
}

.submit-btn {
  padding: 12px;
  font-size: 14px;
  font-weight: 500;
  color: var(--black);
  background: var(--pink);
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.15s;
}

.submit-btn:hover:not(:disabled) {
  background: #f08da3;
}

.submit-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.auth-footer {
  text-align: center;
  margin-top: 24px;
  font-size: 14px;
  color: var(--gray-500);
}

.auth-footer a {
  color: var(--black);
  font-weight: 500;
  text-decoration: none;
  margin-left: 4px;
}

.auth-footer a:hover {
  text-decoration: underline;
}

.divider {
  display: flex;
  align-items: center;
  margin: 24px 0;
  gap: 16px;
}

.divider::before,
.divider::after {
  content: '';
  flex: 1;
  height: 1px;
  background: var(--gray-200);
}

.divider span {
  font-size: 12px;
  color: var(--gray-400);
  text-transform: uppercase;
}

.guest-btn {
  width: 100%;
  padding: 12px;
  font-size: 14px;
  color: var(--gray-600);
  background: var(--white);
  border: 1px solid var(--gray-200);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.15s;
}

.guest-btn:hover {
  border-color: var(--gray-300);
  color: var(--black);
}
</style>
