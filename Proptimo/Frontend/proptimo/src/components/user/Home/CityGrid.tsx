import React from "react";
import { Box } from "@mui/material";
import CityCard from "./CityCard";

const cities = [
  {
    cityName: "İstanbul",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCOhxWI-SrYO3LHS1tkbIqpIxM4aQOHsYyMwkFPLOQjPU5h1AAzDE7ZHvYPXpWHUM5x6tD9Gemqr7RBhXt4tIUQ21HWQzCimRha4uv9Z3Jy_3pdx5nW2014lRTDMWu57qXGnJCnaP9N2aKrxYUNIQsoSi9GnXSAlPTpjEDg4a6lm6CE7HksQ_OtS0uXYKMfgO8eoYolmmvJcT4082zJ452x111mBgJFe_Y10EeQdITJleCxg9uxwSVH-JNG6Z9VsZXCuR0_vPrdwC9N",
  },
  {
    cityName: "Ankara",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBVD99npdZVrGhXF7aOScHHS5LevhZdQIlirksOZ357stUkquxhMaV1exLBprqTrp2nyABec1h1_8dLdRvNFx1_H6iZGwcjEuK9ObxAHCppBJ-ibCqP8YCaOnAK9R1Gjhgpn9Nbs7Xo09HrbyPazHhxdM_4ue3RJqvGqeMC0mlSg0X3wexkFLUZjS8SIE1zIHrXar7VR2DLc6hQjVeSqfE29BypYdu6jsCUc-_kxLrppCfbz8u_uv78dWJ4BD3gJLx7opEp4gJ6dtpq",
  },
  {
    cityName: "İzmir",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuA0MV6u14APSHBiRpaB8QHjYuStY5mlHV4xh-V2wr_QlxIJXsn4psZLKdNtuq6o2YMJCP_U-LI_VjrbIPFDzUMt6d4MpsysTph8ldM07kBf-fS-oYL4Gdy-WnLcSFvhV0yfaOhAFgVCnD7iMuVKUkZYM5ZfnWxH-NzLoGTBSRTa_WQui6en5slo250mbhwM5CdEyO6N2qlf8KAq3RPwT76WOjZeP8CAPz578i_HvmCcRB95AH0uxrh_4WVSjxHSek1CCOFXQeBglQs8",
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
