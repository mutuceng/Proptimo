import React from "react";
import { Box } from "@mui/material";
import CityCard from "./CityCard";

const cities = [
  {
    cityName: "İstanbul",
    imageUrl: "/istanbul.jpg",
  },
  {
    cityName: "Ankara",
    imageUrl: "/Ankara-1366x768-1-770x433.jpg",
  },
  {
    cityName: "İzmir",
    imageUrl: "/Izmir-Turkey-coast.jpg",
  },
];

const CityGrid: React.FC = () => {
  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit,minmax(158px,1fr))",
        gap: 3,
        p: 1,
      }}
    >
      {cities.map(({ cityName, imageUrl }) => (
        <CityCard key={cityName} cityName={cityName} imageUrl={imageUrl} />
      ))}
    </Box>
  );
};

export default CityGrid;
