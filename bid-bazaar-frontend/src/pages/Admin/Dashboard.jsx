import React from 'react'
import { useUser } from '../../contexts/UserContext';
import { apis, useProtectedApi } from '../../APIs/api';
import { Navigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const Dashboard = () => {
    const setUser = useUser().setUser;
    const { protectedPost } = useProtectedApi();
    return (
      <div className="container">
        <h2 style={{ alignSelf: "center" }}>
          Welcome, Admin
        </h2>
        <button
          onClick={async () => {
            try {
              await protectedPost(apis.logout);
              setUser(null);
              return <Navigate to="/login" />;
            } catch (error) {
              toast.error("Error logging out!");
            }
          }}
          className="btn btn-prev"
        >
          Logout
        </button>
      </div>
    );
}

export default Dashboard
