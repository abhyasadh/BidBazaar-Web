import { createContext, useContext, useState, useEffect } from "react";
import { sessionApi } from "../APIs/api";
import { connectSocket } from "../APIs/socket";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const response = await sessionApi();
        if (response.data.success) {
          setUser(response.data.user);
          connectSocket(response.data.user.id);
        }
      } catch (error) {
        console.log("No active session.");
      } finally {
        setLoading(false);
      }
    };

    fetchSession();
  }, []);

  return (
    <UserContext.Provider value={{ user, loading, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
