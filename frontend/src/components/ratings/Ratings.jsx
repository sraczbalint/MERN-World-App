export const Ratings = ({ number, icon }) => {
  let ratings = [];
  for (let i = 0; i < number - 1; ++i) {
    ratings.push(icon);
  }
  return ratings;
};
