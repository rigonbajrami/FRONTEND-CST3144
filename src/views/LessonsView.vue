<template>
  <div class="lessons-page">
    <div class="container">
      <header class="page-header">
        <h1>After School Classes</h1>
        <p>Find the perfect class for your child</p>
      </header>

      <div class="controls">
        <div class="search-box">
          <svg class="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="8"/>
            <path d="m21 21-4.35-4.35"/>
          </svg>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search classes..."
            @input="handleSearch"
          />
        </div>

        <div class="filters">
          <select v-model="sortBy" class="select">
            <option value="subject">Subject</option>
            <option value="location">Location</option>
            <option value="price">Price</option>
            <option value="spaces">Availability</option>
          </select>

          <button class="sort-btn" @click="toggleSortOrder">
            <svg v-if="sortOrder === 'asc'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="m18 15-6-6-6 6"/>
            </svg>
            <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="m6 9 6 6 6-6"/>
            </svg>
          </button>
        </div>
      </div>

      <!-- v-for to display lessons -->
      <div class="lessons-grid">
        <article
          v-for="lesson in filteredLessons"
          :key="lesson.id"
          class="lesson-card"
        >
          <div class="card-icon">
            <i :class="lesson.icon"></i>
          </div>
          
          <div class="card-content">
            <h3>{{ lesson.subject }}</h3>
            <p class="location">{{ lesson.location }}</p>
            
            <div class="card-meta">
              <span class="price">£{{ lesson.price }}</span>
              <span class="spots" :class="{ low: lesson.spaces <= 2 }">
                {{ lesson.spaces }} {{ lesson.spaces === 1 ? 'spot' : 'spots' }} left
              </span>
            </div>
          </div>

          <!-- v-on click to add to cart, disabled when spaces = 0 -->
          <button
            class="add-btn"
            :disabled="lesson.spaces === 0"
            @click="addToCart(lesson)"
          >
            {{ lesson.spaces === 0 ? 'Sold out' : 'Add to cart' }}
          </button>
        </article>
      </div>

      <div v-if="filteredLessons.length === 0" class="empty-state">
        <p>No classes found</p>
        <button @click="clearSearch">Clear search</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useCartStore } from '@/services/cartStore';

const cartStore = useCartStore();

const lessons = ref([]);
const searchQuery = ref('');
const sortBy = ref('subject');
const sortOrder = ref('asc');

const toggleSortOrder = () => {
  sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc';
};

const clearSearch = () => {
  searchQuery.value = '';
  fetchLessons();
};

// sort lessons by selected attribute
const sortedLessons = computed(() => {
  const sorted = [...lessons.value];
  
  sorted.sort((a, b) => {
    let aValue = a[sortBy.value];
    let bValue = b[sortBy.value];
    
    if (sortBy.value === 'price' || sortBy.value === 'spaces') {
      return sortOrder.value === 'asc' ? aValue - bValue : bValue - aValue;
    } else {
      return sortOrder.value === 'asc' 
        ? aValue.localeCompare(bValue) 
        : bValue.localeCompare(aValue);
    }
  });
  
  return sorted;
});

// filter lessons by search query
const filteredLessons = computed(() => {
  if (!searchQuery.value) return sortedLessons.value;
  
  const query = searchQuery.value.toLowerCase();
  return sortedLessons.value.filter(lesson =>
    lesson.subject.toLowerCase().includes(query) ||
    lesson.location.toLowerCase().includes(query) ||
    lesson.price.toString().includes(query) ||
    lesson.spaces.toString().includes(query)
  );
});

const addToCart = (lesson) => {
  if (lesson.spaces > 0) {
    cartStore.addToCart(lesson);
    lesson.spaces--;
  }
};

// fetch search results from backend
const handleSearch = async () => {
  if (!searchQuery.value.trim()) {
    fetchLessons();
    return;
  }
  
  try {
    const response = await fetch(`https://backend-cst3144-eqir.onrender.com/search?q=${encodeURIComponent(searchQuery.value)}`);
    if (response.ok) {
      lessons.value = await response.json();
    }
  } catch (error) {
    console.error('Search error:', error);
  }
};

// fetch lessons from backend
const fetchLessons = async () => {
  try {
    const response = await fetch('https://backend-cst3144-eqir.onrender.com/lessons');
    if (response.ok) {
      lessons.value = await response.json();
    }
  } catch (error) {
    console.error('Error fetching lessons:', error);
  }
};

onMounted(() => {
  fetchLessons();
});
</script>

<style scoped>
.lessons-page {
  min-height: calc(100vh - 60px);
  background: var(--gray-50);
}

.container {
  max-width: 1120px;
  margin: 0 auto;
  padding: 48px 20px;
}

.page-header {
  margin-bottom: 40px;
}

.page-header h1 {
  font-size: 28px;
  font-weight: 600;
  color: var(--black);
  margin-bottom: 4px;
  letter-spacing: -0.5px;
}

.page-header p {
  font-size: 15px;
  color: var(--gray-500);
}

.controls {
  display: flex;
  gap: 12px;
  margin-bottom: 32px;
  flex-wrap: wrap;
}

.search-box {
  flex: 1;
  min-width: 200px;
  position: relative;
}

.search-icon {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  width: 18px;
  height: 18px;
  color: var(--gray-400);
}

.search-box input {
  width: 100%;
  padding: 10px 12px 10px 40px;
  font-size: 14px;
  border: 1px solid var(--gray-200);
  border-radius: 8px;
  background: var(--white);
  outline: none;
  transition: border-color 0.15s;
}

.search-box input:focus {
  border-color: var(--gray-400);
}

.search-box input::placeholder {
  color: var(--gray-400);
}

.filters {
  display: flex;
  gap: 8px;
}

.select {
  padding: 10px 32px 10px 12px;
  font-size: 14px;
  border: 1px solid var(--gray-200);
  border-radius: 8px;
  background: var(--white);
  cursor: pointer;
  outline: none;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23737373' stroke-width='2'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 10px center;
}

.sort-btn {
  width: 40px;
  height: 40px;
  border: 1px solid var(--gray-200);
  border-radius: 8px;
  background: var(--white);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: border-color 0.15s;
}

.sort-btn:hover {
  border-color: var(--gray-400);
}

.sort-btn svg {
  width: 18px;
  height: 18px;
  color: var(--gray-600);
}

.lessons-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
}

.lesson-card {
  background: var(--white);
  border: 1px solid var(--gray-200);
  border-radius: 12px;
  padding: 20px;
  transition: border-color 0.15s, box-shadow 0.15s;
}

.lesson-card:hover {
  border-color: var(--gray-300);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.04);
}

.card-icon {
  width: 44px;
  height: 44px;
  background: var(--pink-light);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
}

.card-icon i {
  font-size: 18px;
  color: var(--black);
}

.card-content h3 {
  font-size: 16px;
  font-weight: 600;
  color: var(--black);
  margin-bottom: 4px;
}

.location {
  font-size: 13px;
  color: var(--gray-500);
  margin-bottom: 16px;
}

.card-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.price {
  font-size: 18px;
  font-weight: 600;
  color: var(--black);
}

.spots {
  font-size: 12px;
  color: var(--gray-500);
}

.spots.low {
  color: #dc2626;
}

.add-btn {
  width: 100%;
  padding: 10px;
  font-size: 14px;
  font-weight: 500;
  color: var(--black);
  background: var(--pink);
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.15s;
}

.add-btn:hover:not(:disabled) {
  background: #f08da3;
}

.add-btn:disabled {
  background: var(--gray-100);
  color: var(--gray-400);
  cursor: not-allowed;
}

.empty-state {
  text-align: center;
  padding: 64px 24px;
  color: var(--gray-500);
}

.empty-state button {
  margin-top: 16px;
  padding: 8px 16px;
  font-size: 14px;
  color: var(--black);
  background: var(--white);
  border: 1px solid var(--gray-200);
  border-radius: 6px;
  cursor: pointer;
}

@media (max-width: 640px) {
  .container {
    padding: 32px 16px;
  }

  .page-header h1 {
    font-size: 24px;
  }

  .lessons-grid {
    grid-template-columns: 1fr;
  }
}
</style>
