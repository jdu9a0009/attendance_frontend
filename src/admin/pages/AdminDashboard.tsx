import React, { useState, useEffect } from "react";
import "../../shared/styles/App.css";
import DashboardContent from "./AdminDashboardContent";
import { Grid, Button, Select, MenuItem, SelectChangeEvent } from "@mui/material";
import { Routes, Route, useNavigate } from "react-router-dom";
import DepartmentPositionManagement from "./DepartmentPositionManagement";
import EmployeeListPage from "./EmployeeListPage";
import CompanySettingsPage from "./CompanySettingsPage";
import SideMenu from "../components/SideMenu";
import { useTranslation } from "react-i18next";
import axiosInstance, { fetchCompanySettings, updateCompanySettings } from '../../utils/libs/axios';

interface AdminDashboardProps {
  onLogout: () => void;
}

function AdminDashboard({ onLogout }: AdminDashboardProps) {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation(['admin', 'common']);
  const [language, setLanguage] = useState(i18n.language);
  const [companyName, setCompanyName] = useState<string>("");

  useEffect(() => {
    const getCompanyInfo = async () => {
      try {
        const data = await fetchCompanySettings();
        console.log("Company data:", data);
        setCompanyName(data.results.company_name || "");
        console.log("Company name set to:", data.results.company_name);
      } catch (error) {
        console.error("Ошибка при получении информации о компании:", error);
      }
    };

    getCompanyInfo();
  }, []);
    

  const handleLogoutClick = () => {
    onLogout();
    navigate("/login");
  };

  const handleLanguageChange = (event: SelectChangeEvent<string>) => {
    const newLanguage = event.target.value;
    i18n.changeLanguage(newLanguage);
    setLanguage(newLanguage);
  };

  return (
    <div className="Container">
      <div className="Slayout">
        <div className="Ssidebar">
          <SideMenu />
        </div>
      </div>
      <div className="App">
        <header className="App-header">
          <h1 className="Logo">{companyName || "○○○"}</h1>
          <div className="User-info" style={{ display: "flex", alignItems: "center" }}>
            <Select
              value={language}
              onChange={handleLanguageChange}
              sx={{
                marginRight: "10px",
                color: "white",
                borderColor: "white",
                backgroundColor: "#105E82",
                height: "40px",
                width: "120px",
                fontSize: "0.875rem",
                padding: "0 10px"
              }}
            >
              <MenuItem value="ja">{t('common:japanese')}</MenuItem>
              <MenuItem value="en">{t('common:english')}</MenuItem>
            </Select>
            <Button
              variant="contained"
              sx={{
                backgroundColor: "#105E82",
                ":hover": { backgroundColor: "#919191", color: "black" },
                height: "40px"
              }}
              onClick={handleLogoutClick}
            >
              {t('logout')}
            </Button>
          </div>
        </header>
        <Grid container>
          <div className="Dashboard">
            <Routes>
              <Route path="/" element={<DashboardContent />} />
              <Route path="/department-and-position" element={<DepartmentPositionManagement />} />
              <Route path="/employee-edit" element={<EmployeeListPage />} />
              <Route path="/company-settings" element={<CompanySettingsPage />} />
            </Routes>
          </div>
        </Grid>
      </div>
    </div>
  );
}

export default AdminDashboard;
