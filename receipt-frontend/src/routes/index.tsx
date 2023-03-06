import { createBrowserRouter } from "react-router-dom";
import App from "../components/App";

const routes = createBrowserRouter([
  {
    path: "/",
    element: <App />
  },
  // {
  //   path: "/receipts",
  //   element: <ViewReceiptsPage />
  // }
]);

export default routes;