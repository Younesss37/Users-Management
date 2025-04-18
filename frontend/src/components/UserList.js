import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import './UserList.css';
import { FaUsers } from 'react-icons/fa';
import { getUsers, deleteUser } from '../services/api';

const UserList = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    getUsers()
      .then(response => setUsers(response.data))
      .catch(error => console.error(error));
  }, []);

  const handleDelete = (id) => {
    deleteUser(id)
      .then(() => {
        setUsers(users.filter(user => user.id !== id));
      })
      .catch(error => console.error(error));
  };

  const ConfirDialog = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!"
    }).then((result) => {
      if (result.isConfirmed) {
        handleDelete(id);
        Swal.fire({
          title: "Deleted!",
          text: "Your file has been deleted.",
          icon: "success"
        });
      }
    });
  };

  return (
    <div>
      <h1>User Management</h1>
      <center>
        <div className="card">
          <h2><FaUsers />Total Users</h2>
          <p>{users.length}</p>
        </div>

        <button><Link to="/add" style={{ color: 'white', fontWeight: 'bold', padding: 10 }}>Add User</Link></button>
      </center>
      <ul>
        {users.map(user => (
          <li key={user.id}>
            {user.name} <br /> {user.email}
            <div>
              <Link to={`/edit/${user.id}`}>Edit</Link>
              <button onClick={() => ConfirDialog(user.id)}>Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserList;