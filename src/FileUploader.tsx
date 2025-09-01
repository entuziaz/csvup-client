import React, { useState } from "react"; 
import log from "loglevel"; 
// import { set } from "astro:schema";

log.setLevel(process.env.NODE_ENV === "development" ? "debug" : "error")

const FileUploader: React.FC = () => {
    const [file, setFile] = useState<File | null>(null);
    const [message, setMessage] = useState<string>("");

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setFile(e.target.files[0]);
        }
    };

    const handleUpload = async () => {
    if (!file) {
        setMessage("Please select a file first.");
        return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
        log.info("Uploading file:", file.name);
        setMessage("Uploading...");

        // const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';
        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
        const response = await fetch(`${API_URL}/api/v1/uploads/csv/`, {
            method: "POST",
            body: formData,
        });

        log.debug("---Response status:", response.status);

        if (!response.ok) {
            const errorText = await response.text();
            log.error("---Upload failed:", errorText);
            throw new Error(errorText || "Upload failed");
        }

        const data = await response.json();
        log.info("---Server response:", data);
        console.log("---Server response:", data);

        // setMessage(`Upload: ${data.data.filename}, Rows: ${data.data.rows}`);
        // setMessage(`Upload successful: ${data.data.filename}, Successful rows: ${data.data.successful_rows}, Failed rows: ${data.data.failed_rows}`);
        let messageText = `✅Upload successful!\n`;
        messageText += `File: ${data.data.filename}\n`;
        messageText += `Total rows: ${data.data.total_rows}\n`;
        messageText += `✅Successful: ${data.data.successful_rows}\n`;
        
        if (data.data.duplicate_rows > 0) {
            messageText += `⚠️Duplicates skipped: ${data.data.duplicate_rows}\n`;
        }
        
        if (data.data.failed_rows > 0) {
            messageText += `❌Failed: ${data.data.failed_rows}\n`;
        }

        setMessage(messageText);

    } catch (error) {
        log.error("---Error uploading file:", error);
        // setMessage("Error uploading file");

        if (error instanceof Error) {
            if (error.message.includes("Missing columns")) {
                setMessage("Error: The CSV file is missing required columns. Please check the file format.");
            } else if (error.message.includes("Malformed CSV")) {
                setMessage("Error: The CSV file is malformed or corrupted. Please check the file.");
            } else if (error.message.includes("Invalid file type")) {
                setMessage("Error: Please upload a valid CSV file.");
            } else if (error.message.includes("Empty CSV file")) {
                setMessage("Error: The file is empty. Please upload a valid CSV file.");
            } else {
                setMessage(`Upload failed: An unexpected error occurred while processing the file.`);
            }
        } else {
            setMessage("Error uploading file. Please try again.");
        }
    }
};

    return (
        <div className="p-4 border rounded-lg shadow-md w-96">
            <h2 className="text-lg font-semibold mb-2">Upload CSV</h2>
            <label htmlFor="file-upload" className="sr-only">
                Upload CSV file 
            </label>
            <input
                id="file-upload"
                type="file"
                title="Upload CSV file"
                placeholder="Choose a CSV file"
                accept=".csv"
                onChange={handleFileChange}
                className="mb-2"
            />
            <button
                onClick={handleUpload}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
                Upload
            </button>
            {message && <p className="mt-4">{message}</p>}
            {/* {message && (
                <div className="mt-4 p-3 bg-gray-100 rounded">
                    {message.split('\n').map((line, index) => (
                        <p key={index} className={index === 0 ? "font-semibold" : ""}>
                            {line}
                        </p>
                    ))}
                </div>
            )} */}
        </div>
    );
};

export default FileUploader;
