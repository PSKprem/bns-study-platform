import { createBrowserRouter } from "react-router-dom";
import Layout from "./components/Layout";
import RouteLoading from "./components/RouteLoading";
import Home from "./pages/Home";

// Route-level code splitting via React Router's `lazy`: each page is its own
// chunk, loaded only when the route is visited (tech-performance rules).
const page = (load: () => Promise<{ default: React.ComponentType }>) => async () => ({
  Component: (await load()).default,
});

export const router = createBrowserRouter(
  [
    {
      path: "/",
      Component: Layout,
      HydrateFallback: RouteLoading,
      children: [
        { index: true, Component: Home },
        { path: "chapter/:id", lazy: page(() => import("./pages/ChapterPage")) },
        { path: "section/:id", lazy: page(() => import("./pages/SectionPage")) },
        { path: "dictionary", lazy: page(() => import("./pages/DictionaryPage")) },
        { path: "search", lazy: page(() => import("./pages/SearchPage")) },
        { path: "about", lazy: page(() => import("./pages/AboutPage")) },
        { path: "*", lazy: page(() => import("./pages/NotFound")) },
      ],
    },
  ],
  {
    // Matches the Vite base path so routing works when hosted on GitHub Pages.
    basename: import.meta.env.BASE_URL,
  },
);
