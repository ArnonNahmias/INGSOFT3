import { Request, Response } from 'express';
import { UserService } from '../services/UserService';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export class AuthController {
  static async register(req: Request, res: Response) {
    try {
      const { username, email, password } = req.body;

      // Validación básica
      if (!username || !email || !password) {
        return res.status(400).json({
          message: 'Username, email y password son requeridos'
        });
      }

      if (username.length < 3) {
        return res.status(400).json({
          message: 'Username debe tener al menos 3 caracteres'
        });
      }

      if (password.length < 6) {
        return res.status(400).json({
          message: 'Password debe tener al menos 6 caracteres'
        });
      }

      // Verificar si el usuario ya existe
      const existingUser = await UserService.getUserByEmail(email);
      if (existingUser) {
        return res.status(409).json({
          message: 'El usuario ya existe con este email'
        });
      }

      // Crear usuario
      const user = await UserService.createUser({
        username,
        email,
        password
      });

      // Generar token
      const token = jwt.sign(
        { userId: user.id, email: user.email },
        JWT_SECRET,
        { expiresIn: '24h' }
      );

      res.status(201).json({
        user: {
          id: user.id,
          username: user.username,
          email: user.email
        },
        token
      });

    } catch (error) {
      console.error('Error en registro:', error);
      res.status(500).json({
        message: 'Error interno del servidor'
      });
    }
  }

  static async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      // Validación básica
      if (!email || !password) {
        return res.status(400).json({
          message: 'Email y password son requeridos'
        });
      }

      // Verificar credenciales
      const user = await UserService.getUserByEmail(email);
      if (!user) {
        return res.status(401).json({
          message: 'Credenciales inválidas'
        });
      }

      const isValidPassword = await UserService.validatePassword(password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({
          message: 'Credenciales inválidas'
        });
      }

      // Generar token
      const token = jwt.sign(
        { userId: user.id, email: user.email },
        JWT_SECRET,
        { expiresIn: '24h' }
      );

      res.json({
        user: {
          id: user.id,
          username: user.username,
          email: user.email
        },
        token
      });

    } catch (error) {
      console.error('Error en login:', error);
      res.status(500).json({
        message: 'Error interno del servidor'
      });
    }
  }

  static async getCurrentUser(req: Request, res: Response) {
    try {
      const token = req.header('Authorization')?.replace('Bearer ', '');
      
      if (!token) {
        return res.status(401).json({ message: 'Token requerido' });
      }

      const decoded = jwt.verify(token, JWT_SECRET) as any;
      const user = await UserService.getUserById(decoded.userId);

      if (!user) {
        return res.status(404).json({ message: 'Usuario no encontrado' });
      }

      res.json({
        user: {
          id: user.id,
          username: user.username,
          email: user.email
        }
      });

    } catch (error) {
      console.error('Error obteniendo usuario actual:', error);
      res.status(401).json({ message: 'Token inválido' });
    }
  }
}