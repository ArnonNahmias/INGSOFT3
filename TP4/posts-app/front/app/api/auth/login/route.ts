import { NextRequest } from 'next/server';
import { AuthController } from '@/controllers/AuthController';
import { initDatabase } from '@/config/database';

// Inicializar la base de datos al cargar el módulo
initDatabase().catch(console.error);

export async function POST(request: NextRequest) {
  return await AuthController.login(request);
}