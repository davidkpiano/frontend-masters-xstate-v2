# 04. Guards

## Goals

- Know what guarded transitions ("guards") are and when they should be used (rather than different events)
- Understand that guards "fall through" like an if/else-if structure
- Know how to implement guards in XState
- Know how to parameterize guards in XState
- Know what eventless ("always") transitions are and how they work well with guards

## Exercises

1. Add volume controls and prevent the volume from going below 0 or above 10
2. Add an `always` transition that goes to the next song when `elapsed` >= `duration`
