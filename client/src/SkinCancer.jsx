import { useState } from "react";
import axios from "axios";
const SkinCancer = () => {
  const [image, setImage] = useState(null);
  const [result, setResult] = useState(null);
  const [info, setInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleImageChange = (event) => {
    setImage(event.target.files[0]); // Get the selected file
  };

  const handleUpload = async () => {
    if (!image) {
      alert("Please select an image first!");
      return;
    }

    const formData = new FormData();
    formData.append("pic", image);

    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(
        "http://127.0.0.1:8080/skin_cancer",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      setResult(response.data.result);
      setInfo(response.data.info);
    } catch (err) {
      console.error("Upload error:", err);
      setError(err.response?.data?.error || "Error uploading image");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-xl font-bold">Skin Cancer Detection</h1>
      <input
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        className="mt-2"
      />
      <button
        onClick={handleUpload}
        className="bg-blue-500 text-white p-2 mt-2 rounded"
      >
        {loading ? "Uploading..." : "Upload Image"}
      </button>

      {error && <p className="text-red-500 mt-2">{error}</p>}
      {result && (
        <div className="mt-4 p-4 border rounded">
          <h2 className="text-lg font-semibold">Prediction: {result}</h2>
          <p>{info}</p>
        </div>
      )}
    </div>
  );
};

export default SkinCancer;
