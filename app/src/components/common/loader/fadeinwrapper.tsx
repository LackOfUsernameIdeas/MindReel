import React, { useEffect, useState, ReactNode } from "react";
import { CSSTransition } from "react-transition-group";
import { useLocation } from "react-router-dom";
import Loader from "./Loader";

interface FadeInWrapperProps {
  children: ReactNode;
  loadingTimeout?: number; // Optional timeout for loading phase in ms
  fadeTimeout?: number; // Optional timeout for fade-in effect in ms
}

const FadeInWrapper: React.FC<FadeInWrapperProps> = ({
  children,
  loadingTimeout = 100 // Default to 100ms if not provided
}) => {
  const [isPageLoaded, setIsPageLoaded] = useState(false);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setLoading(false);
      setIsPageLoaded(true);
    }, loadingTimeout);

    return () => clearTimeout(timeoutId);
  }, [location.key, loadingTimeout]);

  return (
    <>
      <CSSTransition
        in={loading}
        timeout={100}
        classNames="fade"
        unmountOnExit
        key="loading"
      >
        <Loader />
      </CSSTransition>

      <CSSTransition
        in={isPageLoaded}
        timeout={600}
        classNames="fade"
        unmountOnExit
      >
        <div>{children}</div>
      </CSSTransition>
    </>
  );
};

export default FadeInWrapper;
