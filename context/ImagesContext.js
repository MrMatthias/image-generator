import React, { useState, useEffect } from "react";

const ImagesContext = React.createContext();
export default ImagesContext;

export const ImagesProvider = ({ children }) => {
  const [images, setImages] = useState([]);
  const [count, setCount] = useState(0);
  const [page, setPage] = useState(1);
  const [take, setTake] = useState(21);

  useEffect(() => {
    loadPage(1);
  }, []);

  const loadPage = async (page) => {
    const response = await fetch(`/api/image?page=${page}`);
    const data = await response.json();
    setImages(data.images);
    setCount(data.count);
    setTake(data.take);
    setPage(page);
  };

  const addImage = (image) => {
    setImages((prevImages) => [image, ...prevImages]);
  };

  const deleteImage = async (id) => {
    await fetch(`/api/image?id=${id}`, {
      method: "DELETE",
    });
    setImages((prevImages) => prevImages.filter((image) => image.id !== id));
  };

  const value = { images, addImage, deleteImage, count, page, loadPage, take };

  return (
    <ImagesContext.Provider value={value}>{children}</ImagesContext.Provider>
  );
};
