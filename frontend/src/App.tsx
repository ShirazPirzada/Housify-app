import {
  Routes,
  Route,
  Navigate,
  BrowserRouter as Router,
} from "react-router-dom";
import Layout from "./layouts/Layout";
import Register from "./pages/Register";
import SignIn from "./pages/SignIn";
import AddApartment from "./pages/AddApartment";
import { useAppContext } from "./contexts/AppContext";
import MyApartments from "./pages/MyApartments";
import EditApartment from "./pages/EditApartment";
import Search from "./pages/Search";

function App() {
  const { isLoggedIn } = useAppContext();
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <Layout>
              <p>Home Page</p>
            </Layout>
          }
        />
        <Route
          path="/search"
          element={
            <Layout>
             <Search/>
            </Layout>
          }
        />

        <Route
          path="/register"
          element={
            <Layout>
              <Register />
            </Layout>
          }
        />
        <Route
          path="/sign-in"
          element={
            <Layout>
              <SignIn />
            </Layout>
          }
        />

        {isLoggedIn && (
          <>
            <Route
              path="/add-apartment"
              element={
                <Layout>
                  <AddApartment></AddApartment>
                </Layout>
              }
            />
              <Route
              path="/my-apartments"
              element={
                <Layout>
                  <MyApartments></MyApartments>
                </Layout>
              }
            />
             <Route
              path="/edit-apartment/:apartmentId"
              element={
                <Layout>
                  <EditApartment></EditApartment>
                </Layout>
              }
            />
          </>
        )}

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
