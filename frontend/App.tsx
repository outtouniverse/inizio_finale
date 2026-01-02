import React, { useState, useEffect, Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useParams, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import QuotaModal from './components/ui/QuotaModal';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { IdeaContext, Project, AppSettings } from './types';
import { StorageService } from './services/storageService';
import { projectService } from './services/projectService';

// Lazy load all route components for better performance
const BootSequence = lazy(() => import('./components/intro/BootSequence'));
const Login = lazy(() => import('./components/intro/Login'));
const IdeaVault = lazy(() => import('./components/IdeaVault'));
const EntryScreen = lazy(() => import('./components/EntryScreen'));
const AgentWorkspace = lazy(() => import('./components/AgentWorkspace'));
const ProfileView = lazy(() => import('./components/ProfileView'));
const SettingsView = lazy(() => import('./components/SettingsView'));

// Loading component for Suspense fallback
const LoadingSpinner: React.FC = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
  </div>
);

// Default error fallback component
const DefaultErrorFallback: React.FC<{ error: Error }> = ({ error }) => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="text-center">
      <h2 className="text-2xl font-bold text-red-600 mb-4">Something went wrong</h2>
      <p className="text-gray-600 mb-4">{error.message}</p>
      <button
        onClick={() => window.location.reload()}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Reload Page
      </button>
    </div>
  </div>
);

// Error boundary component (functional approach)
const ErrorBoundary: React.FC<{
  children: React.ReactNode;
  fallback?: React.ComponentType<{ error: Error }>;
}> = ({ children, fallback: FallbackComponent = DefaultErrorFallback }) => {
  const [hasError, setHasError] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      console.error('Route error:', event.error);
      setHasError(true);
      setError(event.error);
      event.preventDefault();
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      console.error('Unhandled promise rejection:', event.reason);
      setHasError(true);
      setError(new Error(event.reason?.message || 'Unhandled promise rejection'));
      event.preventDefault();
    };

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, []);

  if (hasError && error) {
    return <FallbackComponent error={error} />;
  }

  return <>{children}</>;
};

// Protected Route component
const ProtectedRoute: React.FC<{
  children: React.ReactNode;
  redirectTo?: string;
}> = ({ children, redirectTo = '/auth' }) => {
  const { isAuthenticated, isLoading } = useAuth();

  // Show loading while checking authentication
  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  return <>{children}</>;
};

// Route wrapper with error handling and loading states
const RouteWrapper: React.FC<{
  children: React.ReactNode;
  showNav?: boolean;
  onNavClick?: (dest: string) => void;
  settings?: AppSettings;
}> = ({ children, showNav = false, onNavClick, settings }) => (
  <ErrorBoundary>
    <Layout showNav={showNav} onNavClick={onNavClick} settings={settings}>
      <Suspense fallback={<LoadingSpinner />}>
        {children}
      </Suspense>
    </Layout>
  </ErrorBoundary>
);

// Workspace route with proper validation
const WorkspaceRoute: React.FC<{
  projects: Project[];
  setProjects: (projects: Project[]) => void;
  onNavClick: (dest: string) => void;
  settings: AppSettings;
}> = ({ projects, setProjects, onNavClick, settings }) => {
  const navigate = useNavigate();
  const { projectId } = useParams<{ projectId: string }>();

  // Validate projectId format and existence
  if (!projectId) {
    console.warn('Project ID is required');
    return <Navigate to="/vault" replace />;
  }

  const project = projects.find(p => p._id === projectId || p.id === projectId);

  if (!project) {
    console.warn('Project not found:', projectId);
    return <Navigate to="/vault" replace />;
  }

  const activeIdea: IdeaContext = {
    rawInput: project.pitch,
    description: project.pitch,
    industry: project.industry || (project.tags && project.tags.length > 0 ? project.tags[0] : 'Tech'),
    stage: project.stage || 'BUILDING',
    userGoal: project.userGoal || 'Unknown',
    constraints: project.constraints || 'Unknown'
  };

  const handleReset = async () => {
    try {
      navigate('/vault');
      // Refresh projects from backend
      const refreshedProjects = await projectService.getProjects();
      setProjects(refreshedProjects);
    } catch (error) {
      console.error('Error resetting workspace:', error);
      navigate('/vault');
    }
  };

  return (
    <ErrorBoundary>
      <Layout showNav={true} onNavClick={onNavClick} settings={settings}>
        <Suspense fallback={<LoadingSpinner />}>
          <AgentWorkspace
            idea={activeIdea}
            projectId={projectId}
            onReset={handleReset}
          />
        </Suspense>
      </Layout>
    </ErrorBoundary>
  );
};

// 404 Not Found component
const NotFound: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-blue-400 mb-4">404</h1>
        <h2 className="text-2xl font-semibold mb-4">Page Not Found</h2>
        <p className="text-gray-400 mb-8">The page you're looking for doesn't exist.</p>
        <button
          onClick={() => navigate('/vault')}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition-colors"
        >
          Go to Vault
        </button>
      </div>
    </div>
  );
};

// Main App component with routing logic
const AppContent: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [settings, setSettings] = useState<AppSettings>(() => {
    try {
      return StorageService.getSettings();
    } catch (error) {
      console.error('Error loading settings:', error);
      return {} as AppSettings;
    }
  });
  const [quotaModalOpen, setQuotaModalOpen] = useState(false);
  const [projectsLoading, setProjectsLoading] = useState(false);
  const [projectsError, setProjectsError] = useState<string | null>(null);

  // Load projects from backend when authentication state changes
  useEffect(() => {
    const loadProjects = async () => {
      if (isAuthenticated) {
        setProjectsLoading(true);
        setProjectsError(null);
        try {
          const fetchedProjects = await projectService.getProjects();
          setProjects(fetchedProjects);
        } catch (error) {
          console.error('Error loading projects:', error);
          setProjectsError(error instanceof Error ? error.message : 'Failed to load projects');
          setProjects([]);
        } finally {
          setProjectsLoading(false);
        }
      } else {
        setProjects([]);
        setProjectsError(null);
        setProjectsLoading(false);
      }
    };

    loadProjects();
  }, [isAuthenticated]);

  // Setup quota error listener
  useEffect(() => {
    const handleQuotaError = () => setQuotaModalOpen(true);
    window.addEventListener('inizio-quota-error', handleQuotaError);

    return () => {
      window.removeEventListener('inizio-quota-error', handleQuotaError);
    };
  }, []);

  const handleSettingsSave = (newSettings: AppSettings) => {
    try {
      setSettings(newSettings);
      StorageService.saveSettings(newSettings);
    } catch (error) {
      console.error('Error saving settings:', error);
    }
  };

  const handleBootComplete = () => navigate('/auth');

  const handleAuthComplete = () => {
    navigate('/vault');
  };

  const handleNewIdea = () => navigate('/entry');

  const handleIdeaStart = async (context: IdeaContext) => {
    try {
      const newProject = await projectService.createProject(context);
      setProjects(prev => [newProject, ...prev]);
      navigate(`/workspace/${newProject.id || newProject._id}`);
    } catch (error) {
      console.error('Error creating project:', error);
      alert('Failed to create project. Please try again.');
    }
  };

  const handleOpenProject = (id: string) => {
    navigate(`/workspace/${id}`);
  };

  const handleLogout = async () => {
    try {
      await logout();
      setProjects([]);
      navigate('/auth');
    } catch (error) {
      console.error('Logout error:', error);
      setProjects([]);
      navigate('/auth');
    }
  };

  const handleNav = (dest: string) => {
    switch (dest) {
      case 'VAULT':
        navigate('/vault');
        break;
      case 'PROFILE':
        navigate('/profile');
        break;
      case 'SETTINGS':
        navigate('/settings');
        break;
      case 'LOGOUT':
        handleLogout();
        break;
      default:
        console.warn('Unknown navigation destination:', dest);
    }
  };

  return (
    <>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={
          <ErrorBoundary>
            <Suspense fallback={<LoadingSpinner />}>
              <BootSequence onComplete={handleBootComplete} />
            </Suspense>
          </ErrorBoundary>
        } />

        <Route path="/auth" element={
          <RouteWrapper settings={settings}>
            <Login onComplete={handleAuthComplete} />
          </RouteWrapper>
        } />

        {/* Protected routes - require authentication */}
        <Route path="/vault" element={
          <ProtectedRoute>
            <RouteWrapper showNav={true} onNavClick={handleNav} settings={settings}>
              {projectsLoading ? (
                <div className="flex items-center justify-center min-h-[400px]">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                    <p className="text-gray-400">Loading your projects...</p>
                  </div>
                </div>
              ) : projectsError ? (
                <div className="flex items-center justify-center min-h-[400px]">
                  <div className="text-center">
                    <h3 className="text-xl font-semibold text-red-400 mb-2">Failed to load projects</h3>
                    <p className="text-gray-400 mb-4">{projectsError}</p>
                    <button
                      onClick={() => window.location.reload()}
                      className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded transition-colors"
                    >
                      Retry
                    </button>
                  </div>
                </div>
              ) : (
                <IdeaVault onSelect={handleOpenProject} onNew={handleNewIdea} projects={projects} />
              )}
            </RouteWrapper>
          </ProtectedRoute>
        } />

        <Route path="/entry" element={
          <ProtectedRoute>
            <RouteWrapper showNav={true} onNavClick={handleNav} settings={settings}>
              <EntryScreen onStart={handleIdeaStart} onCancel={() => navigate('/vault')} />
            </RouteWrapper>
          </ProtectedRoute>
        } />

        <Route path="/workspace/:projectId" element={
          <ProtectedRoute>
            <WorkspaceRoute
              projects={projects}
              setProjects={setProjects}
              onNavClick={handleNav}
              settings={settings}
            />
          </ProtectedRoute>
        } />

        <Route path="/profile" element={
          <ProtectedRoute>
            <RouteWrapper showNav={true} onNavClick={handleNav} settings={settings}>
              <ProfileView onClose={() => navigate('/vault')} />
            </RouteWrapper>
          </ProtectedRoute>
        } />

        <Route path="/settings" element={
          <ProtectedRoute>
            <RouteWrapper showNav={true} onNavClick={handleNav} settings={settings}>
              <SettingsView onClose={() => navigate('/vault')} settings={settings} onSave={handleSettingsSave} />
            </RouteWrapper>
          </ProtectedRoute>
        } />

        {/* 404 catch-all route */}
        <Route path="*" element={<NotFound />} />
      </Routes>

      {/* Global quota modal */}
      <QuotaModal isOpen={quotaModalOpen} onClose={() => setQuotaModalOpen(false)} />
    </>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
};

export default App;