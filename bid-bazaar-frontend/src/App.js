import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { ThemeProvider } from "./contexts/ThemeContext";
import { UserProvider, useUser } from "./contexts/UserContext";
import { AuthProvider } from "./pages/Auth/context/AuthContext";
import { FilterProvider } from "./pages/User/context/FilterContext";
import { PostProvider } from "./pages/User/context/PostContext";
import { FunctionsProvider } from "./contexts/CommonFunctions";
import { ItemsProvider } from "./pages/User/context/ItemsContext";
import { ShareReportModalProvider } from "./pages/User/context/ShareAndReportContext";
import { lazy, Suspense } from "react";

const Auth = lazy(() => import("./pages/Auth/Auth"));
const Home = lazy(() => import("./pages/User/Home"));
const Dashboard = lazy(() => import("./pages/Admin/Dashboard"));
const Saved = lazy(() => import("./pages/User/pages/Saved"));
const MyBids = lazy(() => import("./pages/User/pages/MyBids"));
const Settings = lazy(() => import("./pages/User/pages/Settings"));
const HomeDefault = lazy(() => import("./pages/User/pages/Default"));
const SettingsDefault = lazy(() =>
  import("./pages/User/pages/SettingsPages/Default")
);
const FAQs = lazy(() => import("./pages/User/pages/SettingsPages/FAQs"));
const TermsAndConditions = lazy(() =>
  import("./pages/User/pages/SettingsPages/TermsAndConditions")
);
const Profile = lazy(() => import("./pages/User/pages/SettingsPages/Profile"));
const ListedAuctions = lazy(() =>
  import("./pages/User/pages/SettingsPages/ListedAuctions")
);
const ItemDetails = lazy(() => import("./pages/User/pages/ItemDetails"));

function AppProviders({ children }) {
  return (
    <FilterProvider>
      <PostProvider>
        <ShareReportModalProvider>
          <FunctionsProvider>{children}</FunctionsProvider>
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
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        <Route
          path="/auth"
          element={
            <FunctionsProvider>
              <AuthProvider>
                <Auth />
              </AuthProvider>
            </FunctionsProvider>
          }
        />
        <Route
          path="/"
          element={
            <ProtectedRoute
              element={
                <AppProviders>
                  <Home />
                </AppProviders>
              }
            />
          }
        >
          <Route index element={<HomeDefault />} />
          <Route path="saved" element={<Saved />} />
          <Route path="bids" element={<MyBids />} />
          <Route path="settings" element={<Settings />}>
            <Route index element={<SettingsDefault />} />
            <Route path="profile" element={<Profile />} />
            <Route path="listings" element={<ListedAuctions />} />
            <Route path="faq" element={<FAQs />} />
            <Route
              path="terms-and-conditions"
              element={<TermsAndConditions />}
            />
          </Route>
        </Route>

        <Route
          path="/admin"
          element={<ProtectedRoute element={<Dashboard />} adminOnly />}
        />

        <Route
          path="/item/:itemId/:name"
          element={
            <AppProviders>
              <ItemDetails />
            </AppProviders>
          }
        />
      </Routes>
    </Suspense>
  );
}

function App() {
  return (
    <UserProvider>
      <ThemeProvider>
        <ItemsProvider>
          <Router>
            <ToastContainer />
            <AppContent />
          </Router>
        </ItemsProvider>
      </ThemeProvider>
    </UserProvider>
  );
}

export default App;
