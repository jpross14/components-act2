import mongoose from 'mongoose';

const applicantSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  groupName: { type: String, required: true },
  role: { type: String, required: true },
  expectedSalary: { type: Number, required: true },
  expectedDateOfDefense: { type: Date, required: true }

});

const Applicant = mongoose.model('Applicant', applicantSchema);

export default Applicant;

// const userSchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   email: { type: String, required: true, unique: true },
//   age: { type: Number, required: true }
// });

// const User = mongoose.model('User', userSchema);

// export default User;