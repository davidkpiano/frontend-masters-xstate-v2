import '../style.css';

const initialState = {
  value: 'loading', // or 'playing' or 'paused'
};

function playerMachine(state, event) {
  switch (state.value) {
    case 'loading':
      if (event.type === 'LOADED') {
        return { ...state, value: 'playing' };
      }
      return state;
    case 'playing':
      if (event.type === 'PAUSE') {
        return { ...state, value: 'paused' };
      }
      return state;
    case 'paused':
      if (event.type === 'PLAY') {
        return { ...state, value: 'playing' };
      }
      return state;
    default:
      return state;
  }
}

console.log(playerMachine(initialState, { type: 'LOADED' }));

const playerMachineObject = {
  initial: 'loading',
  states: {
    loading: {
      on: {
        LOADED: 'playing',
      },
    },
    playing: {
      on: {
        PAUSE: 'paused',
      },
    },
    paused: {
      on: {
        PLAY: 'playing',
      },
    },
  },
};

function playerMachine2(state, event) {
  const nextStateValue =
    playerMachineObject.states[state.value].on?.[event.type];

  if (!nextStateValue) {
    return state;
  }

  return {
    ...state,
    value: nextStateValue,
  };
}
