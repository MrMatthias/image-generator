import { useContext } from "react";
import ImagesContext from "../context/ImagesContext";

const useImages = () => useContext(ImagesContext);

export default useImages;
