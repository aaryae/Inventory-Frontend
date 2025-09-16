import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { BrowserMultiFormatReader } from "@zxing/browser";
import { getResourceById } from "../../../../services/inventory/resourceService";
const BarcodePage = () => {

  const [resourceId, setResourceId] = useState("");
  const [barcodeImage, setBarcodeImage] = useState("");
  const [resourceInfo, setResourceInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showResult, setShowResult] = useState(false);


  const videoRef = useRef(null);
  const [decodedText, setDecodedText] = useState("");
  const [scannerResource, setScannerResource] = useState(null);
  const [error, setError] = useState("");
  const [devices, setDevices] = useState([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState(null);
  const codeReaderRef = useRef(new BrowserMultiFormatReader());

  const handleGenerate = async () => {
    if (!resourceId.trim()) return;

    try {
      setLoading(true);
      const token = localStorage.getItem("token"); 
      console.log("Token for barcode",token)
      const infoResponse = await axios.get(
        `http://localhost:8080/api/resources/${resourceId}`,{
          headers: { Authorization: `Bearer ${token}` }
          
        }
       
      );
   
      console.log("Info response",infoResponse)
      setResourceInfo(infoResponse.data.data);

      const barcodeResponse = await axios.get(
        `http://localhost:8080/api/resources/${resourceId}/barcode`,
        { headers: { Authorization: `Bearer ${token}` },
  
        }
       
      );
   console.log("Barcode response",barcodeResponse)
      setBarcodeImage(barcodeResponse.data.data);
      console.log("Barcode image",barcodeResponse.data.data)
      setShowResult(true);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch data. Make sure the Resource ID exists.");
      setShowResult(false);
    } finally {
      setLoading(false);
    }
  };

  
  const startCamera = async (deviceId) => {
    try {
      const constraints = {
        video: deviceId
          ? { deviceId: { exact: deviceId } }
          : { facingMode: "environment" },
      };
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      if (videoRef.current) videoRef.current.srcObject = stream;
    } catch (err) {
      console.error("Error accessing camera:", err);
      setError("Camera access denied or not available.");
    }
  };

  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject;
      if (stream && stream.getTracks) {
        stream.getTracks().forEach((track) => track.stop());
      }
    }
  };

  useEffect(() => {
    const getDevices = async () => {
      const allDevices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = allDevices.filter((d) => d.kind === "videoinput");
      setDevices(videoDevices);
      if (videoDevices.length > 0) setSelectedDeviceId(videoDevices[0].deviceId);
    };
    getDevices();
  }, []);

  useEffect(() => {
    if (!selectedDeviceId) return;
    stopCamera();
    startCamera(selectedDeviceId);
    return () => stopCamera();
  }, [selectedDeviceId]);

  useEffect(() => {
    const scan = () => {
      if (!videoRef.current) return;
      codeReaderRef.current
        .decodeOnceFromVideoElement(videoRef.current)
        .then((result) => setDecodedText(result.getText()))
        .catch(() => {});
    };
    const intervalId = setInterval(scan, 1500);
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    const fetchResource = async () => {
      if (!decodedText) return;
      const token = localStorage.getItem("token");
      if (!token) {
        setError("No access token found.");
        return;
      }
      try {
        const res = await axios.get(
          `http://localhost:8080/api/resources/${decodedText}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setScannerResource(res.data.data);
        setError("");
      } catch (err) {
        console.error("Resource fetch error:", err);
        setError("Failed to fetch resource or unauthorized.");
        setScannerResource(null);
      }
    };
    fetchResource();
  }, [decodedText]);

  return (
    <>
  
      <div className="p-6">
        <div className="mb-6 p-6 rounded-2xl border border-[#21222d] shadow-lg bg-[#171821]">
          <h1 className="text-3xl font-bold text-slate-100 mb-2">Barcode Management</h1>
          <p className="text-white">
            Generate or scan barcodes efficiently for your inventory items.
          </p>
        </div>
      </div>


      <div className="flex flex-col items-center justify-center px-4 py-8">
        <h2 className="text-2xl text-white font-bold mb-6">Generate Barcode from Resource ID</h2>
        <input
          type="text"
          placeholder="Enter Resource ID"
          value={resourceId}
          onChange={(e) => {
            setResourceId(e.target.value);
            setShowResult(false);
            setResourceInfo(null);
            setBarcodeImage("");
          }}
          className="border-white text-white rounded px-4 py-2 mb-4 w-full max-w-md"
        />
        <button
          onClick={handleGenerate}
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
          disabled={loading}
        >
          {loading ? "Generating..." : "Generate Barcode"}
        </button>

        {showResult && resourceInfo && barcodeImage && (
          <div className="bg-white p-6 rounded shadow mt-6 text-center">
            <img src={barcodeImage} alt="Generated Barcode" className="mx-auto mb-4" />
            <a
              href={barcodeImage}
              download={`barcode-${resourceId}.png`}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
            >
              Download Barcode
            </a>
          </div>
        )}
      </div>
      <div className="flex flex-col items-center justify-center px-4 py-8">
        <h2 className="text-2xl font-bold mb-4">Live Camera Barcode Scanner</h2>

        <select
          className="mb-4 p-2 border rounded"
          onChange={(e) => setSelectedDeviceId(e.target.value)}
          value={selectedDeviceId ?? ""}
        >
          {devices.map((device) => (
            <option key={device.deviceId} value={device.deviceId}>
              {device.label || `Camera ${device.deviceId}`}
            </option>
          ))}
        </select>

        <video
          ref={videoRef}
          autoPlay
          playsInline
          className="w-full max-w-md border-4 border-gray-800 rounded-lg mb-4"
        />

        {decodedText && <p className="text-green-700 font-semibold mb-2">Scanned Barcode: {decodedText}</p>}
        {error && <p className="text-red-500 mb-2">{error}</p>}

        {scannerResource && (
          <div className="bg-white p-6 rounded shadow w-full max-w-xl mt-4">
            <h3 className="text-xl font-semibold mb-4">Resource Details</h3>
            <table className="w-full table-auto border-collapse">
              <tbody>
                {Object.entries(scannerResource).map(([key, value]) => (
                  <tr key={key} className="border-b">
                    <td className="font-medium py-2 px-4 capitalize">{key}</td>
                    <td className="py-2 px-4">{String(value ?? "-")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    
    </>
  );
};

export default BarcodePage;
