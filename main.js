import './style.css';

function transition(state, event) {
    switch (state.status) {
        case 'idle':
            if (event.type === 'FETCH') {
                console.log("Starting to fetch...");
                return { status: 'loading'}
            }
            return state;
        case 'loading':
            console.log("Loading...");
            break;
        default:
            break;
    }

    return state
}

const machine = {
    initial: 'idle',
    states: {
        idle: {
            on: {
                FETCH: 'loading'
            }
        },
        loading: {}
    }
}

function transition2(state, event) {
    const nextStatus = machine.states[state.status].on?.[event.type] ?? state.status;

    return {status: nextStatus};
}

window.transition = transition;
window.transition2 = transition2;
window.machine = machine;