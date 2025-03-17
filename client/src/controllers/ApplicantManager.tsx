import React, { useState, useEffect } from 'react';

interface Applicant {
  _id: string;
  firstName: string;
  lastName: string;
  groupName: string;
  role: string;
  expectedSalary: number;
  expectedDateOfDefense: Date;
}

const ApplicantManager: React.FC = () => {
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [groupName, setGroupName] = useState('');
  const [role, setRole] = useState('');
  const [expectedSalary, setExpectedSalary] = useState('');
  const [expectedDateOfDefense, setExpectedDateOfDefense] = useState('');
  const [editingApplicantId, setEditingApplicantId] = useState<string | null>(null);

  useEffect(() => {
    fetchApplicants();
  }, []);

  const fetchApplicants = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/users');
      const data = await response.json();
      setApplicants(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const addApplicants = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          firstName, 
          lastName, 
          groupName, 
          role, 
          expectedSalary: parseInt(expectedSalary), 
          expectedDateOfDefense: expectedDateOfDefense ? new Date(expectedDateOfDefense).toISOString() : null
        }),
      });
      const newApplicant = await response.json();
      setApplicants([...applicants, newApplicant]);
      resetForm();
    } catch (error) {
      console.error('Error adding applicant:', error);
    }
  };

  const deleteApplicant = async (id: string) => {
    try {
      const response = await fetch(`http://localhost:5000/api/users/${id}`, {
        method: "DELETE",
      });
  
      if (!response.ok) {
        throw new Error("Failed to delete user");
      }
  
      setApplicants((prevApplicants) => prevApplicants.filter((applicant) => applicant._id !== id));
    } catch (error) {
      console.error("Error deleting applicant:", error);
    }
  };

  const startEditing = (applicant: Applicant) => {
    setEditingApplicantId(applicant._id);
    setFirstName(applicant.firstName);
    setLastName(applicant.lastName);
    setGroupName(applicant.groupName);
    setRole(applicant.role);
    setExpectedSalary(applicant.expectedSalary.toString());
    setExpectedDateOfDefense(new Date(applicant.expectedDateOfDefense).toISOString().split("T")[0]);
  };

  const updateApplicant = async (id: string, updatedData: Applicant) => {
    try {
      const response = await fetch(`http://localhost:5000/api/users/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedData),
      });
  
      if (!response.ok) {
        throw new Error("Failed to update user");
      }
  
      const updatedApplicant = await response.json();
      setApplicants((prevApplicants) =>
        prevApplicants.map((applicant) => (applicant._id === id ? updatedApplicant : applicant))
      );
    } catch (error) {
      console.error("Error updating applicant:", error);
    }
  };

  const resetForm = () => {
    setEditingApplicantId(null);
    setFirstName('');
    setLastName('');
    setGroupName('');
    setRole('');
    setExpectedSalary('');
    setExpectedDateOfDefense('');
  };

  if (!Array.isArray(applicants)) {
    console.log("Invalid applicants data:", applicants);
    return <p>Error loading applicants...</p>;
  }

  return (
    <div>
      <h1>Applicant List</h1>
      <h2>{editingApplicantId ? 'Edit' : 'Add Applicant'}</h2>
      <input type="text" value={firstName} onChange={e => setFirstName(e.target.value)} placeholder="First Name" />
      <input type="text" value={lastName} onChange={e => setLastName(e.target.value)} placeholder="Last Name" />
      <input type="text" value={groupName} onChange={e => setGroupName(e.target.value)} placeholder="Group Name" />
      <input type="text" value={role} onChange={e => setRole(e.target.value)} placeholder="Role" />
      <input type="number" value={expectedSalary} onChange={e => setExpectedSalary(e.target.value)} placeholder="Expected Salary" />
      <input type="date" value={expectedDateOfDefense} onChange={e => setExpectedDateOfDefense(e.target.value)} placeholder="Expected Date of Defense" />
      {editingApplicantId ? (
        <>
          <button onClick={() => updateApplicant(editingApplicantId!, { _id: editingApplicantId, firstName, lastName, groupName, role, expectedSalary: parseInt(expectedSalary), expectedDateOfDefense: new Date(expectedDateOfDefense) })}>Update Applicant</button>
          <button onClick={resetForm}>Cancel</button>
        </>
      ) : (
        <button onClick={addApplicants}>Add Applicant</button>
      )}

      <ul>
        {applicants.map(applicant => (
          <li key={applicant._id}>
            {applicant.firstName} {applicant.lastName} - {applicant.groupName} - {applicant.role} - ₱{applicant.expectedSalary} - {new Date(applicant.expectedDateOfDefense).toLocaleDateString()}
            <button onClick={() => startEditing(applicant)}>Edit</button>
            <button onClick={() => deleteApplicant(applicant._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ApplicantManager;
