import React, { useState, useEffect } from 'react';

interface User {
  _id: string;
  name: string;
  email: string;
  age: number;
}

const UserManager: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [age, setAge] = useState('');
  const [editingUserId, setEditingUserId] = useState<string | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/users');
      const data = await response.json();
      setUsers(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const addUser = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, age: parseInt(age) }),
      });
      const newUser = await response.json();
      setUsers([...users, newUser]);
      resetForm();
    } catch (error) {
      console.error('Error adding user:', error);
    }
  };

  const deleteUser = async (id: string) => {
    try {
      await fetch(`http://localhost:5000/api/users/${id}`, {
        method: 'DELETE',
      });
      setUsers(users.filter(user => user._id !== id));
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const startEditing = (user: User) => {
    setEditingUserId(user._id);
    setName(user.name);
    setEmail(user.email);
    setAge(user.age.toString());
  };

  const updateUser = async () => {
    if (!editingUserId) return;

    try {
      const response = await fetch(`http://localhost:5000/api/users/${editingUserId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, age: parseInt(age) }),
      });

      const updatedUser = await response.json();
      setUsers(users.map(user => (user._id === editingUserId ? updatedUser : user)));
      resetForm();
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  const resetForm = () => {
    setEditingUserId(null);
    setName('');
    setEmail('');
    setAge('');
  };

  if (!Array.isArray(users)) {
    console.log("Invalid users data:", users);
    return <p>Error loading users...</p>;
  }

  return (
    <div>
      <h1>Users List</h1>
      <h2>{editingUserId ? 'Edit User' : 'Add User'}</h2>
      <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Name" />
      <input type="text" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" />
      <input type="number" value={age} onChange={e => setAge(e.target.value)} placeholder="Age" />
      {editingUserId ? (
        <>
          <button onClick={updateUser}>Update User</button>
          <button onClick={resetForm}>Cancel</button>
        </>
      ) : (
        <button onClick={addUser}>Add User</button>
      )}

      <ul>
        {users.map(user => (
          <li key={user._id}>
            {user.name} - {user.email} ({user.age} years old)
            <button onClick={() => startEditing(user)}>Edit</button>
            <button onClick={() => deleteUser(user._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserManager;
