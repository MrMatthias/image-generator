import React, { useState, useEffect } from "react";

const ImagesContext = React.createContext();
export default ImagesContext;

export const ImagesProvider = ({ children }) => {
  const [images, setImages] = useState([]);

  const addImage = (image) => {
    setImages((prevImages) => [image, ...prevImages]);
  };

  const deleteImage = async (id) => {
    await fetch(`/api/image?id=${id}`, {
      method: "DELETE",
    });
    setImages((prevImages) => prevImages.filter((image) => image.id !== id));
  };

  useEffect(() => {
    const fetchImages = async () => {
      const response = await fetch("/api/image");
      const data = await response.json();
      setImages(data);
    };
    fetchImages();
  }, []);

  const value = { images, addImage, deleteImage };

  return (
    <ImagesContext.Provider value={value}>{children}</ImagesContext.Provider>
  );
};
