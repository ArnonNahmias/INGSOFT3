import { NextRequest, NextResponse } from 'next/server';
import { PostService } from '../services/PostService';
import { CreatePostData } from '../models/Post';
import { z } from 'zod';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Esquemas de validación
const createPostSchema = z.object({
  content: z.string().min(1, 'Content is required').max(280, 'Content must be less than 280 characters'),
});

// Función para extraer el usuario del token JWT
function getUserFromToken(request: NextRequest): { userId: number; email: string } | null {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return null;
    }
    
    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    
    return {
      userId: decoded.userId,
      email: decoded.email,
    };
  } catch (error) {
    return null;
  }
}

export class PostController {
  static async createPost(request: NextRequest): Promise<NextResponse> {
    try {
      // Verificar autenticación
      const user = getUserFromToken(request);
      if (!user) {
        return NextResponse.json({
          success: false,
          error: 'Unauthorized',
        }, { status: 401 });
      }
      
      const body = await request.json();
      
      // Validar datos de entrada
      const validatedData = createPostSchema.parse(body);
      
      const postData: CreatePostData = {
        user_id: user.userId,
        content: validatedData.content,
      };
      
      const post = await PostService.createPost(postData);
      
      return NextResponse.json({
        success: true,
        post,
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
        error: error.message || 'Error creating post',
      }, { status: 500 });
    }
  }
  
  static async getAllPosts(request: NextRequest): Promise<NextResponse> {
    try {
      const posts = await PostService.getAllPosts();
      
      return NextResponse.json({
        success: true,
        posts,
      });
      
    } catch (error: any) {
      return NextResponse.json({
        success: false,
        error: error.message || 'Error fetching posts',
      }, { status: 500 });
    }
  }
  
  static async getUserPosts(request: NextRequest): Promise<NextResponse> {
    try {
      // Verificar autenticación
      const user = getUserFromToken(request);
      if (!user) {
        return NextResponse.json({
          success: false,
          error: 'Unauthorized',
        }, { status: 401 });
      }
      
      const posts = await PostService.getPostsByUserId(user.userId);
      
      return NextResponse.json({
        success: true,
        posts,
      });
      
    } catch (error: any) {
      return NextResponse.json({
        success: false,
        error: error.message || 'Error fetching user posts',
      }, { status: 500 });
    }
  }
  
  static async deletePost(request: NextRequest, { params }: { params: { id: string } }): Promise<NextResponse> {
    try {
      // Verificar autenticación
      const user = getUserFromToken(request);
      if (!user) {
        return NextResponse.json({
          success: false,
          error: 'Unauthorized',
        }, { status: 401 });
      }
      
      const postId = parseInt(params.id);
      if (isNaN(postId)) {
        return NextResponse.json({
          success: false,
          error: 'Invalid post ID',
        }, { status: 400 });
      }
      
      const deleted = await PostService.deletePost(postId, user.userId);
      
      if (!deleted) {
        return NextResponse.json({
          success: false,
          error: 'Post not found or unauthorized',
        }, { status: 404 });
      }
      
      return NextResponse.json({
        success: true,
        message: 'Post deleted successfully',
      });
      
    } catch (error: any) {
      return NextResponse.json({
        success: false,
        error: error.message || 'Error deleting post',
      }, { status: 500 });
    }
  }
}