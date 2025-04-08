const { expect, createTestDbConnection, cleanTestDb, closeTestDbConnection } = require('./setup');
const request = require('supertest');
const app = require('../src/index');

describe('User API Tests', () => {
  let connection;
  let testUserId;

  // Avant tous les tests
  before(async () => {
    // Création de la connexion à la base de données de test
    connection = await createTestDbConnection();
  });

  // Après tous les tests
  after(async () => {
    // Fermeture de la connexion à la base de données
    await closeTestDbConnection(connection);
  });

  // Avant chaque test
  beforeEach(async () => {
    // Nettoyage de la base de données
    await cleanTestDb(connection);
  });

  // Test de création d'un utilisateur
  describe('POST /api/users', () => {
    it('should create a new user', async () => {
      const userData = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123'
      };

      const res = await request(app)
        .post('/api/users')
        .send(userData);

      expect(res.status).to.equal(201);
      expect(res.body).to.have.property('id');
      expect(res.body.name).to.equal(userData.name);
      expect(res.body.email).to.equal(userData.email);
      expect(res.body).to.have.property('message', 'User created successfully');

      // Sauvegarde de l'ID pour les tests suivants
      testUserId = res.body.id;
    });

    it('should not create a user with an existing email', async () => {
      // Création d'un premier utilisateur
      const userData = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123'
      };

      await request(app)
        .post('/api/users')
        .send(userData);

      // Tentative de création d'un second utilisateur avec le même email
      const res = await request(app)
        .post('/api/users')
        .send(userData);

      expect(res.status).to.equal(400);
      expect(res.body).to.have.property('message', 'Email already exists');
    });
  });

  // Test de récupération des utilisateurs
  describe('GET /api/users', () => {
    it('should get all users', async () => {
      // Création de quelques utilisateurs
      const users = [
        { name: 'User 1', email: 'user1@example.com', password: 'pass1' },
        { name: 'User 2', email: 'user2@example.com', password: 'pass2' }
      ];

      for (const user of users) {
        await request(app)
          .post('/api/users')
          .send(user);
      }

      // Récupération de tous les utilisateurs
      const res = await request(app)
        .get('/api/users');

      expect(res.status).to.equal(200);
      expect(res.body).to.be.an('array');
      expect(res.body).to.have.lengthOf(2);
      expect(res.body[0]).to.have.property('name');
      expect(res.body[0]).to.have.property('email');
      expect(res.body[0]).to.not.have.property('password');
    });
  });

  // Test de récupération d'un utilisateur spécifique
  describe('GET /api/users/:id', () => {
    it('should get a single user', async () => {
      // Création d'un utilisateur
      const userData = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123'
      };

      const createRes = await request(app)
        .post('/api/users')
        .send(userData);

      const userId = createRes.body.id;

      // Récupération de l'utilisateur
      const res = await request(app)
        .get(`/api/users/${userId}`);

      expect(res.status).to.equal(200);
      expect(res.body).to.have.property('id', userId);
      expect(res.body.name).to.equal(userData.name);
      expect(res.body.email).to.equal(userData.email);
      expect(res.body).to.not.have.property('password');
    });

    it('should return 404 for non-existent user', async () => {
      const res = await request(app)
        .get('/api/users/999');

      expect(res.status).to.equal(404);
      expect(res.body).to.have.property('message', 'User not found');
    });
  });

  // Test de mise à jour d'un utilisateur
  describe('PUT /api/users/:id', () => {
    it('should update a user', async () => {
      // Création d'un utilisateur
      const userData = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123'
      };

      console.log('Creating user:', userData);
      const createRes = await request(app)
        .post('/api/users')
        .send(userData);
      console.log('Create response:', createRes.body);

      const userId = createRes.body.id;

      // Vérification que l'utilisateur existe
      const getRes = await request(app)
        .get(`/api/users/${userId}`);
      console.log('Get response:', getRes.body);

      // Mise à jour de l'utilisateur
      const updateData = {
        name: 'Updated User',
        email: 'updated@example.com',
        password: 'newpassword123'
      };

      console.log('Updating user:', updateData);
      const res = await request(app)
        .put(`/api/users/${userId}`)
        .send(updateData);
      console.log('Update response:', res.body);

      expect(res.status).to.equal(200);
      expect(res.body).to.have.property('id', userId);
      expect(res.body.name).to.equal(updateData.name);
      expect(res.body.email).to.equal(updateData.email);
      expect(res.body).to.have.property('message', 'User updated successfully');

      // Vérification que l'utilisateur a bien été mis à jour
      const finalGetRes = await request(app)
        .get(`/api/users/${userId}`);
      console.log('Final get response:', finalGetRes.body);
    });

    it('should not update a user with an existing email', async () => {
      // Création de deux utilisateurs
      const user1 = {
        name: 'User 1',
        email: 'user1@example.com',
        password: 'pass1'
      };

      const user2 = {
        name: 'User 2',
        email: 'user2@example.com',
        password: 'pass2'
      };

      const createRes1 = await request(app)
        .post('/api/users')
        .send(user1);

      await request(app)
        .post('/api/users')
        .send(user2);

      // Tentative de mise à jour du premier utilisateur avec l'email du second
      const res = await request(app)
        .put(`/api/users/${createRes1.body.id}`)
        .send({ ...user1, email: user2.email });

      expect(res.status).to.equal(400);
      expect(res.body).to.have.property('message', 'Email already exists for another user');
    });
  });

  // Test de suppression d'un utilisateur
  describe('DELETE /api/users/:id', () => {
    it('should delete a user', async () => {
      // Création d'un utilisateur
      const userData = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123'
      };

      const createRes = await request(app)
        .post('/api/users')
        .send(userData);

      const userId = createRes.body.id;

      // Suppression de l'utilisateur
      const res = await request(app)
        .delete(`/api/users/${userId}`);

      expect(res.status).to.equal(200);
      expect(res.body).to.have.property('message', 'User deleted successfully');

      // Vérification que l'utilisateur a bien été supprimé
      const getRes = await request(app)
        .get(`/api/users/${userId}`);

      expect(getRes.status).to.equal(404);
    });
  });
}); 