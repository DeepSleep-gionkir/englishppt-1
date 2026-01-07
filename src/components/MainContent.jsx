import React, { useState } from "react";
import {
  Paperclip,
  ArrowUp,
  Copy,
  ThumbsUp,
  ThumbsDown,
  RotateCcw,
} from "lucide-react";
import PineIcon from "./PineIcon";

const MainContent = ({ onSendMessage, chatHistory = [] }) => {
  const [input, setInput] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingMessage, setProcessingMessage] = useState(""); // Store msg being processed
  const [transitionStep, setTransitionStep] = useState(0);
  // 0: Idle
  // 1: User Msg Moving Up
  // 2: Spinner Show
  // 3: Typewriter Effect
  const [showAttachment, setShowAttachment] = useState(false); // Controls attachment visibility
  const [displayedText, setDisplayedText] = useState("");
  const [aiResponseText, setAiResponseText] = useState(""); // Dynamic response text

  // Refs to store data across async transitions
  const pendingDataRef = React.useRef({ msg: "", target: null });
  const chatEndRef = React.useRef(null); // Ref for auto-scrolling

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Scroll on history update or processing step change
  React.useEffect(() => {
    scrollToBottom();
  }, [chatHistory, isProcessing, transitionStep, showAttachment]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSend = () => {
    if (!input.trim()) return;

    let targetView = null;
    let response = "";
    const currentInput = input;

    // Trigger 1: PPT (Flexible)
    // "PPT" is the strong signal. "영어" or "지문" context.
    if (
      (currentInput.includes("ppt") || currentInput.includes("피피티")) &&
      (currentInput.includes("영어") || currentInput.includes("지문"))
    ) {
      targetView = "presentation";
      response = "알겠습니다! 영어 독해 지문을 ppt 형태로 준비했습니다.";
    }
    // Trigger 2: Words
    // "단어" is strong signal. "정리" or "지문". "영어" is optional context here.
    else if (
      currentInput.includes("단어") &&
      (currentInput.includes("정리") ||
        currentInput.includes("지문") ||
        currentInput.includes("보여줘"))
    ) {
      targetView = "words";
      response = "네, 지문에 나온 영단어를 정리해 드립니다.";
    }
    // Trigger 3: Quiz
    // Relaxed check: "퀴즈" is unique enough
    else if (currentInput.includes("퀴즈")) {
      targetView = "quiz";
      response = "지문 바탕으로 퀴즈를 준비했습니다.";
    }
    // Trigger 4: Closing Greeting (Thank You)
    else if (currentInput.includes("마무리 인사")) {
      targetView = "thankyou";
      response = "알겠습니다. 감사 인사로 마무리하겠습니다.";
    }

    if (targetView) {
      // Store in Ref
      pendingDataRef.current = { msg: currentInput, target: targetView };

      setProcessingMessage(currentInput);
      setInput("");
      setIsProcessing(true);
      setAiResponseText(response);
      setTransitionStep(1);
      setShowAttachment(false);

      setTimeout(() => {
        setTransitionStep(2);
      }, 800);

      setTimeout(() => {
        setTransitionStep(3);
      }, 2500);
    } else {
      onSendMessage(currentInput, null);
      setInput("");
    }
  };

  // Timeout Refs for cleanup
  const timeoutsRef = React.useRef([]);

  // Typewriter Effect & Finish Handler
  React.useEffect(() => {
    let interval = null;

    if (transitionStep === 3) {
      let currentIndex = 0;
      interval = setInterval(() => {
        setDisplayedText(aiResponseText.slice(0, currentIndex + 1));
        currentIndex++;
        if (currentIndex === aiResponseText.length) {
          clearInterval(interval);

          // Typing finished. Show Attachment gently.
          const t1 = setTimeout(() => {
            setShowAttachment(true);
          }, 200);
          timeoutsRef.current.push(t1);

          // Wait then switch view
          const t2 = setTimeout(() => {
            // Prevent re-execution loop
            setTransitionStep(4);

            const { msg, target } = pendingDataRef.current;
            onSendMessage(msg, target);
          }, 2000); // Wait 2s before switching
          timeoutsRef.current.push(t2);
        }
      }, 50);
    }

    return () => {
      // Cleanup: Clear interval and ALL timeouts
      if (interval) clearInterval(interval);
      timeoutsRef.current.forEach(clearTimeout);
      timeoutsRef.current = [];
    };
  }, [transitionStep, aiResponseText, onSendMessage]);

  // Determine if we show Chat Layout or Greeting Layout
  const showChatLayout = isProcessing || chatHistory.length > 0;

  // Render Attachment Card Helper
  const renderAttachment = (type, isAnimating = false) => {
    // type: 'presentation' | 'words'
    // Title is always "영어 독해"
    // Subtitle varies.
    // However, if we read from history, we might have stored it in app.jsx.
    // Logic here is for the *animating* one mostly, or falling back.
    // Actually for history items, we pass attachment object.
    // Wait, the history renderer in MainContent uses `msg.attachment` directly?
    // Let's check history renderer.
    // It calls `renderAttachment(msg.attachment.type)`.
    // It does NOT use the stored title/subtitle in msg.attachment...
    // I should update renderAttachment to simpler interface or use the passed object.

    // For proper support, let's allow optional title/subtitle args or defaults.
    // The history loop calls: `renderAttachment(msg.attachment.type)`
    // The animation loop calls: `renderAttachment(pendingDataRef.current.target, true)`

    // So defaults should be correct here.
    const title = "영어 독해";
    const subtitle =
      type === "words"
        ? "단어 정리"
        : type === "quiz"
        ? "퀴즈"
        : type === "thankyou"
        ? "마무리 인사"
        : "영어 지문";

    return (
      <div
        className={`attachment-card ${isAnimating ? "fade-in-up" : ""}`}
        style={isAnimating ? { opacity: 0 } : {}} // Ensure defaults if class handles animation
      >
        <div className="attachment-icon">
          <PineIcon className="attachment-pine" />
        </div>
        <div className="attachment-info">
          <span className="attachment-title">{title}</span>
          <span className="attachment-subtitle">{subtitle}</span>
        </div>
        <button
          className="attachment-open-btn"
          onClick={() => {
            // Trigger F11 Fullscreen Effect as requested
            try {
              if (document.documentElement.requestFullscreen) {
                document.documentElement.requestFullscreen();
              }
            } catch (e) {
              console.warn("Fullscreen denied", e);
            }
            onSendMessage("", type);
          }}
        >
          열기
        </button>
      </div>
    );
  };

  if (showChatLayout) {
    return (
      <div className="main-content">
        <div className="chat-transition-overlay">
          {/* Messages Area (Centered) */}
          <div className="chat-messages-area">
            {/* Render History */}
            {chatHistory.map((msg, idx) => (
              <div
                key={idx}
                className={
                  msg.role === "user"
                    ? "user-message-bubble static"
                    : "ai-history-container"
                }
              >
                {msg.role === "user" ? (
                  msg.text
                ) : (
                  /* Render AI History Msg (Static) */
                  <div className="ai-response-container static">
                    <div className="spinner-wrapper static">
                      <PineIcon />
                    </div>
                    <div className="ai-text-bubble static">{msg.text}</div>

                    {/* Attachment Card Logic */}
                    {msg.attachment && renderAttachment(msg.attachment.type)}

                    <div className="ai-action-icons static">
                      <button className="icon-btn">
                        <Copy size={16} />
                      </button>
                      <button className="icon-btn">
                        <ThumbsUp size={16} />
                      </button>
                      <button className="icon-btn">
                        <ThumbsDown size={16} />
                      </button>
                      <button className="icon-btn">
                        <RotateCcw size={16} />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}

            {/* Current Processing User Message */}
            {isProcessing && (
              <div className="user-message-bubble animating">
                {processingMessage}
              </div>
            )}

            {/* Current Processing AI Response */}
            {isProcessing && transitionStep >= 2 && (
              <div className="ai-response-container">
                <div
                  className="spinner-wrapper"
                  style={{
                    animation: transitionStep === 3 ? "none" : undefined,
                    opacity: 1,
                  }}
                >
                  <PineIcon />
                </div>

                <div className="ai-text-bubble">
                  {transitionStep === 3 && displayedText}
                  {transitionStep === 3 && <span className="cursor">|</span>}
                </div>

                {/* Show Attachment after typing */}
                {transitionStep === 3 &&
                  pendingDataRef.current.target &&
                  showAttachment &&
                  renderAttachment(pendingDataRef.current.target, true)}

                {transitionStep === 3 && (
                  <div className="ai-action-icons">
                    <button className="icon-btn">
                      <Copy size={16} />
                    </button>
                    <button className="icon-btn">
                      <ThumbsUp size={16} />
                    </button>
                    <button className="icon-btn">
                      <ThumbsDown size={16} />
                    </button>
                    <button className="icon-btn">
                      <RotateCcw size={16} />
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Spacer for bottom input - Increased to ensure visibility */}
            <div
              style={{ height: "300px", flexShrink: 0 }}
              ref={chatEndRef}
            ></div>
          </div>

          {/* Fake Input Bar at Bottom */
          /* Only animate slide-down if history is empty (meaning moving from greeting just now).
              If history exists, we are remounting/returning, so stay static. */}
          <div
            className={`input-area-wrapper bottom-fixed ${
              chatHistory.length === 0 ? "animate-slide-down" : ""
            }`}
          >
            <textarea
              className="chat-input"
              placeholder="답글.."
              value={input} // Should be empty now
              onChange={(e) => !isProcessing && setInput(e.target.value)}
              onKeyDown={!isProcessing ? handleKeyDown : undefined}
              disabled={isProcessing}
              rows={1}
            />
            <div className="input-controls">
              <button className="attach-btn" disabled={isProcessing}>
                <Paperclip size={20} />
              </button>
              <div className="right-controls">
                <div className="model-selector">Sonnet 4.5</div>
                <button
                  className={`send-btn ${input.trim() ? "active" : ""}`}
                  onClick={handleSend}
                  disabled={isProcessing || !input.trim()}
                >
                  <ArrowUp size={18} strokeWidth={3} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="main-content">
      {/* Content Container (Greeting Mode) */}
      <div className="content-container">
        {/* Greeting */}
        <div className="greeting-container">
          <div className="plan-badge">
            <span className="star-icon">★</span> 프로페셔널 플랜 업그레이드
          </div>
          <h1 className="greeting-text">
            <div className="icon-wrapper">
              <PineIcon className="greeting-icon" />
            </div>
            좋은 아침입니다, 김은호님
          </h1>
        </div>

        {/* Input Area (Center) */}
        <div className="input-area-wrapper">
          <textarea
            className="chat-input"
            placeholder="오늘은 어떤 도움을 드릴까요?"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={1}
          />

          <div className="input-controls">
            <button className="attach-btn">
              <Paperclip size={20} />
            </button>

            <div className="right-controls">
              <div className="model-selector">Sonnet 4.5</div>
              <button
                onClick={handleSend}
                disabled={!input.trim()}
                className={`send-btn ${input.trim() ? "active" : ""}`}
              >
                <ArrowUp size={18} strokeWidth={3} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Text */}
      <div className="footer-disclaimer">
        Claude는 실수할 수 있습니다. 중요한 정보는 확인해 주세요.
      </div>
    </div>
  );
};

export default MainContent;
