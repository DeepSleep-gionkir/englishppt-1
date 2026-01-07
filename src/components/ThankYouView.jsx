import React, { useEffect } from "react";

const ThankYouView = ({ onBack }) => {
  // Handle interaction (Space/ArrowRight/Enter/Click to exit)
  const handleInteraction = () => {
    onBack();
  };

  // Keyboard Listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ([" ", "ArrowRight", "Enter", "Escape"].includes(e.key)) {
        e.preventDefault();
        handleInteraction();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div className="thankyou-view" onClick={handleInteraction}>
      <div className="thankyou-content">
        <h1 className="thankyou-en">Thank you</h1>
        <h2 className="thankyou-kr">감사합니다</h2>
      </div>
      {/* Visual Decorator Bars based on reference image (Orange top/bottom hints) */}
      <div className="thankyou-bar top"></div>
      <div className="thankyou-bar bottom"></div>
    </div>
  );
};

export default ThankYouView;
