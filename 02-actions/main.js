import "../style.css";
import { createMachine, assign, interpret, send } from "xstate";
import { raise } from "xstate/lib/actions";
import elements from "../utils/elements";

const playerMachine = createMachine({
  initial: "loading",
  states: {
    loading: {
      on: {
        LOADED: {
          actions: ["assignSongData"],
          target: "playing",
        },
      },
    },
    paused: {
      on: {
        PLAY: { target: "playing" },
      },
    },
    playing: {
      entry: ["playAudio"],
      exit: ["pauseAudio"],
      on: {
        PAUSE: { target: "paused" },
      },
    },
  },
  on: {
    SKIP: {
      actions: "skipSong",
      target: "loading",
    },
    LIKE: {
      actions: "likeSong",
    },
    UNLIKE: {
      actions: "unlikeSong",
    },
    DISLIKE: {
      actions: ["dislikeSong", raise({ type: "SKIP" })],
    },
    VOLUME: {
      actions: "volume",
    },
  },
}).withConfig({
  actions: {
    assignSongData: () => {
      console.log("Assigning song data...");
    },
    playAudio: () => {
      console.log("Playing song!");
    },
    pauseAudio: () => {
      console.log("Audio paused!");
    },
    skipSong: () => {
      console.log("Song skipped");
      setTimeout(() => {
        service.send({ type: "LOADED" });
      }, 1000);
    },
    likeSong: () => {
      console.log("Song liked");
    },
    dislikeSong: () => {
      console.log("Song disliked");
    },
    volume: () => {
      console.log("Volume slider");
    },
  },
});

elements.elPlayButton.addEventListener("click", () => {
  service.send({ type: "PLAY" });
});
elements.elPauseButton.addEventListener("click", () => {
  service.send({ type: "PAUSE" });
});
elements.elSkipButton.addEventListener("click", () => {
  service.send({ type: "SKIP" });
});
elements.elLikeButton.addEventListener("click", () => {
  service.send({ type: "LIKE" });
});
elements.elDislikeButton.addEventListener("click", () => {
  service.send({ type: "DISLIKE" });
});

const service = interpret(playerMachine).start();

service.subscribe((state) => {
  // console.log(state.actions);

  // @ts-ignore
  elements.elLoadingButton.hidden = !state.matches("loading");
  // @ts-ignore
  elements.elPlayButton.hidden = !state.can({ type: "PLAY" });
  // @ts-ignore
  elements.elPauseButton.hidden = !state.can({ type: "PAUSE" });
});

service.send("LOADED");
