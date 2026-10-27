export const ROUTES = {
  FEED: "/feed",
  ADD: "/add",
  CATALOG: "/",
  LOGIN: "/login",
};
export type RouteKeyType = keyof typeof ROUTES;
export const ROUTE_LABELS: { [key in RouteKeyType]: string } = {
  FEED: "Лента",
  ADD: "Добавление",
  CATALOG: "Плитка",
  LOGIN: "Вход",
};
