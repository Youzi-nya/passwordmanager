<template>
  <div class="login">
    <h1>登录</h1>
    <form @submit.prevent="login">
      <input v-model="email" placeholder="电子邮件" required />
      <input v-model="password" type="password" placeholder="密码" required />
      <div class="remember-me">
        <input type="checkbox" v-model="rememberMe" id="rememberMe" />
        <label for="rememberMe">记住我</label>
      </div>
      <button type="submit">登录</button>
      <router-link to="/register">没有账户？注册一个</router-link>
      <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';
import { hashPassword, decryptPrivateKey, decryptSymmetricKey } from '@/tool/cryptoUtils'; // 导入加密解密函数

const router = useRouter();
const email = ref('');
const password = ref('');
const rememberMe = ref(false);
const errorMessage = ref('');

const login = async () => {
  try {
    // 获取盐值
    const saltResponse = await axios.get('http://localhost:8000/salt', {
      params: { email: email.value }
    });
    const salt = new Uint8Array(saltResponse.data.salt);

    // 生成哈希密码
    const hashedPassword = await hashPassword(password.value, salt);

    // 将哈希后的密码发送到后端进行验证
    const response = await axios.post('http://localhost:8000/login', {
      email: email.value,
      hashedPassword: Array.from(hashedPassword).map(byte => byte.toString(16).padStart(2, '0')).join('') // 转换为十六进制字符串
    });

    console.log('Login response:', response.data);

    const { userId,encryptedPrivateKey, encryptedSymmetricKey, iv, token } = response.data;

    if (!encryptedPrivateKey || !encryptedSymmetricKey || !iv || !token) {
      throw new Error('Missing required fields in response data');
    }

    // 确保 encryptedPrivateKey 和 iv 是 Uint8Array 格式
    const encryptedPrivateKeyArray = new Uint8Array(Object.values(encryptedPrivateKey));
    const ivArray = new Uint8Array(Object.values(iv));

    // 调试信息
    console.log('Encrypted Private Key:', encryptedPrivateKeyArray);
    console.log('IV:', ivArray);
    console.log('Hashed Password:', hashedPassword);

    // // 解密私钥
    // const privateKey = await decryptPrivateKey(
    //   encryptedPrivateKeyArray,
    //   hashedPassword,
    //   ivArray
    // );

    // console.log('Decrypted Private Key:', privateKey);

    // // 确保 encryptedSymmetricKey 是 Uint8Array 格式
    // const encryptedSymmetricKeyArray = new Uint8Array(Object.values(encryptedSymmetricKey));

    // // 解密对称密钥
    // const symmetricKey = await decryptSymmetricKey(
    //   encryptedSymmetricKeyArray,
    //   privateKey
    // );

    // console.log('Decrypted Symmetric Key:', symmetricKey);

    // // 存储 JWT 和对称密钥
    localStorage.setItem('token', token);
    localStorage.setItem('userId', userId);
    console.log('userId:', userId);
    // localStorage.setItem('symmetricKey', JSON.stringify(Array.from(symmetricKey)));

    // 记住我功能
    // if (rememberMe.value) {
    //   localStorage.setItem('email', email.value);
    // } else {
    //   localStorage.removeItem('email');
    // }

    // 跳转到受保护的页面
    router.push('/manager');
  } catch (error) {
    console.error('Error during login:', error);
    errorMessage.value = '登录失败，请检查您的凭据。';
  }
};

// 自动填充记住的电子邮件
if (localStorage.getItem('email')) {
  email.value = localStorage.getItem('email');
}
</script>

<style scoped>
.login {
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

.remember-me {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.remember-me input {
  margin-right: 5px;
}

.error {
  color: red;
  margin-top: 10px;
}
</style>