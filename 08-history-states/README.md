# 08. History states

## Goals

- Understand what history states are and what they represent ("pseudostates")
- Know the difference between history states and "previous states" - they are not the same!
- Recognize when to use history states
- Know the difference between shallow and deep history
- Know how to implement history states in XState

## Exercises

If the song is in the `loading` state, when it's done loading, it should go to the most recent child state of the `ready` state (`playing` or `paused`). Model this with a history state.
