import React, { useState, useRef, useEffect } from 'react';
import { MapContainer, Marker, Popup, TileLayer, FeatureGroup } from 'react-leaflet';
import { EditControl } from 'react-leaflet-draw';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';
import osm from '../../../osm-provider';
import useGeoLocation from '../../../useGeoLocation';
import NavBar from '../../NavBar/NavBar';
import Axios from 'axios';
import ip from '../../ip/ip';
import Loading from '../../Loading/Loading';
import { useNavigate } from 'react-router-dom';
import userMarker from '../../../Assets/Images/user_marker.png';
import Image from '../../../Assets/Images/marker.png';
import '../MultipleWastesMap/ViewMultipleWasteMap.scss'; // Import your custom styles for this component

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
  const [loading, setLoading] = useState(false);
  const [markers, setMarkers] = useState([]);
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [isAddingMarker, setIsAddingMarker] = useState(false);
  const [drawControl, setDrawControl] = useState(null);
  const mapRef = useRef();
  const location = useGeoLocation();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await Axios.get(`${ip()}/products/wasteProductsAll/`, {
          headers: {
            Authorization: `Token ${sessionStorage.getItem('token')}`,
          },
        });
        setProducts(response.data.message);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

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

  return (
    <div className="add-waste-container">
      <NavBar clas="dark" />
      <div className="right-another">
        <MapContainer center={[13.084622, 80.248357]} zoom={ZOOM_LEVEL} className="map-container2" ref={mapRef}>
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
          {products.map((product, idx) => (
            <Marker
              key={idx}
              position={[parseFloat(product.latitude), parseFloat(product.longitude)]}
              icon={markerIcon}
              eventHandlers={{
                click: () => setSelectedMarker(product),
              }}
            >
              <Popup>
                <b>Waste Product Details:</b> <br />
                Name: {product.name} <br />
                Description: {product.description} <br />
                Latitude: {parseFloat(product.latitude).toFixed(6)} <br />
                Longitude: {parseFloat(product.longitude).toFixed(6)}
              </Popup>
            </Marker>
          ))}
          {location.loaded && !location.error && (
            <Marker icon={userIcon} position={[location.coordinates.lat, location.coordinates.lng]}></Marker>
          )}
        </MapContainer>

      </div>
      <div className="maps-buttons-container">
        <button type="button" onClick={showMyLocation}>
          Show my location
        </button>
      </div>
    </div>
  );
};

export default AddWaste;
