<template>
  <div id="app">
    <nav>
      <h1 class="home-image" @click="goToHomeProfile">DEBAO</h1>
      <img src="@/assets/congyu1.png" alt="user" class="user-image" @click="goToUserProfile" />
    </nav>
    <div class="container">
      <div class="left-pane">
        <!-- 左侧内容 -->
        <div class="nav-links">
          <router-link to="/manager" class="nav-link">密码管理</router-link>
          <router-link to="/generate" class="nav-link">生成密码</router-link>
        </div>
      </div>
      <div class="right-pane">
        <!-- 右侧内容 -->
        <router-view></router-view>
      </div>
    </div>
    <!-- 右下角固定图片 -->
    <img src="@/assets/cia.png" alt="固定图片" class="fixed-image" />
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();

const goToUserProfile = () => {
  router.push('/user-profile');
};

const goToHomeProfile = () => {
  router.push('/');
};
</script>

<style scoped>
#app {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px;
  background-color: #4a90e2;
  color: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.user-image {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  cursor: pointer;
  transition: transform 0.2s;
}

.home-image{
  cursor: pointer;
  font-size: 30px;
}

.home-image:hover, .user-image:hover {
  transform: scale(1.1);
}

.container {
  display: flex;
  flex: 1;
}

.left-pane {
  display: flex;
  flex-direction: column;
  width: 100px;
  background-color: #2c3e50;
  padding: 20px;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
}

.right-pane {
  display: flex;
  flex: 1;
  padding: 20px;
  background-color: #ecf0f1;
}

.nav-links {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.nav-link {
  width: 100%;
  text-decoration: none;
  color: #ecf0f1;
  padding: 10px 15px;
  border-radius: 5px;
  transition: background-color 0.2s, color 0.2s;
}

.router-link-active {
  background-color: #3498db; /* 蓝色背景 */
  color: white; /* 白色文字 */
}

.nav-link:hover {
  background-color: #3498db;
  color: white;
}

/* 右下角固定图片样式 */
.fixed-image {
  position: fixed;
  bottom: 10px;
  right: 10px;
  width: 100px; /* 根据需要调整图片大小 */
  height: 100px; /* 根据需要调整图片大小 */
  border-radius: 50%; /* 如果需要圆形图片 */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); /* 添加阴影 */
}
</style>