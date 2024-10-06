<template>
  <div class="register">
    <h1>注册</h1>
    <form @submit.prevent="register">
      <input v-model="email" placeholder="电子邮件" required />
      <input v-model="password" type="password" placeholder="密码" required />
      <input v-model="confirmPassword" type="password" placeholder="确认密码" required />
      <button type="submit">注册</button>
      <router-link to="/login">已有账户？登录</router-link>
      <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import axios from '@/services/axios'; // 导入封装的 Axios 实例
import {
  generateSalt,
  hashPassword,
  generateKeyPair,
  encryptPrivateKey,
  encryptSymmetricKey,
  generateIV
} from '@/tool/cryptoUtils'; // 导入加密解密函数

const email = ref('');
const password = ref('');
const confirmPassword = ref('');
const errorMessage = ref('');
const router = useRouter();

const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

const register = async () => {
  if (!validateEmail(email.value)) {
    errorMessage.value = '请输入有效的电子邮件地址。';
    return;
  }

  if (password.value !== confirmPassword.value) {
    errorMessage.value = '密码和确认密码不匹配。';
    return;
  }

  try {
    const salt = generateSalt();
    const hashedPassword = await hashPassword(password.value, salt);
    const keyPair = await generateKeyPair();
    const iv = generateIV();
    const encryptedPrivateKey = await encryptPrivateKey(keyPair.privateKey, hashedPassword, iv);
    const symmetricKey = await window.crypto.subtle.generateKey(
      { name: 'AES-GCM', length: 256 },
      true,
      ['encrypt', 'decrypt']
    );
    const encryptedSymmetricKey = await encryptSymmetricKey(symmetricKey, keyPair.publicKey);

    const response = await axios.post('/register', {
      email: email.value,
      salt: Array.from(salt),
      hashedPassword: Array.from(hashedPassword),
      encryptedPrivateKey: Array.from(encryptedPrivateKey),
      encryptedSymmetricKey: Array.from(encryptedSymmetricKey),
      iv: Array.from(iv)
    });

    console.log(response.data);
    if (response.data.success) {
      // 注册成功，跳转到登录页面
      router.push('/login');
    } else {
      // 注册失败，显示错误信息
      alert('Registration failed: ' + response.data.message);
    }
  } catch (error) {
    console.error(error);
    alert('An error occurred during registration.');
  }
};
</script>

<style scoped>
.register {
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 8px;
  background-color: #f9f9f9;
}

form {
  display: flex;
  flex-direction: column;
}

input {
  margin-bottom: 10px;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

button {
  padding: 10px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  background-color: #007bff;
  color: white;
  font-size: 16px;
}

button:hover {
  background-color: #0056b3;
}

.error {
  color: red;
  margin-top: 10px;
}
</style>