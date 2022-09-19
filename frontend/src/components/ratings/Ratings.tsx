import { keys } from "@mui/system";

interface RatingsProps {
  number: number;
  icon: any;
}

export const Ratings = ({ number, icon }: RatingsProps) => {
  let ratings: any[] = [];
  for (let i = 0; i < number; ++i) {
    ratings.push("*");
  }
  return <>{ratings.fill(icon)}</>;
};
