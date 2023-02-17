import React from "react";
import ReactDOM from "react-dom";
import styles from "./ImageShadowBox.module.css";

export default function ImageShadowBox({ image, onClose }) {
  return ReactDOM.createPortal(
    <div onClick={onClose} className={styles.shadowbox}>
      <img
        className={styles.content}
        src={`images/${image.url}`}
        alt={image.caption}
      />
    </div>,
    document.getElementById("overlays")
  );
}
