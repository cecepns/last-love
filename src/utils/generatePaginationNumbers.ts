export const generatePaginationNumbers = (
  currentPage: number,
  totalPages: number,
  visibleNumbers: number
): number[] => {
  const paginationNumbers: number[] = [];
  const halfVisible = Math.floor(visibleNumbers / 2);
  
  currentPage = Math.max(1, Math.min(currentPage, totalPages));
  
  if (totalPages <= visibleNumbers) {
    for (let i = 1; i <= totalPages; i++) {
      paginationNumbers.push(i);
    }
  } else if (currentPage <= halfVisible + 1) {
    for (let i = 1; i <= visibleNumbers - 1; i++) {
      paginationNumbers.push(i);
    }
    paginationNumbers.push(-1); // Add ellipsis
    paginationNumbers.push(totalPages); // Last page number
  } else if (currentPage >= totalPages - halfVisible) {
    // Display pages near the end
    paginationNumbers.push(1); // First page number
    paginationNumbers.push(-1); // Add ellipsis
    for (let i = totalPages - visibleNumbers + 2; i <= totalPages; i++) {
      paginationNumbers.push(i);
    }
  } else {
    paginationNumbers.push(1); // First page number
    paginationNumbers.push(-1); // Add ellipsis
    for (let i = currentPage - halfVisible; i <= currentPage + halfVisible; i++) {
      paginationNumbers.push(i);
    }
    paginationNumbers.push(-1); // Add ellipsis
    paginationNumbers.push(totalPages); // Last page number
  }
  
  return paginationNumbers;
};
  
