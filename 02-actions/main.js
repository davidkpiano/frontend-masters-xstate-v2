// @ts-check
import '../style.css';
import { createMachine, assign, interpret, send } from 'xstate';
import { raise } from 'xstate/lib/actions';
import elements from '../utils/elements';

const playerMachine = createMachine({
  initial: 'loading',
  states: {
    loading: {
      on: {
        LOADED: {
          // Add an action here to assign the song data
          target: 'playing',
        },
      },
    },
    paused: {
      on: {
        PLAY: { target: 'playing' },
      },
    },
    playing: {
      // When this state is entered, add an action to play the audio
      // When this state is exited, add an action to pause the audio
      on: {
        PAUSE: { target: 'paused' },
      },
    },
  },
  on: {
    SKIP: {
      // Add an action to skip the song
      target: 'loading',
    },
    LIKE: {
      // Add an action to like the song
    },
    UNLIKE: {
      // Add an action to unlike the song
    },
    DISLIKE: {
      // Add two actions to dislike the song and raise the skip event
    },
    VOLUME: {
      // Add an action to assign to the volume
    },
  },
}).withConfig({
  actions: {
    // Add implementations for the actions here, if you'd like
    // For now you can just console.log something
  },
});

elements.elPlayButton.addEventListener('click', () => {
  service.send({ type: 'PLAY' });
});
elements.elPauseButton.addEventListener('click', () => {
  service.send({ type: 'PAUSE' });
});
elements.elSkipButton.addEventListener('click', () => {
  service.send({ type: 'SKIP' });
});
elements.elLikeButton.addEventListener('click', () => {
  service.send({ type: 'LIKE' });
});
elements.elDislikeButton.addEventListener('click', () => {
  service.send({ type: 'DISLIKE' });
});

const service = interpret(playerMachine).start();

service.subscribe((state) => {
  console.log(state.actions);

  elements.elLoadingButton.hidden = !state.matches('loading');
  elements.elPlayButton.hidden = !state.can({ type: 'PLAY' });
  elements.elPauseButton.hidden = !state.can({ type: 'PAUSE' });
});

service.send('LOADED');
