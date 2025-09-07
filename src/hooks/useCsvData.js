import { useSelector, useDispatch } from 'react-redux';
import { setCsvData, clearCsvData } from '../store/csvDataSlice';

// Custom hook to manage CSV data
export const useCsvData = () => {
  const dispatch = useDispatch();
  const { csvData, isDataLoaded, fileName, uploadedAt } = useSelector(
    (state) => state.csvData
  );

  // Function to save CSV data to Redux store
  const saveCsvData = (data, fileName) => {
    dispatch(setCsvData({ data, fileName }));
  };

  // Function to clear CSV data from Redux store
  const removeCsvData = () => {
    dispatch(clearCsvData());
  };

  return {
    csvData,
    isDataLoaded,
    fileName,
    uploadedAt,
    saveCsvData,
    removeCsvData,
  };
};
