import React from 'react';
import { forwardRef } from 'react';

interface IFullWidthSidebar {
  style?: Object;
  children: JSX.Element;
}

const FullWidthSidebar = forwardRef(({ children, style }: IFullWidthSidebar, ref: React.ForwardedRef<HTMLDivElement>) => {
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
    >
      {children}
    </div>
  );
});

interface ISidebarContainer {
  width?: number;
  leftSide?: boolean;
  fullWidth?: boolean;
  style?: Object;
  children: JSX.Element;
  open: boolean;
}

export const SidebarContainer = forwardRef(
  (
    { width, leftSide, fullWidth, style, children, open }: ISidebarContainer,
    ref: React.ForwardedRef<HTMLDivElement>,
  ) => {
    if (fullWidth) {
      return (
        <FullWidthSidebar style={style} ref={ref}>
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
      >
        <div style={{ ...rest, ...sx }}>{children}</div>
      </div>
    );
  },
);
