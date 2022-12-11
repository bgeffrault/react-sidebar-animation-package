# React animated Sidebar v1.0.0

## Installation

```shell
$ npm i react-sidebar-animation
```

## Description

An animated sidebar shell for React.

Two behavior:

- Open on the side of your content either left or right.
- Open in fullWidth

The combination is useful if your are looking for a responsive sidebar that has those 2 behaviors depending on your screen size.

## Demo

See the [demo](https://react-sidebar-animation-example.vercel.app/) with [demo source code](https://github.com/bgeffrault/react-sidebar-animation-example).

## Example:

```js
const Example = () => {
  const { toggleSidebar, state, inTransition, open } = useSidebar({
    initiallyOpen: true,
    fullWidth: false,
    sidebarWidth: SIDEBAR_WIDTH,
  });

  return (
    <div
      style={{
        position: 'relative',
        display: 'flex',
        height: '100vh',
        width: '100vw',
      }}
    >
      <div
        style={{
          flexGrow: 1,
          padding: '16px',
        }}
      >
        <button onClick={toggleSidebar}>Toggle sidebar</button>
      </div>
      <SidebarContainer
        {...state}
        zIndex={10}
        style={{
          backgroundColor: '#1976D2',
          color: 'white',
          padding: '8px',
          boxShadow: '2px 0px 2px 1px #1575C0',
          marginRight: '2px',
        }}
      >
        <div>Sidebar</div>
      </SidebarContainer>
    </div>
  );
};
```

See the [package source](https://github.com/bgeffrault/react-sidebar-animation-package) for more details.
