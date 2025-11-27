<template>
  <div class="auth-page">
    <div class="auth-container">
      <div class="auth-card">
        <h1>Create account</h1>
        <p class="subtitle">Start your learning journey</p>

        <form @submit.prevent="handleRegister" class="auth-form">
          <div class="form-group">
            <label>Name</label>
            <input
              v-model="name"
              type="text"
              placeholder="Full name"
              required
              :class="{ error: nameError }"
              @input="validateName"
            />
            <span v-if="nameError" class="field-error">Letters only</span>
          </div>

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
                placeholder="Create password"
                required
                minlength="6"
              />
              <button type="button" class="toggle-btn" @click="showPassword = !showPassword">
                {{ showPassword ? 'Hide' : 'Show' }}
              </button>
            </div>
            <div v-if="password" class="password-strength">
              <div class="strength-bar">
                <div 
                  class="strength-fill" 
                  :style="{ width: passwordStrength + '%' }"
                  :class="strengthClass"
                ></div>
              </div>
              <span class="strength-label">{{ strengthText }}</span>
            </div>
          </div>

          <div v-if="errorMessage" class="error-box">
            {{ errorMessage }}
          </div>

          <button type="submit" class="submit-btn" :disabled="isLoading || nameError">
            {{ isLoading ? 'Creating...' : 'Create account' }}
          </button>
        </form>

        <div class="auth-footer">
          <span>Already have an account?</span>
          <router-link to="/login">Sign in</router-link>
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
import { ref, computed, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/services/authStore';

const router = useRouter();
const authStore = useAuthStore();

const name = ref('');
const email = ref('');
const password = ref('');
const showPassword = ref(false);
const isLoading = ref(false);
const errorMessage = ref('');
const nameError = ref(false);

// validate name - letters only
watch(name, (val) => {
  if (!val) {
    nameError.value = false;
    return;
  }
  nameError.value = !/^[a-zA-Z\s]+$/.test(val);
});

const validateName = () => {
  if (!name.value) {
    nameError.value = false;
    return;
  }
  nameError.value = !/^[a-zA-Z\s]+$/.test(name.value);
};

const passwordStrength = computed(() => {
  if (!password.value) return 0;
  let strength = 0;
  if (password.value.length >= 6) strength += 25;
  if (password.value.length >= 10) strength += 25;
  if (/[A-Z]/.test(password.value)) strength += 25;
  if (/[0-9]/.test(password.value)) strength += 25;
  return strength;
});

const strengthClass = computed(() => {
  if (passwordStrength.value < 50) return 'weak';
  if (passwordStrength.value < 75) return 'medium';
  return 'strong';
});

const strengthText = computed(() => {
  if (passwordStrength.value < 50) return 'Weak';
  if (passwordStrength.value < 75) return 'Medium';
  return 'Strong';
});

const handleRegister = async () => {
  if (nameError.value) return;
  
  errorMessage.value = '';
  isLoading.value = true;

  const result = await authStore.register(name.value, email.value, password.value);
  
  isLoading.value = false;

  if (result.success) {
    router.push('/');
  } else {
    errorMessage.value = result.message || 'Registration failed';
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

.form-group input.error {
  border-color: #dc2626;
}

.field-error {
  font-size: 12px;
  color: #dc2626;
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

.password-strength {
  display: flex;
  align-items: center;
  gap: 10px;
}

.strength-bar {
  flex: 1;
  height: 3px;
  background: var(--gray-200);
  border-radius: 2px;
  overflow: hidden;
}

.strength-fill {
  height: 100%;
  transition: width 0.2s;
}

.strength-fill.weak {
  background: #dc2626;
}

.strength-fill.medium {
  background: #f59e0b;
}

.strength-fill.strong {
  background: #10b981;
}

.strength-label {
  font-size: 11px;
  color: var(--gray-500);
  min-width: 48px;
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
