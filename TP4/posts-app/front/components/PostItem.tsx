"use client";

import { Post } from "@/services/postHttpService";
import { authService } from "@/services/authService";
import { postService } from "@/services/postHttpService";
import { useState } from "react";

interface PostItemProps {
  post: Post;
  onDeleted?: (postId: number) => void;
}

export default function PostItem({ post, onDeleted }: PostItemProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const currentUser = authService.getUser();
  const canDelete = currentUser && currentUser.username === post.username;

  const handleDelete = async () => {
    if (!canDelete || isDeleting) return;

    if (!confirm('¿Estás seguro de que quieres eliminar esta publicación?')) {
      return;
    }

    setIsDeleting(true);
    try {
      const result = await postService.deletePost(post.id);
      if (result.success) {
        onDeleted?.(post.id);
      } else {
        alert('Error al eliminar la publicación: ' + result.error);
      }
    } catch (error) {
      alert('Error al eliminar la publicación');
    } finally {
      setIsDeleting(false);
    }
  };

  const formatDateTime = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInHours = diffInMs / (1000 * 60 * 60);

    if (diffInHours < 1) {
      const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
      return `hace ${diffInMinutes}m`;
    } else if (diffInHours < 24) {
      return `hace ${Math.floor(diffInHours)}h`;
    } else {
      return date.toLocaleDateString('es-ES', { 
        day: '2-digit', 
        month: '2-digit', 
        year: 'numeric'
      });
    }
  };

  return (
    <article className="p-4 border border-border rounded-lg bg-card hover:bg-accent/10 transition-colors">
      <div className="flex items-start justify-between mb-3">
        <div className="group cursor-pointer">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-primary-foreground font-semibold text-sm">
              {post.username ? post.username.charAt(0).toUpperCase() : '?'}
            </div>
            <div>
              <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors duration-200">
                {post.username || 'Usuario desconocido'}
              </h3>
              <time className="text-xs text-muted-foreground">{formatDateTime(post.created_at)}</time>
            </div>
          </div>

          {canDelete && (
            <button 
              onClick={handleDelete}
              disabled={isDeleting}
              className="text-sm text-muted-foreground hover:text-destructive transition-colors disabled:opacity-50"
              title="Eliminar publicación"
            >
              {isDeleting ? 'Eliminando...' : '🗑️'}
            </button>
          )}
        </div>
      </div>

      <div className="pl-13">
        <p className="text-foreground leading-relaxed whitespace-pre-wrap">
          {post.content}
        </p>
      </div>
    </article>
  );
}
