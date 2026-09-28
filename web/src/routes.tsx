import { lazy, Suspense } from "react";
import { createBrowserRouter } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";

// Route-level code splitting: each page becomes its own chunk, keeping the
// initial load small (tech-performance rules).
const ChapterPage = lazy(() => import("./pages/ChapterPage"));
const SectionPage = lazy(() => import("./pages/SectionPage"));
const DictionaryPage = lazy(() => import("./pages/DictionaryPage"));
const FlashcardsPage = lazy(() => import("./pages/FlashcardsPage"));
const SearchPage = lazy(() => import("./pages/SearchPage"));
const Placeholder = lazy(() => import("./pages/Placeholder"));

function Lazy({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<p className="text-sm text-slate-500">Loading…</p>}>
      {children}
    </Suspense>
  );
}

export const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <Layout />,
      children: [
        { index: true, element: <Home /> },
        {
          path: "chapter/:id",
          element: (
            <Lazy>
              <ChapterPage />
            </Lazy>
          ),
        },
        {
          path: "section/:id",
          element: (
            <Lazy>
              <SectionPage />
            </Lazy>
          ),
        },
        {
          path: "dictionary",
          element: (
            <Lazy>
              <DictionaryPage />
            </Lazy>
          ),
        },
        {
          path: "flashcards",
          element: (
            <Lazy>
              <FlashcardsPage />
            </Lazy>
          ),
        },
        {
          path: "search",
          element: (
            <Lazy>
              <SearchPage />
            </Lazy>
          ),
        },
        {
          path: "*",
          element: (
            <Lazy>
              <Placeholder title="Page not found" />
            </Lazy>
          ),
        },
      ],
    },
  ],
  {
    // Matches the Vite base path so routing works when hosted on GitHub Pages.
    basename: import.meta.env.BASE_URL,
  },
);
