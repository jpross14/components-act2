import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import Applicant from './models/Applicant'; //formerly: import User from './models/User';
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
      const { id, firstName, lastName, groupName, role, expectedSalary, expectedDateOfDefense } = req.body;
      const applicant = new Applicant({ id, firstName, lastName, groupName, role, expectedSalary, expectedDateOfDefense });
      await applicant.save();
      res.status(201).json(applicant);
    } catch (error) {
      res.status(500).json({ message: 'Error creating user', error });
    }
  });

// GET: Fetch all users
app.get('/api/users', async (req, res) => {
    try {
      const applicants = await Applicant.find();
      res.status(200).json(applicants);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching users', error });
    }
  });

// PUT: Update a user
app.put('/api/users/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const { id, firstName, lastName, groupName, role, expectedSalary, expectedDateOfDefense } = req.body;
    const updatedApplicant = await Applicant.findByIdAndUpdate(
      req.params.id,
      { id, firstName, lastName, groupName, role, expectedSalary, expectedDateOfDefense },
      { new: true } // Returns the updated document
    );
    if (!updatedApplicant) {
      res.status(404).json({ message: 'Applicant not found' });
      return;
    }
    res.status(200).json(updatedApplicant);
  } catch (error) {
    res.status(500).json({ message: 'Error updating applicant', error });
  }
});

// DELETE: Remove a user
app.delete('/api/users/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const deletedApplicant = await Applicant.findByIdAndDelete(req.params.id);
    if (!deletedApplicant) {
      res.status(404).json({ message: 'Applicant not found' });
      return;
    }
    res.status(200).json({ message: 'Applicant deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting user', error });
  }
});
