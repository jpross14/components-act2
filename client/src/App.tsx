import React, { useState, useEffect } from 'react';
// import './App.css';

interface User {
  _id: string;
  name: string;
  email: string;
  age: number;
}

const App: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [age, setAge] = useState('');

  const addUser = async () => {
    const response = await fetch('http://localhost:5000/api/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, email, age: parseInt(age) }),
    });
    const newUser = await response.json();
    setUsers([...users, newUser]);
  };

  useEffect(() => {
    fetch('http://localhost:5000/api/users')
      .then(response => response.json())
      .then(data => setUsers(data));
  }, []);

  if (!users || !Array.isArray(users)) {
    console.log("Invalid users data:", users);
    return (
      <div>
      <h1>User List</h1>
      {/* <h2>Add User</h2>
      <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Name" />
      <input type="text" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" />
      <input type="number" value={age} onChange={e => setAge(e.target.value)} placeholder="Age" />
      <button onClick={addUser}>Add User</button> */}
      <p>Error loading users...</p>
    </div>
    );
  }

  return (
    <div>
      <h1>Users List</h1>


      <h2>Add User</h2>
      <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Name" />
      <input type="text" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" />
      <input type="number" value={age} onChange={e => setAge(e.target.value)} placeholder="Age" />
      <button onClick={addUser}>Add User</button>

      <ul>
        {users.map(user => (
          <li key={user._id}>
            {user.name} - {user.email} ({user.age} years old)
          </li>
        ))}
      </ul>
    </div>
  );
};
export default App;

// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Edit <code>src/App.tsx</code> and save to reload.
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a>
//       </header>
//     </div>
//   );
// }

// export default App;
