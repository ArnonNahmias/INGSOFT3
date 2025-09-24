import { getConnection } from '../config/database';
import { Post, CreatePostData, PostWithUser } from '../models/Post';

export class PostService {
  static async createPost(postData: CreatePostData): Promise<Post> {
    const conn = await getConnection();
    
    try {
      const [result] = await conn.execute(
        'INSERT INTO posts (user_id, content) VALUES (?, ?)',
        [postData.user_id, postData.content]
      ) as any;
      
      const [rows] = await conn.execute(
        'SELECT * FROM posts WHERE id = ?',
        [result.insertId]
      ) as any;
      
      return rows[0];
    } catch (error) {
      throw error;
    }
  }
  
  static async getAllPosts(): Promise<PostWithUser[]> {
    const conn = await getConnection();
    
    try {
      const [rows] = await conn.execute(`
        SELECT p.id, p.content, p.created_at, u.username 
        FROM posts p 
        JOIN users u ON p.user_id = u.id 
        ORDER BY p.created_at DESC
      `) as any;
      
      return rows;
    } catch (error) {
      throw error;
    }
  }
  
  static async getPostById(id: number): Promise<Post | null> {
    const conn = await getConnection();
    
    try {
      const [rows] = await conn.execute(
        'SELECT * FROM posts WHERE id = ?',
        [id]
      ) as any;
      
      return rows[0] || null;
    } catch (error) {
      throw error;
    }
  }
  
  static async getPostsByUserId(userId: number): Promise<PostWithUser[]> {
    const conn = await getConnection();
    
    try {
      const [rows] = await conn.execute(`
        SELECT p.id, p.content, p.created_at, u.username 
        FROM posts p 
        JOIN users u ON p.user_id = u.id 
        WHERE p.user_id = ? 
        ORDER BY p.created_at DESC
      `, [userId]) as any;
      
      return rows;
    } catch (error) {
      throw error;
    }
  }
  
  static async deletePost(id: number, userId: number): Promise<boolean> {
    const conn = await getConnection();
    
    try {
      const [result] = await conn.execute(
        'DELETE FROM posts WHERE id = ? AND user_id = ?',
        [id, userId]
      ) as any;
      
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }
}