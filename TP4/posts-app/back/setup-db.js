const mysql = require('mysql2/promise');

const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'posts_app',
  port: 3306,
};

async function initDatabase() {
  let conn = null;
  
  try {
    // Primero conectar sin especificar base de datos para poder crearla
    conn = await mysql.createConnection({
      host: dbConfig.host,
      user: dbConfig.user,
      password: dbConfig.password,
      port: dbConfig.port,
    });
    
    console.log('Conectado a MySQL para inicialización');
    
    // Crear base de datos si no existe
    await conn.execute(`CREATE DATABASE IF NOT EXISTS \`${dbConfig.database}\``);
    console.log(`Base de datos '${dbConfig.database}' creada o ya existe`);
    
    // Cerrar conexión y reconnectar a la base de datos específica
    await conn.end();
    
    conn = await mysql.createConnection(dbConfig);
    console.log('Conectado a la base de datos posts_app');
    
    // Crear tabla de usuarios
    await conn.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(255) UNIQUE NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
    console.log('Tabla users creada o ya existe');
    
    // Crear tabla de posts
    await conn.execute(`
      CREATE TABLE IF NOT EXISTS posts (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        content TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);
    console.log('Tabla posts creada o ya existe');
    
    console.log('✅ Base de datos inicializada correctamente');
  } catch (error) {
    console.error('❌ Error inicializando la base de datos:', error);
    throw error;
  } finally {
    if (conn) {
      await conn.end();
    }
  }
}

// Ejecutar si es llamado directamente
if (require.main === module) {
  initDatabase()
    .then(() => {
      console.log('Setup completado');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Setup falló:', error);
      process.exit(1);
    });
}

module.exports = { initDatabase };