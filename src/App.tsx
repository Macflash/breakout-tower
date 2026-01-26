import React from "react";
import "./App.css";
import { add, Vec, vec } from "./vec";
import { useTick } from "./useTick";

function clamp(n: number, min: number, max: number): number {
  return Math.max(min, Math.min(n, max));
}

interface Box {
  s: Vec;
  p: Vec;

  color?: string;
}

function box(s = vec(), p = vec(), color?: string) {
  return { s, p, color };
}

interface Ball extends Box {
  v: Vec;
}

function intersect(a: Box, b: Box): boolean {
  const a1 = a.p;
  const a2 = add(a.p, a.s);

  const b1 = b.p;
  const b2 = add(b.p, b.s);

  // Is this all it really takes?
  if (b1.x > a2.x || b1.y > a2.y) return false;
  if (b2.x < a1.x || b2.y < a1.y) return false;

  return true;
}

interface Level {
  s: Vec;
  paddle: Box;

  blocks: Box[];

  ball: Ball;
}

const LEVEL_SIZE = vec(600, 600);
const PADDLE_SIZE = vec(100, 20);

function makeLevel(): Level {
  return {
    s: { ...LEVEL_SIZE },
    paddle: box(
      { ...PADDLE_SIZE },
      vec(LEVEL_SIZE.x / 2 - PADDLE_SIZE.x / 2, LEVEL_SIZE.y - PADDLE_SIZE.y),
    ),
    ball: {
      ...box(vec(10, 10), vec(LEVEL_SIZE.x / 2, LEVEL_SIZE.y / 2)),
      v: vec(-1, -2),
    },
    blocks: [],
  };
}

const l = makeLevel();

function App() {
  const { state, setState } = useTick<Level>(l, (level) => {
    // Move ball
    const { ball, paddle } = level;
    ball.p = add(ball.p, ball.v);

    const maxBallX = level.s.x - ball.s.x;
    if (ball.p.x < 0 || ball.p.x > maxBallX) ball.v.x *= -1;
    ball.p.x = clamp(ball.p.x, 0, maxBallX);

    const maxBallY = level.s.y - ball.s.y;
    if (ball.p.y < 0 || ball.p.y > maxBallY) ball.v.y *= -1;
    ball.p.y = clamp(ball.p.y, 0, maxBallY);

    // Intersect with paddle
    if (intersect(ball, paddle)) {
      ball.color = "red";
      // figure out the ANGLE thingy.
    } else ball.color = "green";

    return level;
  });

  return (
    <div
      className="App"
      style={{
        width: state.s.x,
        height: state.s.y,
        outline: "1px solid black",
        cursor: "crosshair",
      }}
      onMouseMove={(e) => {
        const x = clamp(
          e.clientX - state.paddle.s.x / 2, // center the paddle
          0,
          state.s.x - state.paddle.s.x,
        );

        setState({
          ...state,
          paddle: {
            ...state.paddle,
            p: { ...state.paddle.p, x }, // Could allow for SOME y control.
          },
        });
      }}
    >
      <BoxEl box={state.paddle} />
      <BoxEl box={state.ball} />
    </div>
  );
}

function BoxEl({ box: { s, p, color } }: { box: Box }) {
  return (
    <div
      style={{
        position: "absolute",
        top: p.y,
        left: p.x,
        height: s.y,
        width: s.x,
        background: color || "grey",
      }}
    ></div>
  );
}

export default App;
