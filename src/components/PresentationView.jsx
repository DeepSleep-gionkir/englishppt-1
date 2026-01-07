import React, { useState, useEffect } from "react";
import { ChevronRight, ChevronLeft, Maximize2 } from "lucide-react";
import PineIcon from "./PineIcon";

const SlideContent = ({ slide }) => {
  if (slide.type === "title") {
    return (
      <div className="title-slide-layout">
        <div className="title-header">
          <div className="title-icon-wrapper">
            <PineIcon className="title-deco" />
          </div>
          <span className="class-name">푸른꿈반</span>
        </div>

        <div className="title-main-box">
          <h1>영어 독해 발표</h1>
          <p>《A Pine Tree's Wishes》</p>
        </div>

        <div className="presenter-name">김은호</div>
      </div>
    );
  }

  return (
    <div className="content-slide-layout">
      {/* Number Icon */}
      {slide.number && (
        <div className="slide-number-icon">
          <PineIcon className="slide-deco" />
          <span className="number-text">{slide.number}</span>
        </div>
      )}

      <div className="slide-text-content">
        {slide.lines.map((line, idx) => (
          <div
            key={idx}
            className="content-line"
            style={{ marginBottom: line.gap ? "2rem" : "1rem" }}
          >
            {line.content}
          </div>
        ))}
      </div>
    </div>
  );
};

const TextHighlight = ({ children, color }) => {
  const className = color === "orange" ? "text-orange" : "text-blue";
  return <span className={className}>{children}</span>;
};

const PresentationView = ({ onFinish }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isVisible, setIsVisible] = useState(true); // For fade effect

  const slides = [
    {
      type: "title",
    },
    {
      type: "content",
      number: 1,
      lines: [
        {
          content: (
            <>
              Once there <TextHighlight color="orange">was</TextHighlight>{" "}
              <TextHighlight color="blue">a pine tree</TextHighlight> in a
              forest.
            </>
          ),
          gap: true,
        },
        {
          content: (
            <>
              <TextHighlight color="blue">Its needles</TextHighlight>{" "}
              <TextHighlight color="orange">were</TextHighlight> evergreen.
            </>
          ),
          gap: true,
        },
        {
          content: (
            <>
              ① <TextHighlight color="blue">It</TextHighlight>{" "}
              <TextHighlight color="orange">said</TextHighlight>, “
              <TextHighlight color="blue">I</TextHighlight>{" "}
              <TextHighlight color="orange">don’t like</TextHighlight> my
              needles.
            </>
          ),
          gap: false,
        },
        {
          content: (
            <>
              <TextHighlight color="blue">They</TextHighlight>{" "}
              <TextHighlight color="orange">aren’t</TextHighlight> pretty.
            </>
          ),
          gap: false,
        },
        {
          content: (
            <>
              <TextHighlight color="blue">I</TextHighlight>{" "}
              <TextHighlight color="orange">wish</TextHighlight>{" "}
              <TextHighlight color="blue">I</TextHighlight>{" "}
              <TextHighlight color="orange">had</TextHighlight> golden leaves.”
            </>
          ),
          gap: false,
        },
      ],
    },
    {
      type: "content",
      number: 2,
      lines: [
        {
          content: (
            <>
              Next morning, <TextHighlight color="blue">its wish</TextHighlight>{" "}
              <TextHighlight color="orange">was granted</TextHighlight>.
            </>
          ),
          gap: true,
        },
        {
          content: (
            <>
              ② <TextHighlight color="blue">It</TextHighlight>{" "}
              <TextHighlight color="orange">had</TextHighlight> shining golden
              leaves.
            </>
          ),
          gap: true,
        },
        {
          content: (
            <>
              But <TextHighlight color="blue">a man</TextHighlight>{" "}
              <TextHighlight color="orange">saw</TextHighlight> the golden
              leaves and <TextHighlight color="orange">started</TextHighlight>{" "}
              picking
            </>
          ),
          gap: false,
        },
        { content: <>them.</>, gap: true },
        {
          content: (
            <>
              Soon <TextHighlight color="blue">the tree</TextHighlight>{" "}
              <TextHighlight color="orange">was stripped</TextHighlight> bare.
            </>
          ),
          gap: false,
        },
      ],
    },
    {
      type: "content",
      number: 3,
      lines: [
        {
          content: (
            <>
              ③ <TextHighlight color="blue">It</TextHighlight> then{" "}
              <TextHighlight color="orange">said</TextHighlight>, “
              <TextHighlight color="blue">I</TextHighlight>{" "}
              <TextHighlight color="orange">was</TextHighlight> wrong.
            </>
          ),
          gap: true,
        },
        {
          content: (
            <>
              <TextHighlight color="blue">I</TextHighlight>{" "}
              <TextHighlight color="orange">wish</TextHighlight>{" "}
              <TextHighlight color="blue">I</TextHighlight>{" "}
              <TextHighlight color="orange">had</TextHighlight> glass leaves.
            </>
          ),
          gap: true,
        },
        {
          content: (
            <>
              <TextHighlight color="blue">They</TextHighlight>
              <TextHighlight color="orange">’d</TextHighlight>{" "}
              <TextHighlight color="orange">look</TextHighlight> pretty and{" "}
              <TextHighlight color="blue">no one</TextHighlight>{" "}
              <TextHighlight color="orange">would steal</TextHighlight> them.”
            </>
          ),
          gap: true,
        },
        {
          content: (
            <>
              The next morning,{" "}
              <TextHighlight color="blue">its wish</TextHighlight>{" "}
              <TextHighlight color="orange">was granted</TextHighlight> again.
            </>
          ),
          gap: true,
        },
        {
          content: (
            <>
              Then <TextHighlight color="blue">a storm</TextHighlight>{" "}
              <TextHighlight color="orange">came</TextHighlight> and ④{" "}
              <TextHighlight color="blue">it</TextHighlight>{" "}
              <TextHighlight color="orange">broke</TextHighlight> all the glass
            </>
          ),
          gap: false,
        },
        { content: <>leaves.</>, gap: false },
      ],
    },
    {
      type: "content",
      number: 4,
      lines: [
        {
          content: (
            <>
              “<TextHighlight color="blue">I</TextHighlight>
              <TextHighlight color="orange">’m</TextHighlight> a fool,”{" "}
              <TextHighlight color="orange">sighed</TextHighlight>{" "}
              <TextHighlight color="blue">the pine tree</TextHighlight>.
            </>
          ),
          gap: true,
        },
        {
          content: (
            <>
              “<TextHighlight color="blue">My needles</TextHighlight>{" "}
              <TextHighlight color="orange">were</TextHighlight> the best for
              me.
            </>
          ),
          gap: true,
        },
        {
          content: (
            <>
              <TextHighlight color="blue">I</TextHighlight>{" "}
              <TextHighlight color="orange">wish</TextHighlight>{" "}
              <TextHighlight color="blue">I</TextHighlight>{" "}
              <TextHighlight color="orange">could have</TextHighlight> them back
              again.”
            </>
          ),
          gap: true,
        },
        {
          content: (
            <>
              Fortunately, <TextHighlight color="blue">its wish</TextHighlight>{" "}
              <TextHighlight color="orange">was granted</TextHighlight> and ⑤{" "}
              <TextHighlight color="blue">it</TextHighlight>{" "}
              <TextHighlight color="orange">got back</TextHighlight>
            </>
          ),
          gap: false,
        },
        { content: <>its (A) pretty needles.</>, gap: false },
      ],
    },
  ];

  const changeSlide = (newIndex) => {
    setIsVisible(false); // Start fade out
    setTimeout(() => {
      if (newIndex >= 0 && newIndex < slides.length) {
        setCurrentSlide(newIndex);
        setTimeout(() => setIsVisible(true), 100); // Start fade in
      } else if (newIndex >= slides.length) {
        // End of presentation
        onFinish();
      }
    }, 500); // Wait for fade out to finish
  };

  const handleNext = () => changeSlide(currentSlide + 1);
  const handlePrev = () => {
    if (currentSlide > 0) changeSlide(currentSlide - 1);
  };

  const handleKeyDown = (e) => {
    if (e.key === "ArrowRight" || e.key === " ") handleNext();
    if (e.key === "ArrowLeft") handlePrev();
    if (e.key === "Escape") onFinish();
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentSlide]);

  const slide = slides[currentSlide];

  return (
    <div className="presentation-view">
      {/* Header / Controls */}
      <div className="presentation-header">
        <div className="slide-counter">
          {currentSlide + 1} / {slides.length}
        </div>
        <button className="fullscreen-btn" onClick={onFinish}>
          <Maximize2 size={20} />
        </button>
      </div>

      {/* Slide Content */}
      <div className={`slide-card ${isVisible ? "fade-in" : "fade-out"}`}>
        <SlideContent slide={slide} />
      </div>

      {/* Navigation Areas */}
      <div className="nav-area left" onClick={handlePrev}>
        <ChevronLeft size={40} />
      </div>
      <div className="nav-area right" onClick={handleNext}>
        <ChevronRight size={40} />
      </div>
    </div>
  );
};

export default PresentationView;
