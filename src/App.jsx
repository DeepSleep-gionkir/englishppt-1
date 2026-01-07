import React, { useState } from "react";
import Sidebar from "./components/Sidebar";
import MainContent from "./components/MainContent";
import PresentationView from "./components/PresentationView";
import WordAnalysisView from "./components/WordAnalysisView";
import QuizView from "./components/QuizView";
import ThankYouView from "./components/ThankYouView";

function App() {
  const [viewMode, setViewMode] = useState("chat"); // 'chat' | 'presentation' | 'words'
  const [chatHistory, setChatHistory] = useState([]);

  // Handles messages from MainContent
  // triggering is now determined by MainContent or passed explicitly?
  // Actually, MainContent handles the "fake" interaction.
  // App should just record the "final committed" state.
  const handleSendMessage = (message, targetView) => {
    console.log("Received message:", message, "Target:", targetView);

    // If message is empty, it's a re-open action (navigation only)
    if (!message && targetView) {
      if (targetView === "presentation") {
        setViewMode("presentation");
        if (document.documentElement.requestFullscreen) {
          document.documentElement.requestFullscreen().catch((err) => {
            console.error("Error attempting to enable fullscreen:", err);
          });
        }
      } else if (targetView === "words") {
        setViewMode("words");
      } else if (targetView === "quiz") {
        setViewMode("quiz");
      }
      return; // Exit without adding history
    }

    // Append User Message to History
    const newUserMsg = { role: "user", text: message };

    // Determine AI Response based on target or content
    let newAiMsg = null;
    if (
      targetView === "presentation" ||
      (message.includes("영어 지문") && message.includes("ppt"))
    ) {
      newAiMsg = {
        role: "ai",
        text: "알겠습니다! 영어 독해 지문을 ppt 형태로 준비했습니다.",
        attachment: {
          type: "presentation",
          title: "영어 독해",
          subtitle: "영어 지문",
        },
      };
    } else if (
      targetView === "words" ||
      (message.includes("단어") &&
        (message.includes("정리") ||
          message.includes("보여줘") ||
          message.includes("지문")))
    ) {
      newAiMsg = {
        role: "ai",
        text: "네, 지문에 나온 영단어를 정리해 드립니다.", // Removed '요'
        attachment: {
          type: "words",
          title: "영어 독해",
          subtitle: "단어 정리",
        },
      };
    } else if (
      targetView === "quiz" ||
      (message.includes("지문") && message.includes("퀴즈"))
    ) {
      newAiMsg = {
        role: "ai",
        text: "지문 바탕으로 퀴즈를 준비했습니다.",
        attachment: { type: "quiz", title: "영어 독해", subtitle: "퀴즈" },
      };
    } else if (targetView === "thankyou" || message.includes("마무리 인사")) {
      newAiMsg = {
        role: "ai",
        text: "알겠습니다. 감사 인사로 마무리하겠습니다.",
        attachment: {
          type: "thankyou",
          title: "영어 독해",
          subtitle: "마무리 인사",
        },
      };
    }

    // Update History
    setChatHistory((prev) => {
      const next = [...prev, newUserMsg];
      if (newAiMsg) next.push(newAiMsg);
      return next;
    });

    // Unified Target Detection
    const finalTarget = targetView || newAiMsg?.attachment?.type;

    // Switch View if needed
    if (finalTarget) {
      if (finalTarget === "presentation") {
        setViewMode("presentation");
        // Request Fullscreen
        if (document.documentElement.requestFullscreen) {
          document.documentElement.requestFullscreen().catch((err) => {
            console.error("Error attempting to enable fullscreen:", err);
          });
        }
      } else if (finalTarget === "words") {
        setViewMode("words");
      } else if (finalTarget === "quiz") {
        setViewMode("quiz");
      } else if (finalTarget === "thankyou") {
        setViewMode("thankyou");
      }
    }
  };

  const handleBack = () => {
    setViewMode("chat");
    // Exit Fullscreen if active
    if (document.fullscreenElement) {
      document.exitFullscreen().catch((err) => {
        console.error("Error attempting to exit fullscreen:", err);
      });
    }
  };

  const handlePresentationFinish = () => {
    handleBack();
  };

  if (viewMode === "presentation") {
    return <PresentationView onFinish={handlePresentationFinish} />;
  }

  if (viewMode === "words") {
    return <WordAnalysisView onBack={handleBack} />;
  }

  if (viewMode === "quiz") {
    return <QuizView onBack={handleBack} />;
  }

  if (viewMode === "thankyou") {
    return <ThankYouView onBack={handleBack} />;
  }

  return (
    <div className="app-container">
      <Sidebar />
      <MainContent
        onSendMessage={handleSendMessage}
        chatHistory={chatHistory}
      />
    </div>
  );
}

export default App;
