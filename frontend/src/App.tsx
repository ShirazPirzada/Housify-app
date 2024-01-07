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
import DetailPage from "./pages/DetailPage";

function App() {
  const { isLoggedIn } = useAppContext();
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <Layout isSignInPage={false}>
              <p>Home Page</p>
            </Layout>
          }
        />
        <Route
          path="/search"
          element={
            <Layout isSignInPage={false}>
              <Search />
            </Layout>
          }
        />

        <Route
          path="/detail/:apartmentId"
          element={
            <Layout isSignInPage={false}>
              <DetailPage />
            </Layout>
          }
        />

        <Route
          path="/register"
          element={
            <Layout isSignInPage={false}>
              <Register />
            </Layout>
          }
        />
        <Route
          path="/sign-in"
          element={
            <Layout isSignInPage={true}>
              <SignIn />
            </Layout>
          }
        />

        {isLoggedIn && (
          <>
            <Route
              path="/add-apartment"
              element={
                <Layout isSignInPage={false}>
                  <AddApartment></AddApartment>
                </Layout>
              }
            />
            <Route
              path="/my-apartments"
              element={
                <Layout isSignInPage={false}>
                  <MyApartments></MyApartments>
                </Layout>
              }
            />
            <Route
              path="/edit-apartment/:apartmentId"
              element={
                <Layout isSignInPage={false}>
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
