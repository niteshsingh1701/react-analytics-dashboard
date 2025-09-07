import React, { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import Papa from "papaparse";
import * as XLSX from "xlsx";
import { useNavigate } from "react-router-dom";
import { useCsvData } from "../../hooks/useCsvData";

// Required columns for validation (moved outside component to avoid re-creation)
const REQUIRED_COLUMNS = [
  "Product Name",
  "Sales",
  "Profit",
  "TE",
  "Credit",
  "Amazon Fee",
  "Profit Percentage",
];

const FileUpload = () => {
  const [uploadStatus, setUploadStatus] = useState("idle");
  const [error, setError] = useState("");
  const [parsedData, setParsedData] = useState(null);
  const [fileName, setFileName] = useState("");
  const navigate = useNavigate();
  const { saveCsvData } = useCsvData();

  // Validate if all required columns exist
  const validateColumns = useCallback((headers) => {
    const missingColumns = REQUIRED_COLUMNS.filter(
      (col) =>
        !headers.some(
          (header) => header.toLowerCase().trim() === col.toLowerCase().trim()
        )
    );
    return missingColumns;
  }, []);

  // Parse CSV data
  const parseCSV = useCallback((file) => {
    return new Promise((resolve, reject) => {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          if (results.errors.length > 0) {
            reject(
              new Error("CSV parsing failed: " + results.errors[0].message)
            );
            return;
          }

          const headers = Object.keys(results.data[0] || {});
          const missingColumns = validateColumns(headers);

          if (missingColumns.length > 0) {
            reject(
              new Error(
                `Missing required columns: ${missingColumns.join(", ")}`
              )
            );
            return;
          }

          resolve(results.data);
        },
        error: (error) => {
          reject(new Error("Failed to parse CSV: " + error.message));
        },
      });
    });
  }, [validateColumns]);

  // Parse Excel data
  const parseExcel = useCallback((file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = e.target.result;
          const workbook = XLSX.read(data, { type: "binary" });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet);

          if (jsonData.length === 0) {
            reject(new Error("Excel file is empty"));
            return;
          }

          const headers = Object.keys(jsonData[0]);
          const missingColumns = validateColumns(headers);

          if (missingColumns.length > 0) {
            reject(
              new Error(
                `Missing required columns: ${missingColumns.join(", ")}`
              )
            );
            return;
          }

          resolve(jsonData);
        } catch (error) {
          reject(new Error("Failed to parse Excel file: " + error.message));
        }
      };
      reader.onerror = () => {
        reject(new Error("Failed to read Excel file"));
      };
      reader.readAsBinaryString(file);
    });
  }, [validateColumns]);

  // Handle file processing
  const processFile = useCallback(async (file) => {
    setUploadStatus("uploading");
    setError("");
    setFileName(file.name);

    try {
      let data;

      // Parse based on file type
      if (file.name.toLowerCase().endsWith(".csv")) {
        data = await parseCSV(file);
      } else if (file.name.toLowerCase().match(/\.(xlsx|xls)$/)) {
        data = await parseExcel(file);
      } else {
        throw new Error(
          "Unsupported file format. Please upload CSV or Excel files."
        );
      }

      if (!data || data.length === 0) {
        throw new Error("File is empty or contains no valid data");
      }

      // Clean and validate data
      const cleanedData = data
        .filter((row) => {
          // Remove rows where all values are empty/null
          return Object.values(row).some(
            (value) => value !== null && value !== undefined && value !== ""
          );
        })
        .map((row) => {
          // Clean each row
          const cleanedRow = {};
          Object.keys(row).forEach((key) => {
            let value = row[key];
            if (typeof value === "string") {
              value = value.trim();
            }
            cleanedRow[key] = value;
          });
          return cleanedRow;
        });

      if (cleanedData.length === 0) {
        throw new Error("No valid data found in file after cleaning");
      }

      setParsedData(cleanedData);
      setUploadStatus("success");
    } catch (error) {
      setError(error.message);
      setUploadStatus("error");
    }
  }, [parseCSV, parseExcel]);

  // Save data to Redux and redirect to dashboard
  const handleSave = () => {
    if (parsedData && fileName) {
      // Save data to Redux store
      saveCsvData(parsedData, fileName);
      alert("File processed successfully!");
      navigate('/dashboard');
    }
  };

  // Dropzone configuration
  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      processFile(acceptedFiles[0]);
    }
  }, [processFile]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "text/csv": [".csv"],
      "application/vnd.ms-excel": [".xls"],
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [
        ".xlsx",
      ],
    },
    maxFiles: 1,
    multiple: false,
  });

  const getStatusColor = () => {
    switch (uploadStatus) {
      case "success":
        return "border-green-500 bg-green-50";
      case "error":
        return "border-red-500 bg-red-50";
      case "uploading":
        return "border-blue-500 bg-blue-50";
      default:
        return "border-gray-300 bg-white";
    }
  };

  const getStatusIcon = () => {
    switch (uploadStatus) {
      case "uploading":
        return (
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        );
      case "success":
        return (
          <svg
            className="w-8 h-8 text-green-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        );
      case "error":
        return (
          <svg
            className="w-8 h-8 text-red-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        );
      default:
        return (
          <svg
            className="w-8 h-8 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
            />
          </svg>
        );
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Upload CSV/Excel File
        </h2>

        {/* File Upload Area */}
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-colors ${getStatusColor()} ${
            isDragActive ? "border-blue-500 bg-blue-50" : ""
          }`}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center space-y-4">
            {getStatusIcon()}
            <div>
              {uploadStatus === "uploading" ? (
                <p className="text-blue-600 font-semibold">
                  Processing file...
                </p>
              ) : uploadStatus === "success" ? (
                <div>
                  <p className="text-green-600 font-semibold">
                    ✅ File processed successfully!
                  </p>
                  <p className="text-gray-600 text-sm mt-1">
                    File: {fileName}
                  </p>
                  <p className="text-gray-600 text-sm">
                    Records: {parsedData?.length || 0}
                  </p>
                </div>
              ) : uploadStatus === "error" ? (
                <div>
                  <p className="text-red-600 font-semibold">❌ Upload failed</p>
                  <p className="text-red-500 text-sm mt-1">{error}</p>
                </div>
              ) : isDragActive ? (
                <p className="text-blue-600 font-semibold">
                  Drop the file here...
                </p>
              ) : (
                <div>
                  <p className="text-gray-600 font-semibold">
                    Drag and drop a CSV or Excel file here, or click to browse
                  </p>
                  <p className="text-gray-500 text-sm mt-2">
                    Supported formats: .csv, .xlsx, .xls
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Required Columns Info */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-700 mb-3">
            Required Columns:
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
            {REQUIRED_COLUMNS.map((column, index) => (
              <span
                key={index}
                className="text-sm bg-blue-100 text-blue-800 px-3 py-1 rounded-full"
              >
                {column}
              </span>
            ))}
          </div>
        </div>

        {/* Data Preview */}
        {uploadStatus === "success" && parsedData && parsedData.length > 0 && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-3">
              Data Preview (First 5 rows):
            </h3>
            <div className="overflow-x-auto">
              <table className="min-w-full table-auto border border-gray-200">
                <thead>
                  <tr className="bg-gray-100">
                    {Object.keys(parsedData[0]).map((header, index) => (
                      <th
                        key={index}
                        className="px-4 py-2 text-left text-sm font-semibold text-gray-700 border-b"
                      >
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {parsedData.slice(0, 5).map((row, rowIndex) => (
                    <tr key={rowIndex} className="border-b">
                      {Object.keys(parsedData[0]).map((header, colIndex) => (
                        <td
                          key={colIndex}
                          className="px-4 py-2 text-sm text-gray-600"
                        >
                          {row[header]}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        {uploadStatus === "success" && (
          <div className="mt-6 flex justify-center space-x-4">
            <button
              onClick={() => {
                setUploadStatus("idle");
                setParsedData(null);
                setFileName("");
                setError("");
              }}
              className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              Upload Another File
            </button>
            <button
              onClick={handleSave}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Continue to Dashboard
            </button>
          </div>
        )}

        {uploadStatus === "error" && (
          <div className="mt-6 flex justify-center">
            <button
              onClick={() => {
                setUploadStatus("idle");
                setError("");
              }}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FileUpload;
