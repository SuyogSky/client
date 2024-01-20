import React, { useState, useRef } from 'react';
import { MapContainer, Marker, Popup, TileLayer, FeatureGroup } from 'react-leaflet';
import { EditControl } from 'react-leaflet-draw';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';
import osm from '../../../osm-provider';
import useGeoLocation from "../../../useGeoLocation";
import NavBar from "../../NavBar/NavBar";
import Axios from 'axios';
import ip from "../../ip/ip";
import Loading from "../../Loading/Loading";
import { useNavigate } from "react-router-dom";
import swal from 'sweetalert2';
import "./AddWaste.scss";
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

  const handleFile = (e) => {
    setFile(URL.createObjectURL(e.target.files[0]));
    setPath(e.target.files[0]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('description', description);
      formData.append('image', path);

      // Add latitude and longitude to formData if selectedMarker is available
      if (selectedMarker) {
        formData.append('latitude', selectedMarker.lat.toFixed(6));
        formData.append('longitude', selectedMarker.lng.toFixed(6));
      }

      const response = await Axios.post(`${ip()}/products/wasteProducts/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Token ${sessionStorage.getItem('token')}`
        },
      });

      if (response.data.success === 1) {
        swal.fire({
          title: "Added Successfully",
          icon: "success",
          toast: true,
          timer: 6000,
          position: 'top-right',
          timerProgressBar: true,
          showConfirmButton: false,
        });
        navigate('/view-waste');
      } else {
        swal.fire({
          title: response.data.message,
          icon: "error",
          toast: true,
          timer: 6000,
          position: 'top-right',
          timerProgressBar: true,
          showConfirmButton: false,
        });
        console.log(response.data.message);
      }

      setLoading(false);
    } catch (error) {
      console.error(error);
      // Handle errors
      setLoading(false);
    }
  };

  if (!loading) {
    return (
      <>
        <NavBar clas='dark' />
        <section className="add-waste-section">
          <h2>Add Wasted Products</h2>
          <br />


          <form action="" method="POST" encType="multipart/form-data" onSubmit={handleSubmit}>

            <div className='right'>
              <div className="image field">
                <label className="img-lbl" htmlFor="product-image">Product Image<span>*</span></label>
                <label
                  htmlFor="product-image"
                  className="label"
                  style={file ? {
                    backgroundImage: `url(${file})`,
                    backgroundPosition: 'center',
                    backgroundSize: 'cover',
                    backgroundRepeat: 'no-repeat',
                  } : null}
                ></label>
                <input type="file" id="product-image" onChange={(e) => handleFile(e)} />
              </div>
              <div className='maps-buttons-container'>
                <button type='button' onClick={toggleMarkerAdding}>
                  {isAddingMarker ? 'Disable Marker Adding' : 'Enable Marker Adding'}
                </button>
                <button type='button' onClick={showMyLocation}>
                  Show my location
                </button>
              </div>
            </div>

            <div className="left">
              <div className="name field">
                <label htmlFor="product-name">Product Name<span>*</span></label>
                <input type="text" id="product-name" placeholder="Name" onChange={(e) => setName(e.target.value)} />
              </div>
              <div className="description field">
                <label htmlFor="product-description">Product Description<span>*</span></label>
                <textarea type="text" id="product-description" placeholder="Description" onChange={e => setDescription(e.target.value)}></textarea>
              </div>
              <button type="submit">Submit</button>
            </div>
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
          </form>
        </section>
        {selectedMarker && (
          <div>
            <p>
              Selected Marker: Latitude - {selectedMarker.lat.toFixed(6)}, Longitude - {selectedMarker.lng.toFixed(6)}
            </p>
          </div>
        )}
      </>
    );
  } else {
    return (
      <Loading />
    );
  }
};

export default AddWaste;
