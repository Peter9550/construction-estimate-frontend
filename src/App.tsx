import { BrowserRouter, Route, Routes } from "react-router-dom";
import { FeedPage } from "./pages/FeedPage";
import CatalogPage from "./pages/CatalogPage";
import { ROUTES } from "./Routes";
import { AppLayout } from "./AppLayout";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path={ROUTES.CATALOG} element={<CatalogPage />} />
          <Route path={`${ROUTES.FEED}/:id`} element={<FeedPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
