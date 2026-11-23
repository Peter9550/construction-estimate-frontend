import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { FeedPage } from "./pages/FeedPage";
import CatalogPage from "./pages/CatalogPage";
import { AddPage } from "./pages/AddPage";
import { LoginPage } from "./pages/LoginPage";
import { ROUTES } from "./Routes";
import { AppLayout } from "./AppLayout";

function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path={ROUTES.CATALOG} element={<CatalogPage />} />
          <Route path={ROUTES.FEED} element={<FeedPage />} />
          <Route path={`${ROUTES.FEED}/:id`} element={<FeedPage />} />
          <Route path={ROUTES.ADD} element={import.meta.env.MODE === "pages" ? <Navigate to={ROUTES.CATALOG} replace /> : <AddPage />} />
          <Route path={ROUTES.LOGIN} element={import.meta.env.MODE === "pages" ? <Navigate to={ROUTES.CATALOG} replace /> : <LoginPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
