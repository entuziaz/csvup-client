import React, { useState } from "react"; 
import log from "loglevel"; 

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

        const response = await fetch("http://localhost:8000/api/v1/uploads/csv/", {
            method: "POST",
            body: formData,
        });

        log.debug("🔎 Response status:", response.status);

        if (!response.ok) {
            const errorText = await response.text();
            log.error("---Upload failed:", errorText);
            throw new Error(errorText || "Upload failed");
        }

        const data = await response.json();
        log.info("---Server response:", data);
        console.log("---Server response:", data);

        setMessage(`Upload: ${data.filename}, Rows: ${data.rows}`);
    } catch (error) {
        log.error("---Error uploading file:", error);
        setMessage("Error uploading file");
    }
};

    return (
    <div className="p-4 border rounded-lg shadow-md w-96">
        <h2 className="text-lg font-semibold mb-2">Upload CSV</h2>
        <input
        type="file"
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
        {message && <p className="mt-2">{message}</p>}
    </div>
    );
};

export default FileUploader;
