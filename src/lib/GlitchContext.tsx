import {
  createContext,
  createSignal,
  useContext,
  type ParentComponent,
  type Accessor,
  onMount,
} from "solid-js";

type GlitchContextType = {
  isBrutalistMode: Accessor<boolean>;
  toggleBrutalistMode: () => void;
  isGlitching: Accessor<boolean>;
};

const GlitchContext = createContext<GlitchContextType>();

export const GlitchProvider: ParentComponent = (props) => {
  const [isBrutalistMode, setIsBrutalistMode] = createSignal(false);
  const [isGlitching, setIsGlitching] = createSignal(false);

  // Load state from localStorage on mount (client-side only)
  onMount(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("brutalist-mode");
      if (stored === "true") {
        setIsBrutalistMode(true);
      }
    }
  });

  const toggleBrutalistMode = () => {
    const newValue = !isBrutalistMode();
    setIsBrutalistMode(newValue);

    // Trigger glitch animation
    setIsGlitching(true);
    setTimeout(() => setIsGlitching(false), 600);

    // Persist to localStorage (client-side only)
    if (typeof window !== "undefined") {
      localStorage.setItem("brutalist-mode", String(newValue));
    }
  };

  const value: GlitchContextType = {
    isBrutalistMode,
    toggleBrutalistMode,
    isGlitching,
  };

  return (
    <GlitchContext.Provider value={value}>
      {props.children}
    </GlitchContext.Provider>
  );
};

export function useGlitch(): GlitchContextType {
  const context = useContext(GlitchContext);
  if (!context) {
    throw new Error("useGlitch must be used within a GlitchProvider");
  }
  return context;
}
