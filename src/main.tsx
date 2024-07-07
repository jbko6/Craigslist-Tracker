import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './pages/App.tsx'
import './index.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Trackers from './pages/trackers/Trackers.tsx'
import ItemDetails from './pages/trackers/ItemDetails.tsx'
import { getConfig, getItem, getItems, getStatus } from './api.tsx'
import CreateItemPopup from './pages/trackers/CreateItemPopup.tsx'
import StatusView from './pages/status/StatusView.tsx'
import ModifyItemPopup from './pages/trackers/ModifyItemPopup.tsx'
import ModifyConfigPopup from './pages/status/ModifyConfigPopup.tsx'

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <Trackers></Trackers>,
        loader: getItems,
        children: [
          {
            path: "/create",
            element: <CreateItemPopup></CreateItemPopup>
          },
          {
            path: "/modify/:itemId",
            element: <ModifyItemPopup></ModifyItemPopup>,
            loader: getItem
          }
        ]
      },
      {
        path: "/item/:itemId",
        element: <ItemDetails></ItemDetails>,
        loader: getItem
      },
      {
        path: "/status/",
        element: <StatusView></StatusView>,
        loader: getStatus,
        children: [
          {
            path: "/status/modify",
            element: <ModifyConfigPopup></ModifyConfigPopup>,
            loader: getConfig
          }
        ]
      }
    ]
  }
])

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router}/>
  </React.StrictMode>,
)
