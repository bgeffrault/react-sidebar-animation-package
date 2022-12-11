import React from 'react';
import { forwardRef } from 'react';

interface IFullWidthSidebar {
  style?: Object;
  children: JSX.Element;
  className?: string;
  zIndex: number;
}

const FullWidthSidebar = forwardRef(
  (
    { children, style, className, zIndex }: IFullWidthSidebar,
    ref: React.ForwardedRef<HTMLDivElement>,
  ) => {
    return (
      <div
        style={{
          ...style,
          height: 'initial',
          width: '100%',
          position: 'absolute',
          boxSizing: 'border-box',
          zIndex,
        }}
        ref={ref}
        className={className}
      >
        {children}
      </div>
    );
  },
);

interface ISidebarContainer {
  /**
   * Set the sidebar width
   */
  width?: number;
  /**
   * Sidebar open on the right by default, set to true to open on the left
   */
  leftSide?: boolean;
  /**
   * Change the animation: Display the sidebar on the whole screen
   */
  fullWidth?: boolean;
  /**
   * Additional styled to be applied to the sidebar
   */
  style?: { [key: string]: any };
  children: JSX.Element;
  /**
   * Sidebar zIndex
   * Default: 1
   */
  zIndex?: number;
  /**
   * Applied to the sidebar content in normal mode (not fullWidth), and to the sidebar in fullWidth mode
   */
  className?: string;
  /**
   * animatedDivClassName: className to be applied to the animated div in the "normal" (not fullWidth) case
   * For normal case we render an animated div containing another div who contains the sidebar content
   */
  animatedDivClassName?: string;
}

/**
 * SidebarContainer
 */
export const SidebarContainer = forwardRef(
  (
    {
      width = 320,
      leftSide,
      fullWidth,
      style,
      children,
      zIndex = 1,
      className,
      animatedDivClassName,
    }: ISidebarContainer,
    ref: React.ForwardedRef<HTMLDivElement>,
  ) => {
    if (fullWidth) {
      return (
        <FullWidthSidebar
          style={style}
          zIndex={zIndex}
          ref={ref}
          className={className}
        >
          {children}
        </FullWidthSidebar>
      );
    }

    const sx: { [key: string]: any } = {
      position: 'absolute',
      top: 0,
      bottom: 0,
      width: fullWidth ? '100%' : width,
      boxSizing: 'border-box',
    };
    leftSide ? (sx.right = 0) : (sx.left = 0);

    return (
      <div
        style={{
          height: '100%',
          width,
          position: 'relative',
          zIndex: zIndex ?? 1,
          flexShrink: 0,
        }}
        ref={ref}
        className={animatedDivClassName}
      >
        <div style={{ ...style, ...sx }} className={className}>
          {children}
        </div>
      </div>
    );
  },
);
