import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/lib/auth";
import NotFound from "@/pages/not-found";
import MainPage from "@/pages/MainPage";
import ArticlePage from "@/pages/ArticlePage";
import AllArticlesPage from "@/pages/AllArticlesPage";
import LoginPage from "@/pages/LoginPage";
import RegisterPage from "@/pages/RegisterPage";
import { ChatWidget } from "@/components/ChatWidget";

function Router() {
  return (
    <Switch>
      <Route path="/" component={MainPage} />
      <Route path="/article/:title" component={ArticlePage} />
      <Route path="/articles" component={AllArticlesPage} />
      <Route path="/categories" component={AllArticlesPage} />
      <Route path="/category/:name" component={AllArticlesPage} />
      <Route path="/random" component={ArticlePage} />
      <Route path="/recent" component={AllArticlesPage} />
      <Route path="/login" component={LoginPage} />
      <Route path="/register" component={RegisterPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
          <ChatWidget />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
