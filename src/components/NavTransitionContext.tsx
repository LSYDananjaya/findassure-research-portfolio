import { createContext, useContext, useMemo, useState, type ReactNode } from "react";

type NavTransitionContextValue = {
  navTransitionActive: boolean;
  setNavTransitionActive: (active: boolean) => void;
};

const NavTransitionContext = createContext<NavTransitionContextValue | null>(null);

export const NavTransitionProvider = ({ children }: { children: ReactNode }) => {
  const [navTransitionActive, setNavTransitionActive] = useState(false);

  const value = useMemo(
    () => ({
      navTransitionActive,
      setNavTransitionActive,
    }),
    [navTransitionActive]
  );

  return (
    <NavTransitionContext.Provider value={value}>
      {children}
    </NavTransitionContext.Provider>
  );
};

export const useNavTransition = () => {
  const context = useContext(NavTransitionContext);

  if (!context) {
    throw new Error("useNavTransition must be used within a NavTransitionProvider");
  }

  return context;
};
