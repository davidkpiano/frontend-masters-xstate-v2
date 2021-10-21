// @ts-check
import '../style.css';
import { createMachine, assign, interpret, send } from 'xstate';

import elements from '../utils/elements';
import { raise } from 'xstate/lib/actions';
import { formatTime } from '../utils/formatTime';

const playerMachine = createMachine({
  initial: 'loading',
  context: {
    title: undefined,
    artist: undefined,
    duration: 0,
    elapsed: 0,
    likeStatus: 'unliked', // or 'liked' or 'disliked'
    volume: 5,
  },
  states: {
    loading: {
      tags: ['loading'],
      id: 'loading',
      on: {
        LOADED: {
          actions: 'assignSongData',
          // Make this go to a 'ready' state instead
          target: 'paused',
        },
      },
    },
    // Refactor the 'paused' and 'playing' states so that
    // they are children of the 'ready' state.
    // Don't forget to add an initial state!
    paused: {
      on: {
        PLAY: { target: 'playing' },
      },
    },
    playing: {
      entry: 'playAudio',
      exit: 'pauseAudio',
      on: {
        PAUSE: { target: 'paused' },
      },
      always: {
        cond: (ctx) => ctx.elapsed >= ctx.duration,
        // We changed this to an ID so that it can target
        // the loading state at any position
        target: '#loading',
      },
    },
  },
  on: {
    SKIP: {
      actions: 'skipSong',
      target: 'loading',
    },
    LIKE: {
      actions: 'likeSong',
    },
    UNLIKE: {
      actions: 'unlikeSong',
    },
    DISLIKE: {
      actions: ['dislikeSong', raise('SKIP')],
    },
    VOLUME: {
      cond: 'volumeWithinRange',
      actions: 'assignVolume',
    },
    'AUDIO.TIME': {
      actions: 'assignTime',
    },
  },
}).withConfig({
  actions: {
    assignSongData: assign({
      title: (_, e) => e.data.title,
      artist: (_, e) => e.data.artist,
      duration: (ctx, e) => e.data.duration,
      elapsed: 0,
      likeStatus: 'unliked',
    }),
    likeSong: assign({
      likeStatus: 'liked',
    }),
    unlikeSong: assign({
      likeStatus: 'unliked',
    }),
    dislikeSong: assign({
      likeStatus: 'disliked',
    }),
    assignVolume: assign({
      volume: (_, e) => e.level,
    }),
    assignTime: assign({
      elapsed: (_, e) => e.currentTime,
    }),
    skipSong: () => {
      console.log('Skipping song');
    },
    playAudio: () => {},
    pauseAudio: () => {},
  },
  guards: {
    volumeWithinRange: (_, e) => {
      return e.level <= 10 && e.level >= 0;
    },
  },
});

const service = interpret(playerMachine).start();
window.service = service;

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

service.subscribe((state) => {
  console.log(state.value, state.context);
  const { context } = state;

  elements.elLoadingButton.hidden = !state.hasTag('loading');
  elements.elPlayButton.hidden = !state.can({ type: 'PLAY' });
  elements.elPauseButton.hidden = !state.can({ type: 'PAUSE' });
  elements.elVolumeButton.dataset.level =
    context.volume === 0
      ? 'zero'
      : context.volume <= 2
      ? 'low'
      : context.volume >= 8
      ? 'high'
      : undefined;

  elements.elScrubberInput.setAttribute('max', context.duration);
  elements.elScrubberInput.value = context.elapsed;
  elements.elElapsedOutput.innerHTML = formatTime(
    context.elapsed - context.duration
  );

  elements.elLikeButton.dataset.likeStatus = context.likeStatus;
  elements.elArtist.innerHTML = context.artist;
  elements.elTitle.innerHTML = context.title;
});

service.send({
  type: 'LOADED',
  data: {
    title: 'Some song title',
    artist: 'Some song artist',
    duration: 100,
  },
});
