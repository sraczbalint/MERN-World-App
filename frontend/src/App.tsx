import React, { useEffect, useState } from "react";
import Map, { Marker } from "react-map-gl";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import "mapbox-gl/dist/mapbox-gl.css";
import "./App.css";
import { Box } from "@mui/system";
import Register from "./components/register/Register";
import Login from "./components/login/Login";
import { OutputPopup } from "./components/outputPopup/OutputPopup";
import { InputPopup } from "./components/inputPopup/InputPopup";
import { Button } from "./components/button/button";
import { axiosGetPins, axiosPostPins, PinProps } from "../src/api/index";

interface NewPlaceProps {
  lat: number;
  lon: number;
}

interface ViewPortProps {
  longitude: number;
  latitude: number;
  zoom: number;
  bearing?: number | undefined;
  pitch?: number;
  padding?: mapboxgl.PaddingOptions;
}

function App() {
  const myStorage = window.localStorage;
  const [currentUser, setCurrentUser] = useState<string | null>(
    myStorage.getItem("user")
  );
  const [pins, setPins] = useState<PinProps[]>([]);
  const [currentPlaceId, setCurrentPlaceId] = useState<string | null>(null);
  const [title, setTitle] = useState<string | null>(null);
  const [desc, setDesc] = useState<string | null>(null);
  const [rating, setRating] = useState<number | string>(1);
  const [newPlace, setNewPlace] = useState<NewPlaceProps | null>(null);
  const [showregister, setShowRegister] = useState<boolean>(false);
  const [showLogin, setShowLogin] = useState<boolean>(false);
  const [viewport, setViewport] = useState<ViewPortProps>({
    longitude: 2,
    latitude: 48,
    zoom: 3,
  });

  useEffect(() => {
    const getPins = async () => {
      try {
        const res = await axiosGetPins();
        setPins(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    getPins();
  }, []);

  const handleMarkerClick = (id: string, lat: number, lon: number) => {
    setCurrentPlaceId(id);
    setViewport({ ...viewport, latitude: lat, longitude: lon });
  };

  const handleAddClick = (e: mapboxgl.MapLayerMouseEvent) => {
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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const newPin = {
      username: currentUser,
      title,
      desc,
      rating,
      lat: newPlace?.lat,
      lon: newPlace?.lon,
    };

    try {
      const res = await axiosPostPins(newPin);
      setPins([...pins, res.data]);
      setNewPlace(null);
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogout = (e: React.FormEvent<HTMLInputElement>) => {
    e.preventDefault();
    myStorage.removeItem("user");
    setCurrentUser(null);
  };

  return (
    <Map
      {...viewport}
      style={{ width: "100vw", height: "100vh", overflow: "hidden" }}
      mapboxAccessToken={process.env.REACT_APP_MAPBOX}
      mapStyle="mapbox://styles/mapbox/streets-v9"
      onMove={(evt) => setViewport(evt.viewState)}
      onDblClick={(e: mapboxgl.MapLayerMouseEvent) => handleAddClick(e)}
      doubleClickZoom={false}
    >
      {pins.map((p) => (
        <Box key={p._id}>
          <Marker
            longitude={p.lon}
            latitude={p.lat}
            offset={[0, -viewport.zoom]}
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
          onClick={(e: React.FormEvent<HTMLInputElement>) => handleLogout(e)}
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
