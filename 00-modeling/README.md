

## Goals

- Understand what software modeling is
- Understand what event-driven architecture is
- Translate user stories to "given-when-then" specifications
- Know everything that can happen (events) in their app
- Plan app logic at a higher level of abstraction using state machines
- Create a basic state machine without libraries (using `switch` or objects)

## Exercise

Let's build a media player. It will have the following functionality:

- A song, when loaded, will start playing by default.
- The user can play or pause the song
- When the song is over, the next song will play
- The user can like or unlike a song
- When the song is unliked, the next song plays
- The user can skip to the next song

1. What are all the possible events (user or otherwise) that can happen?
2. Do these events exhibit the same behavior at all times? If not, what are the different behaviors?
3. What are all the possible behaviors (states) of the app?
4. How can these states change? (due to which events?)
5. Model these states and transitions as a finite state machine, using a switch statement or an object.
