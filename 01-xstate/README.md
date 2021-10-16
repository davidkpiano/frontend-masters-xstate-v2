

## Goals 
- Understand the purpose of XState (state orchestration vs. state management)
- Know how to install XState (`npm install xstate`)
- Make a small state machine with XState and use `machine.transition(...)`
- Interpret a machine using `interpret(machine)`
- Inspect machines using `@xstate/inspect`

## Exercises

1. Take the previous state machine you created (using switch statements or objects) and refactor it to use XState (`createMachine(...)`).
2. Test the flow with `machine.transition(state, event)`
3. Interpret the machine using `interpret(machine).start()`
4. Inspect the machine using `@xstate/inspect`
