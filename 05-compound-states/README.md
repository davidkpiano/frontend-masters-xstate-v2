

## Goals
- Know what "combinatorial state explosion" is and how it can arise
- Recognize when to logically group states together
- Understand that compound states immediately enter initial states
- Understand propagation of events - atomic states are checked first to find matching transitions, then parents, then grandparents, etc.
- Understand when entry/exit actions are selected on compound states
- Know how to implement compound states in XState

## Exercises
1. Refactor: add a `loading` and `ready` state
2. The `ready` state should be a parent state of the `playing` and `paused` states
3. The `loading` state should be the initial state
4. When going to the next song, transition to the `loading` state to load the next song