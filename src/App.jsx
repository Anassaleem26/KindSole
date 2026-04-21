
import { createBrowserRouter } from 'react-router-dom';
import './App.css';
import { UserLayout, Signup, Login, AdminLayout } from './index.js';
import Home from './Pages/Home.jsx';
// import Admin from './Pages/Admin.jsx';
import AddProduct from './Admin/AdminPage.jsx/AddProduct.jsx';
import AdminDashboard from './Admin/AdminPage.jsx/AdminDashboard.jsx';
import AllProducts from './Admin/AllProducts.jsx';


let router = createBrowserRouter([

  // User panel routing

  {
    path: "/",
    element: <UserLayout />,
    children: [
      {
        path: "/",
        element: <Home />
      },
      {
        path: "/Signup",
        element: <Signup />
      },
      {
        path: "/Login",
        element: <Login />
      },


    ]
  },



// Admin panel routing
  {
    path: "/admin-dashboard",
    element: <AdminLayout />,
    children: [
      {
         path: "/admin-dashboard",
        element: <AdminDashboard />
      },
      {
         path: "add-products",
        element: <AddProduct />
      },
      {
         path: "products",
        element: <AllProducts />
      },
    ]
  },

])




export default router