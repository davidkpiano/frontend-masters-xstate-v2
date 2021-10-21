// @ts-check
import '../style.css';
import { createMachine, assign, interpret, send } from 'xstate';

const elPlayButton = document.querySelector('#button-play');
const elPauseButton = document.querySelector('#button-pause');
const elSkipButton = document.querySelector('#button-skip');
const elLikeButton = document.querySelector('#button-like');
const elDislikeButton = document.querySelector('#button-dislike');
const elLoadingButton = document.querySelector('#button-loading');
const elScrubberInput = document.querySelector('#scrubber');
const elMuteButton = document.querySelector('#button-mute');
const elUnmuteButton = document.querySelector('#button-unmute');
const elElapsedButton = document.querySelector('#elapsed');
const elDurationButton = document.querySelector('#duration');

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

function loadSong() {
  return new Promise((res, rej) => {
    setTimeout(() => {
      res();
    }, 1000);
  });
}

function getCurrentSong(context) {
  return context.playlist[context.songIndex];
}

const invokeAudio = (ctx) => (sendBack, receive) => {
  const audio = createFakeAudio(getCurrentSong(ctx).duration);

  audio.addEventListener('timeupdate', () => {
    console.log(audio);
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

const assignNextSong = assign({
  elapsed: 0,
  songIndex: (ctx) => (ctx.songIndex + 1) % ctx.playlist.length,
});

const songMachine = createMachine({
  context: {
    playlist: [
      { title: 'Song 1', duration: 5, likeStatus: 'unknown' },
      { title: 'Song 2', duration: 10, likeStatus: 'unknown' },
      { title: 'Song 3', duration: 15, likeStatus: 'unknown' },
    ],
    songIndex: 0,
    elapsed: 0,
    likeStatus: 'unknown', // or 'liked' or 'disliked'
  },
  type: 'parallel',
  states: {
    player: {
      initial: 'loading',
      states: {
        loading: {
          tags: 'loading',
          invoke: {
            id: 'songLoader',
            src: loadSong,
            onDone: 'ready.hist',
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
                PLAY: 'playing',
              },
            },
            playing: {
              entry: send({ type: 'PLAY' }, { to: 'audio' }),
              exit: send({ type: 'PAUSE' }, { to: 'audio' }),
              on: {
                'AUDIO.TIME': {
                  actions: assign({
                    elapsed: (_, e) => e.currentTime,
                  }),
                },
                PAUSE: 'paused',
              },
            },
            hist: {
              type: 'history',
            },
          },
          always: {
            cond: (ctx) => ctx.elapsed >= getCurrentSong(ctx).duration,
            target: 'finished',
          },
        },
        finished: {
          type: 'final',
        },
      },
      on: {
        SKIP: {
          actions: assignNextSong,
          target: '.loading',
        },
      },
      onDone: {
        cond: (ctx) => ctx.elapsed >= getCurrentSong(ctx).duration,
        actions: assignNextSong,
        target: '.',
      },
    },
    volume: {
      initial: 'unmuted',
      states: {
        unmuted: {
          on: {
            MUTE: 'muted',
          },
        },
        muted: {
          on: {
            UNMUTE: 'unmuted',
          },
        },
      },
    },
  },
  on: {
    'LIKE.TOGGLE': {
      actions: assign({
        playlist: (ctx) => {
          return ctx.playlist.map((song, i) => {
            if (i !== ctx.songIndex) {
              return song;
            }
            return {
              ...song,
              likeStatus: song.likeStatus === 'unknown' ? 'liked' : 'unknown',
            };
          });
        },
      }),
    },
    DISLIKE: {
      actions: [
        assign({
          playlist: (ctx) => {
            return ctx.playlist.map((song, i) => {
              if (i !== ctx.songIndex) {
                return song;
              }
              return { ...song, likeStatus: 'disliked' };
            });
          },
        }),
        send('SKIP'),
      ],
    },
  },
});

const service = interpret(songMachine).start();

elPlayButton.addEventListener('click', () => {
  service.send({ type: 'PLAY' });
});
elPauseButton.addEventListener('click', () => {
  service.send({ type: 'PAUSE' });
});
elSkipButton.addEventListener('click', () => {
  service.send({ type: 'SKIP' });
});
elLikeButton.addEventListener('click', () => {
  service.send({ type: 'LIKE.TOGGLE' });
});
elDislikeButton.addEventListener('click', () => {
  service.send({ type: 'DISLIKE' });
});
elMuteButton.addEventListener('click', () => {
  service.send({ type: 'MUTE' });
});
elUnmuteButton.addEventListener('click', () => {
  service.send({ type: 'UNMUTE' });
});
elScrubberInput.addEventListener('change', (e) => {
  console.log(e.target.valueAsNumber);
});
service.subscribe((state) => {
  console.log(state.event, state.value, state.context);

  elLoadingButton.hidden = !state.hasTag('loading');
  elPlayButton.hidden = !state.can({ type: 'PLAY' });
  elPauseButton.hidden = !state.can({ type: 'PAUSE' });
  elMuteButton.hidden = !state.can({ type: 'MUTE' });
  elUnmuteButton.hidden = !state.can({ type: 'UNMUTE' });

  elScrubberInput.setAttribute('max', getCurrentSong(state.context).duration);
  elScrubberInput.value = state.context.elapsed;
  elElapsedButton.innerHTML = `${state.context.elapsed}`;
  elDurationButton.innerHTML = `${getCurrentSong(state.context).duration}`;

  elLikeButton.dataset.likeStatus = getCurrentSong(state.context).likeStatus;
});
