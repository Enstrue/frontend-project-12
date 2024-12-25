import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from './store/index.js';
import App from './App';
import 'bootstrap/dist/css/bootstrap.min.css';
import './locales/i18n.js';

const root = document.getElementById('root');
const rootInstance = createRoot(root);

rootInstance.render(
  <Provider store={store}>
    <App />
  </Provider>
);
