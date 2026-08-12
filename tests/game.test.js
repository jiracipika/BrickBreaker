import test from 'node:test';
import assert from 'node:assert/strict';
import { createGame, movePaddle, setPaddleCenter, step, WIDTH, HEIGHT } from '../.test-build/game.js';

test('paddle movement remains inside the board', () => {
  const game = createGame();
  for (let i = 0; i < 100; i += 1) movePaddle(game, -1);
  assert.equal(game.paddle.x, 0);
  for (let i = 0; i < 100; i += 1) movePaddle(game, 1);
  assert.equal(game.paddle.x, WIDTH - game.paddle.width);
});

test('pointer-style movement keeps a waiting ball attached to the paddle', () => {
  const game = createGame();
  setPaddleCenter(game, 123);
  assert.equal(game.paddle.x + game.paddle.width / 2, 123);
  assert.equal(game.ball.x, 123);

  setPaddleCenter(game, -100);
  assert.equal(game.paddle.x, 0);
  assert.equal(game.ball.x, game.paddle.width / 2);

  game.phase = 'playing';
  const launchedX = game.ball.x;
  setPaddleCenter(game, WIDTH);
  assert.equal(game.paddle.x, WIDTH - game.paddle.width);
  assert.equal(game.ball.x, launchedX);
});

test('missing the paddle ends the game', () => {
  const game = createGame();
  game.phase = 'playing';
  game.ball.y = HEIGHT + game.ball.radius;
  game.ball.dy = 1;
  assert.equal(step(game), 'lost');
  assert.equal(game.phase, 'lost');
});

test('a brick can only score once', () => {
  const game = createGame();
  game.phase = 'playing';
  const brick = game.bricks[0];
  game.ball.x = brick.x + brick.width / 2;
  game.ball.y = brick.y + brick.height / 2;
  game.ball.dx = 0;
  game.ball.dy = 0;
  assert.equal(step(game), 'brick');
  assert.equal(game.score, 10);
  step(game);
  assert.equal(game.score, 10);
});