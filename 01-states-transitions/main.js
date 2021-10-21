import '../style.css';
import { createMachine, interpret } from 'xstate';
import elements from '../utils/elements';

const playerMachine = createMachine({
  // Add initial state key
  // Add all states
});

const service = interpret(playerMachine).start();
window.service = service;

elements.elPlayButton.addEventListener('click', () => {
  service.send({ type: 'PLAY' });
});
elements.elPauseButton.addEventListener('click', () => {
  service.send({ type: 'PAUSE' });
});

service.subscribe((state) => {
  console.log(state);
  elements.elLoadingButton.hidden = !state.matches('loading');
  elements.elPlayButton.hidden = !state.can({ type: 'PLAY' });
  elements.elPauseButton.hidden = !state.can({ type: 'PAUSE' });
});
