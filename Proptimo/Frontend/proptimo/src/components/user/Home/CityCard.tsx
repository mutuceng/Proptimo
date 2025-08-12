import React from "react";
import { Box, Typography } from "@mui/material";

interface CityCardProps {
  imageUrl: string;
  cityName: string;
}

const CityCard: React.FC<CityCardProps> = ({ imageUrl, cityName }) => {
  return (
    <Box display="flex" flexDirection="column" gap={1} pb={3}>
      <Box
        sx={{
          width: "100%",
          aspectRatio: "1 / 1",
          borderRadius: 2,
          backgroundImage: `url(${imageUrl})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      <Typography
        sx={{
          fontWeight: 500,
          fontSize: 16,
          color: "#0d141c",
          userSelect: "none",
        }}
      >
        {cityName}
      </Typography>
    </Box>
  );
};

export default CityCard;
