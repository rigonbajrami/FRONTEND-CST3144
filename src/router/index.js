import { createRouter, createWebHashHistory } from 'vue-router';
import LessonsView from '../views/LessonsView.vue';
import CartView from '../views/CartView.vue';
import LoginView from '../views/LoginView.vue';
import RegisterView from '../views/RegisterView.vue';

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    { path: '/', name: 'lessons', component: LessonsView },
    { path: '/cart', name: 'cart', component: CartView },
    { path: '/login', name: 'login', component: LoginView },
    { path: '/register', name: 'register', component: RegisterView }
  ]
});

export default router;
