import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { GameProvider } from "./contexts/GameContext.tsx";
import { NpcProvider } from "./contexts/NpcContext";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <NpcProvider>
      <GameProvider>
        <App />
      </GameProvider>
    </NpcProvider>
  </StrictMode>
);
