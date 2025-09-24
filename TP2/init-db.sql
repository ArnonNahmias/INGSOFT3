-- Archivo de inicialización para MySQL
-- Este archivo se ejecuta automáticamente cuando se crea el contenedor

-- Crear usuario de aplicación si no existe
CREATE USER IF NOT EXISTS 'appuser'@'%' IDENTIFIED BY 'apppass123';

-- Otorgar permisos completos al usuario de aplicación
GRANT ALL PRIVILEGES ON *.* TO 'appuser'@'%';

-- Aplicar los cambios
FLUSH PRIVILEGES;

-- Mostrar información de inicialización
SELECT 'Database initialization completed successfully' as status;