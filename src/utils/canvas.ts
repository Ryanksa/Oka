import { getRandomArbitrary, getRandomInt } from "./general";

const TREE_ROTATION_CONSTANT = 0.2;

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

export const drawTreeBranch = (
  ctx: CanvasRenderingContext2D,
  branchSize: number,
  branchColour: string,
  leafSize: number,
  leafColour: string,
  depth: number
) => {
  if (depth === 0) return;
  ctx.strokeStyle = branchColour;
  ctx.fillStyle = leafColour;
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(branchSize, 0);
  ctx.stroke();

  if (depth <= 3) {
    ctx.save();
    ctx.translate(branchSize, 0);
    const numLeaves = getRandomInt(10, 15);
    for (let i = 0; i < numLeaves; i++) {
      const xPos = getRandomInt(-(branchSize / numLeaves), 0);
      const yPos = getRandomInt(-3, 3);
      const rotation = getRandomArbitrary(-Math.PI / 2, Math.PI / 2);
      ctx.translate(xPos, 0);
      ctx.beginPath();
      ctx.ellipse(0, yPos, leafSize, leafSize / 2, rotation, 0, 2 * Math.PI);
      ctx.fill();
    }
    ctx.restore();
  }

  const numBranches = getRandomInt(3, 6);
  for (let i = 0; i < numBranches; i++) {
    const maxRotation = Math.min(TREE_ROTATION_CONSTANT + i * 0.2, 0.9);
    const rotation = getRandomArbitrary(TREE_ROTATION_CONSTANT, maxRotation);

    ctx.save();
    ctx.translate(branchSize - (branchSize / numBranches) * i, 0);
    ctx.rotate(rotation);
    ctx.scale(0.8, 1);
    drawTreeBranch(
      ctx,
      branchSize * 0.7,
      branchColour,
      leafSize,
      leafColour,
      depth - 1
    );
    ctx.restore();
  }
};
