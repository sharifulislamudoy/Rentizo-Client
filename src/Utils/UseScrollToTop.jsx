import { useEffect } from 'react';

// Custom hook to scroll the window to the top when the component mounts
const useScrollToTop = () => {
  useEffect(() => {
    window.scrollTo(0, 0); // Scrolls the page to the top-left corner
  }, []); // Empty dependency array means this runs only once when component mounts
};

export default useScrollToTop;
