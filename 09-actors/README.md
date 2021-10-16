

## Goals
- Understand what the actor model is
- Realize that an interpreted machine is an actor!
- Know how to "invoke" an actor in XState
- Know how to "spawn" an actor in XState
- Understand the difference between invoking and spawning actors in XState
- Know how to send and receive events from actors
- Visualize actor communication and hierarchy (sequence diagrams)

## Exercises
1. Invoke an actor for loading the song (invoke in `loading` state)
2. Create a parent actor that invokes the song actor (the machine we've been working on) and is responsible for providing the next songs and keeping track of the songs