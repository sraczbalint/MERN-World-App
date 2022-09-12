import React from "react";
import { Popup } from "react-map-gl";
import { Button } from "../button/button";

function InputBox({ handleSubmit, setTitle, setDesc, setRating }) {
  return (
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
      <Button title="Add rating" />
    </form>
  );
}

export function InputPopup({
  handleSubmit,
  newPlace,
  setCurrentPlaceId,
  setDesc,
  setTitle,
  setRating,
}) {
  return (
    <Popup
      longitude={newPlace.lon}
      latitude={newPlace.lat}
      anchor="left"
      closeOnClick={false}
      closeButton={true}
      onClose={() => setCurrentPlaceId(null)}
    >
      <InputBox
        handleSubmit={handleSubmit}
        setDesc={setDesc}
        setTitle={setTitle}
        setRating={setRating}
      />
    </Popup>
  );
}
