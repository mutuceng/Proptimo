import React from "react";
import { Paper, Step, StepLabel, Stepper } from "@mui/material";

interface ProgressStepsProps {
  steps: string[];
  activeStep: number;
}

export const ProgressSteps: React.FC<ProgressStepsProps> = ({ steps, activeStep }) => {
  return (
    <Paper
      sx={{
        p: 3,
        mb: 4,
        borderRadius: 2,
        backgroundColor: "white"
      }}
      elevation={2}
    >
      <Stepper activeStep={activeStep} alternativeLabel>
        {steps.map((label, index) => (
          <Step key={label}>
            <StepLabel
              sx={{
                "& .MuiStepLabel-label": {
                  fontWeight: activeStep >= index ? 600 : 400,
                  color: activeStep >= index ? "#1976D2" : "#9E9E9E"
                }
              }}
            >
              {label}
            </StepLabel>
          </Step>
        ))}
      </Stepper>
    </Paper>
  );
};
