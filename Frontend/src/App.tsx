import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Login from './components/Login';
import Register from './components/Register';
import { useAuth } from './context/AuthContext';
import { TutorialProvider, useTutorial } from './context/TutorialContext';
import { AccessibilityProvider } from './context/AccessibilityContext';
import { EnvironmentProvider } from './context/EnvironmentContext';
import TutorialOverlay from './components/TutorialOverlay';
import AtomicMascot from './components/AtomicMascot';
import AccessibilityPanel from './components/AccessibilityPanel';
import FeedbackButton from './components/FeedbackButton';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import DashboardOverview from './pages/DashboardOverview';
import TopologyPage from './pages/TopologyPage';
import MonitoringPage from './pages/MonitoringPage';
import ProvisioningPage from './pages/ProvisioningPage';
import OperationsPage from './pages/OperationsPage';

const AppContent: React.FC = () => {
  const { token, login } = useAuth();
  const [isRegistering, setIsRegistering] = useState(true);
  const { startTutorial } = useTutorial();

  useEffect(() => {
    if (token) {
      startTutorial([
        {
          id: 'welcome',
          title: 'Atomic Platform',
          description: 'Welcome to the evolved multi-page orchestration environment. Each operational domain now has its own dedicated space.',
          targetSelector: 'body',
          position: 'bottom',
        },
        {
          id: 'nav',
          title: 'Platform Navigation',
          description: 'Use the new expanded navbar to jump between Topology, Monitoring, and Operations.',
          targetSelector: 'nav',
          position: 'bottom',
        },
        {
          id: 'mascot',
          title: 'Constant Support',
          description: "I'll follow you across pages to provide context-aware tips!",
          targetSelector: '.fixed.bottom-4.right-4',
          position: 'left',
        }
      ]);
    }
  }, [token, startTutorial]);

  if (!token) {
    return (
      <div className="min-h-screen bg-background text-text flex flex-col items-center justify-center">
        {isRegistering ? (
          <Register onRegisterSuccess={() => setIsRegistering(false)} />
        ) : (
          <Login onLoginSuccess={login} />
        )}
        <button onClick={() => setIsRegistering(!isRegistering)} className="mt-4 text-primary hover:text-secondary hover-scale transition-all">
          {isRegistering ? 'Already have an account? Login' : "Don't have an account? Register"}
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background text-text transition-colors duration-300">
      <Navbar />
      <main className="flex-grow p-6 animate-fade-in container mx-auto">
        <Routes>
          <Route path="/" element={<DashboardOverview />} />
          <Route path="/topology" element={<TopologyPage />} />
          <Route path="/monitoring" element={<MonitoringPage />} />
          <Route path="/provisioning" element={<ProvisioningPage />} />
          <Route path="/operations" element={<OperationsPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <AtomicMascot />
      <AccessibilityPanel />
      <FeedbackButton />
      <TutorialOverlay />
    </div>
  );
};

function App() {
  return (
    <AccessibilityProvider>
      <EnvironmentProvider>
        <TutorialProvider>
          <BrowserRouter>
            <AppContent />
          </BrowserRouter>
        </TutorialProvider>
      </EnvironmentProvider>
    </AccessibilityProvider>
  );
}

export default App;
