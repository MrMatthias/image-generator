import React from "react";

import { Button } from "@mui/joy";

import styles from "./Pagination.module.css";

import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

export default function Pagination({ count, page, take, onChange }) {
  const numbers = [];
  const pages = Math.ceil(count / take);
  const spread = 1;
  const caps = 3;

  let i = 1;

  const renderNumber = (page, currentPage) => {
    const linkPage = page;

    numbers.push(
      <a
        className={page === currentPage ? styles.current : ""}
        onClick={() => onChange(linkPage)}
      >
        {page}
      </a>
    );
    if (page < pages) {
      numbers.push(<> </>);
    }
  };

  // start
  for (i = 1; i <= pages && i <= caps; i++) {
    renderNumber(i, page);
  }

  // middle
  let j = Math.max(i, page - spread);
  if (j - spread > pages - caps) {
    j = Math.max(i, pages - caps + 1);
  }

  if (j > i) {
    numbers.push(<>... </>);
  }

  for (j; j <= page + spread && j < pages; j++) {
    renderNumber(j, page);
  }

  // end
  let k = Math.max(j, pages - caps + 1);

  if (k > j) {
    numbers.push(<>... </>);
  }

  for (k; k <= pages; k++) {
    renderNumber(k, page);
  }

  return (
    <div className={styles.pagination}>
      <Button onClick={() => onChange(page - 1)} disabled={page === 1}>
        <ChevronLeftIcon />
      </Button>
      {numbers}
      <Button
        onClick={() => onChange(page + 1)}
        disabled={page * take >= count}
      >
        <ChevronRightIcon />
      </Button>
    </div>
  );
}
