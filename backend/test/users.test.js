const { expect, request, createTestDbConnection, cleanTestDb, closeTestDbConnection } = require('./setup');
const app = require('../src/app');

describe('Users API', () => {
  let connection;

  before(async () => {
    connection = await createTestDbConnection();
  });

  after(async () => {
    await closeTestDbConnection(connection);
  });

  beforeEach(async () => {
    await cleanTestDb(connection);
  });

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

      expect(res).to.have.status(201);
      expect(res.body).to.have.property('id');
      expect(res.body.name).to.equal(userData.name);
      expect(res.body.email).to.equal(userData.email);
    });

    it('should not create a user with duplicate email', async () => {
      const userData = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123'
      };

      await request(app)
        .post('/api/users')
        .send(userData);

      const res = await request(app)
        .post('/api/users')
        .send(userData);

      expect(res).to.have.status(400);
      expect(res.body).to.have.property('message', 'Email already exists');
    });
  });

  describe('GET /api/users', () => {
    it('should get all users', async () => {
      const users = [
        { name: 'User 1', email: 'user1@example.com', password: 'pass1' },
        { name: 'User 2', email: 'user2@example.com', password: 'pass2' }
      ];

      for (const user of users) {
        await request(app)
          .post('/api/users')
          .send(user);
      }

      const res = await request(app)
        .get('/api/users');

      expect(res).to.have.status(200);
      expect(res.body).to.be.an('array');
      expect(res.body).to.have.lengthOf(2);
    });
  });

  describe('GET /api/users/:id', () => {
    it('should get a single user', async () => {
      const userData = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123'
      };

      const createRes = await request(app)
        .post('/api/users')
        .send(userData);

      const userId = createRes.body.id;

      const res = await request(app)
        .get(`/api/users/${userId}`);

      expect(res).to.have.status(200);
      expect(res.body).to.have.property('id', userId);
      expect(res.body).to.have.property('name', userData.name);
      expect(res.body).to.have.property('email', userData.email);
    });

    it('should return 404 for non-existent user', async () => {
      const res = await request(app)
        .get('/api/users/999');

      expect(res).to.have.status(404);
      expect(res.body).to.have.property('message', 'User not found');
    });
  });

  describe('PUT /api/users/:id', () => {
    it('should update a user', async () => {
      const userData = {
        name: 'Original Name',
        email: 'original@example.com',
        password: 'password123'
      };

      const createRes = await request(app)
        .post('/api/users')
        .send(userData);

      const userId = createRes.body.id;

      const updateData = {
        name: 'Updated Name',
        email: 'updated@example.com',
        password: 'newpassword123'
      };

      const res = await request(app)
        .put(`/api/users/${userId}`)
        .send(updateData);

      expect(res).to.have.status(200);
      expect(res.body).to.have.property('id', userId);
      expect(res.body).to.have.property('name', updateData.name);
      expect(res.body).to.have.property('email', updateData.email);
    });

    it('should not update with duplicate email', async () => {
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

      const res = await request(app)
        .put(`/api/users/${createRes1.body.id}`)
        .send({ ...user1, email: user2.email });

      expect(res).to.have.status(400);
      expect(res.body).to.have.property('message', 'Email already exists for another user');
    });
  });

  describe('DELETE /api/users/:id', () => {
    it('should delete a user', async () => {
      const userData = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123'
      };

      const createRes = await request(app)
        .post('/api/users')
        .send(userData);

      const userId = createRes.body.id;

      const res = await request(app)
        .delete(`/api/users/${userId}`);

      expect(res).to.have.status(200);
      expect(res.body).to.have.property('message', 'User deleted successfully');

      const getRes = await request(app)
        .get(`/api/users/${userId}`);

      expect(getRes).to.have.status(404);
    });
  });
}); 