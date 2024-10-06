const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const db = require('./db'); // 导入数据库连接

const app = express();
const PORT = 8000;
const SECRET_KEY = 'your-secret-key'; // 用于签名 JWT 的密钥

// 中间件
app.use(bodyParser.json());
app.use(cors());

// JWT 验证中间件
const authenticateJWT = (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ success: false, message: 'Access token is missing or invalid' });
  }

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) {
      return res.status(403).json({ success: false, message: 'Invalid token' });
    }

    req.user = user;
    next();
  });
};

// 获取盐路由
app.get('/salt', async (req, res) => {
  const { email } = req.query;

  try {
    // 查询数据库获取盐值
    const [rows] = await db.execute('SELECT salt FROM users WHERE email = ?', [email]);

    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Email not found' });
    }

    const salt = rows[0].salt;
    res.json({ success: true, salt: Array.from(salt) });
  } catch (error) {
    console.error('Error executing query:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// 登录路由
app.post('/login', async (req, res) => {
  const { email, hashedPassword } = req.body;

  try {
    // 查询数据库获取用户信息，包括用户 ID
    const [rows] = await db.execute('SELECT id, hashedPassword, encryptedPrivateKey, encryptedSymmetricKey, iv FROM users WHERE email = ?', [email]);

    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Email not found' });
    }

    const user = rows[0];

    // 验证哈希密码
    if (Buffer.from(user.hashedPassword).toString('hex') !== hashedPassword) {
      return res.status(401).json({ success: false, message: 'Invalid password' });
    }

    // 生成 JWT，包含用户 ID 和 email
    const token = jwt.sign({ userId: user.id, email }, SECRET_KEY, { expiresIn: '1h' });

    // 返回生成的 token 和其他必要的信息
    res.json({
      success: true,
      userId: user.id,
      token,
      encryptedPrivateKey: user.encryptedPrivateKey,
      encryptedSymmetricKey: user.encryptedSymmetricKey,
      iv: user.iv
    });

  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// 注册路由
app.post('/register', async (req, res) => {
  const { email, salt, hashedPassword, encryptedPrivateKey, encryptedSymmetricKey, iv } = req.body;

  try {
    // 插入数据库
    const query = 'INSERT INTO users (email, salt, hashedPassword, encryptedPrivateKey, encryptedSymmetricKey, iv) VALUES (?, ?, ?, ?, ?, ?)';
    await db.execute(query, [
      email,
      Buffer.from(salt, 'hex'), // 确保盐值是二进制格式
      Buffer.from(hashedPassword, 'hex'), // 确保哈希密码是二进制格式
      Buffer.from(encryptedPrivateKey, 'hex'), // 确保加密的私钥是二进制格式
      Buffer.from(encryptedSymmetricKey, 'hex'), // 确保加密的对称密钥是二进制格式
      Buffer.from(iv, 'hex') // 确保初始化向量是二进制格式
    ]);
    res.json({ success: true, message: 'User registered successfully' });
  } catch (error) {
    console.error('Error executing query:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// 获取所有账户
app.get('/accounts', async (req, res) => {
  const userId = req.query.user_id; // 从查询参数中获取用户ID
  try {
    const [rows] = await db.execute('SELECT * FROM accounts WHERE user_id = ?', [userId]);
    console.log('Fetched accounts:', rows); // 添加调试信息
    res.json(rows);
  } catch (error) {
    console.error('Error fetching accounts:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// 添加账户
app.post('/accounts', async (req, res) => {
  const { platform, username, password, user_id } = req.body;
  try {
    await db.execute('INSERT INTO accounts (platform, username, password, user_id) VALUES (?, ?, ?, ?)', [platform, username, password, user_id]);
    res.json({ message: 'Account added successfully' });
  } catch (error) {
    console.error('Error adding account:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// 删除账户
app.delete('/accounts/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await db.execute('DELETE FROM accounts WHERE id = ?', [id]);
    res.json({ message: 'Account deleted successfully' });
  } catch (error) {
    console.error('Error deleting account:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// 更新账户
app.put('/accounts/:id', async (req, res) => {
  const { id } = req.params;
  const { platform, username, password } = req.body;
  try {
    await db.execute('UPDATE accounts SET platform = ?, username = ?, password = ? WHERE id = ?', [platform, username, password, id]);
    res.json({ message: 'Account updated successfully' });
  } catch (error) {
    console.error('Error updating account:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});
// 受保护的路由示例
app.get('/protected', authenticateJWT, (req, res) => {
  res.json({ message: 'This is a protected route', user: req.user });
});

// 启动服务器
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});