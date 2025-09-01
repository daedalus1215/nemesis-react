import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type ScrollDirection = "up" | "down" | "none";

interface ScrollContextType {
  isVisible: boolean;
  direction: ScrollDirection;
  scrollY: number;
  hasScrolled: boolean; // New: tracks if user has scrolled at all
}

const ScrollContext = createContext<ScrollContextType | undefined>(undefined);

interface ScrollProviderProps {
  children: ReactNode;
  threshold?: number;
  debounceMs?: number;
}

export const ScrollProvider: React.FC<ScrollProviderProps> = ({ 
  children, 
  threshold = 3, 
  debounceMs = 100 
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const [direction, setDirection] = useState<ScrollDirection>("none");
  const [scrollY, setScrollY] = useState(0);
  const [hasScrolled, setHasScrolled] = useState(false);

  useEffect(() => {
    console.log('🚀 ScrollProvider initialized');
    let timeoutId: NodeJS.Timeout;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setScrollY(currentScrollY);
      
      // Track if user has scrolled at all
      if (currentScrollY > 0 && !hasScrolled) {
        setHasScrolled(true);
        console.log('📜 User has started scrolling');
      }
      
      // Check if we're near the bottom of the page
      const windowHeight = window.innerHeight;
      const documentHeight = document.body.scrollHeight;
      const scrollPosition = currentScrollY + windowHeight;
      const distanceFromBottom = documentHeight - scrollPosition;
      
      console.log(`📏 Scroll position: ${currentScrollY}, Distance from bottom: ${distanceFromBottom}`);
      
      // Hide navigation when near bottom (within 100px), show when not
      if (distanceFromBottom < 100) {
        if (isVisible) {
          console.log('🙈 Near bottom of page, hiding navigation');
          setIsVisible(false);
        }
      } else {
        if (!isVisible) {
          console.log('👁️ Not near bottom, showing navigation');
          setIsVisible(true);
        }
      }

      // Determine scroll direction for other uses
      if (Math.abs(currentScrollY - scrollY) < threshold) {
        return; // Ignore tiny scroll movements
      }

      const newDirection: ScrollDirection = 
        currentScrollY > scrollY ? "down" : "up";
      
      console.log(`📜 Scroll: ${newDirection}, Y: ${currentScrollY}, lastY: ${scrollY}, diff: ${currentScrollY - scrollY}`);
      
      setDirection(newDirection);

      // Only use debounce for edge cases
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        // Additional logic if needed
      }, debounceMs);
    };

    // Show navigation at the top of the page
    const handleScrollToTop = () => {
      if (window.scrollY <= 20) {
        console.log('🏠 At top of page, showing navigation');
        setIsVisible(true);
      }
    };

    console.log('📡 Adding scroll event listeners');
    window.addEventListener("scroll", handleScroll);
    window.addEventListener("scroll", handleScrollToTop);

    return () => {
      console.log('🧹 Cleaning up scroll event listeners');
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("scroll", handleScrollToTop);
      clearTimeout(timeoutId);
    };
  }, [scrollY, threshold, debounceMs, hasScrolled, isVisible]);

  const value: ScrollContextType = {
    isVisible,
    direction,
    scrollY,
    hasScrolled
  };

  return (
    <ScrollContext.Provider value={value}>
      {children}
    </ScrollContext.Provider>
  );
};

export const useScroll = (): ScrollContextType => {
  const context = useContext(ScrollContext);
  if (context === undefined) {
    throw new Error('useScroll must be used within a ScrollProvider');
  }
  return context;
};
