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
import Booking from "./pages/Booking";
import MyBookings from "./pages/MyBookings";
import Profile from "./pages/Profile";
import HomePage from "./pages/HomePage";

function App() {
  const { isLoggedIn } = useAppContext();
  
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <Layout isSignInPage={false}>

              <HomePage/>
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
          path="/updateProfile"
          element={
            <Layout isSignInPage={false}>
              <Profile />
            </Layout>
          }
        />
        <Route
          path="/register"
          element={
            <Layout isSignInPage={true}>
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
              path="/apartment/:apartmentId/booking"
              element={
                <Layout isSignInPage={false}>
                  <Booking />
                </Layout>
              }
            />

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
              path="/bookedapartments"
              element={
                <Layout isSignInPage={false}>
                  <MyBookings></MyBookings>
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
