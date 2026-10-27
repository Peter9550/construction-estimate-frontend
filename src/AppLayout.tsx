import { useState, type FC } from "react";
import { Outlet } from "react-router-dom";
import type { ConstructionWork } from "./modules/constructionWorksApi";
import { CONSTRUCTION_WORKS_MOCK } from "./modules/mock";
import { TabBar } from "./components/TabBar";
import "./MobileApp.css";

export interface AppOutletContext {
  cards: ConstructionWork[];
  setCards: (cards: ConstructionWork[]) => void;
}

export const AppLayout: FC = () => {
  const [cards, setCards] = useState<ConstructionWork[]>(CONSTRUCTION_WORKS_MOCK);

  return (
    <div className="appShell">
      <main className="appContent">
        <Outlet context={{ cards, setCards }} />
      </main>
      <TabBar cards={cards} />
    </div>
  );
};
