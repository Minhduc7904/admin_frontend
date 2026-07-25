import { useEffect, useRef, useState } from 'react';

const DRAG_THRESHOLD = 5;

/** Enables desktop mouse drag-to-scroll without turning a real click into a drag. */
export const useDragToScroll = () => {
  const stateRef = useRef(null);
  const suppressClickRef = useRef(false);
  const [isDragging, setIsDragging] = useState(false);

  const finishDrag = () => {
    const state = stateRef.current;
    if (!state) return;

    stateRef.current = null;
    setIsDragging(false);

    if (state.moved) {
      suppressClickRef.current = true;
      window.setTimeout(() => { suppressClickRef.current = false; }, 100);
    }
  };

  useEffect(() => {
    const onMouseMove = (event) => {
      const state = stateRef.current;
      if (!state) return;

      const deltaX = event.clientX - state.startX;
      const deltaY = event.clientY - state.startY;
      if (!state.moved && Math.hypot(deltaX, deltaY) < DRAG_THRESHOLD) return;

      state.moved = true;
      state.container.scrollLeft = state.scrollLeft - deltaX;
      state.container.scrollTop = state.scrollTop - deltaY;
      setIsDragging(true);
      event.preventDefault();
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', finishDrag);
    return () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', finishDrag);
    };
  }, []);

  const onMouseDown = (event) => {
    if (event.button !== 0) return;
    const container = event.currentTarget;
    stateRef.current = {
      startX: event.clientX,
      startY: event.clientY,
      scrollLeft: container.scrollLeft,
      scrollTop: container.scrollTop,
      container,
      moved: false,
    };
  };

  const onClickCapture = (event) => {
    if (!suppressClickRef.current) return;
    event.preventDefault();
    event.stopPropagation();
    suppressClickRef.current = false;
  };

  return {
    dragProps: {
      onMouseDown,
      onClickCapture,
    },
    isDragging,
  };
};
