import React, { useState, useRef, useEffect } from 'react';
import { MapContainer, Marker, Popup, TileLayer, FeatureGroup } from 'react-leaflet';
import { EditControl } from 'react-leaflet-draw';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';
import osm from '../../../osm-provider';
import cities from '../../../Assets/cities.json';
import useGeoLocation from "../../../useGeoLocation";
import NavBar from "../../NavBar/NavBar";
import Axios from 'axios';
import ip from "../../ip/ip";
import Loading from "../../Loading/Loading";
import { useNavigate } from "react-router-dom";
import swal from 'sweetalert2';
import userMarker from "../../../Assets/Images/user_marker.png";
import Image from "../../../Assets/Images/marker.png";

const markerIcon = new L.Icon({
  iconUrl: Image,
  iconSize: [35, 45],
  iconAnchor: [17, 46],
  popupAnchor: [0, -46],
});

const userIcon = new L.Icon({
  iconUrl: userMarker,
  iconSize: [35, 45],
  iconAnchor: [17, 46],
  popupAnchor: [0, -46],
});

const ZOOM_LEVEL = 9;

const AddWaste = () => {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [path, setPath] = useState(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [markers, setMarkers] = useState([]);
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [isAddingMarker, setIsAddingMarker] = useState(false);
  const [drawControl, setDrawControl] = useState(null);
  const mapRef = useRef();
  const location = useGeoLocation();

  const _onCreate = (e) => {
    const { lat, lng } = e.layer.getLatLng();
    const newMarker = { lat, lng };
    setMarkers([...markers, newMarker]);
    console.log('Marker created at:', newMarker);
  };

  const _onEdited = (e) => {
    console.log(e);
  };

  const _onDeleted = (e) => {
    console.log(e);
  };

  const toggleMarkerAdding = () => {
    setIsAddingMarker(!isAddingMarker);
    if (drawControl) {
      drawControl._toolbars.edit._modes.marker.handler.enable();
    }
  };

  const handleMarkerClick = (marker) => {
    setSelectedMarker(marker);
  };

  const showMyLocation = () => {
    if (location.loaded && !location.error) {
      mapRef.current.flyTo([location.coordinates.lat, location.coordinates.lng], ZOOM_LEVEL, { animate: true });
    } else {
      alert(location.error.message);
    }
  };
  const [products, setProducts] = useState([]);
  
  useEffect(() => {
      const fetchProducts = () => {
          Axios.get(`${ip()}/products/wasteProductsAll/`, {
              headers: {
                  Authorization: `Token ${sessionStorage.getItem('token')}`
              }
          })
          .then((response) => {
              console.log(response.data)
              setProducts(response.data['message']);
          })
          .catch((error) => {
              console.error("Error fetching products:", error);
          })
          .finally(() => {
              setLoading(false);
              console.log('hihi',products);
          });
      };
  
      fetchProducts();
  }, []);
  
  return (
    <>
      <NavBar clas='dark' />
      <div className="right">
        <MapContainer center={[13.084622, 80.248357]} zoom={ZOOM_LEVEL} className="MapContainer" ref={mapRef}>
          <FeatureGroup>
            <EditControl
              position="topright"
              onCreated={_onCreate}
              onEdited={_onEdited}
              onDeleted={_onDeleted}
              ref={(ref) => setDrawControl(ref)}
              draw={{
                rectangle: false,
                polygon: false,
                circle: false,
                circlemarker: false,
                marker: isAddingMarker,
              }}
            />
          </FeatureGroup>
          <TileLayer url={osm.maptiler.url} attribution={osm.maptiler.attribute}></TileLayer>
          {cities.map((city, idx) => (
            <Marker position={[city.lat, city.lng]} icon={markerIcon} key={idx}>
              <Popup>
                <b>{city.city}, {city.country}</b>
              </Popup>
            </Marker>
          ))}
          {markers.map((marker, idx) => (
            <Marker
              key={idx}
              position={[marker.lat, marker.lng]}
              icon={markerIcon}
              eventHandlers={{
                click: () => handleMarkerClick(marker),
              }}
            >
              <Popup>
                <b>Marker at:</b> <br />
                Latitude: {marker.lat.toFixed(6)} <br />
                Longitude: {marker.lng.toFixed(6)}
              </Popup>
            </Marker>
          ))}
          {location.loaded && !location.error && (
            <Marker icon={userIcon} position={[location.coordinates.lat, location.coordinates.lng]}></Marker>
          )}
        </MapContainer>
      </div>
      <div className='maps-buttons-container'>
+
                <button type='button' onClick={showMyLocation}>
                  Show my location
                </button>
              </div>
    </>
  );
          }
export default AddWaste
