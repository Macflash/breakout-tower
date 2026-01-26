// TODO: Add Z? could easily just treat it as 0.
export interface Vec {
  x: number;
  y: number;
}

export function vec(x = 0, y = 0): Vec {
  return { x, y };
}

/** @returns a new vector scaled by n. */
export function scale(v: Vec, n: number): Vec {
  return { x: v.x * n, y: v.y * n };
}

/** @returns magnitude of a vector */
export function magnitude(v: Vec) {
  return Math.sqrt(Math.pow(v.x, 2) + Math.pow(v.y, 2));
}

/** @returns angle of a vector in radians */
export function angle(v: Vec): number {
  return Math.atan2(v.y, v.x);
}

/** @returns angle of a vector in radians */
export function fromDegree(dirDegrees: number, speed: number): Vec {
  const radians = ((90 - dirDegrees) * Math.PI) / 180;
  return fromAngle(radians, speed);
}

/** @returns angle of a vector in radians */
export function fromAngle(radians: number, speed: number): Vec {
  return vec(speed * Math.cos(radians), -speed * Math.sin(radians));
}

export function at(v: Vec): Vec {
  return { ...v };
}

/** @returns a new vector (a - b) */
export function add(a: Vec, b: Vec): Vec {
  return { x: a.x + b.x, y: a.y + b.y };
}

/** @returns a new vector (a - b) */
export function subtract(a: Vec, b: Vec): Vec {
  return { x: a.x - b.x, y: a.y - b.y };
}

/** @returns distance between 2 points */
export function distance(a: Vec, b: Vec): number {
  return magnitude(subtract(a, b));
}

/** @returns angle between 2 points */
export function angleFromAtoB(a: Vec, b: Vec) {
  const delta = subtract(b, a);
  return angle(delta);
}

export function normal(a: Vec, b: Vec, d = distance(a, b)) {
  return scale(subtract(a, b), 1 / d);
}

export function dot(a: Vec, b: Vec): number {
  return a.x * b.x + a.y * b.y;
}
