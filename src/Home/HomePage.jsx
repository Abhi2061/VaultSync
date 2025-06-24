import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase/firebase";
import "./HomePage.css";

const HomePage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("getPassword");
  const [services, setServices] = useState([]);
  const [secret, setSecret] = useState("");
  const [selectedService, setSelectedService] = useState("");
  const [service, setService] = useState("");
  const [syncKey, setSyncKey] = useState("");
  const [retrievedSyncKey, setRetrievedSyncKey] = useState("");
  const [copied, setCopied] = useState(false);

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    fetchServices();
  }, []);
    
  const fetchServices = async () => {
    const idToken = localStorage.getItem("idToken");
    if (!idToken) return;
  
    try {
      const res = await fetch(`${API_BASE_URL}/vault`, {
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      });
  
      const data = await res.json();
      if (res.ok) setServices(data);
      else console.warn("Error loading Services", data.error);
    } catch (err) {
      console.error("Error fetching Services:", err);
    }
  };
  
  const handleLogout = async () => {
    await auth.signOut();
    navigate("/"); // Redirect to login after logout
  };

  const handleToggle = (tab) => {
    setActiveTab(tab);
    setSelectedService("");
    setSyncKey(""); 
    setService("");
    setSecret("");
    setRetrievedSyncKey("");
  };

  const generateRandomKey = () => {
    const upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const lower = "abcdefghijklmnopqrstuvwxyz";
    const numbers = "0123456789";
    const symbols = "@#&";
    const allChars = upper + lower + numbers + symbols;
  
    let key = [
      upper[Math.floor(Math.random() * upper.length)],
      lower[Math.floor(Math.random() * lower.length)],
      numbers[Math.floor(Math.random() * numbers.length)],
      symbols[Math.floor(Math.random() * symbols.length)],
    ];
  
    while (key.length < 10) {
      key.push(allChars[Math.floor(Math.random() * allChars.length)]);
    }
  
    key = key.sort(() => 0.5 - Math.random());
    setSyncKey(key.join(""));
  };
  
  const handleGetPassword = async () => {
    if (!selectedService || !secret) {
      alert("Select site and enter secret.");
      return;
    }
  
    try {
      const idToken = localStorage.getItem("idToken");
      const res = await fetch(`${API_BASE_URL}/vault/${selectedService}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({ secret }),
      });
  
      const data = await res.json();
      if (res.ok) 
        setRetrievedSyncKey(data.Key);
      else 
        alert("Error: " + (data.error || "Unable to retrieve password"));
    } catch (err) {
      console.error("Error:", err);
      alert("Failed to retrieve password.");
    }
  };
  
  
  const handleSavePassword = async () => {
    if (!service || !syncKey || !secret) {
      alert("Fill all fields.");
      return;
    }
  
    try {
      const idToken = localStorage.getItem("idToken");
      const res = await fetch(`${API_BASE_URL}/vault`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({
          serviceName: service,
          syncKey,
          secret,
        }),
      });
  
      const data = await res.json();

      if (res.ok) {
        setRetrievedSyncKey(syncKey); // Show what was just saved
        fetchServices(); // Refresh the list of services
      }
      else {
        alert("Error: " + (data.error || "Failed to save password"));
      }
    } catch (err) {
      console.error("Save error:", err);
      alert("Failed to save password.");
    }
  };
  
  const copyToClipboard = async () => {
    try {
      const syncKey = retrievedSyncKey; 
      if (typeof syncKey === "string") {
        await navigator.clipboard.writeText(syncKey);
        setCopied(true);
        setTimeout(() => {
          setCopied(false);
        }, 2000); // Hide message after 2 seconds
      } 
    } catch (err) {
      console.error("Failed to copy:", err);
      alert("Error copying password.");
    }
  };  

  return (
    <div>
      <div className="header">
        <h1>Password Manager</h1>
        <button className="logout-button" onClick={handleLogout}>
          Logout
        </button>
      </div>
      
      <div className="toggle-buttons">
        <button className={activeTab === "getPassword" ? "active" : ""} onClick={() => handleToggle("getPassword")}>
        🔐 Get Password
        </button>
        <button className={activeTab === "savePassword" ? "active" : ""} onClick={() => handleToggle("savePassword")}>
        💾 Save Password
        </button>
      </div>

      {activeTab === "getPassword" ? (
        <div className="password-section">
          <h2>Retrieve Password</h2>
          <select value={selectedService} onChange={(e) => setSelectedService(e.target.value)}>
            <option value="">-- Select a service --</option>
            {services.map((serv) => (
              <option key={serv.id} value={serv.id}>{serv.serviceName}</option>
            ))}
          </select>
          <input type="password" placeholder="Master Key" value={secret} onChange={(e) => setSecret(e.target.value)} />
          <button onClick={handleGetPassword}>Get Password</button>
        </div>
      ) : (
        <div className="password-section">
          <h2>Save Password</h2>
          <input type="text" placeholder="Service Name" value={service} onChange={(e) => setService(e.target.value)} />
          <div style={{ display: "flex", gap: "10px" }}>
            <input
              type="text"
              placeholder="Sync Key"
              value={syncKey}
              onChange={(e) => setSyncKey(e.target.value)}
              style={{ flex: 1 }}
            />
            <button onClick={generateRandomKey}>Generate Random</button>
          </div>
          <input type="text" placeholder="Master Key" value={secret} onChange={(e) => setSecret(e.target.value)} />
          <button onClick={handleSavePassword}>Save Password</button>
        </div>
      )}

      {retrievedSyncKey && (
        <div className="password-result">
          <p>Sync Key : <span>{retrievedSyncKey}</span> <span className="copy-btn" onClick={copyToClipboard}>📋</span></p>
          {copied && <p className="copyMsg">Sync Key copied to clipboard!</p>}
        </div>
      )}
    </div>
  );
};

export default HomePage;
