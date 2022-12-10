import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import gsap from 'gsap';

function openSidebar({
  tl,
  sidebarRef,
  sidebarWidth,
  fullWidth,
}: {
  tl: gsap.core.Timeline;
  sidebarRef: React.RefObject<HTMLElement>;
  fullWidth: boolean;
  sidebarWidth: number;
}) {
  if (fullWidth) {
    return tl.to(sidebarRef.current, { xPercent: 0 }, 0);
  }
  return tl.to(sidebarRef.current, { width: sidebarWidth }, 0);
}

function closeSidebar({
  tl,
  sidebarRef,
  fullWidth,
  leftSide,
}: {
  tl: gsap.core.Timeline;
  sidebarRef: React.RefObject<HTMLElement>;
  fullWidth: boolean;
  leftSide: boolean;
}) {
  if (fullWidth) {
    return (tl = tl.to(sidebarRef.current, { xPercent: leftSide ? -100 : 100 }, 0));
  }
  return (tl = tl.to(sidebarRef.current, { width: 0 }, 0));
}

const useLiveRef = <T,>(value: T) => {
  const ref = useRef(value);
  useEffect(() => {
    ref.current = value;
  }, [value]);
  return ref;
};

interface AnimatedSidebar {
  /**
   * Open the sidebar at first render
   * Default: false
   */
  initiallyOpen?: boolean;
  /**
   * Apply width to the sidebar
   * Default: 200
   */
  sidebarWidth?: number;
  /**
   * Choose opening side
   * Default: false (right side)
   */
  leftSide?: boolean;
  /**
   * Apply zIndex to the sidebar
   * Default: 1
   */
  sidebarZIndex?: number;
  /**
   * Choose mode of the sidebar
   * Normal mode (not full width) the sidebar will push the content
   * Full width mode the sidebar will overlay the content (it uses the first relative parent)
   */
  fullWidth?: boolean;
}

/**
 * Hook to animate the SidebarContainer
 * Spread the returned props on the SidebarContainer
 * @param param0
 */
export const useSidebar = ({
  initiallyOpen = false,
  sidebarWidth = 200,
  fullWidth = false,
  leftSide = false,
  sidebarZIndex = 1,
}: AnimatedSidebar) => {
  const [openState, setOpenState] = useState(initiallyOpen);
  const openStateRef = useLiveRef(openState);
  const sidebarRef = useRef<HTMLElement>(null);
  const animationState = useRef<{ tl: gsap.core.Timeline | null }>({
    tl: null,
  });
  const EASING = useMemo(
    () => (fullWidth ? 'power2.inOut' : 'back.out(1)'),
    [fullWidth],
  );

  const DURATION = useMemo(() => (fullWidth ? 0.6 : 0.8), [fullWidth]);

  const toggleSidebar = useCallback(
    async (callback: gsap.Callback) => {
      if (!sidebarRef.current) return;

      animationState.current.tl?.kill();
      let tl = gsap.timeline({
        paused: true,
        defaults: { duration: DURATION, ease: EASING },
      });

      animationState.current.tl = openStateRef.current
        ? closeSidebar({ tl, sidebarRef, fullWidth, leftSide })
        : openSidebar({ tl, sidebarRef, sidebarWidth, fullWidth });
      setOpenState((v) => !v);

      if (typeof callback === 'function') {
        animationState.current.tl?.call(callback);
      }

      await animationState.current.tl?.restart();
    },
    [DURATION, EASING, fullWidth, openStateRef, sidebarWidth, leftSide],
  );

  useEffect(() => {
    if (fullWidth) {
      gsap.set(sidebarRef.current, {
        zIndex: sidebarZIndex,
        xPercent: openStateRef.current ? 0 : leftSide ? -100 : 100,
      });
      return;
    }
    if (!openStateRef.current) {
      gsap.set(sidebarRef.current, { width: 0 });
      return;
    }
    gsap.set(sidebarRef.current, { width: sidebarWidth });
  }, [fullWidth, sidebarWidth, sidebarZIndex, leftSide, openStateRef]);

  return {
    toggleSidebar,
    open: openState,
    state: {
      ref: sidebarRef,
      width: sidebarWidth,
      leftSide,
      fullWidth,
      open: openState,
    },
  };
};
