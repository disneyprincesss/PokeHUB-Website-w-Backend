import { StrictMode } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import HomePage from "./pages/home";
import LibraryPage from "./pages/library";
import BattlePage from "./pages/battle";

function App() {
  const route = createBrowserRouter([
    {
      path: "/",
      element: <HomePage />,
    },
    {
      path: "/library",
      element: <LibraryPage />,
    },
    {
      path: "/battle",
      element: <BattlePage />,
    },
    {
      path: "/library/edit",
      element: <LibraryPage />,
    },
  ]);

  return (
    <StrictMode>
      <RouterProvider router={route} />
    </StrictMode>
  );
}

export default App;
