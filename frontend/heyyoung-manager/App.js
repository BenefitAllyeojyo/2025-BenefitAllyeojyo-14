import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import IndexPage from './pages/IndexPage';
import BranchSelectPage from './pages/BranchSelectPage';
import PaymentPage from './pages/PaymentPage';
import DashboardPage from './pages/DashboardPage';
import SchoolDashboardPage from './pages/SchoolDashboardPage';

export default function App() {
  const [currentPage, setCurrentPage] = useState('index');
  const [navigationParams, setNavigationParams] = useState({});

  const navigation = {
    navigate: (pageName, params) => {
      setCurrentPage(pageName);
      setNavigationParams(params || {});
    },
    goBack: () => setCurrentPage('index')
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'index':
        return <IndexPage navigation={navigation} />;
      case 'BranchSelect':
        return <BranchSelectPage navigation={navigation} />;
      case 'Payment':
        return <PaymentPage navigation={navigation} route={{ params: navigationParams }} />;
      case 'Dashboard':
        return <DashboardPage navigation={navigation} />;
      case 'SchoolDashboard':
        return <SchoolDashboardPage navigation={navigation} />;
      default:
        return <IndexPage navigation={navigation} />;
    }
  };

  return (
    <>
      <StatusBar style="auto" />
      {renderPage()}
    </>
  );
}