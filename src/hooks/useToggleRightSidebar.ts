import { useCallback, useEffect, useMemo, useRef } from 'react';
import gsap from 'gsap';

type UseToggleRightSidebarProps = {
  initialState?: 'opened' | 'closed';
  sidebarWidth?: number;
  mobileOnly?: boolean;
  isSmallScreen?: boolean;
};

export const useToggleRightSidebar = ({
  initialState = 'opened',
  sidebarWidth = 247,
  mobileOnly,
  isSmallScreen = false,
}: UseToggleRightSidebarProps) => {
  const bodyRef = useRef<HTMLDivElement | null>(null);
  const sidebarRef = useRef<HTMLDivElement | null>(null);
  const animationState = useRef<{ tl: GSAPTimeline | null; lastState: string }>({
    lastState: isSmallScreen ? 'closed' : initialState,
    tl: null,
  });
  const EASING = useMemo(
    () => (isSmallScreen ? 'power2.inOut' : 'back.out(1)'),
    [isSmallScreen],
  );
  const DURATION = useMemo(() => (isSmallScreen ? 0.6 : 0.8), [isSmallScreen]);

  const handleToggleSidebar = useCallback(
    async (callback?: () => any) => {
      if ((mobileOnly && !isSmallScreen) || !bodyRef.current || !sidebarRef.current)
        return;

      animationState.current.tl?.kill();
      let tl = gsap.timeline({
        paused: true,
        defaults: { duration: DURATION, ease: EASING },
      });
      animationState.current.lastState === 'opened' ? closeSidebar() : openSidebar();

      animationState.current.tl = tl;
      if (typeof callback === 'function') {
        animationState.current.tl.call(callback);
      }
      await animationState.current.tl.restart();

      function openSidebar() {
        animationState.current.lastState = 'opened';
        tl = tl.fromTo(sidebarRef.current, { xPercent: 100 }, { xPercent: 0 }, 0);
        tl = isSmallScreen
          ? tl.to(bodyRef.current, { xPercent: -100 }, 0)
          : tl.to(
              bodyRef.current,
              {
                width:
                  (bodyRef.current as HTMLDivElement).offsetWidth - sidebarWidth,
              },
              0,
            );
      }

      function closeSidebar() {
        animationState.current.lastState = 'closed';
        animationState.current.tl = tl.to(sidebarRef.current, { xPercent: 100 }, 0);
        isSmallScreen
          ? tl.to(bodyRef.current, { xPercent: 0 }, 0)
          : tl.to(bodyRef.current, { width: '100%' }, 0);
      }
    },
    [DURATION, EASING, isSmallScreen, mobileOnly, sidebarWidth],
  );

  useEffect(() => {
    if (animationState.current.lastState === 'closed') {
      gsap.set(sidebarRef.current, { xPercent: 100 });
      gsap.set(bodyRef.current, { width: '100%' });
      return;
    }

    if (isSmallScreen) {
      gsap.set(bodyRef.current, { clearProps: 'width' });
      gsap.set(bodyRef.current, { xPercent: -100 });
      return;
    }

    if (!bodyRef.current) return;
    gsap.set(bodyRef.current, { clearProps: 'xPercent' });
    gsap.set(bodyRef.current, {
      width: bodyRef.current.offsetWidth - sidebarWidth,
    });
  }, [isSmallScreen, mobileOnly, sidebarWidth]);

  useEffect(() => {
    if (mobileOnly && !isSmallScreen) {
      gsap.set(sidebarRef.current, { clearProps: 'xPercent' });
      gsap.set(bodyRef.current, { clearProps: 'xPercent' });
    }
  }, []);

  return { handleToggleSidebar, bodyRef, sidebarRef };
};
