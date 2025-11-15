import path from 'path';
import express from 'express';
import mongoose from 'mongoose';

const {
  PORT = 3000,
  DB_ADDRESS = 'mongodb://localhost:27017/authdb',
} = process.env;

const app = express();

/* TODO: Обработать невозможность связи с БД */
mongoose.connect(DB_ADDRESS)
  .catch((error) => console.log(error));

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// заготовки
// Данные
app.get('/product', (req, res) => console.log(req, res));
app.post('/product/:id}', (req, res) => console.log(req, res));
app.post('/order', (req, res) => console.log(req, res));
// Файлы
app.post('/upload', (req, res) => console.log(req, res));
// Авторизация и прочая и прочая
app.get('/auth/token', (req, res) => console.log(req, res));
app.post('/auth/login', (req, res) => console.log(req, res));
app.post('/auth/register', (req, res) => console.log(req, res));
app.get('/auth/user', (req, res) => console.log(req, res));
app.get('/auth/logout', (req, res) => console.log(req, res));

app.use(express.static(path.join(__dirname, 'public')));
app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});
