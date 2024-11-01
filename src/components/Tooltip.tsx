import React, { useState } from 'react';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css'; // Optional CSS for default styling

const ClickTooltip: React.FC = () => {
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });

  const handleClick = (event: React.MouseEvent) => {
    setCursorPosition({ x: event.clientX, y: event.clientY });
    setTooltipVisible(!tooltipVisible);
  };

  return (
    <div onClick={handleClick} style={{ height: '100vh', cursor: 'pointer' }}>
      <Tippy
        content="This is your tooltip!"
        visible={tooltipVisible}
        onClickOutside={() => setTooltipVisible(false)}
        interactive
        placement="top-start"
        popperOptions={{
          modifiers: [
            {
              name: 'preventOverflow',
              options: {
                boundary: 'viewport',
              },
            },
            {
              name: 'flip',
              options: {
                fallbackPlacements: ['top', 'bottom', 'left', 'right'],
              },
            },
          ],
        }}
        offset={[0, 10]}
      >
        <div
          style={{
            position: 'absolute',
            top: cursorPosition.y,
            left: cursorPosition.x,
            pointerEvents: 'none',
          }}
        />
      </Tippy>
    </div>
  );
};

export default ClickTooltip;
