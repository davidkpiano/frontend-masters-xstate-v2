import { interpret, createMachine, assign } from "xstate";
import "./style.css";

function countBehavior(state, event) {
  if (event.type === "INC") {
    return {
      ...state,
      count: state.count + 1,
    };
  }
}

function createActor(behavior, initialState) {
  let currentState = initialState;
  return {
    send: (event) => {
      currentState = behavior(currentState, event);
      console.log(currentState);
    },
  };
}

const actor = createActor(countBehavior, { count: 42 });

window.actor = actor;
