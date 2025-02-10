
import { useState } from "react";
import axios from "axios";

const SkinChecker = () => {
  const [image, setImage] = useState(null);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const handleFileChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!image) return alert("Please upload an image!");

    const formData = new FormData();
    formData.append("file", image);

    try {
      const response = await axios.post(
        "http://127.0.0.1:8080/skin_disease",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      setResult(response.data.prediction);
      setError(null);
    } catch (error) {
      setError("Error: Unable to get prediction.");
      console.error(error);
    }
  };
  return (
    <div>
      <h1>Skin Disease Detection</h1>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload</button>
      {result && (
        <div>
          <h2>Prediction: {result}</h2>
        </div>
      )}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default SkinChecker;
