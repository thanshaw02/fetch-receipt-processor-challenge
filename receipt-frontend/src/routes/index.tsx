import { createBrowserRouter } from "react-router-dom";
import App from "../components/App";
import ViewReceiptsPage from "../components/ViewReceiptsPage";

const routes = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/receipts",
    element: <ViewReceiptsPage />,
  },
]);

export default routes;
