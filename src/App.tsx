import React, { useState, useEffect } from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./client/pages/LoginPage.tsx";
import DashboardPage from "./client/pages/DashboardPage.tsx";
import AdminDashboard from "./admin/pages/AdminDashboard.tsx";
import { Employee } from "./employees";
import { Box } from "@mui/material";
import "./shared/styles/App.css";
import QRCodeScanner from "./client/pages/QrCodeScanner.tsx";
import BigTablePage from "./client/pages/BigTable.tsx";
import './i18n.ts';

const theme = createTheme({
  palette: {
    primary: {
      main: "#007bff",
    },
    secondary: {
      main: "#6c757d",
    },
  },
  typography: {
    fontFamily: "Poppins, Roboto, sans-serif",
  },
});

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [employeeData, setEmployeeData] = useState<Employee | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuthStatus = () => {
      const accessToken = localStorage.getItem("access_token");
      const storedEmployeeData = localStorage.getItem("employeeData");

      // console.log("Проверка аутентификации:");
      // console.log("Access Token:", accessToken);
      console.log("Stored Employee Data:", storedEmployeeData);

      if (accessToken && storedEmployeeData) {
        setIsLoggedIn(true);
        setEmployeeData(JSON.parse(storedEmployeeData));
        console.log("Пользователь аутентифицирован");
      } else {
        console.log("Пользователь не аутентифицирован");
      }
      setIsLoading(false);
    };

    checkAuthStatus();
  }, []);

  const handleLoginSuccess = (employee: Employee) => {
    // console.log("Login successful:", employee);
    setIsLoggedIn(true);
    setEmployeeData(employee);
    localStorage.setItem("employeeData", JSON.stringify(employee));
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setEmployeeData(null);
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("employeeData");
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Box sx={{ height: "100vh"}}>
          <Routes>
            <Route path="/login" element={<LoginPage onLoginSuccess={handleLoginSuccess} />} />
            <Route
              path="/employee"
              element={
                isLoggedIn ? (
                  <DashboardPage employeeData={employeeData!} onLogout={handleLogout} />
                ) : (
                  <Navigate to="/login" />
                )
              }
            />
            <Route path="/admin/*" element={<AdminDashboard onLogout={handleLogout}/>} />
            <Route path="/qrscanner" element={<QRCodeScanner />} />
            <Route path="/bigTable" element={<BigTablePage />} />
            <Route path="/" element={<Navigate to="/login" />} />
            <Route path="*" element={<Navigate to="/login" />} />
          </Routes>
        </Box>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
