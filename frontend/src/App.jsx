import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import LoginPage from "./pages/LoginPage";

const router = createBrowserRouter([
  {
    path: "/login",
    element: <LoginPage />,
  },
]);

function App() {
  return (
    <React.Fragment>
      <RouterProvider router={router} />
    </React.Fragment>
  );
}

export default App;
