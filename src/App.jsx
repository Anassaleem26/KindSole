
import { createBrowserRouter } from 'react-router-dom';
import './App.css';
import { UserLayout, Signup, Login, AdminLayout } from './index.js';
import Home from './Pages/Home.jsx';
// import Admin from './Pages/Admin.jsx';
import AddProduct from './Admin/AdminPage.jsx/AddProduct.jsx';
import AdminDashboard from './Admin/AdminPage.jsx/AdminDashboard.jsx';
import AllProducts from './Admin/Products handle/AllProducts.jsx';
import EditProduct from './Admin/AdminPage.jsx/EditProduct.jsx';
import MenSectionPage from './Pages/MenSectionPage.jsx';
import WomenSectionPage from './Pages/WomenSectionPage.jsx';
import SaleSectionPage from './Pages/SaleSectionPage.jsx';
import MenSalePage from './Pages/MenSalePage.jsx';
import WomenSalePage from './Pages/WomenSalePage.jsx';
import SearchPage from './Pages/SearchPage.jsx';
import ProductDetailView from './Pages/ProductDetailView.jsx';
import CheckOut from './Pages/CheckOut.jsx'
import OrderSuccess from './Pages/OrderSuccess.jsx';
import Account from './Components/Account/Account.jsx';
import HelpPage from './Pages/HelpPage.jsx';
import AboutPage from './Pages/AboutPage.jsx';
import SalesAnalytics from './Admin/AdminPage.jsx/SalesAnalytics.jsx';




import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { firebaseConfig } from '../src/lib/fireBaseConfig.js'


const stripePromise = loadStripe(firebaseConfig.stripePublicKey);

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

      {
        path: "/mensection",
        element: <MenSectionPage />
      },

      {
        path: "/womensection",
        element: <WomenSectionPage />
      },

      {
        path: "/salesection",
        element: <SaleSectionPage />
      },

      {
        path: "/salesection/mensale",
        element: <MenSalePage />
      },


      {
        path: "/salesection/women",
        element: <WomenSalePage />
      },


      {
        path: "/search",
        element: <SearchPage />
      },

      {
        path: "/product/:productId",
        element: <ProductDetailView />
      },

      {
        path: "/checkout",
        element: (
          <Elements stripe={stripePromise}>
            <CheckOut />
          </Elements>
        )
      },

      {
        path: "/order-success",
        element: <OrderSuccess />
      },

      {
        path: "/account",
        element: <Account />
      },
      {
        path: "/help",
        element: <HelpPage />
      },
      {
        path: "/about",
        element: <AboutPage />
      },


    ]
  },



  // Admin panel routing
  {
    path: "/admin-dashboard",
    element: <AdminLayout />,
    children: [
      {
        index: true,
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
      {
        path: "edit-product/:id",
        element: <EditProduct />
      },
      {
      path: "sales-analytics",
      element: <SalesAnalytics /> 
    }
    ]
  },

])




export default router