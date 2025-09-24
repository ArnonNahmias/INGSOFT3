import { RowDataPacket } from 'mysql2';
import { getConnection } from '../config/database';

export interface Post {
  id: number;
  title: string;
  content: string;
  userId: number;
  username: string;
  createdAt: Date;
  updatedAt: Date;
}

export class PostService {
  static async getAllPosts(): Promise<Post[]> {
    const connection = await getConnection();
    try {
      const [rows] = await connection.execute<RowDataPacket[]>(
        `SELECT p.*, u.username 
         FROM posts p 
         JOIN users u ON p.userId = u.id 
         ORDER BY p.createdAt DESC`
      );
      return rows as Post[];
    } catch (error) {
      console.error('Error getting all posts:', error);
      throw error;
    }
  }

  static async getPostById(id: number): Promise<Post | null> {
    const connection = await getConnection();
    try {
      const [rows] = await connection.execute<RowDataPacket[]>(
        `SELECT p.*, u.username 
         FROM posts p 
         JOIN users u ON p.userId = u.id 
         WHERE p.id = ?`,
        [id]
      );
      return rows.length > 0 ? (rows[0] as Post) : null;
    } catch (error) {
      console.error('Error getting post by id:', error);
      throw error;
    }
  }

  static async createPost(title: string, content: string, userId: number): Promise<Post> {
    const connection = await getConnection();
    try {
      const [result] = await connection.execute(
        'INSERT INTO posts (title, content, userId) VALUES (?, ?, ?)',
        [title, content, userId]
      );
      
      const insertId = (result as any).insertId;
      const post = await this.getPostById(insertId);
      
      if (!post) {
        throw new Error('Error creando el post');
      }
      
      return post;
    } catch (error) {
      console.error('Error creating post:', error);
      throw error;
    }
  }

  static async updatePost(id: number, title: string, content: string, userId: number): Promise<Post | null> {
    const connection = await getConnection();
    try {
      // Verificar que el post existe y pertenece al usuario
      const existingPost = await this.getPostById(id);
      if (!existingPost || existingPost.userId !== userId) {
        return null;
      }

      await connection.execute(
        'UPDATE posts SET title = ?, content = ?, updatedAt = CURRENT_TIMESTAMP WHERE id = ? AND userId = ?',
        [title, content, id, userId]
      );
      
      return await this.getPostById(id);
    } catch (error) {
      console.error('Error updating post:', error);
      throw error;
    }
  }

  static async deletePost(id: number, userId: number): Promise<boolean> {
    const connection = await getConnection();
    try {
      const [result] = await connection.execute(
        'DELETE FROM posts WHERE id = ? AND userId = ?',
        [id, userId]
      );
      
      return (result as any).affectedRows > 0;
    } catch (error) {
      console.error('Error deleting post:', error);
      throw error;
    }
  }

  static async getPostsByUser(userId: number): Promise<Post[]> {
    const connection = await getConnection();
    try {
      const [rows] = await connection.execute<RowDataPacket[]>(
        `SELECT p.*, u.username 
         FROM posts p 
         JOIN users u ON p.userId = u.id 
         WHERE p.userId = ? 
         ORDER BY p.createdAt DESC`,
        [userId]
      );
      return rows as Post[];
    } catch (error) {
      console.error('Error getting posts by user:', error);
      throw error;
    }
  }
}