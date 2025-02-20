import { useState } from "react";
import axios from "axios";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { FaCloudUploadAlt } from "react-icons/fa";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
console.log(API_KEY)

const SkinChecker = () => {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [cures, setCures] = useState(null);
  const [loading, setLoading] = useState(false);
  const [precautionLoading, setPrecautionLoading] = useState(false); // Added precaution loading state
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleUpload = async () => {
    if (!image) {
      alert("Please select an image first!");
      return;
    }

    const formData = new FormData();
    formData.append("file", image);

    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(
        "http://127.0.0.1:8080/skin_disease",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      const prediction = response.data.prediction;
      setResult(prediction);
      fetchCureFromGemini(prediction);
    } catch (error) {
      setError("Error: Unable to get prediction.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCureFromGemini = async (disease) => {
    setPrecautionLoading(true); // Start loading for precautions
    try {
      const genAI = new GoogleGenerativeAI(API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      const message = `Provide a list of home remedies and medical treatments for ${disease}. Format the response in bullet points.`;

      const result = await model.generateContent(message);
      const text = await result.response.text();

      // Extract clean text
      const cureList = text
        .match(/^[*\-•]\s*(.+)/gm)
        ?.map((item) => item.replace(/^[*\-•]\s*/, ""));

      if (cureList) {
        setCures(cureList.join("\n"));
      } else {
        setCures("No structured cure list found. Try refining the prompt.");
      }
    } catch (error) {
      setError("Error: Unable to fetch treatment details.");
      console.error(error);
    } finally {
      setPrecautionLoading(false); // Stop loading
    }
  };


  return (
    <div className="p-4 sm:p-6 max-w-5xl mx-auto bg-white shadow-lg rounded-xl border border-gray-200 flex flex-col lg:flex-row gap-4 lg:gap-6 min-h-[450px] h-full w-full overflow-y-auto" data-aos="zoom-in-up">
      {/* Left Side - Image Upload & Prediction */}
      <div className="flex flex-col items-center w-full lg:w-1/2 flex-1">
        <h1 className="text-2xl sm:text-3xl font-bold text-center text-green-600 mb-4">
          Skin Care Assistant
        </h1>

        {/* Custom File Input */}
        <label className="w-full flex flex-col items-center justify-center p-4 border-2 border-dashed border-green-300 rounded-lg bg-green-50 hover:bg-green-100 transition cursor-pointer">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
          <i className="fas fa-cloud-upload-alt text-3xl text-green-600 mb-2"></i>{" "}
          {/* Font Awesome Upload Icon */}
          <p className="text-md font-semibold text-green-700">
            Drag & drop your photo
          </p>
          <p className="text-xs text-gray-500 mt-1">or</p>
          <span className="mt-2 px-3 py-1.5 bg-green-600 text-white rounded-md hover:bg-green-700 transition text-sm">
            Browse files
          </span>
        </label>

        {preview ? (
          <img
            src={preview}
            alt="Selected Preview"
            className="w-40 sm:w-64 h-40 sm:h-64 object-cover rounded-md border border-gray-300 mt-4"
          />
        ) : (
          <div className="w-40 sm:w-64 h-40 sm:h-64 flex flex-col items-center justify-center bg-gray-100 rounded-md border border-gray-300 mt-4">
            <p className="text-gray-500 text-center">No image selected.</p>
            <p className="text-gray-400 text-sm text-center">
              Upload an image to start analysis.
            </p>
          </div>
        )}
        <button
          onClick={handleUpload}
          className="w-full bg-green-500 text-white py-2 rounded-md hover:bg-green-600 transition mt-4"
        >
          {loading ? "Uploading..." : "Upload Image"}
        </button>
        {error && <p className="text-red-500 text-center mt-2">{error}</p>}
        {result && (
          <div className="mt-4 p-4 bg-gray-50 border rounded-md w-full">
            <h2 className="text-lg font-semibold text-gray-700">
              Your Skin Type:
            </h2>
            <p className="text-gray-600">{result}</p>
          </div>
        )}
      </div>

      {/* Right Side - Treatment Suggestions */}
      <div className="w-full lg:w-1/2 bg-green-50 p-4 sm:p-6 border border-green-200 rounded-md flex-1 flex flex-col self-stretch h-full">
        <h2 className="text-xl sm:text-2xl font-semibold text-green-700">
          Treatment Suggestions:
        </h2>
        {precautionLoading ? (
          <div className="flex justify-center items-center mt-4">
            <div className="w-6 h-6 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : cures ? (
          <ul className="list-disc list-inside text-gray-700 mt-4 flex-1 overflow-y-auto">
            {cures.split("\n").map((point, index) => (
              <li key={index}>{point}</li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 italic mt-4 flex-1">
            Treatment suggestions will be displayed after analysis.
          </p>
        )}
      </div>
    </div>
  );
};

export default SkinChecker;