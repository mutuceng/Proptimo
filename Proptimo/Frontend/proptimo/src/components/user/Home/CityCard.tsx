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
    <Box
      sx={{
        position: "relative",
        width: "100%",
        aspectRatio: "1 / 1",
        borderRadius: 2,
        backgroundImage: `url(${imageUrl})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        cursor: "pointer",
        transition: "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
        overflow: "hidden",
        "&:hover": {
          transform: "scale(1.02)",
          boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
        },
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.4) 100%)",
          zIndex: 1,
        },
      }}
      onClick={handleCityClick}
    >
      <Box
        sx={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          padding: 2,
          zIndex: 2,
        }}
      >
        <Typography
          sx={{
            fontWeight: 700,
            fontSize: "1.25rem",
            color: "white",
            textAlign: "center",
            textShadow: "0 2px 4px rgba(0,0,0,0.5)",
            userSelect: "none",
            fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
          }}
        >
          {cityName}
        </Typography>
      </Box>
    </Box>
  );
};

export default CityCard;
