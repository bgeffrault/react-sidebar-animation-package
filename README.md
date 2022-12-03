# React animated Sidebar v0.

An animated sidebar shell for React

Two behavior:

- Open on the side of your content either left or right.
- Open in fullWidth

The combination is useful if your are looking for a responsive sidebar that has those 2 behaviors depending on your screen size.

Example:

```js
const Example = () => {
  const { toggleSidebar, state } = useSidebar({
    initiallyOpen: true,
    sidebarWidth: SIDEBAR_WIDTH,
    fullWidth: false,
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
        style={{
          backgroundImage: `linear-gradient(
                  120deg,
                  hsl(240deg 100% 20%) 0%,
                  hsl(289deg 100% 21%) 11%,
                  hsl(315deg 100% 27%) 20%,
                  hsl(329deg 100% 36%) 29%,
                  hsl(337deg 100% 43%) 38%,
                  hsl(357deg 91% 59%) 46%,
                  hsl(17deg 100% 59%) 56%,
                  hsl(34deg 100% 53%) 68%,
                  hsl(45deg 100% 50%) 82%,
                  hsl(55deg 100% 50%) 100%
              )`,
          color: 'white',
          padding: '8px',
        }}
      >
        <div>Sidebar</div>
      </SidebarContainer>
    </div>
  );
};
```
