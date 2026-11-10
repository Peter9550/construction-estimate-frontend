import type { FC } from "react";
import { Outlet } from "react-router-dom";
import { TabBar } from "./components/TabBar";
import { LoadingOverlay } from "./components/LoadingOverlay";
import { useAppSelector } from "./store";
import "./MobileApp.css";

export const AppLayout: FC = () => {
  const loading = useAppSelector((state) => state.constructionWorks.loading);

  return (
    <div className="appShell">
      <main className="appContent">
        <Outlet />
      </main>
      <TabBar />
      {loading && <LoadingOverlay />}
    </div>
  );
};
