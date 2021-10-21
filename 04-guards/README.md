# 04. Guards

## Goals

- Know what guarded transitions ("guards") are and when they should be used (rather than different events)
- Understand that guards "fall through" like an if/else-if structure
- Know how to implement guards in XState
- Know how to parameterize guards in XState
- Know what eventless ("always") transitions are and how they work well with guards

## Exercises

Add the missing guards to ensure the `volume` stays within range, and that sending the `'LIKE.TOGGLE'` event performs the right action.

Then, add the missing eventless transition to the `playing` state.
