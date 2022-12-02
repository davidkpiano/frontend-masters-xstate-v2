import '../style.css';

// Create a state machine transition function either using:
// - a switch statement (or nested switch statements)
// - or an object (transition lookup table)

// Also, come up with a simple way to "interpret" it, and
// make it an object that you can `.send(...)` events to.

const initialState = {
    value: 'loading', // or 'playing' or 'paused'
  };

const playerMachineObject = {
    initial: 'loading',
    states: {
        loading: {
            on: {
                LOADED: "playing",
            }
        },
        playing: {
            on: {
                PAUSE: 'paused',
            }
        },
        paused: {
            on: {
                PLAY: 'playing'
            }
        },
    },
}

function playerMachine(state, event) {
    const nextStateValue = playerMachineObject.states[state.value].on?.[event.type];
    if(!nextStateValue ) {
        return state;
    }
    return {
        ...state,
        value: nextStateValue,
    }
}

console.log(playerMachine(mac, { type: 'LOADED' }));
