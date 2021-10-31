# State Machines & XState Workshop

Welcome to the [Frontend Masters](https://frontendmasters.com) workshop on **JavaScript State Machines and Statecharts with XState, v2**! In this workshop, we will be learning about software modeling with state machines and statecharts by building a real-world media player application.

- GitHub repo: https://github.com/statelyai/xstate
- Documentation: https://xstate.js.org/docs
- Visualizer: https://stately.ai/viz
- Community: https://discord.gg/xstate

## Getting Started

1. Run `npm install` or `yarn install`
2. Run `npm run dev` or `yarn dev`
3. Navigate to any of the exercises:

- [00-modeling](http://localhost:3000/00-modeling/)
- [01-states-transitions](http://localhost:3000/01-states-transitions/)
- [02-actions](http://localhost:3000/02-actions/)
- [03-context](http://localhost:3000/03-context/)
- [04-guards](http://localhost:3000/04-guards/)
- [05-compound-states](http://localhost:3000/05-compound-states/)
- [06-parallel-states](http://localhost:3000/06-parallel-states/)
- [07-final-states](http://localhost:3000/07-final-states/)
- [08-history-states](http://localhost:3000/08-history-states/)
- [09-actors](http://localhost:3000/09-actors/)
- [10-testing](http://localhost:3000/10-testing/)

## What we're building
In this workshop, we will be building a media player. This app will allow you to like/ unlike a song, represented by the heart symbol. The next option the app will allow you to do is thumbs down the song, which will remove it from your playlist. The play/pause action will allow you to play or pause the current song. Then we have the forward/next option of the app that will allow you to skip the current song and load the next in queue. Next, you will have the option to mute/ unmute the current song that is playing.

![media-player](https://user-images.githubusercontent.com/49595511/139563998-b2118580-d981-4465-bfd1-06d876b0b08a.png)

We will be using state machines, state charts, and the actor model to build these features on our media player app.
