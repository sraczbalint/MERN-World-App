import React, { useEffect, useState } from "react";
import Map, { Marker } from "react-map-gl";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import axios from "axios";
import "mapbox-gl/dist/mapbox-gl.css";
import "./App.css";
import { Box } from "@mui/system";
import Register from "./components/register/Register";
import Login from "./components/login/Login";
import { OutputPopup } from "./components/outputPopup/OutputPopup";
import { InputPopup } from "./components/inputPopup/InputPopup";
import { Button } from "./components/button/button";

function App() {
  const myStorage = window.localStorage;
  const [currentUser, setCurrentUser] = useState(myStorage.getItem("user"));
  const [pins, setPins] = useState([]);
  const [currentPlaceId, setCurrentPlaceId] = useState(null);
  const [title, setTitle] = useState(null);
  const [desc, setDesc] = useState(null);
  const [rating, setRating] = useState(1);
  const [newPlace, setNewPlace] = useState(null);
  const [showregister, setShowRegister] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [viewport, setViewport] = useState({
    longitude: 2,
    latitude: 48,
    zoom: 3,
  });

  useEffect(() => {
    const getPins = async () => {
      try {
        const res = await axios.get("/pins");
        setPins(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    getPins();
  }, []);

  const handleMarkerClick = (id, lat, lon) => {
    setCurrentPlaceId(id);
    setViewport({ ...viewport, latitude: lat, longitude: lon });
  };

  const handleAddClick = (e) => {
    setNewPlace({
      lat: Object.values(e.lngLat)[1],
      lon: Object.values(e.lngLat)[0],
    });
    setViewport({
      ...viewport,
      latitude: Object.values(e.lngLat)[1],
      longitude: Object.values(e.lngLat)[0],
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newPin = {
      username: currentUser,
      title,
      desc,
      rating,

      lat: newPlace.lat,
      lon: newPlace.lon,
    };

    try {
      await axios.post("/pins", newPin);
      setPins([...pins, newPin]);
      setNewPlace(null);
    } catch (err) {
      console.err(err);
    }
  };

  const handleLogout = (e) => {
    e.preventDefault();
    myStorage.removeItem("user");
    setCurrentUser(null);
  };

  return (
    <Map
      viewState={viewport}
      style={{ width: "100vw", height: "100vh", overflow: "hidden" }}
      mapboxAccessToken={process.env.REACT_APP_MAPBOX}
      mapStyle="mapbox://styles/mapbox/streets-v9"
      animationMode={"flyTo"}
      onMove={(viewport) =>
        setViewport(
          Math.round({
            ...viewport,
            latitude: viewport.lat,
            longitude: viewport.lon,
          })
        )
      }
      onDblClick={(e) => handleAddClick(e)}
      doubleClickZoom={false}
      double
    >
      {pins.map((p) => (
        <Box key={p._id}>
          <Marker
            longitude={p.lon}
            latitude={p.lat}
            offset={-[viewport.zoom * 9, 0]}
          >
            <LocationOnIcon
              sx={{
                size: viewport.zoom * 9,
                color: currentUser === p.username ? "orangered" : "slateblue",
                cursor: "pointer",
              }}
              onClick={() => handleMarkerClick(p._id, p.lat, p.lon)}
            />
          </Marker>
          {p._id === currentPlaceId && (
            <OutputPopup pins={p} setCurrentPlaceId={setCurrentPlaceId} />
          )}
        </Box>
      ))}
      {newPlace && (
        <InputPopup
          handleSubmit={handleSubmit}
          newPlace={newPlace}
          setCurrentPlaceId={setCurrentPlaceId}
          setTitle={setTitle}
          setDesc={setDesc}
          setRating={setRating}
        />
      )}

      {currentUser ? (
        <Button
          className="button logout"
          title="Log out"
          onClick={(e) => handleLogout(e)}
        />
      ) : (
        <Box className="buttons">
          <Button
            className="button login"
            title="Login"
            onClick={() => setShowLogin(true)}
          />
          <Button
            className="button register"
            title="register"
            onClick={() => setShowRegister(true)}
          />
        </Box>
      )}
      {showregister && <Register setShowRegister={setShowRegister} />}
      {showLogin && (
        <Login
          setShowLogin={setShowLogin}
          myStorage={myStorage}
          setCurrentUser={setCurrentUser}
        />
      )}
    </Map>
  );
}

export default App;
