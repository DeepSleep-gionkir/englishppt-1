import React from "react";
import PineIcon from "./PineIcon";
import { ChevronLeft } from "lucide-react";

const interleavedWordList = [
  { en: "once", ko: "옛날에, 한때" },
  { en: "shining", ko: "빛나는" },
  { en: "pine tree", ko: "소나무" },
  { en: "strip", ko: "벗다, 벗기다" },
  { en: "forest", ko: "숲" },
  { en: "bare", ko: "숲" },
  { en: "needle", ko: "침엽" },
  { en: "glass", ko: "유리" },
  { en: "evergreen", ko: "늘 푸르른" },
  { en: "steal", ko: "훔치다" },
  { en: "pretty", ko: "예쁜" },
  { en: "storm", ko: "폭풍" },
  { en: "golden", ko: "금색의, 금빛의" },
  { en: "fool", ko: "바보" },
  { en: "leaf", ko: "잎" },
  { en: "sigh", ko: "한숨을 쉬다" },
  { en: "wish", ko: "바라다, 소망하다" },
  { en: "fortunately", ko: "다행히" },
  { en: "grant", ko: "허락하다, 들어주다" },
  { en: "get back", ko: "돌아오다, 되돌아가다" },
];

const WordAnalysisView = ({ onBack }) => {
  // Handle Keyboard Exit (Esc, Space, Arrows)
  React.useEffect(() => {
    const handleKeyDown = (e) => {
      // Allow exit on: Escape, Space, ArrowLeft, ArrowRight
      if (["Escape", " ", "ArrowLeft", "ArrowRight"].includes(e.key)) {
        e.preventDefault(); // Prevent scroll for space/arrows
        onBack();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onBack]);

  return (
    <div className="word-analysis-view">
      <div className="word-content-wrapper">
        {/* Word Grid */}
        <div className="word-grid">
          {interleavedWordList.map((item, index) => (
            <div key={index} className="word-item">
              <span className="word-en">{item.en} : </span>
              <span className="word-ko">{item.ko}</span>
            </div>
          ))}
        </div>
      </div>

      {/* No Back Button UI - Exit via Keyboard */}
    </div>
  );
};

export default WordAnalysisView;
