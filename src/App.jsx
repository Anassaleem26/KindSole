
import { createBrowserRouter } from 'react-router-dom';
import './App.css';
import { Layout, Signup, Login } from './index.js';
import Home from './Pages/Home.jsx';

let router = createBrowserRouter([

  {
    path: "/",
    element: <Layout />,
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
  }

])




export default router