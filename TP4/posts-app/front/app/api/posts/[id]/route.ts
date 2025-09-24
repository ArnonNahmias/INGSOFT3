import { NextRequest } from 'next/server';
import { PostController } from '@/controllers/PostController';
import { initDatabase } from '@/config/database';

// Inicializar la base de datos al cargar el módulo
initDatabase().catch(console.error);

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return await PostController.deletePost(request, { params });
}