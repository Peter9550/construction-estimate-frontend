import "./TabBar.css";
import type { FC } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { LOGOUT_LABEL, ROUTES, ROUTE_LABELS } from "../Routes";
import { useAppDispatch, useAppSelector } from "../store";
import { resetUser } from "../slices/userSlice";
import { resetPriceLimit } from "../slices/constructionWorksSlice";

export const TabBar: FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector((state) => state.user.isAuthenticated);
  const feedWork = useAppSelector((state) => state.constructionWorks.feedWork);
  const works = useAppSelector((state) => state.constructionWorks.works);

  const isFeed = location.pathname.startsWith(ROUTES.FEED);
  const isCatalog = location.pathname === ROUTES.CATALOG;
  const isAdd = location.pathname === ROUTES.ADD;
  const isLogin = location.pathname === ROUTES.LOGIN;

  const goToFeed = () => {
    const workId = feedWork?.id ?? works[0]?.id;
    navigate(workId ? `${ROUTES.FEED}/${workId}` : ROUTES.FEED);
  };

  const handleLogout = async () => {
    try {
      await axios.post("/api/users/logout");
    } finally {
      dispatch(resetUser());
      dispatch(resetPriceLimit());
      navigate(ROUTES.CATALOG);
    }
  };

  return (
    <nav className="tabBar">
      <button
        type="button"
        className={`tabBarItem ${isFeed ? "tabBarItemActive" : ""}`}
        onClick={goToFeed}
      >
        {ROUTE_LABELS.FEED}
      </button>
      <button
        type="button"
        className={`tabBarItem ${isAdd ? "tabBarItemActive" : ""}`}
        disabled={!isAuthenticated}
        onClick={() => navigate(ROUTES.ADD)}
      >
        {ROUTE_LABELS.ADD}
      </button>
      <button
        type="button"
        className={`tabBarItem ${isCatalog ? "tabBarItemActive" : ""}`}
        onClick={() => navigate(ROUTES.CATALOG)}
      >
        {ROUTE_LABELS.CATALOG}
      </button>
      {isAuthenticated ? (
        <button type="button" className="tabBarItem" onClick={handleLogout}>
          {LOGOUT_LABEL}
        </button>
      ) : (
        <button
          type="button"
          className={`tabBarItem ${isLogin ? "tabBarItemActive" : ""}`}
          onClick={() => navigate(ROUTES.LOGIN)}
        >
          {ROUTE_LABELS.LOGIN}
        </button>
      )}
    </nav>
  );
};
