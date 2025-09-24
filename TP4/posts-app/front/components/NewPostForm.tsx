"use client";

import type React from "react";
import { useState } from "react";
import { postService } from "@/services/postHttpService";
import { authService } from "@/services/authService";

interface NewPostFormProps {
  onPostCreated?: () => void;
}

export default function NewPostForm({ onPostCreated }: NewPostFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [content, setContent] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const maxLength = 280;
  const currentUser = authService.getUser();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || content.length > maxLength) return;

    setIsSubmitting(true);
    setError("");

    try {
      const result = await postService.createPost({ content: content.trim() });
      
      if (result.success) {
        setContent("");
        setIsFocused(false);
        if (onPostCreated) {
          onPostCreated();
        }
      } else {
        setError(result.error || "Error al crear el post");
      }
    } catch (error) {
      setError("Error de conexión");
    } finally {
      setIsSubmitting(false);
    }
  };

  const remainingChars = maxLength - content.length
  const progressPercentage = ((maxLength - remainingChars) / maxLength) * 100

  return (
    <div className="bg-card border border-border/50 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300 animate-fade-in">
      {error && (
        <div className="mb-4 p-3 bg-destructive/10 border border-destructive/20 text-destructive rounded-md">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-primary-foreground font-semibold flex-shrink-0">
            {currentUser?.username.charAt(0).toUpperCase() || 'U'}
          </div>

          <div className="flex-1 space-y-3">
            <div className="relative">
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                placeholder="¿Qué estás pensando?"
                className={`w-full min-h-[120px] p-4 border rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-primary/50 bg-background text-foreground placeholder:text-muted-foreground transition-all duration-200 ${
                  isFocused ? "border-primary/50 shadow-lg" : "border-input hover:border-border"
                }`}
                maxLength={maxLength}
                disabled={isSubmitting}
                aria-label="Contenido del nuevo post"
              />

              {isFocused && (
                <div className="absolute bottom-2 right-2 flex items-center gap-2">
                  <div className="w-8 h-8 relative">
                    <svg className="w-8 h-8 transform -rotate-90" viewBox="0 0 32 32">
                      <circle
                        cx="16"
                        cy="16"
                        r="14"
                        stroke="currentColor"
                        strokeWidth="2"
                        fill="none"
                        className="text-muted/20"
                      />
                      <circle
                        cx="16"
                        cy="16"
                        r="14"
                        stroke="currentColor"
                        strokeWidth="2"
                        fill="none"
                        strokeDasharray={`${progressPercentage * 0.88} 88`}
                        className={remainingChars < 50 ? "text-destructive" : "text-primary"}
                      />
                    </svg>
                    <span
                      className={`absolute inset-0 flex items-center justify-center text-xs font-medium ${
                        remainingChars < 50 ? "text-destructive" : "text-muted-foreground"
                      }`}
                    >
                      {remainingChars < 100 ? remainingChars : ""}
                    </span>
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  className="p-2 rounded-full hover:bg-muted/50 text-muted-foreground hover:text-primary transition-colors duration-200"
                  title="Agregar imagen"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </button>
                <button
                  type="button"
                  className="p-2 rounded-full hover:bg-muted/50 text-muted-foreground hover:text-accent transition-colors duration-200"
                  title="Agregar emoji"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </button>
              </div>

              <button
                type="submit"
                disabled={isSubmitting || !content.trim() || content.length > maxLength}
                className="px-6 py-2.5 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 transition-all duration-200 text-sm font-semibold shadow-lg hover:shadow-xl"
              >
                {isSubmitting ? 'Publicando...' : 'Publicar'}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}
