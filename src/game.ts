export const WIDTH = 800;
export const HEIGHT = 600;

export type Phase = 'ready' | 'playing' | 'paused' | 'won' | 'lost';
type Ball = { x: number; y: number; dx: number; dy: number; radius: number };
type Rectangle = { x: number; y: number; width: number; height: number };
type Brick = Rectangle & { active: boolean };
export type Game = {
  ball: Ball;
  paddle: Rectangle;
  bricks: Brick[];
  score: number;
  phase: Phase;
};

export function createGame(): Game {
  const bricks: Brick[] = [];
  for (let row = 0; row < 5; row += 1) {
    for (let column = 0; column < 10; column += 1) {
      bricks.push({ x: 23 + column * 77, y: 55 + row * 30, width: 70, height: 20, active: true });
    }
  }
  return {
    ball: { x: WIDTH / 2, y: HEIGHT - 55, dx: 4, dy: -4, radius: 8 },
    paddle: { x: WIDTH / 2 - 55, y: HEIGHT - 30, width: 110, height: 14 },
    bricks,
    score: 0,
    phase: 'ready'
  };
}

export function movePaddle(game: Game, direction: number): void {
  game.paddle.x = Math.max(0, Math.min(WIDTH - game.paddle.width, game.paddle.x + direction * 24));
  if (game.phase === 'ready') game.ball.x = game.paddle.x + game.paddle.width / 2;
}

function overlaps(ball: Ball, rectangle: Rectangle): boolean {
  return ball.x + ball.radius >= rectangle.x && ball.x - ball.radius <= rectangle.x + rectangle.width
    && ball.y + ball.radius >= rectangle.y && ball.y - ball.radius <= rectangle.y + rectangle.height;
}

export function step(game: Game): 'won' | 'lost' | 'brick' | null {
  if (game.phase !== 'playing') return null;
  const ball = game.ball;
  ball.x += ball.dx;
  ball.y += ball.dy;

  if (ball.x - ball.radius <= 0 || ball.x + ball.radius >= WIDTH) {
    ball.dx *= -1;
    ball.x = Math.max(ball.radius, Math.min(WIDTH - ball.radius, ball.x));
  }
  if (ball.y - ball.radius <= 0) {
    ball.dy = Math.abs(ball.dy);
    ball.y = ball.radius;
  }
  if (ball.dy > 0 && overlaps(ball, game.paddle)) {
    const offset = (ball.x - (game.paddle.x + game.paddle.width / 2)) / (game.paddle.width / 2);
    ball.dx = offset * 5;
    ball.dy = -Math.abs(ball.dy);
    ball.y = game.paddle.y - ball.radius;
  }

  const brick = game.bricks.find((candidate) => candidate.active && overlaps(ball, candidate));
  if (brick) {
    brick.active = false;
    ball.dy *= -1;
    game.score += 10;
    if (game.bricks.every((candidate) => !candidate.active)) {
      game.phase = 'won';
      return 'won';
    }
  }
  if (ball.y - ball.radius > HEIGHT) {
    game.phase = 'lost';
    return 'lost';
  }
  return brick ? 'brick' : null;
}