"use client";

import Navbar from "@/components/Navbar"
import PostList from "@/components/PostList"
import Link from "next/link"
import { useState, useEffect } from "react"
import { Post, postService } from "@/services/postHttpService"

export default function HomePage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setIsLoading(true);
        const result = await postService.getAllPosts();
        
        if (result.success && result.posts) {
          setPosts(result.posts);
        } else {
          setError(result.error || "Error cargando posts");
        }
      } catch (error) {
        setError("Error de conexión");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, []);
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="bg-gradient-to-br from-background via-muted/20 to-primary/5 border-b border-border/50">
        <div className="max-w-4xl mx-auto px-6 py-12">
          <div className="text-center space-y-6">
            <h1 className="text-4xl md:text-5xl font-playfair font-bold gradient-text animate-fade-in">
              Comparte tus ideas
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty animate-slide-up">
              Únete a nuestra comunidad y descubre las conversaciones más interesantes. Conecta con personas que
              comparten tus intereses.
            </p>
            <div className="flex items-center justify-center gap-4 animate-slide-up">
              <Link
                href="/register"
                className="px-8 py-3 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 hover:scale-105 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl"
              >
                Únete ahora
              </Link>
              <Link
                href="/login"
                className="px-8 py-3 border border-border rounded-full hover:bg-muted/50 transition-all duration-200 font-medium hover-lift"
              >
                Iniciar sesión
              </Link>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-4xl mx-auto px-6 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-playfair font-bold text-foreground mb-2">Timeline Público</h2>
              {isLoading ? (
                <p className="text-muted-foreground">Cargando posts...</p>
              ) : error ? (
                <p className="text-red-600">Error: {error}</p>
              ) : (
                <p className="text-muted-foreground">
                  {posts.length} {posts.length === 1 ? "mensaje" : "mensajes"} recientes
                </p>
              )}
            </div>

            <div className="hidden md:flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Trending:</span>
              <div className="flex gap-2">
                <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium">#NextJS</span>
                <span className="px-3 py-1 bg-accent/10 text-accent rounded-full text-xs font-medium">#React</span>
                <span className="px-3 py-1 bg-chart-3/10 text-chart-3 rounded-full text-xs font-medium">#WebDev</span>
              </div>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Cargando posts...</p>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-600 mb-4">Error: {error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90 transition-colors"
            >
              Intentar nuevamente
            </button>
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">Aún no hay posts públicos</p>
            <Link 
              href="/register"
              className="px-6 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90 transition-colors inline-block"
            >
              ¡Sé el primero en publicar!
            </Link>
          </div>
        ) : (
          <PostList posts={posts} />
        )}
      </main>
    </div>
  )
}
