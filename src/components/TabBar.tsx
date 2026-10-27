import "./TabBar.css";
import type { FC } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ROUTES, ROUTE_LABELS } from "../Routes";
import type { ConstructionWork } from "../modules/constructionWorksApi";

interface Props {
  cards: ConstructionWork[];
}

export const TabBar: FC<Props> = ({ cards }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const isFeed = location.pathname.startsWith(ROUTES.FEED);
  const isCatalog = location.pathname === ROUTES.CATALOG;

  const goToFeed = () => {
    const firstId = cards[0]?.id;
    if (firstId) {
      navigate(`${ROUTES.FEED}/${firstId}`);
    }
  };

  const goToCatalog = () => navigate(ROUTES.CATALOG);

  return (
    <nav className="tabBar">
      <button
        type="button"
        className={`tabBarItem ${isFeed ? "tabBarItemActive" : ""}`}
        onClick={goToFeed}
      >
        {ROUTE_LABELS.FEED}
      </button>
      <button type="button" className="tabBarItem" disabled>
        {ROUTE_LABELS.ADD}
      </button>
      <button
        type="button"
        className={`tabBarItem ${isCatalog ? "tabBarItemActive" : ""}`}
        onClick={goToCatalog}
      >
        {ROUTE_LABELS.CATALOG}
      </button>
      <button type="button" className="tabBarItem" disabled>
        {ROUTE_LABELS.LOGIN}
      </button>
    </nav>
  );
};
