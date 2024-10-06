<template>
  <div class="generate-container">
    <h1>生成随机密码</h1>
    <div class="form-group">
      <label for="length">密码长度:</label>
      <input type="number" v-model="length" min="1" max="20" />
    </div>
    <button @click="generatePassword" class="generate-button">生成密码</button>
    <div v-if="password" class="password-display">
      <p class="password">{{ password }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const length = ref(12); // 默认密码长度
const password = ref('');

const generatePassword = () => {
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+~`|}{[]:;?><,./-=';
  let generatedPassword = '';
  for (let i = 0; i < length.value; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    generatedPassword += charset[randomIndex];
  }
  password.value = generatedPassword;
};
</script>

<style scoped>
.generate-container {
  padding: 20px;
  max-width: 600px;
  margin: 0 auto;
  background: linear-gradient(135deg, #ffffff 0%, #3498db 50%); /* 渐变背景 */
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  text-align: center;
  color: white;
  animation: fadeIn 0.3s ease-in-out;
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
  margin-bottom: 20px;
  font-size: 2.5em;
  color: #ffffff;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
}

.form-group {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
}

.form-group label {
  margin-right: 10px;
  font-size: 1.2em;
  color: #ffffff;
}

input[type="number"] {
  padding: 10px;
  font-size: 1em;
  border-radius: 5px;
  border: 1px solid #ccc;
  width: 100px;
  text-align: center;
  transition: all 0.3s ease;
}

input[type="number"]:focus {
  border-color: #4a90e2;
  box-shadow: 0 0 8px rgba(74, 144, 226, 0.5);
}

.generate-button {
  padding: 10px 20px;
  background-color: #4a90e2; /* 蓝色背景 */
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 1em;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.3s ease;
  margin-top: 20px;
}

.generate-button:hover {
  background-color: #357ab8; /* 深蓝色背景 */
  transform: scale(1.05);
}

.password-display {
  margin-top: 20px;
  text-align: center;
}

.password {
  font-family: 'Courier New', Courier, monospace;
  font-size: 1.2em;
  background-color: rgba(255, 255, 255, 0.1);
  padding: 10px;
  border-radius: 5px;
  display: inline-block;
  color: #ffffff;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
}
</style>