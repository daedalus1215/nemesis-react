import { useState, useEffect } from "react";

type ScrollDirection = "up" | "down" | "none";

export const useScrollDirection = (threshold = 10, debounceMs = 100) => {
  console.log('🔥 useScrollDirection hook called!'); // Basic test
  
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [direction, setDirection] = useState<ScrollDirection>("none");

  useEffect(() => {
    console.log('🚀 useScrollDirection useEffect running');
    let timeoutId: NodeJS.Timeout;

    const handleScroll = () => {
      console.log('📜 Scroll event fired!', window.scrollY);
      const currentScrollY = window.scrollY;
      
      // Determine scroll direction
      if (Math.abs(currentScrollY - lastScrollY) < threshold) {
        console.log('📏 Scroll too small, ignoring');
        return; // Ignore small scroll movements
      }

      const newDirection: ScrollDirection = 
        currentScrollY > lastScrollY ? "down" : "up";
      
      console.log(`📜 Scroll: ${newDirection}, Y: ${currentScrollY}, isVisible: ${isVisible}`);
      
      setDirection(newDirection);
      setLastScrollY(currentScrollY);

      // Debounce the visibility change
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        if (newDirection === "down" && currentScrollY > 100) {
          console.log('🙈 Hiding bottom navigation');
          setIsVisible(false); // Hide navbar when scrolling down (after initial scroll)
        } else if (newDirection === "up") {
          console.log('👁️ Showing bottom navigation');
          setIsVisible(true); // Show navbar when scrolling up
        }
      }, debounceMs);
    };

    // Show navbar at the top of the page
    const handleScrollToTop = () => {
      if (window.scrollY <= 30) {
        console.log('🏠 At top of page, showing navigation');
        setIsVisible(true);
      }
    };

    console.log('📡 Adding scroll event listeners');
    console.log('📏 Current scroll state:', {
      scrollY: window.scrollY,
      innerHeight: window.innerHeight,
      scrollHeight: document.body.scrollHeight,
      isScrollable: document.body.scrollHeight > window.innerHeight
    });
    
    window.addEventListener("scroll", handleScroll);
    window.addEventListener("scroll", handleScrollToTop);

    // Test if scroll events work by manually triggering one
    setTimeout(() => {
      console.log('🧪 Testing scroll event detection...');
      window.dispatchEvent(new Event('scroll'));
    }, 1000);

    // Test if we can detect scroll position changes
    setTimeout(() => {
      console.log('🧪 Testing scroll position detection...');
      console.log('Current scrollY:', window.scrollY);
      console.log('Document height:', document.body.scrollHeight);
    }, 2000);

    return () => {
      console.log('🧹 Cleaning up scroll event listeners');
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("scroll", handleScrollToTop);
      clearTimeout(timeoutId);
    };
  }, [lastScrollY, threshold, debounceMs, isVisible]);

  return { isVisible, direction };
};
