import React from "react";
import { Box, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

interface CityCardProps {
  imageUrl: string;
  cityName: string;
}

const CityCard: React.FC<CityCardProps> = ({ imageUrl, cityName }) => {
  const navigate = useNavigate();

  const handleCityClick = () => {
    // Şehir ismiyle listing sayfasına yönlendir (navbar'daki gibi direkt filtreleme)
    navigate(`/listings?cityName=${encodeURIComponent(cityName)}`);
  };

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
          cursor: "pointer",
          transition: "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
          "&:hover": {
            transform: "scale(1.02)",
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
          },
        }}
        onClick={handleCityClick}
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
