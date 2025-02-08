import React, { useState, useEffect } from "react";
import axios from "axios";
import Header from "../Header";
import UserProfile from "../UserProfile";
import Navbar from "../NavMon";
import "../../styles/EditUser.css"

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [editUser, setEditUser] = useState(null);
  const [modalData, setModalData] = useState({
    isVisible: false,
    message: "",
    type: "", // "success" or "error"
  });
  const [deleteUserID, setDeleteUserID] = useState(null); // Track user being deleted

  // Fetch users
  useEffect(() => {
    axios
      .get("http://localhost:8081/register")
      .then((response) => {
        setUsers(response.data);
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
      });
  }, []);

  // Handle delete
  const handleDelete = () => {
    if (deleteUserID) {
      axios
        .delete(`http://localhost:8081/register/${deleteUserID}`)
        .then(() => {
          setUsers((prev) => prev.filter((user) => user.UserID !== deleteUserID));
          setModalData({
            isVisible: true,
            message: "User deleted successfully!",
            type: "success",
          });
          setDeleteUserID(null); // Reset deleteUserID after deletion
        })
        .catch((error) => {
          setModalData({
            isVisible: true,
            message: "Error deleting user: " + error.message,
            type: "error",
          });
          setDeleteUserID(null); // Reset deleteUserID on error
        });
    }
  };

  // Open edit modal
  const openEditModal = (user) => {
    setEditUser(user);
  };

  // Close edit modal
  const closeEditModal = () => {
    setEditUser(null);
  };

  // Handle edit form submission
  const handleEditSubmit = (e) => {
    e.preventDefault();
    const { UserID, username, password, role } = editUser;

    axios
      .put(`http://localhost:8081/register/${UserID}`, {
        username,
        password,
        role,
      })
      .then(() => {
        setUsers((prev) =>
          prev.map((user) =>
            user.UserID === UserID ? { ...user, username, role } : user
          )
        );
        setModalData({
          isVisible: true,
          message: "User updated successfully!",
          type: "success",
        });
        closeEditModal();
      })
      .catch((error) => {
        setModalData({
          isVisible: true,
          message: "Error updating user: " + error.message,
          type: "error",
        });
      });
  };

  // Open confirmation modal for delete
  const openDeleteConfirmation = (UserID) => {
    setDeleteUserID(UserID); // Set the user ID to be deleted
    setModalData({
      isVisible: true,
      message: "Are you sure you want to delete this user?",
      type: "warning",
    });
  };

  // Close the modal
  const closeModal = () => {
    setModalData({ isVisible: false, message: "", type: "" });
    setDeleteUserID(null); // Reset the deleteUserID when closing modal
  };

  return (
    <>
      <Header />
      <UserProfile/>
      <Navbar/>
      <div className="form-container">
      <div className="col-12">
        <div className="container1">
          <div className="user-list">
            <h1>User List</h1>
            <table className="table">
              <thead>
                <tr>
                 
                  <th>Username</th>
                  <th>Role</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.UserID}>
                    
                    <td>{user.Username}</td>
                    <td>{user.Role}</td>
                    <td>
                      <button
                        className="btn btn-primary"
                        onClick={() => openEditModal(user)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-danger"
                        onClick={() => openDeleteConfirmation(user.UserID)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Edit Dialog */}
          {editUser && (
            <div className="dialog-overlay">
              <dialog open className="dialog">
                <h2>Edit User</h2>
                <form onSubmit={handleEditSubmit}>
                  <div className="form-group">
                    <label>Username</label>
                    <input
                      type="text"
                      value={editUser.username}
                      onChange={(e) =>
                        setEditUser((prev) => ({
                          ...prev,
                          username: e.target.value,
                        }))
                      }
                      className="form-control"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Password</label>
                    <input
                      type="password"
                      value={editUser.password || ""}
                      onChange={(e) =>
                        setEditUser((prev) => ({
                          ...prev,
                          password: e.target.value,
                        }))
                      }
                      className="form-control"
                    />
                  </div>

                  <div className="form-group">
                    <label>Role</label>
                    <select
                      value={editUser.role}
                      onChange={(e) =>
                        setEditUser((prev) => ({
                          ...prev,
                          role: e.target.value,
                        }))
                      }
                      className="form-control"
                      required
                    >
                      <option value="Admin">Admin</option>
                      <option value="Doctor">Doctor</option>
                      <option value="Researcher">Researcher</option>
                    </select>
                  </div>

                  <button type="submit" className="btn btn-primary mt-3">
                    Save Changes
                  </button>
                  <button
                    type="button"
                    onClick={closeEditModal}
                    className="btn btn-secondary mt-3"
                  >
                    Cancel
                  </button>
                </form>
              </dialog>
            </div>
          )}

          {/* Confirmation Dialog for Delete */}
          {modalData.isVisible && modalData.type === "warning" && (
            <div className="dialog-overlay">
              <dialog open className="dialog">
                <h2>Confirmation</h2>
                <p>{modalData.message}</p>
                <button
                  className="btn btn-danger"
                  onClick={handleDelete}
                >
                  Yes, Delete
                </button>
                <button
                  className="btn btn-secondary"
                  onClick={closeModal}
                >
                  Cancel
                </button>
              </dialog>
            </div>
          )}

          {/* Dialog for success or error */}
          {modalData.isVisible && modalData.type !== "warning" && (
            <div className="dialog-overlay">
              <dialog open className="dialog">
                <h2>{modalData.type === "success" ? "Success!" : "Error!"}</h2>
                <p>{modalData.message}</p>
                <button
                  onClick={closeModal}
                  className="btn btn-secondary"
                >
                  Close
                </button>
              </dialog>
            </div>
          )}
        </div>
      </div>
      </div>
    </>
  );
};

export default UserList;
