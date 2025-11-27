import { ref, computed } from 'vue';

const currentUser = ref(null);
const isAuthenticated = ref(false);

// auth store using composition api
export const useAuthStore = () => {
  const login = async (email, password) => {
    try {
      const response = await fetch('http://localhost:3000/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      
      if (response.ok) {
        const data = await response.json();
        currentUser.value = data.user;
        isAuthenticated.value = true;
        localStorage.setItem('user', JSON.stringify(data.user));
        return { success: true };
      } else {
        const error = await response.json();
        return { success: false, message: error.message };
      }
    } catch (error) {
      return { success: false, message: 'Connection error' };
    }
  };

  const register = async (name, email, password) => {
    try {
      const response = await fetch('http://localhost:3000/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      });
      
      if (response.ok) {
        const data = await response.json();
        currentUser.value = data.user;
        isAuthenticated.value = true;
        localStorage.setItem('user', JSON.stringify(data.user));
        return { success: true };
      } else {
        const error = await response.json();
        return { success: false, message: error.message };
      }
    } catch (error) {
      return { success: false, message: 'Connection error' };
    }
  };

  const logout = () => {
    currentUser.value = null;
    isAuthenticated.value = false;
    localStorage.removeItem('user');
  };

  const checkAuth = () => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      currentUser.value = JSON.parse(storedUser);
      isAuthenticated.value = true;
    }
  };

  return {
    user: computed(() => currentUser.value),
    loggedIn: computed(() => isAuthenticated.value),
    login,
    register,
    logout,
    checkAuth
  };
};
