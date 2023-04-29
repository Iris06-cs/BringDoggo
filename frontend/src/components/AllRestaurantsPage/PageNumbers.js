import React, { useState } from "react";

const PageNumbers = ({ pageNumber, onPageChange, currentPage }) => {
  const [startNum, setStartNum] = useState(1);
  const showPages = 8;
  let endNum = Math.min(
    pageNumber,
    Math.ceil(startNum / showPages) * showPages
  );

  const handlePageNumClick = (pageNum) => {
    // get the results for corresponding page num,also update currentpage
    onPageChange(pageNum);
  };
  const handlePrev = () => {
    if (startNum > 1) setStartNum((prev) => prev - showPages);
  };
  const handleNext = () => {
    if (endNum <= pageNumber) setStartNum((prev) => prev + showPages);
  };

  const pageRange = () => {
    let res = [];

    for (let i = startNum; i <= endNum; i++) {
      res.push(
        <button
          key={i}
          onClick={() => handlePageNumClick(i)}
          className={currentPage === i ? "active" : ""}
        >
          {i}
        </button>
      );
    }
    return res;
  };

  return (
    <div>
      <button onClick={handlePrev} disabled={startNum === 1}>
        {"<"}
      </button>
      {pageRange()}
      <button onClick={handleNext} disabled={endNum === pageNumber}>
        {">"}
      </button>
      <span>
        {currentPage}/{pageNumber}
      </span>
    </div>
  );
};
export default PageNumbers;
