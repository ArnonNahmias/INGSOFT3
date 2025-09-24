import { Request, Response } from 'express';
import { PostService } from '../services/PostService';
import jwt from 'jsonwebtoken';

export class PostController {
  static async getAllPosts(req: Request, res: Response) {
    try {
      const posts = await PostService.getAllPosts();
      res.json(posts);
    } catch (error) {
      console.error('Error obteniendo posts:', error);
      res.status(500).json({ message: 'Error interno del servidor' });
    }
  }

  static async getPostById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const post = await PostService.getPostById(parseInt(id));
      
      if (!post) {
        return res.status(404).json({ message: 'Post no encontrado' });
      }
      
      res.json(post);
    } catch (error) {
      console.error('Error obteniendo post:', error);
      res.status(500).json({ message: 'Error interno del servidor' });
    }
  }

  static async createPost(req: Request, res: Response) {
    try {
      const { title, content } = req.body;
      const token = req.header('Authorization')?.replace('Bearer ', '');
      
      if (!token) {
        return res.status(401).json({ message: 'Token requerido' });
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret') as any;
      const userId = decoded.userId;

      const post = await PostService.createPost(title, content, userId);
      res.status(201).json(post);
    } catch (error) {
      console.error('Error creando post:', error);
      res.status(500).json({ message: 'Error interno del servidor' });
    }
  }

  static async updatePost(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { title, content } = req.body;
      const token = req.header('Authorization')?.replace('Bearer ', '');
      
      if (!token) {
        return res.status(401).json({ message: 'Token requerido' });
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret') as any;
      const userId = decoded.userId;

      const post = await PostService.updatePost(parseInt(id), title, content, userId);
      
      if (!post) {
        return res.status(404).json({ message: 'Post no encontrado o no autorizado' });
      }
      
      res.json(post);
    } catch (error) {
      console.error('Error actualizando post:', error);
      res.status(500).json({ message: 'Error interno del servidor' });
    }
  }

  static async deletePost(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const token = req.header('Authorization')?.replace('Bearer ', '');
      
      if (!token) {
        return res.status(401).json({ message: 'Token requerido' });
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret') as any;
      const userId = decoded.userId;

      const success = await PostService.deletePost(parseInt(id), userId);
      
      if (!success) {
        return res.status(404).json({ message: 'Post no encontrado o no autorizado' });
      }
      
      res.json({ message: 'Post eliminado correctamente' });
    } catch (error) {
      console.error('Error eliminando post:', error);
      res.status(500).json({ message: 'Error interno del servidor' });
    }
  }

  static async getPostsByUser(req: Request, res: Response) {
    try {
      const { userId } = req.params;
      const posts = await PostService.getPostsByUser(parseInt(userId));
      res.json(posts);
    } catch (error) {
      console.error('Error obteniendo posts del usuario:', error);
      res.status(500).json({ message: 'Error interno del servidor' });
    }
  }
}