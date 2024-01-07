
import React, {useState} from 'react';
import Home from "./Components/Home";
import Dasboard from "./Components/Dashboard"
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import DynamicForm from './Components/test';



const App = () => {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Home/>,
    },
    {
      path: "/dashboard",
      element: <Dasboard/>,
    },
    {
      path: "/test",
      element: <DynamicForm/>,
    },
  ]);


  return(
<React.StrictMode >
    <RouterProvider router={router} />
  

    </React.StrictMode>
  
  );

}

export default App;
