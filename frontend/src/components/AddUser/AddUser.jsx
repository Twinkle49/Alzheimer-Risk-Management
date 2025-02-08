import React, { useState } from "react";
import axios from "axios";
import "../../styles/PatientForm.css";
import Header from "../Header";
import UserProfile from '../UserProfile';
import NavMon from "../NavMon";

const AddUserForm = () => {
  const [formData, setFormData] = useState({
    userID: "",
    username: "",
    password: "",
    role: "",
  });

  const [modalData, setModalData] = useState({
    isVisible: false,
    message: "",
    type: "", // "success" or "error"
  });

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:8081/register", formData);
      if (response.status === 200 || response.status === 201) {
        setModalData({
          isVisible: true,
          message: "User added successfully!",
          type: "success",
        });
        // Reset form after successful submission
        setFormData({
          username: "",
          password: "",
          role: "",
        });
      } else {
        throw new Error("Unexpected response");
      }
    } catch (error) {
      setModalData({
        isVisible: true,
        message: "Error adding user: " + error.message,
        type: "error",
      });
    }
  };

  const closeModal = () => {
    setModalData((prev) => ({
      ...prev,
      isVisible: false,
    }));
  };

  return (
    <>
    <Header/>
    <UserProfile/>
    <NavMon/>
    <div className="col-12">
        <div className="container1">
    <div className="form-container">
      <div className="form-wrapper">
        <h1>Add New User</h1>
        <form onSubmit={handleSubmit}>
          

          <div className="form-group">
            <label>Username</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="form-control"
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="form-control"
              required
            />
          </div>

          <div className="form-group">
            <label>Role</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="form-control"
              required
            >
              <option value="">Select Role</option>
              <option value="Admin">Admin</option>
              <option value="Doctor">Doctor</option>
              <option value="Researcher">Researcher</option>
            </select>
          </div>

          <button type="submit" className="btn btn-primary mt-3">
            Add User
          </button>
        </form>
      </div>

      {/* Modal for success or error */}
      {modalData.isVisible && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>{modalData.type === "success" ? "Success!" : "Error!"}</h2>
            <p>{modalData.message}</p>
            <button onClick={closeModal} className="btn btn-secondary">
              Close
            </button>
          </div>
        </div>
      )}
    </div>
    </div>
    </div>
    </>
  );
};

export default AddUserForm;
