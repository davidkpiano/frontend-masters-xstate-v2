import '../style.css';

// Create a state machine transition function either using:
// - a switch statement (or nested switch statements)
// - or an object (transition lookup table)

const initialState = { status: 'loading' };

function transition(state = initialState, event) {
    switch (state.status) {
        case 'loading':
            if (event.type === 'LOADED') {
                return {
                    ...state,
                    value: 'playing'
                }
            }
            break;
        case 'playing':
            if (event.type === 'PAUSE') {
                return {
                    ...state,
                    value: 'paused'
                }
            }
            break;
        case 'paused':
            if (event.type === 'PLAY') {
                return {
                    ...state,
                    value: 'playing'
                }
            }
            break;
        default:
            break;
    }

    return state;
}

window.transition = transition;

const machine = {
    initial: 'loading',
    states: {
        loading: {
            on: {
                LOADED: 'playing'
            }
        },
        playing: {
            on: {
                PAUSE: 'paused'
            }
        },
        paused: {
            on: {
                PLAY: 'playing',
                BELE: 'belekas'
            }
        },
        belekas: {
            on: {
                GET: 'playing'
            }
        }
    }
}

function machineTransition(state = {
    value: machine.initial
}, event) {
    const nextValue = machine.states[state.value].on?.[event.type];

    if (!nextValue) {
        return state;
    }

    return {
        ...state,
        value: nextValue
    };
}

window.machineTransition = machineTransition;

let currentState = { value: machine.initial };

const service = {
    send: (event) => {
        currentState = machineTransition(currentState, event);
        console.log(currentState);
    }
}

window.service = service;

// Also, come up with a simple way to "interpret" it, and
// make it an object that you can `.send(...)` events to.
