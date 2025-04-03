import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { ThemeProvider } from "./contexts/ThemeContext";
import { UserProvider, useUser } from "./contexts/UserContext";
import { CsrfProvider } from "./contexts/CsrfContext";
import { AuthProvider } from "./pages/Auth/context/AuthContext";
import { FilterProvider } from "./pages/User/context/FilterContext";
import { PostProvider } from "./pages/User/context/PostContext";
import { FunctionsProvider } from "./contexts/CommonFunctions";
import { SavedProvider } from "./pages/User/context/SavedContext";
import { ShareReportModalProvider } from "./pages/User/context/ShareAndReportContext";

import Auth from "./pages/Auth/Auth";
import Home from "./pages/User/Home";
import Dashboard from "./pages/Admin/Dashboard";
import Saved from "./pages/User/pages/Saved";
import MyBids from "./pages/User/pages/MyBids";
import Settings from "./pages/User/pages/Settings";
import HomeDefault from "./pages/User/pages/Default";
import SettingsDefault from "./pages/User/pages/SettingsPages/Default";
import FAQs from "./pages/User/pages/SettingsPages/FAQs";
import TermsAndConditions from "./pages/User/pages/SettingsPages/TermsAndConditions";
import Profile from "./pages/User/pages/SettingsPages/Profile";
import ListedAuctions from "./pages/User/pages/SettingsPages/ListedAuctions";
import ItemDetails from "./pages/User/pages/ItemDetails";

function AppProviders({ children }) {
  return (
    <FilterProvider>
      <PostProvider>
        <ShareReportModalProvider>
          <SavedProvider>
            <FunctionsProvider>{children}</FunctionsProvider>
          </SavedProvider>
        </ShareReportModalProvider>
      </PostProvider>
    </FilterProvider>
  );
}

function ProtectedRoute({ element, adminOnly }) {
  const { user, loading } = useUser();
  if (loading) return <div>Loading...</div>;

  if (!user) return <Navigate to="/auth" />;
  if (adminOnly && !user.isAdmin) return <Navigate to="/" />;

  return element;
}

function AppContent() {
  return (
    <Routes>
      <Route
        path="/auth"
        element={
          <AuthProvider>
            <Auth />
          </AuthProvider>
        }
      />
      
      <Route path="/" element={<ProtectedRoute element={<Home />} />}>
        <Route index element={<HomeDefault />} />
        <Route path="saved" element={<Saved />} />
        <Route path="bids" element={<MyBids />} />
        <Route path="settings" element={<Settings />}>
          <Route index element={<SettingsDefault />} />
          <Route path="profile" element={<Profile />} />
          <Route path="listings" element={<ListedAuctions />} />
          <Route path="faq" element={<FAQs />} />
          <Route path="terms-and-conditions" element={<TermsAndConditions />} />
        </Route>
      </Route>

      <Route path="/admin" element={<ProtectedRoute element={<Dashboard />} adminOnly />} />

      <Route
        path="/item/:itemId/:name"
        element={<ItemDetails />}
      />
    </Routes>
  );
}

function App() {
  return (
    <UserProvider>
      <CsrfProvider>
        <ThemeProvider>
          <Router>
            <ToastContainer />
            <AppProviders>
              <AppContent />
            </AppProviders>
          </Router>
        </ThemeProvider>
      </CsrfProvider>
    </UserProvider>
  );
}

export default App;