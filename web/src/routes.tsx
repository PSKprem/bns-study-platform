import { createBrowserRouter } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Placeholder from "./pages/Placeholder";

export const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <Layout />,
      children: [
        { index: true, element: <Home /> },
        { path: "chapter/:id", element: <Placeholder title="Chapter" /> },
        { path: "section/:id", element: <Placeholder title="Section" /> },
        { path: "dictionary", element: <Placeholder title="Dictionary" /> },
        { path: "flashcards", element: <Placeholder title="Flashcards" /> },
        { path: "search", element: <Placeholder title="Search" /> },
        { path: "*", element: <Placeholder title="Page not found" /> },
      ],
    },
  ],
  {
    // Matches the Vite base path so routing works when hosted on GitHub Pages.
    basename: import.meta.env.BASE_URL,
  },
);
