import WarningIcon from "@mui/icons-material/Warning";
import CloseIcon from "@mui/icons-material/Close";
import Alert from "@mui/joy/Alert";
import IconButton from "@mui/joy/IconButton";
import Typography from "@mui/joy/Typography";
import React from "react";

export default function ErrorAlert({ onClose, children }) {
  return (
    <Alert
      startDecorator={<WarningIcon sx={{ mx: 0.5 }} />}
      variant="soft"
      color="danger"
      endDecorator={
        <IconButton variant="soft" size="sm" color="danger" onClick={onClose}>
          <CloseIcon />
        </IconButton>
      }
    >
      <Typography color="danger" fontWeight="md">
        {children}
      </Typography>
    </Alert>
  );
}
