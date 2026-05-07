import { useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AnimatePresence, motion } from "framer-motion";
import Layout from "./components/Layout";
import Index from "./pages/Index";
import Work from "./pages/Work";
import About from "./pages/About";
import Team from "./pages/Team";
import NotFound from "./pages/NotFound";
import { NavTransitionProvider, useNavTransition } from "./components/NavTransitionContext";
import SmoothScroll from "./components/SmoothScroll";

const queryClient = new QueryClient();

const pageTransition = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
  transition: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] },
};

const noPageTransition = {
  initial: false as const,
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 1, y: 0 },
  transition: { duration: 0 },
};

const AnimatedRoutes = () => {
  const location = useLocation();
  const { navTransitionActive } = useNavTransition();
  const transitionProps = navTransitionActive ? noPageTransition : pageTransition;

  useEffect(() => {
    const resetScroll = () => {
      window.__portfolioLenis?.scrollTo(0, { immediate: true });
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    };

    resetScroll();
    const frame = window.requestAnimationFrame(resetScroll);

    return () => {
      window.cancelAnimationFrame(frame);
    };
  }, [location.pathname]);

  return (
    <Layout>
      <AnimatePresence initial={false} mode="wait">
        <motion.div key={location.pathname} {...transitionProps}>
          <Routes location={location}>
            <Route path="/" element={<Index />} />
            <Route path="/work" element={<Work />} />
            <Route path="/about" element={<About />} />
            <Route path="/team" element={<Team />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </motion.div>
      </AnimatePresence>
    </Layout>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <SmoothScroll />
      <Toaster />
      <Sonner />
      <NavTransitionProvider>
        <BrowserRouter basename={import.meta.env.BASE_URL}>
          <AnimatedRoutes />
        </BrowserRouter>
      </NavTransitionProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
