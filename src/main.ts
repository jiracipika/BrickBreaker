import './styles.css';
import { createGame, movePaddle, setPaddleCenter, step, WIDTH, HEIGHT, type Phase } from './game';

const canvas = document.querySelector<HTMLCanvasElement>('#gameCanvas')!;
const context = canvas.getContext('2d')!;
const score = document.querySelector<HTMLElement>('#score')!;
const state = document.querySelector<HTMLElement>('#state')!;
const toggle = document.querySelector<HTMLButtonElement>('#toggle')!;
let game = createGame();

function labelPhase(): string {
  const labels: Record<Phase, string> = {
    ready: 'Ready', playing: 'Playing', paused: 'Paused', won: 'You won!', lost: 'Game over'
  };
  return labels[game.phase];
}

function render() {
  context.clearRect(0, 0, WIDTH, HEIGHT);
  context.fillStyle = '#f8fafc';
  context.fillRect(game.paddle.x, game.paddle.y, game.paddle.width, game.paddle.height);
  context.beginPath();
  context.arc(game.ball.x, game.ball.y, game.ball.radius, 0, Math.PI * 2);
  context.fillStyle = '#fbbf24';
  context.fill();
  for (const brick of game.bricks) {
    if (!brick.active) continue;
    context.fillStyle = `hsl(${205 + brick.y / 5} 85% 62%)`;
    context.fillRect(brick.x, brick.y, brick.width, brick.height);
  }
  score.textContent = `Score: ${game.score}`;
  state.textContent = labelPhase();
  toggle.textContent = game.phase === 'playing' ? 'Pause' : game.phase === 'paused' ? 'Resume' : 'Start';
}

function toggleGame() {
  if (game.phase === 'won' || game.phase === 'lost') game = createGame();
  game.phase = game.phase === 'playing' ? 'paused' : 'playing';
  render();
  canvas.focus();
}

function handleKey(event: KeyboardEvent) {
  const direction = event.key === 'ArrowLeft' || event.key.toLowerCase() === 'a' ? -1
    : event.key === 'ArrowRight' || event.key.toLowerCase() === 'd' ? 1 : 0;
  if (direction) movePaddle(game, direction);
  if (event.code === 'Space') toggleGame();
  if (direction || event.code === 'Space') event.preventDefault();
}

function bindMove(id: string, direction: number) {
  document.querySelector(id)!.addEventListener('pointerdown', () => {
    movePaddle(game, direction);
    render();
  });
}

toggle.addEventListener('click', toggleGame);
bindMove('#left', -1);
bindMove('#right', 1);
window.addEventListener('keydown', handleKey);
canvas.addEventListener('pointermove', (event) => {
  const bounds = canvas.getBoundingClientRect();
  setPaddleCenter(game, (event.clientX - bounds.left) * WIDTH / bounds.width);
});

function loop() {
  step(game);
  render();
  requestAnimationFrame(loop);
}
render();
requestAnimationFrame(loop);