import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/login";
import Dashboard from "./pages/Dashboard";
import ProtectedRoutes from "./components/ProtectedRoutes";
import { Layout } from "./layouts/Layout";
import { Toaster } from "sonner";
import Clients from "./pages/clients";
import Plans from "./pages/plans";
import Payments from "./pages/payments";
import ClientProfile from "./pages/ClientProfile";
import Checkin from "./pages/Checkin";
function App() {
  return (
    <>
      <Toaster richColors position="bottom-left" />
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/"
            element={
              <ProtectedRoutes>
                <Layout>
                  <Dashboard />
                </Layout>
              </ProtectedRoutes>
            }
          />
          <Route
            path="/clients"
            element={
              <ProtectedRoutes>
                <Layout>
                  <Clients />
                </Layout>
              </ProtectedRoutes>
            }
          />
          <Route
            path="/plans"
            element={
              <ProtectedRoutes>
                <Layout>
                  <Plans />
                </Layout>
              </ProtectedRoutes>
            }
          />
          <Route
            path="/clients/profile/:dni"
            element={
              <ProtectedRoutes>
                <Layout>
                  <ClientProfile />
                </Layout>
              </ProtectedRoutes>
            }
          />
          <Route
            path="/payments"
            element={
              <ProtectedRoutes>
                <Layout>
                  <Payments />
                </Layout>
              </ProtectedRoutes>
            }
          />
          <Route
            path="/checkin"
            element={
              <ProtectedRoutes>
                <Checkin />
              </ProtectedRoutes>
            }
          />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
