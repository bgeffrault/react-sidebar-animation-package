import { useCallback, useEffect, useRef, useState, RefObject } from "react";
import gsap from "gsap";

type useToggleAnimationProps = {
  wrapperRef: RefObject<HTMLDivElement | null>;
  elementRef: RefObject<HTMLDivElement | null>;
  buttonRef: RefObject<HTMLElement | null>;
  opened?: boolean;
};

export const useToggleAnimation = ({
  wrapperRef,
  elementRef,
  buttonRef,
  opened = false,
}: useToggleAnimationProps) => {
  const [open, setOpen] = useState(opened);
  const animationState = useRef<{
    lastState: string;
    tl: GSAPTimeline | null;
  }>({ lastState: "closing", tl: null });
  const defaultStateAppliedRef = useRef(false);

  const handleOpen = useCallback(
    ({
      scrollIntoView,
    }: { scrollIntoView?: boolean; immediate?: boolean } = {}) => {
      animationState.current.lastState = "opening";
      setOpen(true);
      requestAnimationFrame(() => {
        animationState.current.tl?.kill();
        animationState.current.tl = gsap
          .timeline({ paused: true })
          .call(() => {
            wrapperRef.current!.classList.add("open");
            if (scrollIntoView) {
              wrapperRef.current!.scrollIntoView({
                block: "nearest",
                behavior: "smooth",
              });
            }
          })
          .to(
            elementRef.current,
            {
              height: "auto",
              duration: 0.5,
              ease: "back.out(1)",
            },
            0
          )
          .to(buttonRef.current, { rotate: 180, duration: 0.3 }, 0)
          .call(() => {
            if (scrollIntoView) {
              // Call a second time in case the elementRef was at the bottom
              wrapperRef.current!.scrollIntoView({
                block: "nearest",
                behavior: "smooth",
              });
            }
          });
        animationState.current.tl?.restart();
      });
    },
    []
  );

  const handleClose = useCallback(() => {
    animationState.current.lastState = "closing";
    animationState.current.tl?.kill();
    animationState.current.tl = gsap
      .timeline({
        paused: true,
      })
      .call(() => {
        wrapperRef.current?.classList.remove("open");
      })
      .to(elementRef.current, {
        height: 0,
        duration: 0.8,
        ease: "back.out(1)",
      })
      .to(
        buttonRef.current,
        { rotate: 0, duration: 0.3, clearProps: "transform" },
        0
      )
      .call(() => {
        setOpen(false);
      });
    animationState.current.tl?.restart();
  }, []);

  const handleToggle = useCallback(
    async ({ scrollIntoView = false }: { scrollIntoView?: boolean } = {}) => {
      if (animationState.current.lastState === "opening") {
        handleClose();
        return;
      }
      handleOpen({ scrollIntoView });
    },
    []
  );

  useEffect(() => {
    if (!defaultStateAppliedRef.current && opened) {
      defaultStateAppliedRef.current = true;
      animationState.current.lastState = "opening";
      wrapperRef.current!.classList.add("open");
      gsap.set(elementRef.current, { height: "auto" });
      gsap.set(buttonRef.current, { rotate: 180 });
    }
  }, [opened]);

  return { open, handleToggle };
};
