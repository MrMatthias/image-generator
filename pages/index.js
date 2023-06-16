import { useState } from "react";
import ImageGallery from "../views/ImageGallery";
import useImages from "../hooks/useImages";
import ImageView from "../views/ImageView";
import {
  Card,
  Input,
  Button,
  Grid,
  Typography,
  CircularProgress,
} from "@mui/joy";
import BrushIcon from "@mui/icons-material/Brush";
import ErrorAlert from "../views/ErrorAlert";

export default function ImageGenerator() {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [image, setImage] = useState(null);
  const [inputPrompt, setInputPrompt] = useState("");
  const { addImage, deleteImage } = useImages();

  const handleSelectImage = (image) => {
    if (isLoading) return;
    setImage(image);
  };

  const handleRegenerate = async (prompt) => {
    generateImage(prompt);
  };

  const handleDelete = async (id) => {
    setIsLoading(true);
    await deleteImage(id);
    setIsLoading(false);
    setImage(null);
  };

  const generateImage = async (prompt) => {
    setError(null);
    setImage(null);
    setIsLoading(true);

    const response = await fetch("/api/image", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt: prompt,
      }),
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        if (data.error) {
          throw new Error(data.error);
        }
        setImage(data);
        addImage(data);
      })
      .catch((err) => {
        setError(err.message);
      });
    setIsLoading(false);
  };

  const handleCloseError = () => {
    setError(null);
  };

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    setInputPrompt("");
    generateImage(inputPrompt);
  };

  return (
    <Grid container spacing={3} maxWidth={800} margin="auto">
      <Grid item xs={12} textAlign="center">
        <Typography level="h1">Image Generator</Typography>
      </Grid>
      <Grid item xs={12}>
        <Card>
          <form onSubmit={handleSubmit}>
            <Input
              required
              startDecorator={<BrushIcon />}
              endDecorator={<Button type="submit">Generate</Button>}
              placeholder="Image description..."
              type="text"
              value={inputPrompt}
              onChange={(e) => setInputPrompt(e.target.value)}
              id="prompt"
              name="prompt"
            />
          </form>
        </Card>
      </Grid>
      {isLoading && (
        <Grid
          item
          xs={12}
          display="flex"
          justifyContent={"center"}
          alignItems={"center"}
          height={300}
        >
          <CircularProgress size="lg" />
        </Grid>
      )}
      {error && (
        <Grid item xs={12} justifyContent={"center"}>
          <ErrorAlert onClose={handleCloseError}>{error}</ErrorAlert>
        </Grid>
      )}
      {image && (
        <Grid item xs={12}>
          <ImageView
            image={image}
            onRegenerate={handleRegenerate}
            onDelete={handleDelete}
          />
        </Grid>
      )}
      <Grid item xs={12}>
        <ImageGallery onSelect={handleSelectImage} />
      </Grid>
    </Grid>
  );
}
