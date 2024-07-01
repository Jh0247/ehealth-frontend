import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { combineReducers } from 'redux';
import loadingTransform from './presist/loadingTransform';

import { axiosMiddleware } from './middleware/axiosMiddleware';
import { loadingMiddleware } from './middleware/loadingMiddleware';
import toastReducer from './features/toastSlice';
import loadingReducer from './features/loadingSlice';

import authReducer, { logout } from './features/authSlice';
import userReducer from './features/userSlice';
import collaborationReducer from './features/collaborationSlice';
import organizationReducer from './features/organizationSlice';
import appointmentReducer from './features/appointmentSlice';
import blogPostReducer from './features/blogpostSlice';
import healthcareProviderReducer from './features/healthcareProviderSlice';
import medicationReducer from './features/medicationSlice';
import purchaseReducer from './features/purchaseSlice';
import statisticsReducer from './features/statisticsSlice';

const reduxLogger = (store) => (next) => (action) => {
  console.log('Dispatching action:', action);
  const result = next(action);
  console.log('Next state:', store.getState());
  return result;
};

const persistConfig = {
  key: 'root',
  storage,
  transforms: [loadingTransform],
  blacklist: ['loading'],
};

const appReducer = combineReducers({
  toast: toastReducer,
  loading: loadingReducer,
  auth: authReducer,
  user: userReducer,
  collaboration: collaborationReducer,
  organization: organizationReducer,
  appointment: appointmentReducer,
  blogpost: blogPostReducer,
  healthcareProvider: healthcareProviderReducer,
  medication: medicationReducer,
  purchase: purchaseReducer,
  statistics: statisticsReducer,
});

const rootReducer = (state, action) => {
  if (action.type === logout.type) {
    storage.removeItem('persist:root');
    state = undefined;
  }
  return appReducer(state, action);
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(reduxLogger).concat(axiosMiddleware).concat(loadingMiddleware),
});

export const persistor = persistStore(store);
export default store;
