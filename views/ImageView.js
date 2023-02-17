import React, { useState } from "react";
import { Card, Grid, Typography, Button, IconButton } from "@mui/joy";
import DownloadIcon from "@mui/icons-material/Download";
import ImageShadowBox from "./ImageShadowBox";

export default function ImageView({ image, onDelete, onRegenerate }) {
  const [isShadowBoxOpen, setIsShadowBoxOpen] = useState(false);

  const handleShadowBoxOpen = () => {
    setIsShadowBoxOpen(true);
  };

  return (
    <>
      {isShadowBoxOpen && (
        <ImageShadowBox
          image={image}
          onClose={() => setIsShadowBoxOpen(false)}
        />
      )}
      <Card>
        <Grid container spacing={2}>
          <Grid item xs={12} textAlign="center">
            <Typography level="h2">{image.caption}</Typography>
          </Grid>
          <Grid item xs={12} textAlign="center">
            <img
              onClick={handleShadowBoxOpen}
              width={256}
              height={256}
              src={`images/${image.url}`}
              alt={image.caption}
            />
          </Grid>
          <Grid item xs={12} textAlign="center">
            <Grid container spacing={2} justifyContent="center">
              <Grid item>
                <Button>
                  <a href={`images/${image.url}`} download={image.url}>
                    <DownloadIcon />
                  </a>
                </Button>
              </Grid>
              <Grid item>
                <Button onClick={() => onRegenerate(image.caption)}>
                  Regenerate
                </Button>
              </Grid>
              <Grid item>
                <Button color="danger" onClick={() => onDelete(image.id)}>
                  Delete
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Card>
    </>
  );
}
