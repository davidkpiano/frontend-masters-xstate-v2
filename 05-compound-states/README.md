# 05. Compound states

## Goals

- Know what "combinatorial state explosion" is and how it can arise
- Recognize when to logically group states together
- Understand that compound states immediately enter initial states
- Understand propagation of events - atomic states are checked first to find matching transitions, then parents, then grandparents, etc.
- Understand when entry/exit actions are selected on compound states
- Know how to implement compound states in XState

## Exercises

Add the `paused` and `playing` states to a parent `ready` state.
