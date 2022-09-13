import { Box } from "@mui/system";
import { Ratings } from "../ratings/Ratings";
import StarIcon from "@mui/icons-material/Star";
import { format } from "timeago.js";
import "./outputPopup.css";
import { Popup } from "react-map-gl";
import { PinProps } from "../../App";

interface OutputBoxProps {
  pins: PinProps;
}

type OutputPopupProps = {
  setCurrentPlaceId: React.Dispatch<React.SetStateAction<string | null>>;
} & OutputBoxProps;

export function OutputBox({ pins }: OutputBoxProps) {
  return (
    <Box className="card">
      <label>Place</label>
      <h4>{pins.title}</h4>
      <label>Review</label>
      <p>{pins.desc}</p>
      <label>Rating</label>
      <Box className="star">
        <Ratings number={pins.rating} icon={<StarIcon />} />
      </Box>
      <label>Information</label>
      <span className="username"> Created by {pins.username}</span>
      <span className="date"> {format(pins.createdAt)}</span>
    </Box>
  );
}

export function OutputPopup({ pins, setCurrentPlaceId }: OutputPopupProps) {
  return (
    <Popup
      key={pins._id}
      longitude={pins.lon}
      latitude={pins.lat}
      anchor="left"
      closeButton={true}
      closeOnClick={false}
      onClose={() => setCurrentPlaceId(null)}
    >
      <OutputBox pins={pins} />
    </Popup>
  );
}
