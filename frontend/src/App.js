import React, { useEffect, useState } from "react";
import Map, { Marker, Popup } from "react-map-gl";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import StarIcon from "@mui/icons-material/Star";
import axios from "axios";
import { format } from "timeago.js";
import "mapbox-gl/dist/mapbox-gl.css";
import "./App.css";
import { Box } from "@mui/system";
import Register from "./components/register/Register";
import Login from "./components/login/Login";

const Ratings = ({ number }) => {
  let ratings = [];
  for (let i = 0; i < number - 1; ++i) {
    ratings.push(<StarIcon />);
  }
  return ratings;
};

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

  console.log(currentPlaceId);

  useEffect(() => {
    const getPins = async () => {
      try {
        const res = await axios.get("/pins");
        console.log("response", res);
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
    console.log(Object.values(e.lngLat)[1]);
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
    console.log("newPin", newPin);

    try {
      const res = await axios.post("/pins", newPin);
      console.log("res", res);
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
          {p._id === currentPlaceId &&
            (console.log(p.rating),
            (
              <Popup
                key={p._id}
                longitude={p.lon}
                latitude={p.lat}
                anchor="left"
                closeButton={true}
                closeOnClick={false}
                onClose={() => setCurrentPlaceId(null)}
              >
                <Box className="card">
                  <label>Place</label>
                  <h4>{p.title}</h4>
                  <label>Review</label>
                  <p>{p.desc}</p>
                  <label>Rating</label>
                  <Box className="star">
                    <Ratings number={p.rating} />
                    {Array(p.rating).fill(<StarIcon className="star" />)}
                  </Box>
                  <label>Information</label>
                  <span className="username"> Created by {p.username}</span>
                  <span className="date"> {format(p.createdAt)}</span>
                </Box>
              </Popup>
            ))}
        </Box>
      ))}
      {newPlace && (
        <Popup
          longitude={newPlace.lon}
          latitude={newPlace.lat}
          anchor="left"
          closeOnClick={false}
          closeButton={true}
          onClose={() => setCurrentPlaceId(null)}
        >
          <form onSubmit={(e) => handleSubmit(e)}>
            <label>Title</label>
            <input
              placeholder="Enter a title"
              onChange={(e) => setTitle(e.target.value)}
            ></input>
            <label>Review</label>
            <input
              placeholder="Say us something about this place"
              onChange={(e) => setDesc(e.target.value)}
            ></input>
            <label>Rating</label>
            <select onChange={(e) => setRating(e.target.value)}>
              <option value={1}>1</option>
              <option value={2}>2</option>
              <option value={3}>3</option>
              <option value={4}>4</option>
              <option value={5}>5</option>
            </select>
            <button>Add rating</button>
          </form>
        </Popup>
      )}
      {currentUser ? (
        <button className="button logout" onClick={(e) => handleLogout(e)}>
          Log out
        </button>
      ) : (
        <Box className="buttons">
          <button className="button login" onClick={() => setShowLogin(true)}>
            Login
          </button>
          <button
            className="button register"
            onClick={() => setShowRegister(true)}
          >
            Register
          </button>
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
