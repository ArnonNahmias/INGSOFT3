"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { authService } from "../services/authService";

export default function Navbar() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const checkAuthStatus = () => {
      const authenticated = authService.isAuthenticated();
      const currentUser = authService.getUser();
      setIsAuthenticated(authenticated);
      setUser(currentUser);
    };

    checkAuthStatus();
    
    const handleStorageChange = () => {
      checkAuthStatus();
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const handleLogout = () => {
    authService.logout();
    setIsAuthenticated(false);
    setUser(null);
    router.push('/login');
  };

  return (
    <nav className="sticky top-0 z-50 bg-card/80 backdrop-blur-md border-b border-border/50">
      <div className="max-w-4xl mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          <Link
            href="/"
            className="text-2xl font-playfair font-bold gradient-text hover:scale-105 transition-transform duration-200"
          >
            PostHub
          </Link>

          <div className="flex items-center gap-6">
            {isAuthenticated ? (
              <div className="flex items-center gap-4">
                <span className="text-sm text-muted-foreground">
                  Hola, {user?.username}
                </span>
                <Link
                  href="/app"
                  className="text-sm font-medium text-foreground hover:text-primary transition-colors duration-200 hover-lift px-3 py-2 rounded-lg"
                >
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-sm font-medium text-muted-foreground hover:text-destructive transition-colors duration-200 hover-lift px-3 py-2 rounded-lg"
                >
                  Cerrar sesión
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  href="/login"
                  className="text-sm font-medium text-muted-foreground hover:text-foreground transition-all duration-200 hover-lift px-4 py-2 rounded-lg hover:bg-muted/50"
                >
                  Iniciar sesión
                </Link>
                <Link
                  href="/register"
                  className="text-sm font-medium bg-primary text-primary-foreground px-6 py-2 rounded-full hover:bg-primary/90 hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  Únete ahora
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
