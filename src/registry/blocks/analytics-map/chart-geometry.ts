type Point = {
  x: number;
  y: number;
};

export function buildAreaPaths(
  values: number[],
  width: number,
  height: number,
): { line: string; area: string } {
  if (values.length === 0) {
    return { line: "", area: "" };
  }

  const max = Math.max(...values);
  const min = Math.min(...values);
  const range = max - min || 1;

  const points: Point[] = values.map((value, index) => {
    const x =
      values.length === 1 ? width / 2 : (index / (values.length - 1)) * width;
    const y = height - ((value - min) / range) * height;
    return { x, y };
  });

  const line = points
    .map((point, index) =>
      index === 0
        ? `M ${String(point.x)} ${String(point.y)}`
        : `L ${String(point.x)} ${String(point.y)}`,
    )
    .join(" ");

  const area = `${line} L ${String(width)} ${String(height)} L 0 ${String(height)} Z`;

  return { line, area };
}

function polarToCartesian(
  cx: number,
  cy: number,
  radius: number,
  angleDeg: number,
): Point {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return {
    x: cx + radius * Math.cos(rad),
    y: cy + radius * Math.sin(rad),
  };
}

export function buildDonutSlicePath(
  cx: number,
  cy: number,
  innerRadius: number,
  outerRadius: number,
  startAngle: number,
  endAngle: number,
): string {
  const startOuter = polarToCartesian(cx, cy, outerRadius, endAngle);
  const endOuter = polarToCartesian(cx, cy, outerRadius, startAngle);
  const startInner = polarToCartesian(cx, cy, innerRadius, endAngle);
  const endInner = polarToCartesian(cx, cy, innerRadius, startAngle);
  const largeArc = endAngle - startAngle > 180 ? 1 : 0;

  return [
    `M ${String(startOuter.x)} ${String(startOuter.y)}`,
    `A ${String(outerRadius)} ${String(outerRadius)} 0 ${String(largeArc)} 0 ${String(endOuter.x)} ${String(endOuter.y)}`,
    `L ${String(endInner.x)} ${String(endInner.y)}`,
    `A ${String(innerRadius)} ${String(innerRadius)} 0 ${String(largeArc)} 1 ${String(startInner.x)} ${String(startInner.y)}`,
    "Z",
  ].join(" ");
}

export function buildDonutSlices(
  values: number[],
  cx: number,
  cy: number,
  innerRadius: number,
  outerRadius: number,
): string[] {
  const total = values.reduce((sum, value) => sum + value, 0) || 1;
  const paths: string[] = [];
  let angle = 0;

  for (const value of values) {
    const sweep = (value / total) * 360;
    const startAngle = angle;
    const endAngle = angle + sweep;
    paths.push(
      buildDonutSlicePath(
        cx,
        cy,
        innerRadius,
        outerRadius,
        startAngle,
        endAngle,
      ),
    );
    angle = endAngle;
  }

  return paths;
}
