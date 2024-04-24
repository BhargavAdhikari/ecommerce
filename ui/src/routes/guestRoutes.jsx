import Login from "../pages/Login";
import Register from "../pages/Register";

const guestRoutes = [
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/login",
    element: <Login />,
  },
];

export default guestRoutes;
