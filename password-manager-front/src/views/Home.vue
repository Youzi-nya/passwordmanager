<template>
  <div class="home-container">
    <h1>欢迎使用<p><strong>德宝</strong></p>密码管理器</h1>
    <p>这是一个安全且易于使用的密码管理工具，帮助管理存储所有的密码。</p>

    <router-link to="/manager" class="home-button">开始使用</router-link>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import axios from '@/services/axios'; // 导入封装的 Axios 实例

const user = ref(null);
const router = useRouter();

onMounted(async () => {
  try {
    const token = localStorage.getItem('token');
    if (token) {
      const response = await axios.get('/protected');
      user.value = response.data.user;
    }
  } catch (error) {
    console.error(error);
    user.value = null;
  }
});

const logout = () => {
  localStorage.removeItem('token'); // 清除 JWT
  router.push('/login'); // 重定向到登录页面
};
</script>

<style scoped>
.home-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 80vh; /* 调整高度 */
  width: 90vw; /* 调整宽度 */
  max-width: 600px; /* 设置最大宽度 */
  text-align: center;
  color: white;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  padding: 20px;
  margin: 0 auto; /* 水平居中 */
  background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%); /* 渐变背景 */
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  animation: fadeIn 1s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

h1 {
  font-size: 2.5em; /* 调整字体大小 */
  margin-bottom: 20px;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
}

p {
  font-size: 1.2em; /* 调整字体大小 */
  margin-bottom: 20px;
  max-width: 600px;
}

.home-button {
  padding: 12px 24px; /* 调整按钮大小 */
  background: linear-gradient(135deg, #4CAF50, #45a049);
  color: white;
  border: none;
  border-radius: 30px; /* 调整圆角 */
  font-size: 1.2em; /* 调整字体大小 */
  text-decoration: none;
  cursor: pointer;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: background 0.3s ease, transform 0.3s ease;
}

.home-button:hover {
  background: linear-gradient(135deg, #45a049, #4CAF50);
  transform: translateY(-2px);
}
</style>