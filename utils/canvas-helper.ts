export const drawBranch = (
  ctx: CanvasRenderingContext2D,
  maxLevel: number,
  size: number,
  branches: number,
  spread: number,
  scale: number,
  level = 0
) => {
  if (level > maxLevel) return;
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(size, 0);
  ctx.stroke();

  for (let i = 0; i < branches; i++) {
    ctx.save();
    ctx.translate(size - (size / branches) * i, 0);
    ctx.rotate(spread);
    ctx.scale(scale, scale);
    drawBranch(ctx, maxLevel, size / 2, branches, spread, scale, level + 1);
    ctx.restore();

    ctx.save();
    ctx.translate(size - (size / branches) * i, 0);
    ctx.rotate(-spread);
    ctx.scale(scale, scale);
    drawBranch(ctx, maxLevel, size / 2, branches, spread, scale, level + 1);
    ctx.restore();
  }
};
