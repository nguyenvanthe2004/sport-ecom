import React, { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "../styles/MapLocation.css";
import L from "leaflet";
import { MapPin, Navigation, Phone, Clock, Info } from "lucide-react";

// Custom icon marker
const customIcon = new L.Icon({
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const MapLocation = () => {
  const [mapStyle, setMapStyle] = useState("standard");

  // 📍 Tọa độ shop thể thao Mỹ Đình
  const position = [21.033825, 105.776648];

  const mapStyles = {
    standard: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    satellite: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    dark: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
  };

  const venueInfo = {
    name: "Shop Thể Thao Mỹ Đình",
    address: "Số 15, Ngõ 322/95/29 Mỹ Đình, Nam Từ Liêm, Hà Nội",
    phone: "0387.873.303",
    hours: "8:00 - 22:00 (Hằng ngày)",
  };

  return (
    <div className="map-sport-container">
      <div className="map-header">
        <div className="map-header-content">
          <div className="map-icon-wrapper">
            <MapPin size={32} color="black" />
          </div>
          <div>
            <h2 className="map-title">{venueInfo.name}</h2>
            <p className="map-subtitle">Shop dụng cụ & trang phục thể thao</p>
          </div>
        </div>
        
        <div className="map-controls">
          <button
            className={`control-btn ${mapStyle === "standard" ? "active" : ""}`}
            onClick={() => setMapStyle("standard")}
          >
            Bản đồ
          </button>
          <button
            className={`control-btn ${mapStyle === "satellite" ? "active" : ""}`}
            onClick={() => setMapStyle("satellite")}
          >
            Vệ tinh
          </button>
          <button
            className={`control-btn ${mapStyle === "dark" ? "active" : ""}`}
            onClick={() => setMapStyle("dark")}
          >
            Tối
          </button>
        </div>
      </div>

      <div className="map-content-wrapper">
        <div className="map-wrapper">
          <MapContainer center={position} zoom={17} scrollWheelZoom={true}>
            <TileLayer
              url={mapStyles[mapStyle]}
              attribution='&copy; OpenStreetMap contributors'
            />
            <Marker position={position} icon={customIcon}>
              <Popup>
                <div className="map-popup">
                  <strong className="popup-title">{venueInfo.name}</strong>
                  <p className="popup-text">{venueInfo.address}</p>
                  <p className="popup-text">Mở cửa: {venueInfo.hours}</p>
                </div>
              </Popup>
            </Marker>
          </MapContainer>
          
          <button className="direction-btn">
            <Navigation size={20} />
            <span>Chỉ đường</span>
          </button>
        </div>

        <div className="info-panel">
          <div className="info-card">
            <div className="info-header">
              <Info size={20} color="#667eea" />
              <h3 className="info-title">Thông tin cửa hàng</h3>
            </div>

            <div className="info-item">
              <MapPin size={18} color="#718096" />
              <div>
                <p className="info-label">Địa chỉ</p>
                <p className="info-value">{venueInfo.address}</p>
              </div>
            </div>

            <div className="info-item">
              <Phone size={18} color="#718096" />
              <div>
                <p className="info-label">Điện thoại</p>
                <p className="info-value">{venueInfo.phone}</p>
              </div>
            </div>

            <div className="info-item">
              <Clock size={18} color="#718096" />
              <div>
                <p className="info-label">Giờ mở cửa</p>
                <p className="info-value">{venueInfo.hours}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapLocation;
