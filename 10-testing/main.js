import './style.css';
import { createMachine, assign, interpret, sendParent, send } from 'xstate';

const elPlayButton = document.querySelector('#button-play');
const elPauseButton = document.querySelector('#button-pause');
const elSkipButton = document.querySelector('#button-skip');
const elLikeButton = document.querySelector('#button-like');
const elTime = document.querySelector('#time');

function loadSong() {
  return new Promise((res, rej) => {
    setTimeout(() => {
      res();
    }, 1000);
  });
}

const songMachine = createMachine({
  initial: 'loading',
  context: {
    duration: 100,
    elapsed: 0,
    likeStatus: 'unknown', // or 'liked' or 'disliked'
  },
  states: {
    loading: {
      invoke: {
        src: () => loadSong(),
        onDone: 'ready.hist',
      },
    },
    ready: {
      invoke: {
        src: (ctx) => (sendBack, receive) => {
          let c = 0;
          setInterval(() => {
            c++;
            sendBack({ type: 'timeUpdate', currentTime: c });
          }, 1000);
        },
      },
      initial: 'paused',
      states: {
        paused: {
          on: {
            PLAY: 'playing',
          },
        },
        playing: {
          on: {
            timeUpdate: {
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
    },
  },
  on: {
    SKIP: {
      actions: sendParent({ type: 'SKIP' }),
    },
    CHANGE_SONG: {
      target: '.loading',
      actions: assign({
        duration: () => Math.floor(Math.random() * 10),
        elapsed: 0,
      }),
    },
    LIKE: {
      actions: assign({
        likeStatus: 'liked',
      }),
    },
  },
});

const albumMachine = createMachine({
  context: {
    index: 0,
    songs: [
      { title: 'Song 1', duration: 180 },
      { title: 'Song 2', duration: 280 },
      { title: 'Song 3', duration: 380 },
    ],
  },
  invoke: {
    id: 'song',
    src: songMachine,
  },
  on: {
    SKIP: {
      actions: send({ type: 'CHANGE_SONG' }, { to: 'song' }),
    },
  },
});

const service = interpret(albumMachine).start();

let songSub;

service.subscribe((state) => {
  if (state.children.song && !songSub) {
    elPlayButton.addEventListener('click', () => {
      state.children.song.send({ type: 'PLAY' });
    });
    elPauseButton.addEventListener('click', () => {
      state.children.song.send({ type: 'PAUSE' });
    });
    elSkipButton.addEventListener('click', () => {
      state.children.song.send({ type: 'SKIP' });
    });
    elLikeButton.addEventListener('click', () => {
      state.children.song.send({ type: 'LIKE' });
    });
    songSub = state.children.song.subscribe((state) => {
      console.log(state.event, state.value);

      elPlayButton.hidden = !state.can({ type: 'PLAY' });
      elPauseButton.hidden = !state.can({ type: 'PAUSE' });
      elTime.innerHTML = `${state.context.elapsed} / ${state.context.duration}`;
    });
  }
});

document.querySelector('#app').innerHTML = `
  <h1>Testing</h1>
  <a href="https://vitejs.dev/guide/features.html" target="_blank">Documentation</a>
`;
