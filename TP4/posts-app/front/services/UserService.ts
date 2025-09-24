import { getConnection } from '../config/database';
import { User, CreateUserData } from '../models/User';
import bcrypt from 'bcryptjs';

export class UserService {
  static async createUser(userData: CreateUserData): Promise<User> {
    const conn = await getConnection();
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    
    try {
      const [result] = await conn.execute(
        'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
        [userData.username, userData.email, hashedPassword]
      ) as any;
      
      const [rows] = await conn.execute(
        'SELECT * FROM users WHERE id = ?',
        [result.insertId]
      ) as any;
      
      return rows[0];
    } catch (error: any) {
      if (error.code === 'ER_DUP_ENTRY') {
        throw new Error('Usuario o email ya existe');
      }
      throw error;
    }
  }
  
  static async getUserByEmail(email: string): Promise<User | null> {
    const conn = await getConnection();
    
    try {
      const [rows] = await conn.execute(
        'SELECT * FROM users WHERE email = ?',
        [email]
      ) as any;
      
      return rows[0] || null;
    } catch (error) {
      throw error;
    }
  }
  
  static async validatePassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }
  
  static async getUserById(id: number): Promise<User | null> {
    const conn = await getConnection();
    
    try {
      const [rows] = await conn.execute(
        'SELECT * FROM users WHERE id = ?',
        [id]
      ) as any;
      
      return rows[0] || null;
    } catch (error) {
      throw error;
    }
  }
}