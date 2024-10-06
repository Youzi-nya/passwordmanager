<template>
  <div class="user-profile">
    <h1>User Profile</h1>
    <div class="user-info">welcome</div>
    <button @click="logout" class="logout-button">登出</button>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import axios from '@/services/axios'; // 导入封装的 Axios 实例

const email = ref('');
const username = ref('');
const router = useRouter();


const logout = () => {
  localStorage.removeItem('token'); // 清除 JWT
  router.push('/login'); // 重定向到登录页面
};
</script>

<style scoped>
.user-profile {
  padding: 20px;
  max-width: 600px;
  margin: 0 auto;
  background-color: #f9f9f9;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

h1 {
  margin-bottom: 20px;
  font-size: 2em;
  text-align: center;
}

.user-info {
  margin-bottom: 20px;
}

.logout-button {
  display: block;
  width: 100%;
  padding: 10px;
  background-color: #ff4d4d;
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 1em;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.logout-button:hover {
  background-color: #ff1a1a;
}
</style>