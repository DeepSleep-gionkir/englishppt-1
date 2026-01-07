import React, { useState, useEffect } from "react";
// PineIcon removed to prevent unused import warnings/issues

const questions = [
  {
    id: 1,
    badge: "Q1",
    question: "이 글의 교훈으로 가장 적절한 것은?",
    options: [
      "① 삶이란 공정한 것이 아니다.",
      "② 스스로 돕는 것이 가장 좋다.",
      "③ 현재 가진 것으로 만족하라.",
      "④ 나중에 후회하는 것보다 미리 조심하는 편이 낫다.",
      "⑤ 너무 자만해서는 안 된다.",
    ],
    answerIndex: 2, // 0-based, so 3rd option
    type: "vertical",
  },
  {
    id: 2,
    badge: "Q2",
    question: "밑줄 친 ① ~ ⑤ 중에서\n가리키는 바가 다른 것은?",
    // Q2 has special layout: Horizontal numbers, text reveals below
    options: [
      { id: 1, text: "The pine tree" },
      { id: 2, text: "The pine tree" },
      { id: 3, text: "The pine tree" },
      { id: 4, text: "The storm" }, // Answer
      { id: 5, text: "The pine tree" },
    ],
    answerIndex: 3, // 4th item
    type: "horizontal-reveal",
  },
  {
    id: 3,
    badge: "Q3",
    question: "다음 중 본문의 밑줄 친\n(A) pretty와 쓰임이 같은 것은?",
    options: [
      "① I feel pretty good today.",
      "② She made pretty cards for her parents.",
      "③ He found the story pretty funny.",
      "④ It rained pretty hard.",
      "⑤ It's pretty cool to join a sport club.",
    ],
    answerIndex: 1, // 0-based, 2nd option
    type: "vertical",
  },
];

const QuizView = ({ onBack }) => {
  const [qIndex, setQIndex] = useState(0);
  const [step, setStep] = useState(0); // Controls reveal steps within a question

  // Handle Interaction (Click / Space / etc)
  const handleInteraction = () => {
    const currentQ = questions[qIndex];

    if (currentQ.id === 1) {
      // Q1 Logic:
      // Step 0: Initial
      // Step 1: Show Answer (Highlight number)
      // Step 2: Next Question
      if (step === 0) setStep(1);
      else if (step === 1) {
        setQIndex(1);
        setStep(0);
      }
    } else if (currentQ.id === 2) {
      // Q2 Logic:
      // Step 0: Init
      // Step 1: Reveal 1 (Text: The Pine Tree)
      // Step 2: Reveal 2
      // Step 3: Reveal 3
      // Step 4: Reveal 5 (Order: 1, 2, 3, 5)
      // Step 5: Reveal 4 (Text: The storm)
      // Step 6: Highlight 4 (Answer)
      // Step 7: Next Question
      if (step < 6) setStep((prev) => prev + 1);
      else if (step === 6) {
        setQIndex(2);
        setStep(0);
      }
    } else if (currentQ.id === 3) {
      // Q3 Logic:
      // Step 0: Init
      // Step 1: Reveal Answer (Highlight number)
      // Step 2: Exit
      if (step === 0) setStep(1);
      else if (step === 1) onBack();
    }
  };

  // Handle Previous Interaction (ArrowLeft)
  const handlePrevious = () => {
    if (step > 0) {
      setStep((prev) => prev - 1);
    } else if (qIndex > 0) {
      // Move to previous question's last step
      const prevQId = questions[qIndex - 1].id;
      setQIndex(qIndex - 1);

      // Set step based on previous question's max steps
      if (prevQId === 1) setStep(1); // Q1 max step is 1
      else if (prevQId === 2) setStep(6); // Q2 max step is 6
    }
  };

  // Keyboard Listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ([" ", "ArrowRight", "Enter"].includes(e.key)) {
        e.preventDefault();
        handleInteraction();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        handlePrevious();
      } else if (e.key === "Escape") {
        onBack();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [qIndex, step]); // Re-bind on state change

  const currentData = questions[qIndex];

  return (
    <div className="quiz-view" onClick={handleInteraction}>
      <div className="quiz-content-wrapper" key={currentData.id}>
        {/* Header: Badge + Question */}
        <div className="quiz-header fade-in-up">
          <div className="quiz-badge">
            <div className="quiz-badge-shape"></div>
            <span className="quiz-badge-text">{currentData.badge}</span>
          </div>
          <h1 className="quiz-question-text">
            {currentData.question.split("\n").map((line, i) => (
              <React.Fragment key={i}>
                {line}
                <br />
              </React.Fragment>
            ))}
          </h1>
        </div>

        {/* Content Area */}
        <div className="quiz-body fade-in-up delay-100">
          {currentData.id === 2 ? (
            /* Horizontal Reveal Layout for Q2 */
            <div className="q2-options-container">
              <div className="q2-row-numbers">
                {[1, 2, 3, 4, 5].map((num, idx) => (
                  <div
                    key={idx}
                    className={`q2-option-item ${
                      // Highlight logic for Q2: Answer is num 4 (index 3). Highlights at step 6.
                      num === 4 && step >= 6 ? "highlighted" : ""
                    }`}
                  >
                    <div className="q2-circle">{num}</div>
                  </div>
                ))}
              </div>
              <div className="q2-row-texts">
                {[
                  { idx: 1, stepReq: 1, text: "The pine\ntree" },
                  { idx: 2, stepReq: 2, text: "The pine\ntree" },
                  { idx: 3, stepReq: 3, text: "The pine\ntree" },
                  { idx: 4, stepReq: 5, text: "The storm" }, // Note: idx 4 is actually position 4 (mapped later)
                  { idx: 5, stepReq: 4, text: "The pine\ntree" },
                ]
                  .sort((a, b) => a.idx - b.idx)
                  .map((item) => (
                    <div
                      key={item.idx}
                      className={`q2-text-item ${
                        step >= item.stepReq ? "visible" : ""
                      }`}
                    >
                      {item.text.split("\n").map((l, i) => (
                        <React.Fragment key={i}>
                          {l}
                          <br />
                        </React.Fragment>
                      ))}
                    </div>
                  ))}
              </div>
            </div>
          ) : (
            /* Vertical List for Q1 / Q3 */
            <ul className="quiz-options-list">
              {currentData.options.map((opt, idx) => {
                // Strip the unicode number if present to avoid duplication
                // e.g. "① Option" -> "Option"
                let textStr = opt;
                // Identify if it starts with unicode numbers (simple check or regex)
                if (opt.match(/^[①②③④⑤]/)) {
                  textStr = opt.substring(opt.indexOf(" ") + 1);
                }

                const isAnswer = idx === currentData.answerIndex;
                const isRevealed = step >= 1;

                return (
                  <li key={idx} className="quiz-option-row">
                    <div
                      className={`quiz-num ${
                        isAnswer && isRevealed ? "on" : ""
                      }`}
                    >
                      {idx + 1}
                    </div>
                    <span className="quiz-option-text">{textStr}</span>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuizView;
