import { RefObject, useCallback, useEffect, useRef } from "react";
import gsap from "gsap";

type useToggleRightSidebarProps = {
  bodyRef: RefObject<HTMLDivElement | null>;
  sidebarRef: RefObject<HTMLDivElement | null>;
  initialState?: "opening" | "closing";
  sidebarWidth?: number | string;
  mobileOnly?: boolean;
  isSmallScreen?: boolean;
};

export const useToggleRightSidebar = ({
  bodyRef,
  sidebarRef,
  initialState = "opening",
  sidebarWidth = 247,
  mobileOnly,
  isSmallScreen = false
}: useToggleRightSidebarProps) => {
  const animationState = useRef<{ tl: GSAPTimeline | null; lastState: string }>(
    {
      lastState: isSmallScreen ? "closing" : initialState,
      tl: null,
    }
  );
  const EASING = isSmallScreen ? "power2.inOut" : "back.out(1)";
  const DURATION = isSmallScreen ? 0.6 : 0.8;

  const handleToggleSidebar = useCallback(
    async (callback?: () => any) => {
      if (mobileOnly && !isSmallScreen) return;
      if (animationState.current.lastState === "opening") {
        animationState.current.lastState = "closing";
        animationState.current.tl?.kill();
        animationState.current.tl = gsap
          .timeline({
            paused: true,
            defaults: { duration: DURATION, ease: EASING },
          })
          .to(sidebarRef.current, { xPercent: 100 }, 0);
        if (isSmallScreen) {
          animationState.current.tl.to(bodyRef.current, { xPercent: 0 }, 0);
        } else {
          animationState.current.tl.to(bodyRef.current, { width: "100%" }, 0);
        }
      } else {
        animationState.current.lastState = "opening";
        animationState.current.tl?.kill();
        animationState.current.tl = gsap
          .timeline({
            paused: true,
            defaults: { duration: DURATION, ease: EASING },
          })
          .fromTo(sidebarRef.current, { xPercent: 100 }, { xPercent: 0 }, 0);
        if (isSmallScreen) {
          animationState.current.tl.to(bodyRef.current, { xPercent: -100 }, 0);
        } else {
          animationState.current.tl.to(
            bodyRef.current,
            { width: `calc(100% - ${sidebarWidth})` },
            0
          );
        }
      }
      if (callback) {
        animationState.current.tl.call(callback);
      }
      await animationState.current.tl.restart();
    },
    [isSmallScreen]
  );

  useEffect(() => {
    if (animationState.current.lastState === "closing") {
      gsap.set(sidebarRef.current, { xPercent: 100 });
      gsap.set(bodyRef.current, { width: "100%" });
    }
    if (animationState.current.lastState === "opening") {
      if (isSmallScreen) {
        gsap.set(bodyRef.current, { clearProps: "width" });
        gsap.set(bodyRef.current, { xPercent: -100 });
      }
      if (!isSmallScreen) {
        gsap.set(bodyRef.current, { clearProps: "xPercent" });
        gsap.set(bodyRef.current, { width: `calc(100% - ${sidebarWidth})` });
      }
    }
    if (mobileOnly && !isSmallScreen) {
      gsap.set(sidebarRef.current, { clearProps: "xPercent" });
      gsap.set(bodyRef.current, { clearProps: "xPercent" });
    }
  }, [isSmallScreen]);

  return handleToggleSidebar;
};