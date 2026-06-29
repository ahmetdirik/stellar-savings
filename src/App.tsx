import { Routes, Route } from "react-router-dom";
import { WalletProvider } from "./context/WalletContext";
import { HomePage } from "./pages/HomePage";
import { GoalDetailPage } from "./pages/GoalDetailPage";
import { PublicGoalPage } from "./pages/PublicGoalPage";

export default function App() {
  return (
    <WalletProvider>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/goal/:id" element={<GoalDetailPage />} />
        <Route path="/goal/:id/public" element={<PublicGoalPage />} />
      </Routes>
    </WalletProvider>
  );
}
