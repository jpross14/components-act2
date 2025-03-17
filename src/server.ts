import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import User from './models/User';
import { Request, Response } from 'express';

const app = express();
const port = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// to connect to MongoDB
mongoose.connect('mongodb://localhost:27017/fullstack-crud-app') 
    // { useNewUrlParser: true, useUnifiedTopology: true, })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Failed to connect to MongoDB', err));

// for defining routes
app.get('/', (req, res) => {
  res.send('Hello from the server!');
  // User.find({}).then(function(users){
  //   res.json(users)
  // }).catch(function(err) {
  //   console.log(err)
  // })
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

// POST: Add a new user
app.post('/api/users', async (req, res) => {
    try {
      const { name, email, age } = req.body;
      const user = new User({ name, email, age });
      await user.save();
      res.status(201).json(user);
    } catch (error) {
      res.status(500).json({ message: 'Error creating user', error });
    }
  });

// GET: Fetch all users
app.get('/api/users', async (req, res) => {
    try {
      const users = await User.find();
      res.status(200).json(users);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching users', error });
    }
  });

// PUT: Update a user
app.put('/api/users/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, age } = req.body;
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { name, email, age },
      { new: true } // Returns the updated document
    );
    if (!updatedUser) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: 'Error updating user', error });
  }
});

// DELETE: Remove a user
app.delete('/api/users/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting user', error });
  }
});
