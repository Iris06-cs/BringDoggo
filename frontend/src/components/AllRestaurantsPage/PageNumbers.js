import React from "react";

const PageNumbers = ({ pageNumber, onPageChange, currentPage }) => {
  const showPages = 9;
  const handlePageNumClick = (pageNum) => {
    // get the results for corresponding page num,also update currentpage
    onPageChange(pageNum);
  };

  const handlePrev = () => {
    // onPageChange will set current page to prev page, fetch prev page
    if (currentPage > 1) onPageChange(currentPage - 1);
  };

  const handleNext = () => {
    // onPageChange will set current page to nexy page, fetch next page
    if (currentPage < pageNumber) onPageChange(currentPage + 1);
  };
  const pageRange = () => {
    const pageRanges = [];
    let startPage = Math.max(1, currentPage - Math.floor(showPages / 2));
    let endPage = Math.min(pageNumber, startPage + showPages - 1);

    // Adjust the startPage if the endPage goes beyond the last page
    if (endPage - startPage + 1 < showPages && startPage > 1) {
      startPage = Math.max(1, endPage - showPages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pageRanges.push(
        <button
          key={i}
          onClick={() => handlePageNumClick(i)}
          className={currentPage === i ? "active" : ""}
        >
          {i}
        </button>
      );
    }
    return pageRanges;
  };
  return (
    <div className="pagination-container">
      <div className="page-btn">
        <button onClick={handlePrev} disabled={currentPage === 1}>
          {"<"}
        </button>
        {pageRange()}
        <button onClick={handleNext} disabled={currentPage === pageNumber}>
          {">"}
        </button>
      </div>
      <div>
        {currentPage}/{pageNumber}
      </div>
    </div>
  );
};
export default PageNumbers;
