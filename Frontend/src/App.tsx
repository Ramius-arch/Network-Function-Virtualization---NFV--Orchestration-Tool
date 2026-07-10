import { useEffect } from 'react';
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
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import DashboardOverview from './pages/DashboardOverview';
import TopologyPage from './pages/TopologyPage';
import MonitoringPage from './pages/MonitoringPage';
import ProvisioningPage from './pages/ProvisioningPage';
import OperationsPage from './pages/OperationsPage';

const AppContent: React.FC = () => {
  const { token, login } = useAuth();
  const { startTutorial } = useTutorial();
  const navigate = useNavigate();

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

  // Public routes for logged-out visitors
  if (!token) {
    return (
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route 
          path="/login" 
          element={
            <div className="min-h-screen bg-background text-text flex flex-col items-center justify-center p-4">
              <Login onLoginSuccess={login} />
              <button 
                onClick={() => navigate('/register')} 
                className="mt-6 text-xs text-primary hover:underline font-mono uppercase tracking-widest"
              >
                Create a new account
              </button>
              <button 
                onClick={() => navigate('/')} 
                className="mt-4 text-xs text-text/40 hover:text-text font-mono uppercase tracking-widest"
              >
                Back to Story
              </button>
            </div>
          } 
        />
        <Route 
          path="/register" 
          element={
            <div className="min-h-screen bg-background text-text flex flex-col items-center justify-center p-4">
              <Register onRegisterSuccess={() => navigate('/login')} />
              <button 
                onClick={() => navigate('/login')} 
                className="mt-6 text-xs text-primary hover:underline font-mono uppercase tracking-widest"
              >
                Already have an account? Login
              </button>
              <button 
                onClick={() => navigate('/')} 
                className="mt-4 text-xs text-text/40 hover:text-text font-mono uppercase tracking-widest"
              >
                Back to Story
              </button>
            </div>
          } 
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    );
  }

  // Secure control plane routes for logged-in operators
  return (
    <div className="min-h-screen flex flex-col bg-background text-text transition-colors duration-300">
      <Navbar />
      <main className="flex-grow p-6 animate-fade-in container mx-auto">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/dashboard" element={<DashboardOverview />} />
          <Route path="/topology" element={<TopologyPage />} />
          <Route path="/monitoring" element={<MonitoringPage />} />
          <Route path="/provisioning" element={<ProvisioningPage />} />
          <Route path="/operations" element={<OperationsPage />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
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
