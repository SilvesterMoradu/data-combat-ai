import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Layout from "./components/layout/Layout";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import NewProjectPage from "./pages/NewProjectPage";
import ProjectDetailsPage from "./pages/ProjectDetailsPage";
import { FirebaseAuthProvider } from "./components/auth/FirebaseAuthProvider"; // Updated import
import { ThemeProvider } from "./components/theme/ThemeProvider";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <FirebaseAuthProvider> {/* Updated provider */}
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route
                path="/"
                element={
                  <Layout>
                    <Dashboard />
                  </Layout>
                }
              />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route
                path="/new-project"
                element={
                  <Layout>
                    <NewProjectPage />
                  </Layout>
                }
              />
              <Route
                path="/projects/:id"
                element={
                  <Layout>
                    <ProjectDetailsPage />
                  </Layout>
                }
              />
              <Route
                path="/integrations"
                element={
                  <Layout>
                    <div className="flex items-center justify-center h-full text-2xl font-bold">Integrations Page</div>
                  </Layout>
                }
              />
              <Route
                path="/templates"
                element={
                  <Layout>
                    <div className="flex items-center justify-center h-full text-2xl font-bold">Templates Page</div>
                  </Layout>
                }
              />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </FirebaseAuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;