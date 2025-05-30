import { Route, Switch, useLocation } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect } from "react";
import { ThemeProvider } from "./components/theme-provider";
import { Toaster } from "./components/ui/toaster";
import { getAuthToken } from "./lib/auth";
import Home from "./pages/home";
import CaseStudy from "./pages/case-study";
import NotFound from "./pages/not-found";
import AdminLogin from "./pages/admin/login";
import AdminDashboard from "./pages/admin/dashboard";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function AdminRoute({ component: Component }: { component: any }) {
  const [, setLocation] = useLocation();

  useEffect(() => {
    const token = getAuthToken();
    if (!token) {
      setLocation("/admin");
    }
  }, [setLocation]);

  return <Component />;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="dark" storageKey="portfolio-theme">
        <div className="min-h-screen bg-background font-sans antialiased">
          <Switch>
            <Route path="/" component={Home} />
            <Route path="/case-studies/:slug" component={CaseStudy} />
            <Route path="/admin" component={AdminLogin} />
            <Route path="/admin/dashboard">
              <AdminRoute component={AdminDashboard} />
            </Route>
            <Route component={NotFound} />
          </Switch>
        </div>
        <Toaster />
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;