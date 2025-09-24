import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { initDatabase } from './config/database';
import { PostController } from './controllers/PostController';
import { AuthController } from './controllers/AuthController';

// Cargar variables de entorno
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Inicializar base de datos
initDatabase().catch(console.error);

// Rutas principales
app.get('/', (req, res) => {
  res.json({ message: 'Posts App Backend funcionando correctamente!' });
});

// Rutas de Posts
app.get('/api/posts', PostController.getAllPosts);
app.get('/api/posts/:id', PostController.getPostById);
app.post('/api/posts', PostController.createPost);
app.put('/api/posts/:id', PostController.updatePost);
app.delete('/api/posts/:id', PostController.deletePost);
app.get('/api/users/:userId/posts', PostController.getPostsByUser);

// Rutas de Autenticación
app.post('/api/auth/register', AuthController.register);
app.post('/api/auth/login', AuthController.login);
app.get('/api/auth/me', AuthController.getCurrentUser);

// Middleware de manejo de errores
app.use((err: any, req: any, res: any, next: any) => {
  console.error('Error:', err);
  res.status(500).json({ message: 'Error interno del servidor' });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
  console.log(`📍 URL: http://localhost:${PORT}`);
});