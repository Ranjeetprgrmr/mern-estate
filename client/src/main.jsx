import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { store } from "./redux/store";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { persistor } from "./redux/store";
import { ToastContainer } from 'react-toastify';


createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <ToastContainer />
    <PersistGate loading={null} persistor={persistor}>
     <App />
    </PersistGate>
  </Provider>,
)
