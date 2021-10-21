// @ts-check
import '../style.css';
import { createMachine, assign, interpret, send } from 'xstate';
import { raise } from 'xstate/lib/actions';
import { inspect } from '@xstate/inspect';
import { formatTime } from '../utils/formatTime';
import elements from '../utils/elements';

// inspect({
//   iframe: false,
//   url: 'https://stately.ai/viz?inspect',
// });

function createFakeAudio(duration) {
  let currentTime = 0;
  let interval;
  const observers = new Set();

  const notify = () => {
    observers.forEach((o) => o());
  };

  return {
    addEventListener: (event, fn) => {
      observers.add(fn);
      fn();
    },
    play: () => {
      interval = setInterval(() => {
        currentTime++;
        notify();
      }, 1000);
    },
    pause: () => {
      clearInterval(interval);
      notify();
    },
    get duration() {
      return duration;
    },
    get currentTime() {
      return currentTime;
    },
  };
}

const invokeAudio = (ctx) => (sendBack, receive) => {
  const audio = createFakeAudio(ctx.duration);

  audio.addEventListener('timeupdate', () => {
    sendBack({
      type: 'AUDIO.TIME',
      duration: parseInt(audio.duration),
      currentTime: parseInt(audio.currentTime),
    });
  });

  receive((event) => {
    switch (event.type) {
      case 'PLAY':
        audio.play();
        break;
      case 'PAUSE':
        audio.pause();
        break;
      default:
        break;
    }
  });
};

let songCounter = 0;
function loadSong() {
  return new Promise((res, rej) => {
    setTimeout(() => {
      res({
        title: `Random Song #${songCounter++}`,
        artist: `Random Group`,
        duration: Math.floor(Math.random() * 100),
      });
    }, 1000);
  });
}

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
  type: 'parallel',
  states: {
    player: {
      initial: 'loading',
      states: {
        loading: {
          tags: ['loading'],
          id: 'loading',
          invoke: {
            id: 'songLoader',
            src: loadSong,
            onDone: {
              actions: 'assignSongData',
              target: 'ready.hist',
            },
          },
        },
        ready: {
          invoke: {
            id: 'audio',
            src: invokeAudio,
          },
          initial: 'paused',
          states: {
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
            },
            hist: {
              type: 'history',
            },
          },
          always: {
            cond: (ctx) => ctx.elapsed >= ctx.duration,
            target: 'finished',
          },
        },
        finished: {
          type: 'final',
        },
      },
      onDone: {
        target: '.loading',
      },
      on: {
        SKIP: {
          target: '.loading',
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
        'LIKE.TOGGLE': [
          {
            cond: (ctx) => ctx.likeStatus === 'liked',
            actions: raise('UNLIKE'),
          },
          {
            cond: (ctx) => ctx.likeStatus === 'unliked',
            actions: raise('LIKE'),
          },
        ],
        'AUDIO.TIME': {
          actions: 'assignTime',
        },
      },
    },
    volume: {
      initial: 'unmuted',
      states: {
        unmuted: {
          on: {
            'VOLUME.TOGGLE': 'muted',
          },
        },
        muted: {
          on: {
            'VOLUME.TOGGLE': 'unmuted',
          },
        },
      },
      on: {
        VOLUME: {
          cond: 'volumeWithinRange',
          actions: 'assignVolume',
        },
      },
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
    playAudio: send({ type: 'PLAY' }, { to: 'audio' }),
    pauseAudio: send({ type: 'PAUSE' }, { to: 'audio' }),
  },
  guards: {
    volumeWithinRange: (_, e) => {
      return e.level <= 10 && e.level >= 0;
    },
  },
});

const service = interpret(playerMachine, { devTools: true }).start();
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
  service.send({ type: 'LIKE.TOGGLE' });
});
elements.elDislikeButton.addEventListener('click', () => {
  service.send({ type: 'DISLIKE' });
});
elements.elVolumeButton.addEventListener('click', () => {
  service.send({ type: 'VOLUME.TOGGLE' });
});
elements.elScrubberInput.addEventListener('change', (e) => {
  console.log(e.target.valueAsNumber);
});
service.subscribe((state) => {
  console.log(state.event, state.value, state.context);
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
  elements.elVolumeButton.dataset.status = state.matches({ volume: 'muted' })
    ? 'muted'
    : undefined;

  elements.elScrubberInput.setAttribute('max', context.duration);
  elements.elScrubberInput.value = context.elapsed;
  elements.elElapsedOutput.innerHTML = formatTime(
    context.elapsed - context.duration
  );

  elements.elLikeButton.dataset.likeStatus = context.likeStatus;
  elements.elArtist.innerHTML = context.artist || '--';
  elements.elTitle.innerHTML = context.title || '--';
});
