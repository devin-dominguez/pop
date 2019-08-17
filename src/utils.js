export function checkCircularCollision(circleA, circleB) {
  const radii = (circleA.size + circleB.size) * (circleA.size + circleB.size);
  const dX = circleA.x - circleB.x;
  const dY = circleA.y - circleB.y;
  const dist = (dX * dX) + (dY * dY);

  return dist < radii;
}

export function constrain(value, min = 0, max = 1) {
  return Math.min(max, Math.max(value, min));
}

export function lerp(value, min = 0, max = 1) {
  return min + value * (max - value);
}

