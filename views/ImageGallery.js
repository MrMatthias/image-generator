import React from "react";
import useImages from "../hooks/useImages";
import { Card, Grid, Typography } from "@mui/joy";
import Pagination from "./Pagination";

export default function ImageGallery(props) {
  const { images, count, take, page, loadPage } = useImages();
  const { onSelect } = props;

  const handleSelectImage = (e, image) => {
    e.preventDefault();
    if (onSelect) {
      onSelect(image);
    }
  };

  return (
    <Card>
      <Grid container spacing={2}>
        <Grid item xs={12} textAlign="center">
          <Typography level="h2">Gallery</Typography>
        </Grid>
        <Grid item xs={12} textAlign="center">
          <Grid container spacing={2}>
            {images.map((image) => (
              <Grid key={image.id} item>
                <a href="#" onClick={(e) => handleSelectImage(e, image)}>
                  <img
                    width={80}
                    height={80}
                    src={`images/thumbs/${image.url}`}
                    alt={image.caption}
                  />
                </a>
              </Grid>
            ))}
          </Grid>
        </Grid>
        <Grid item xs={12} textAlign="center">
          <Pagination
            count={count}
            page={page}
            take={take}
            onChange={loadPage}
          />
        </Grid>
      </Grid>
    </Card>
  );
}
