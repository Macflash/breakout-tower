import React from "react";
import "./App.css";
import { add, fromAngle, magnitude, scale, Vec, vec } from "./vec";
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

function center(box: Box): Vec {
  return add(box.p, scale(box.s, 0.5));
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
      v: vec(0, 2),
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
    if (ball.p.y < 0) ball.v.y *= -1;

    if (ball.p.y > maxBallY) {
      ball.v = vec(0, -3);
    }

    ball.p.y = clamp(ball.p.y, 0, maxBallY);

    // Intersect with paddle
    if (intersect(ball, paddle)) {
      ball.color = "red";
      // Remove collision
      ball.p.y = paddle.p.y - ball.s.y;

      // ok, figure out what the angle should be
      const bc = center(ball);
      const pc = center(paddle);

      const offset = (2.5 * (bc.x - pc.x)) / paddle.s.x;
      // convert to like.. ANGLE? 0 to 180
      console.log("hit", offset);

      const ballV = magnitude(ball.v);

      ball.v = fromAngle(Math.PI / 2 - offset, ballV + 0.5);

      // middle should be STRAIGHT, sides should be really angled.
      // but scaled to the width of the paddle.
      // maybe -1 to 1.
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

        console.log("MOUSE!", x);
        state.paddle.p.x = x;
        setState(state);
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
