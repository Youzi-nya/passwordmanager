<template>
  <div class="password-manager">
    <h1>密码管理</h1>
    <form @submit.prevent="addAccount">
      <input v-model="newAccount.platform" placeholder="平台" required />
      <input v-model="newAccount.username" placeholder="账户" required />
      <input v-model="newAccount.password" placeholder="密码" required />
      <button type="submit" class="add-button">添加账户</button>
    </form>
    <ul>
      <li v-for="(account, index) in accounts" :key="account.id">
        <span>{{ account.platform }}</span>
        <span>{{ account.username }}</span>
        <span>{{ account.showPassword ? account.password : '******' }}</span>
        <div class="dropdown">
          <button class="dropdown-button">操作</button>
          <div class="dropdown-content">
            <a @click="togglePasswordVisibility(index)">
              {{ account.showPassword ? '隐藏' : '显示' }}
            </a>
            <a @click="openEditModal(index)">编辑</a>
            <a @click="removeAccount(account.id)">删除</a>
          </div>
        </div>
      </li>
    </ul>

    <!-- 模态框 -->
    <div v-if="isEditModalOpen" class="modal">
      <div class="modal-content">
        <span class="close" @click="closeEditModal">&times;</span>
        <h2>编辑账户</h2>
        <form @submit.prevent="updateAccount">
          <input id="platform" v-model="editAccountData.platform" placeholder="平台" required />
          
          <input id="username" v-model="editAccountData.username" placeholder="账户" required />
          
          <input id="password" v-model="editAccountData.password" placeholder="密码" required />
          <button type="submit" class="update-button">更新账户</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

const userId = localStorage.getItem('userId');
const accounts = ref([]);
const newAccount = ref({
  platform: '',
  username: '',
  password: '',
  showPassword: false
});

const isEditModalOpen = ref(false);
const editAccountData = ref({
  id: null,
  platform: '',
  username: '',
  password: ''
});

const fetchAccounts = async () => {
  try {
    const response = await axios.get('http://localhost:8000/accounts', {
      params: { user_id: userId }
    });
    accounts.value = response.data.map(account => ({ ...account, showPassword: false }));
  } catch (error) {
    console.error('Error fetching accounts:', error);
  }
};

const addAccount = async () => {
  try {
    await axios.post('http://localhost:8000/accounts', {
      platform: newAccount.value.platform,
      username: newAccount.value.username,
      password: newAccount.value.password,
      user_id: userId
    });
    fetchAccounts();
    newAccount.value.platform = '';
    newAccount.value.username = '';
    newAccount.value.password = '';
  } catch (error) {
    console.error('Error adding account:', error);
  }
};

const removeAccount = async (id) => {
  try {
    await axios.delete(`http://localhost:8000/accounts/${id}`);
    fetchAccounts();
  } catch (error) {
    console.error('Error deleting account:', error);
  }
};

const openEditModal = (index) => {
  const account = accounts.value[index];
  editAccountData.value = { ...account };
  isEditModalOpen.value = true;
};

const closeEditModal = () => {
  isEditModalOpen.value = false;
};

const updateAccount = async () => {
  try {
    await axios.put(`http://localhost:8000/accounts/${editAccountData.value.id}`, {
      platform: editAccountData.value.platform,
      username: editAccountData.value.username,
      password: editAccountData.value.password
    });
    fetchAccounts();
    closeEditModal();
  } catch (error) {
    console.error('Error updating account:', error);
  }
};

const togglePasswordVisibility = (index) => {
  accounts.value[index].showPassword = !accounts.value[index].showPassword;
};

onMounted(fetchAccounts);
</script>

<style scoped>
.password-manager {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
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

form {
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;
}

input {
  margin-bottom: 10px;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 1em;
  transition: all 0.3s ease;
}

input:focus {
  border-color: #4a90e2;
  box-shadow: 0 0 8px rgba(74, 144, 226, 0.5);
}

button {
  padding: 10px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1em;
  transition: background-color 0.3s ease, transform 0.3s ease;
}

.add-button {
  background-color: #4a90e2; /* 蓝色背景 */
  color: white;
}

.add-button:hover {
  background-color: #357ab8; /* 深蓝色背景 */
  transform: scale(1.05);
}

ul {
  list-style: none;
  padding: 0;
}

li {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  border-bottom: 1px solid #ccc;
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 5px;
  margin-bottom: 10px;
  transition: background-color 0.3s ease;
}

li:hover {
  background-color: rgba(255, 255, 255, 0.2);
}

li span {
  margin-right: 10px;
}

.dropdown {
  position: relative;
  display: inline-block;
}

.dropdown-button {
  background-color: #4a90e2; /* 蓝色背景 */
  color: white;
  padding: 10px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1em;
  transition: background-color 0.3s ease, transform 0.3s ease;
}

.dropdown-button:hover {
  background-color: #357ab8; /* 深蓝色背景 */
  transform: scale(1.05);
}

.dropdown-content {
  left: 100%;
  top: 0;
  display: none;
  position: absolute;
  background-color: #f9f9f9;
  min-width: 160px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
  z-index: 1;
  border-radius: 5px;
  overflow: hidden;
  cursor: pointer;
}

.dropdown-content a {
  color: black;
  padding: 12px 16px;
  text-decoration: none;
  display: block;
  transition: background-color 0.3s ease;
}

.dropdown-content a:hover {
  background-color: #f1f1f1;
}

.dropdown:hover .dropdown-content {
  display: block;
}

/* 模态框样式 */
.modal {
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  z-index: 1000;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: rgba(0, 0, 0, 0.5);
}

.modal-content {
  background-color: #fefefe;
  margin: auto;
  padding: 20px;
  border: 1px solid #888;
  width: 80%;
  max-width: 500px;
  border-radius: 10px;
  text-align: left;
}

.close {
  color: #aaa;
  float: right;
  font-size: 28px;
  font-weight: bold;
}

.close:hover,
.close:focus {
  color: black;
  text-decoration: none;
  cursor: pointer;
}

.update-button {
  background-color: #4a90e2; /* 蓝色背景 */
  color: white;
}

.update-button:hover {
  background-color: #357ab8; /* 深蓝色背景 */
  transform: scale(1.05);
}
</style>