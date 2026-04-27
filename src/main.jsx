import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { RouterProvider } from 'react-router-dom'
import { Provider } from 'react-redux'
import { store } from './Store/store.js'
import router from './App.jsx'
import { Toaster } from 'sonner';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'


const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1
    }
  }
})

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* <BrowserRouter> */}
    <QueryClientProvider client={queryClient}>
      <Toaster position='top-right' richColors />

      <Provider store={store}>
        <RouterProvider router={router} />
      </Provider>
    </QueryClientProvider>
    {/* </BrowserRouter> */}

  </StrictMode>,
)
