import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  csvData: [],
  isDataLoaded: false,
  fileName: null,
  uploadedAt: null,
};

const csvDataSlice = createSlice({
  name: 'csvData',
  initialState,
  reducers: {
    setCsvData: (state, action) => {
      state.csvData = action.payload.data;
      state.fileName = action.payload.fileName;
      state.isDataLoaded = true;
      state.uploadedAt = new Date().toISOString();
    },
    clearCsvData: (state) => {
      state.csvData = [];
      state.isDataLoaded = false;
      state.fileName = null;
      state.uploadedAt = null;
    },
  },
});

export const { setCsvData, clearCsvData } = csvDataSlice.actions;
export default csvDataSlice.reducer;
