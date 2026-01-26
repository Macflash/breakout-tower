import React from "react";

export function useTick<TState>(
  initial: TState,
  doTick: (state: TState) => TState,
  targetTickSpeed = 1000 / 60,
) {
  const [state, setState] = React.useState<TState>(initial);

  const [lastTick, setLastTick] = React.useState(performance.now());

  // Update the level physics while anything is moving.
  React.useEffect(() => {
    let valid = true;

    // YUCK this sucks when deployed for some reason.
    requestAnimationFrame(() => {
      if (!valid) return;

      // figure out how many ticks we need to do since the last animation frame was drawn.
      const currentTime = performance.now();
      const deltaTime = currentTime - lastTick;
      const ticksToDo = deltaTime / targetTickSpeed;
      //   if (ticksToDo > 1) console.log(ticksToDo);

      let currentState = { ...state };
      for (let i = 0; i < ticksToDo; i++) {
        currentState = doTick(currentState);
      }

      setState(currentState);
      setLastTick(currentTime);
    });
    return () => void (valid = false);
  }, [state, setState, lastTick, setLastTick]);

  return {
    state,
    setState,
  };
}
