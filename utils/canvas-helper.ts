export const drawSnowBranch = (
  ctx: CanvasRenderingContext2D,
  size: number,
  branches: number,
  spread: number,
  scale: number,
  depth: number
) => {
  if (depth <= 0) return;
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(size, 0);
  ctx.stroke();

  for (let i = 0; i < branches; i++) {
    ctx.save();
    ctx.translate(size - (size / branches) * i, 0);
    ctx.rotate(spread);
    ctx.scale(scale, scale);
    drawSnowBranch(ctx, size / 2, branches, spread, scale, depth - 1);
    ctx.restore();

    ctx.save();
    ctx.translate(size - (size / branches) * i, 0);
    ctx.rotate(-spread);
    ctx.scale(scale, scale);
    drawSnowBranch(ctx, size / 2, branches, spread, scale, depth - 1);
    ctx.restore();
  }
};
