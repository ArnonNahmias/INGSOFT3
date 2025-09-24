import { NextRequest, NextResponse } from 'next/server';
import { UserService } from '../services/UserService';
import { CreateUserData, LoginData } from '../models/User';
import jwt from 'jsonwebtoken';
import { z } from 'zod';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Esquemas de validación
const registerSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters'),
  email: z.string().email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(1, 'Password is required'),
});

export class AuthController {
  static async register(request: NextRequest): Promise<NextResponse> {
    try {
      const body = await request.json();
      
      // Validar datos de entrada
      const validatedData = registerSchema.parse(body);
      
      const userData: CreateUserData = {
        username: validatedData.username,
        email: validatedData.email,
        password: validatedData.password,
      };
      
      const user = await UserService.createUser(userData);
      
      // Crear token JWT
      const token = jwt.sign(
        { userId: user.id, email: user.email },
        JWT_SECRET,
        { expiresIn: '7d' }
      );
      
      return NextResponse.json({
        success: true,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
        },
        token,
      }, { status: 201 });
      
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return NextResponse.json({
          success: false,
          error: 'Validation error',
          details: error.errors,
        }, { status: 400 });
      }
      
      return NextResponse.json({
        success: false,
        error: error.message || 'Error creating user',
      }, { status: 400 });
    }
  }
  
  static async login(request: NextRequest): Promise<NextResponse> {
    try {
      const body = await request.json();
      
      // Validar datos de entrada
      const validatedData = loginSchema.parse(body);
      
      const loginData: LoginData = {
        email: validatedData.email,
        password: validatedData.password,
      };
      
      const user = await UserService.getUserByEmail(loginData.email);
      
      if (!user) {
        return NextResponse.json({
          success: false,
          error: 'Invalid credentials',
        }, { status: 401 });
      }
      
      const isValidPassword = await UserService.validatePassword(
        loginData.password,
        user.password
      );
      
      if (!isValidPassword) {
        return NextResponse.json({
          success: false,
          error: 'Invalid credentials',
        }, { status: 401 });
      }
      
      // Crear token JWT
      const token = jwt.sign(
        { userId: user.id, email: user.email },
        JWT_SECRET,
        { expiresIn: '7d' }
      );
      
      return NextResponse.json({
        success: true,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
        },
        token,
      });
      
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return NextResponse.json({
          success: false,
          error: 'Validation error',
          details: error.errors,
        }, { status: 400 });
      }
      
      return NextResponse.json({
        success: false,
        error: error.message || 'Error logging in',
      }, { status: 500 });
    }
  }
}