import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getUsers, createUser, updateUser } from '../services/api';

const UserForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState({
    name: '',
    email: '',
    password: ''
  });

  useEffect(() => {
    if (id) {
      getUsers()
        .then(response => {
          const foundUser = response.data.find(u => u.id === parseInt(id));
          if (foundUser) {
            setUser(foundUser);
          }
        })
        .catch(error => console.error(error));
    }
  }, [id]);

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (id) {
      updateUser(id, user)
        .then(() => navigate('/'))
        .catch(error => console.error(error));
    } else {
      createUser(user)
        .then(() => navigate('/'))
        .catch(error => console.error(error));
    }
  };

  return (
    <div>
      <h1>{id ? 'Edit User' : 'Add User'}</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name:</label>
          <input type="text" name="name" value={user.name} onChange={handleChange} required />
        </div>
        <div>
          <label>Email:</label>
          <input type="email" name="email" value={user.email} onChange={handleChange} required />
        </div>
        <div>
          <label>Password:</label>
          <input type="password" name="password" value={user.password} onChange={handleChange} required={!id} />
        </div>
        <div className="form-actions">
          <button type="button" onClick={() => navigate('/')}>Cancel</button>
          <button type="submit">{id ? 'Update' : 'Add'}</button>
        </div>
      </form>
    </div>
  );
};

export default UserForm;