"use client";

import { useEffect, useRef, useState } from "react";

const MY_NAME = "Eduardo";
const HER_NAME = "Diana Angelina Sanchez";
const YES_GIF_SRC = "https://media1.tenor.com/m/mfC-cc_TL_sAAAAC/thank-you.gif";

const NO_BUTTON_LABELS = [
  "No",
  "Was that a mistake",
  "Are you serious?",
  "Are you sure? :("
];

const NO_BUTTON_SCALE = [1, 0.82, 0.66, 0.5];

type MemoryPhoto = {
  src: string;
  alt: string;
  x: number;
  y: number;
  r: number;
};

const photoPath = (filename: string) => `/photos/${encodeURIComponent(filename)}`;

const MEMORY_PHOTOS: MemoryPhoto[] = [
  { src: photoPath("IMG_0946.JPEG"), alt: "Memory photo 1", x: -136, y: -40, r: -14 },
  { src: photoPath("IMG_1194.jpg"), alt: "Memory photo 2", x: -94, y: -66, r: -9 },
  { src: photoPath("IMG_1209.jpg"), alt: "Memory photo 3", x: -40, y: -50, r: -4 },
  { src: photoPath("IMG_3525.jpg"), alt: "Memory photo 4", x: 16, y: -70, r: 1 },
  { src: photoPath("IMG_4182.jpg"), alt: "Memory photo 5", x: 72, y: -48, r: 6 },
  { src: photoPath("IMG_4235.jpg"), alt: "Memory photo 6", x: 130, y: -34, r: 11 },
  { src: photoPath("IMG_5450.JPEG"), alt: "Memory photo 7", x: -2, y: 8, r: -2 },
  { src: photoPath("IMG_5524.jpg"), alt: "Memory photo 8", x: 90, y: 10, r: 7 }
];

export function ValentineScene() {
  const sectionRef = useRef<HTMLElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const envelopeRef = useRef<HTMLDivElement>(null);
  const flapRef = useRef<HTMLDivElement>(null);
  const pocketRef = useRef<HTMLDivElement>(null);
  const photoDeckRef = useRef<HTMLDivElement>(null);
  const photoRefs = useRef<Array<HTMLElement | null>>([]);
  const letterRef = useRef<HTMLElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const yesButtonRef = useRef<HTMLButtonElement>(null);
  const noButtonRef = useRef<HTMLButtonElement>(null);

  const [isReducedMotion, setIsReducedMotion] = useState(false);
  const [isAccepted, setIsAccepted] = useState(false);
  const [gifLoadError, setGifLoadError] = useState(false);
  const [noStep, setNoStep] = useState(0);
  const lastActionTimeRef = useRef({ yes: 0, no: 0 });

  useEffect(() => {
    const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    const updatePreferences = () => {
      setIsReducedMotion(reducedMotionQuery.matches);
    };

    updatePreferences();

    if (reducedMotionQuery.addEventListener) {
      reducedMotionQuery.addEventListener("change", updatePreferences);

      return () => {
        reducedMotionQuery.removeEventListener("change", updatePreferences);
      };
    }

    reducedMotionQuery.addListener(updatePreferences);

    return () => {
      reducedMotionQuery.removeListener(updatePreferences);
    };
  }, []);

  useEffect(() => {
    if (isReducedMotion) {
      return;
    }

    let mounted = true;
    let cleanup = () => {};

    (async () => {
      const gsapModule = await import("gsap");
      const triggerModule = await import("gsap/ScrollTrigger");
      if (!mounted) {
        return;
      }

      const { gsap } = gsapModule;
      const { ScrollTrigger } = triggerModule;
      gsap.registerPlugin(ScrollTrigger);

      const ctx = gsap.context(() => {
        const photoCards = photoRefs.current.filter(
          (element): element is HTMLElement => element !== null
        );

        gsap.set(envelopeRef.current, {
          rotationY: 0,
          transformStyle: "preserve-3d"
        });
        gsap.set(flapRef.current, {
          rotationX: 0,
          transformOrigin: "top center"
        });
        gsap.set(photoDeckRef.current, {
          yPercent: 72,
          scale: 0.8,
          autoAlpha: 0,
          zIndex: 3
        });
        gsap.set(photoCards, {
          x: 0,
          y: 38,
          rotation: 0,
          scale: 0.55,
          autoAlpha: 0
        });
        gsap.set(letterRef.current, {
          yPercent: 76,
          scale: 0.9,
          autoAlpha: 0,
          zIndex: 3
        });
        gsap.set(ctaRef.current, {
          autoAlpha: 0,
          y: 12
        });
        gsap.set(pocketRef.current, {
          yPercent: 0
        });

        const timeline = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: "bottom bottom",
            pin: pinRef.current,
            scrub: true,
            anticipatePin: 1,
            invalidateOnRefresh: true
          }
        });

        // Segment A (0.00 -> 0.25): envelope front to back flip.
        timeline.to(envelopeRef.current, { rotationY: 180, duration: 0.25 }, 0);

        // Segment B (0.25 -> 0.45): back flap opens.
        timeline.to(flapRef.current, { rotationX: -165, duration: 0.2 }, 0.25);

        // Segment C (0.45 -> 0.86): photo memories rise out one-by-one before the letter appears.
        timeline.to(
          photoDeckRef.current,
          {
            yPercent: -26,
            scale: 1,
            autoAlpha: 1,
            ease: "power2.out",
            duration: 0.22
          },
          0.45
        );
        timeline.to(
          photoDeckRef.current,
          {
            zIndex: 6,
            duration: 0.01
          },
          0.56
        );
        timeline.to(
          photoCards,
          {
            x: (index) => MEMORY_PHOTOS[index]?.x ?? 0,
            y: (index) => MEMORY_PHOTOS[index]?.y ?? 0,
            rotation: (index) => MEMORY_PHOTOS[index]?.r ?? 0,
            scale: 1.08,
            autoAlpha: 1,
            ease: "power3.out",
            duration: 0.14,
            stagger: 0.055
          },
          0.5
        );
        timeline.to(
          photoCards,
          {
            scale: 1,
            ease: "power1.out",
            duration: 0.07,
            stagger: 0.055
          },
          0.62
        );
        timeline.to(
          pocketRef.current,
          {
            yPercent: 4,
            ease: "power1.out",
            duration: 0.2
          },
          0.55
        );

        // Segment C (0.86 -> 0.92): reveal the letter after photos clear the envelope.
        timeline.to(
          letterRef.current,
          {
            zIndex: 8,
            duration: 0.01
          },
          0.86
        );
        timeline.to(
          letterRef.current,
          {
            yPercent: -82,
            scale: 1.02,
            autoAlpha: 1,
            ease: "power2.out",
            duration: 0.06
          },
          0.86
        );

        // Segment D (0.92 -> 1.00): lock final max-size letter state and reveal CTA.
        timeline.to(
          letterRef.current,
          {
            yPercent: -58,
            scale: 1.12,
            autoAlpha: 1,
            ease: "power1.out",
            duration: 0.08
          },
          0.92
        );
        timeline.to(
          ctaRef.current,
          {
            autoAlpha: 1,
            y: 0,
            ease: "power1.out",
            duration: 0.08
          },
          0.95
        );
        timeline.to(
          photoDeckRef.current,
          {
            autoAlpha: 1,
            scale: 1,
            ease: "none",
            duration: 0.1
          },
          0.9
        );
      }, sectionRef);

      const onResize = () => {
        ScrollTrigger.refresh();
      };

      window.addEventListener("resize", onResize);

      cleanup = () => {
        window.removeEventListener("resize", onResize);
        ctx.revert();
      };
    })();

    return () => {
      mounted = false;
      cleanup();
    };
  }, [isReducedMotion]);

  const handleNoPress = () => {
    setNoStep((current) => {
      if (current >= 4) {
        return current;
      }
      return current + 1;
    });
  };

  const handleYesPress = async () => {
    setIsAccepted(true);
    setGifLoadError(false);

    const confettiModule = await import("canvas-confetti");
    const confetti = confettiModule.default;

    confetti({
      particleCount: 120,
      spread: 70,
      startVelocity: 35,
      origin: { y: 0.7 }
    });

    confetti({
      particleCount: 60,
      spread: 55,
      angle: 60,
      origin: { x: 0.15, y: 0.72 }
    });

    confetti({
      particleCount: 60,
      spread: 55,
      angle: 120,
      origin: { x: 0.85, y: 0.72 }
    });
  };

  const runActionOnce = (
    key: "yes" | "no",
    action: () => void | Promise<void>
  ) => {
    const now = Date.now();
    if (now - lastActionTimeRef.current[key] < 240) {
      return;
    }
    lastActionTimeRef.current[key] = now;
    void action();
  };

  const activateYes = () => {
    runActionOnce("yes", handleYesPress);
  };

  const activateNo = () => {
    runActionOnce("no", handleNoPress);
  };

  const noButtonVisible = noStep < 4;
  const noButtonLabel = NO_BUTTON_LABELS[Math.min(noStep, NO_BUTTON_LABELS.length - 1)];
  const noButtonScale = NO_BUTTON_SCALE[Math.min(noStep, NO_BUTTON_SCALE.length - 1)];

  const isPointInside = (x: number, y: number, rect: DOMRect) => (
    x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom
  );

  const isCtaInteractive = () => {
    if (!ctaRef.current) {
      return false;
    }

    const style = window.getComputedStyle(ctaRef.current);
    return style.visibility !== "hidden" && Number.parseFloat(style.opacity || "0") > 0.35;
  };

  const tryFallbackActivation = (
    x: number,
    y: number,
    target: EventTarget | null
  ) => {
    if (!isCtaInteractive()) {
      return;
    }

    if (target instanceof Element && target.closest("button")) {
      return;
    }

    const yesRect = yesButtonRef.current?.getBoundingClientRect();
    if (yesRect && isPointInside(x, y, yesRect)) {
      activateYes();
      return;
    }

    if (!noButtonVisible) {
      return;
    }

    const noRect = noButtonRef.current?.getBoundingClientRect();
    if (noRect && isPointInside(x, y, noRect)) {
      activateNo();
    }
  };

  return (
    <>
      <section
        ref={sectionRef}
        className={`relative overflow-hidden ${isReducedMotion ? "min-h-screen" : "h-[400vh]"}`}
        aria-label="Valentine envelope scroll scene"
        onPointerDownCapture={(event) => {
          tryFallbackActivation(event.clientX, event.clientY, event.target);
        }}
        onTouchStartCapture={(event) => {
          const touchPoint = event.touches[0] ?? event.changedTouches[0];
          if (!touchPoint) {
            return;
          }
          tryFallbackActivation(touchPoint.clientX, touchPoint.clientY, event.target);
        }}
        onClickCapture={(event) => {
          tryFallbackActivation(event.clientX, event.clientY, event.target);
        }}
      >
        <div
          ref={pinRef}
          className="relative flex h-screen items-center justify-center px-4"
        >
          <div className="scene-bg-orb scene-bg-orb-a" aria-hidden />
          <div className="scene-bg-orb scene-bg-orb-b" aria-hidden />

          <div className="scene-shell">
            <div className="envelope-perspective">
              <div
                ref={envelopeRef}
                className="envelope-3d"
                style={isReducedMotion ? { transform: "rotateY(180deg)" } : undefined}
              >
                <div className="envelope-face envelope-front">
                  <p className="label-line">From: {MY_NAME}</p>
                  <p className="label-line">To: {HER_NAME}</p>
                  <p className="scroll-hint">Scroll to open</p>
                </div>

                <div className="envelope-face envelope-back">
                  <div
                    ref={photoDeckRef}
                    className="photo-deck"
                    style={
                      isReducedMotion
                        ? { transform: "translateY(-26%) scale(1)", opacity: 1, zIndex: 6 }
                        : undefined
                    }
                    aria-hidden
                  >
                    {MEMORY_PHOTOS.map((photo, index) => (
                      <figure
                        key={photo.src}
                        ref={(element) => {
                          photoRefs.current[index] = element;
                        }}
                        className="memory-photo"
                        style={
                          isReducedMotion
                            ? {
                                transform: `translate3d(${photo.x}px, ${photo.y}px, 0) rotate(${photo.r}deg) scale(1)`,
                                opacity: 1
                              }
                            : undefined
                        }
                      >
                        <img
                          src={photo.src}
                          alt={photo.alt}
                          width={220}
                          height={300}
                          loading="lazy"
                          decoding="async"
                          onError={(event) => {
                            event.currentTarget.src = "/photos/placeholder.svg";
                          }}
                        />
                      </figure>
                    ))}
                  </div>

                  <div className="letter-anchor">
                    <article
                      ref={letterRef}
                      className="letter-card"
                      style={
                        isReducedMotion
                          ? { transform: "translateY(-58%) scale(1.12)", opacity: 1, zIndex: 8 }
                          : undefined
                      }
                    >
                      {isAccepted ? (
                        <div className="yes-gif-wrap">
                          <h2 className="letter-title">Thank you my love!!!!!!</h2>
                          <img
                            className="yes-gif"
                            src={YES_GIF_SRC}
                            alt="Celebration GIF"
                            loading="eager"
                            decoding="async"
                            onError={() => {
                              setGifLoadError(true);
                            }}
                          />
                          {gifLoadError ? (
                            <p className="gif-fallback">
                              GIF failed to load from <code>{YES_GIF_SRC}</code>.
                            </p>
                          ) : null}
                        </div>
                      ) : (
                        <>
                          <h1 className="letter-title">Will you be my Valentine?</h1>
                          <div
                            ref={ctaRef}
                            className="cta-row"
                            style={
                              isReducedMotion
                                ? {
                                    opacity: 1,
                                    transform: "translateY(0px)",
                                    visibility: "visible"
                                  }
                                : undefined
                            }
                          >
                            <button
                              ref={yesButtonRef}
                              type="button"
                              className="cta-btn cta-btn-yes"
                              onPointerDown={(event) => {
                                event.stopPropagation();
                                activateYes();
                              }}
                              onTouchStart={(event) => {
                                event.stopPropagation();
                                activateYes();
                              }}
                              onClick={() => {
                                activateYes();
                              }}
                              onKeyDown={(event) => {
                                if (event.key === "Enter" || event.key === " ") {
                                  activateYes();
                                }
                              }}
                              aria-label="Yes, I will be your Valentine"
                            >
                              Yes
                            </button>
                            {noButtonVisible ? (
                              <button
                                ref={noButtonRef}
                                type="button"
                                className="cta-btn cta-btn-no"
                                onPointerDown={(event) => {
                                  event.stopPropagation();
                                  activateNo();
                                }}
                                onTouchStart={(event) => {
                                  event.stopPropagation();
                                  activateNo();
                                }}
                                onClick={() => {
                                  activateNo();
                                }}
                                onKeyDown={(event) => {
                                  if (event.key === "Enter" || event.key === " ") {
                                    activateNo();
                                  }
                                }}
                                style={{ transform: `scale(${noButtonScale})` }}
                                aria-label={noButtonLabel}
                              >
                                {noButtonLabel}
                              </button>
                            ) : null}
                          </div>
                        </>
                      )}
                    </article>
                  </div>

                  <div ref={pocketRef} className="envelope-pocket" aria-hidden />
                  <div
                    ref={flapRef}
                    className="envelope-flap"
                    style={
                      isReducedMotion
                        ? { transform: "rotateX(-165deg)" }
                        : undefined
                    }
                    aria-hidden
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
