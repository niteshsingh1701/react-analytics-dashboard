import { configureStore } from '@reduxjs/toolkit';
import csvDataReducer from './csvDataSlice';

const store = configureStore({
  reducer: {
    csvData: csvDataReducer,
  },
  // Enable Redux DevTools in development
  devTools: true,
});

export default store;
