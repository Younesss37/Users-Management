// Configuration pour les tests
process.env.NODE_ENV = 'test';
process.env.DB_HOST = 'localhost';
process.env.DB_USER = 'root';
process.env.DB_PASSWORD = 'root';
process.env.DB_NAME = 'users_management_test';
process.env.DB_PORT = '3307';
process.env.PORT = '5001';

// Importation des dépendances
const chai = require('chai');
const mysql = require('mysql2/promise');
const { expect } = chai;

// Création d'une connexion à la base de données de test
const createTestDbConnection = async () => {
  try {
    // Connexion initiale sans sélectionner de base de données
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      port: process.env.DB_PORT
    });

    // Création de la base de données de test si elle n'existe pas
    await connection.query(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME}`);
    
    // Utilisation de la base de données
    await connection.query(`USE ${process.env.DB_NAME}`);

    // Création de la table users si elle n'existe pas
    await connection.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    return connection;
  } catch (error) {
    console.error('Error setting up test database:', error);
    throw error;
  }
};

// Nettoyage de la base de données de test
const cleanTestDb = async (connection) => {
  try {
    await connection.query('DELETE FROM users');
    await connection.query('ALTER TABLE users AUTO_INCREMENT = 1');
  } catch (error) {
    console.error('Error cleaning test database:', error);
    throw error;
  }
};

// Fermeture de la connexion à la base de données
const closeTestDbConnection = async (connection) => {
  try {
    await connection.end();
  } catch (error) {
    console.error('Error closing test database connection:', error);
    throw error;
  }
};

module.exports = {
  expect,
  createTestDbConnection,
  cleanTestDb,
  closeTestDbConnection
}; 