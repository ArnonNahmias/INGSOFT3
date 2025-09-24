"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import PostList from "@/components/PostList";
import NewPostForm from "@/components/NewPostForm";
import AuthGuard from "@/components/AuthGuard";
import { Post, postService } from "@/services/postHttpService";

export default function AppPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

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

  useEffect(() => {
    fetchPosts();
  }, []);

  const handlePostCreated = () => {
    fetchPosts(); // Recargar posts después de crear uno nuevo
  };

  const handlePostDeleted = (postId: number) => {
    setPosts(posts.filter(post => post.id !== postId));
  };

  if (isLoading) {
    return (
      <AuthGuard>
        <div className="min-h-screen bg-background">
          <Navbar />
          <main className="max-w-2xl mx-auto px-4 py-6">
            <div className="text-center">
              <p>Cargando posts...</p>
            </div>
          </main>
        </div>
      </AuthGuard>
    );
  }

  if (error) {
    return (
      <AuthGuard>
        <div className="min-h-screen bg-background">
          <Navbar />
          <main className="max-w-2xl mx-auto px-4 py-6">
            <div className="text-center text-red-600">
              <p>Error: {error}</p>
              <button 
                onClick={fetchPosts}
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Intentar nuevamente
              </button>
            </div>
          </main>
        </div>
      </AuthGuard>
    );
  }

  return (
    <AuthGuard>
      <div className="min-h-screen bg-background">
        <Navbar />

        <main className="max-w-2xl mx-auto px-4 py-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-foreground mb-4">Mi Timeline</h1>
            <NewPostForm onPostCreated={handlePostCreated} />
          </div>

          <div className="mb-4">
            <p className="text-sm text-muted-foreground">
              {posts.length} {posts.length === 1 ? "mensaje" : "mensajes"}
            </p>
          </div>

          <PostList posts={posts} onPostDeleted={handlePostDeleted} />
        </main>
      </div>
    </AuthGuard>
  )
}
