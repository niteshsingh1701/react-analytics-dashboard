import React, { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import Papa from "papaparse";
import * as XLSX from "xlsx";
// import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const FileUpload = () => {
  const [uploadStatus, setUploadStatus] = useState("idle");
  const [error, setError] = useState("");
  const [parsedData, setParsedData] = useState(null);
  const [fileName, setFileName] = useState("");
  //   const { currentUser } = useAuth();
  const navigate = useNavigate();

  // Required columns for validation
  const requiredColumns = [
    "Product Name",
    "Sales",
    "Profit",
    "TE",
    "Credit",
    "Amazon Fee",
    "Profit Percentage",
  ];

  // Validate if all required columns exist
  const validateColumns = (headers) => {
    const missingColumns = requiredColumns.filter(
      (col) =>
        !headers.some(
          (header) => header.toLowerCase().trim() === col.toLowerCase().trim()
        )
    );
    return missingColumns;
  };

  // Parse CSV data
  const parseCSV = (file) => {
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
          resolve(results.data);
        },
        error: (error) => {
          reject(new Error("CSV parsing failed: " + error.message));
        },
      });
    });
  };

  // Parse Excel data
  const parseExcel = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = e.target.result;
          const workbook = XLSX.read(data, { type: "binary" });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

          // Convert to Papa Parse format
          if (jsonData.length < 2) {
            reject(
              new Error(
                "Excel file must have at least a header row and one data row"
              )
            );
            return;
          }

          const headers = jsonData[0];
          const rows = jsonData.slice(1);
          const parsedData = rows.map((row) => {
            const obj = {};
            headers.forEach((header, index) => {
              obj[header] = row[index] || "";
            });
            return obj;
          });

          resolve(parsedData);
        } catch (error) {
          reject(new Error("Excel parsing failed: " + error.message));
        }
      };
      reader.onerror = () => reject(new Error("Failed to read Excel file"));
      reader.readAsBinaryString(file);
    });
  };

  // Handle file processing
  const processFile = async (file) => {
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

      // Validate data
      if (!data || data.length === 0) {
        throw new Error("File is empty or contains no valid data");
      }

      // Validate columns
      const headers = Object.keys(data[0]);
      const missingColumns = validateColumns(headers);

      if (missingColumns.length > 0) {
        throw new Error(
          `Missing required columns: ${missingColumns.join(", ")}`
        );
      }

      // Clean and validate data
      const cleanedData = data.map((row, index) => {
        const cleanedRow = { ...row };

        // Validate numeric fields
        const numericFields = [
          "Sales",
          "Profit",
          "TE",
          "Credit",
          "Amazon Fee",
          "Profit Percentage",
        ];
        numericFields.forEach((field) => {
          const value = cleanedRow[field];
          if (value !== "" && value !== null && value !== undefined) {
            const numValue = parseFloat(value);
            if (isNaN(numValue)) {
              throw new Error(
                `Invalid numeric value in row ${
                  index + 1
                }, column '${field}': ${value}`
              );
            }
            cleanedRow[field] = numValue;
          } else {
            cleanedRow[field] = 0; // Default to 0 for empty numeric fields
          }
        });

        // Validate Product Name
        if (
          !cleanedRow["Product Name"] ||
          cleanedRow["Product Name"].toString().trim() === ""
        ) {
          throw new Error(`Product Name is required in row ${index + 1}`);
        }

        return cleanedRow;
      });

      setParsedData(cleanedData);
      setUploadStatus("success");
    } catch (error) {
      setError(error.message);
      setUploadStatus("error");
    }
  };

  // Save data to Firestore and redirect to dashboard
  const handleSave = () => {
    alert("File processed successfully!");
    navigate('/dashboard', { state: { csvData: parsedData } });
  };

  // Dropzone configuration
  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      processFile(acceptedFiles[0]);
    }
  }, []);

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

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-md p-8">
        <h2 className="text-2xl font-bold mb-6 text-gray-900">
          Upload Your Data Sheet
        </h2>

        {/* Required Columns Info */}
        <div className="mb-6 p-4 bg-blue-50 rounded-lg">
          <h3 className="font-semibold text-blue-900 mb-2">
            Required Columns:
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm text-blue-800">
            {requiredColumns.map((col, index) => (
              <span key={index} className="bg-blue-100 px-2 py-1 rounded">
                {col}
              </span>
            ))}
          </div>
        </div>

        {/* File Upload Area */}
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
            isDragActive
              ? "border-blue-400 bg-blue-50"
              : uploadStatus === "success"
              ? "border-green-400 bg-green-50"
              : uploadStatus === "error"
              ? "border-red-400 bg-red-50"
              : "border-gray-300 bg-gray-50 hover:border-blue-400 hover:bg-blue-50"
          }`}
        >
          <input {...getInputProps()} />

          {uploadStatus === "idle" && (
            <>
              <div className="mb-4">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  stroke="currentColor"
                  fill="none"
                  viewBox="0 0 48 48"
                >
                  <path
                    d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <p className="text-lg text-gray-600">
                {isDragActive
                  ? "Drop your file here..."
                  : "Drag & drop your CSV or Excel file here"}
              </p>
              <p className="text-sm text-gray-500 mt-2">
                or click to browse files
              </p>
              <p className="text-xs text-gray-400 mt-2">
                Supported formats: .csv, .xlsx, .xls
              </p>
            </>
          )}

          {uploadStatus === "uploading" && (
            <div className="flex flex-col items-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
              <p className="text-lg text-blue-600">Processing {fileName}...</p>
            </div>
          )}

          {uploadStatus === "success" && (
            <div className="flex flex-col items-center">
              <div className="mb-4">
                <svg
                  className="mx-auto h-12 w-12 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  ></path>
                </svg>
              </div>
              <p className="text-lg text-green-600 font-semibold">
                File processed successfully!
              </p>
              <p className="text-sm text-gray-600">{fileName}</p>
              <p className="text-sm text-gray-600">
                {parsedData?.length} rows imported
              </p>
            </div>
          )}

          {uploadStatus === "error" && (
            <div className="flex flex-col items-center">
              <div className="mb-4">
                <svg
                  className="mx-auto h-12 w-12 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  ></path>
                </svg>
              </div>
              <p className="text-lg text-red-600 font-semibold">
                Upload failed
              </p>
              <p className="text-sm text-red-600 mt-2">{error}</p>
              <p className="text-xs text-gray-600 mt-2">Click to try again</p>
            </div>
          )}
        </div>

        {/* Data Preview */}
        {parsedData && uploadStatus === "success" && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-4">Data Preview</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                <thead className="bg-gray-50">
                  <tr>
                    {Object.keys(parsedData[0]).map((header, index) => (
                      <th
                        key={index}
                        className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b"
                      >
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {parsedData.slice(0, 5).map((row, index) => (
                    <tr
                      key={index}
                      className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                    >
                      {Object.values(row).map((value, cellIndex) => (
                        <td
                          key={cellIndex}
                          className="px-4 py-2 text-sm text-gray-900 border-b"
                        >
                          {value}
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
          <div className="mt-6 flex space-x-4">
            <button
              onClick={handleSave}
              className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors font-medium"
            >
              Save & Continue to Dashboard
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FileUpload;
