import { configureStore } from '@reduxjs/toolkit';
import csvDataReducer from './csvDataSlice';

const store = configureStore({
  reducer: {
    csvData: csvDataReducer,
  },
  devTools: true,
});

export default store;
