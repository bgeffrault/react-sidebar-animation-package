import React from 'react';
import { forwardRef } from 'react';

interface IFullWidthSidebar {
  style?: Object;
  children: JSX.Element;
  className?: string;
}

const FullWidthSidebar = forwardRef(({ children, style, className }: IFullWidthSidebar, ref: React.ForwardedRef<HTMLDivElement>) => {
  return (
    <div
      style={{
        ...style,
        height: '100%',
        width: '100%',
        position: 'absolute',
        boxSizing: 'border-box',
      }}
      ref={ref}
      className={className}
    >
      {children}
    </div>
  );
});

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
  style?: {[key: string]: any};
  children: JSX.Element;
  /**
   * Hide/Show sidebar
   */
  open: boolean;
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
 * 
 */
export const SidebarContainer = forwardRef(
  (
    { width = 200, leftSide, fullWidth, style, children, open, className, animatedDivClassName }: ISidebarContainer,
    ref: React.ForwardedRef<HTMLDivElement>,
  ) => {
    if (fullWidth) {
      return (
        <FullWidthSidebar style={style} ref={ref} className={className}>
          {children}
        </FullWidthSidebar>
      );
    }

    const sx: {[key: string]: any} = {
      position: 'absolute',
      top: 0,
      bottom: 0,
      width: fullWidth ? '100%' : width,
      boxSizing: 'border-box',
    };
    leftSide ? (sx.right = 0) : (sx.left = 0);

    const {
      zIndex,
      border,
      borderColor,
      borderLeft,
      borderRight,
      boxShadow,
      margin,
      marginRight,
      marginLeft,
      borderStyle,
      ...rest
    } = (style ?? {}) as {[key: string]: any};

    return (
      <div
        style={{
          height: '100%',
          width,
          position: 'relative',
          backgroundColor: rest.backgroundColor ?? 'unset',
          zIndex: zIndex ?? 1,
          border: border ?? 'initial',
          borderLeft: borderLeft ?? 'initial',
          borderRight: borderRight ?? 'initial',
          borderColor: borderColor ?? 'unset',
          borderStyle: open ? borderStyle ?? 'none' : 'none',
          boxShadow: open ? boxShadow ?? 'none' : 'none',
          margin: open ? margin ?? 0 : 0,
          marginRight: open ? margin ?? 0 : 0,
          marginLeft: open ? margin ?? 0 : 0,
          flexShrink: 0,
        }}
        ref={ref}
        className={animatedDivClassName}
      >
        <div style={{ ...rest, ...sx }} className={className} >{children}</div>
      </div>
    );
  },
);
