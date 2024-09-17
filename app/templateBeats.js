/* eslint-disable filenames/match-regex */
import {
  DEFAULT_SCORE,
  DEFAULT_MONOSYNTH,
  DEFAULT_SOLO,
  DEFAULT_MUTE,
} from "./utils"

export default [
  {
    key: "Hip hop 1",
    name: "Hip hop 1",
    synthScore: DEFAULT_SCORE,
    samplerScore: DEFAULT_SCORE,
    scale: "cmaj",
    sections: {
      keyboard: {
        name: "keyboard",
        tracks: [],
        monosynth: DEFAULT_MONOSYNTH,
      },
      drums: {
        name: "drums",
        tracks: [
          {
            sample: "samples/kick.wav",
            sequence: [1, 1, 0, 1, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1, 0],
            mute: DEFAULT_MUTE,
            solo: DEFAULT_SOLO,
          },
          {
            sample: "samples/snare.wav",
            sequence: [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0],
            mute: DEFAULT_MUTE,
            solo: DEFAULT_SOLO,
          },
          {
            sample: "samples/hihat.wav",
            sequence: [1, 0, 1, 1, 0, 1, 1, 0, 1, 0, 1, 1, 0, 1, 1, 0],
            mute: DEFAULT_MUTE,
            solo: DEFAULT_SOLO,
          },
        ],
      },
    },
  },
  {
    key: "Synth 1",
    name: "Synth 1",
    synthScore: DEFAULT_SCORE,
    samplerScore: DEFAULT_SCORE,
    scale: "cmaj",
    sections: {
      keyboard: {
        name: "keyboard",
        monosynth: DEFAULT_MONOSYNTH,
        tracks: [
          {
            synthType: "square",
            sample: "c3",
            sequence: [0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          },
          {
            synthType: "square",
            sample: "d3",
            sequence: [0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0],
          },
          {
            synthType: "square",
            sample: "e3",
            sequence: [0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          },
          {
            synthType: "square",
            sample: "f3",
            sequence: [0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0],
          },
        ],
      },
      drums: {
        name: "drums",
        tracks: [],
      },
    },
  },
  {
    key: "Buzzanova",
    name: "Buzzanova",
    synthScore: DEFAULT_SCORE,
    samplerScore: DEFAULT_SCORE,
    scale: "cmaj",
    sections: {
      keyboard: {
        name: "keyboard",
        monosynth: DEFAULT_MONOSYNTH,
        tracks: [],
      },
      drums: {
        name: "drums",
        tracks: [
          {
            sample: "samples/hi_hat.wav",
            sequence: [1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0],
            mute: DEFAULT_MUTE,
            solo: DEFAULT_SOLO,
          },
          {
            sample: "samples/6581__ST_012.wav",
            sequence: [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            mute: DEFAULT_MUTE,
            solo: DEFAULT_SOLO,
          },
          {
            sample: "samples/snare.wav",
            sequence: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0],
            mute: DEFAULT_MUTE,
            solo: DEFAULT_SOLO,
          },
        ],
      },
    },
  },
  {
    name: "Blip Hop",
    key: "Blip Hop",
    synthScore: DEFAULT_SCORE,
    samplerScore: DEFAULT_SCORE,
    scale: "cmaj",
    sections: {
      keyboard: {
        name: "keyboard",
        monosynth: DEFAULT_MONOSYNTH,
        tracks: [],
      },
      drums: {
        name: "drums",
        tracks: [
          {
            sample: "samples/hi_hat.wav",
            sequence: [1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0],
            mute: DEFAULT_MUTE,
            solo: DEFAULT_SOLO,
          },
          {
            sample: "samples/8580_PST_060.wav",
            sequence: [0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0],
            mute: DEFAULT_MUTE,
            solo: DEFAULT_SOLO,
          },
          {
            sample: "samples/snare.wav",
            sequence: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            mute: DEFAULT_MUTE,
            solo: DEFAULT_SOLO,
          },
          {
            sample: "samples/hihat.wav",
            sequence: [1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0],
            mute: DEFAULT_MUTE,
            solo: DEFAULT_SOLO,
          },
        ],
      },
    },
  },
  {
    name: "Hard Boom Bap",
    key: "Hard Boom Bap",
    synthScore: DEFAULT_SCORE,
    samplerScore: DEFAULT_SCORE,
    scale: "cmaj",
    sections: {
      keyboard: {
        name: "keyboard",
        monosynth: DEFAULT_MONOSYNTH,
        tracks: [],
      },
      drums: {
        name: "drums",
        tracks: [
          {
            sample: "samples/Kicks/Cymatics - Trap Kick 1 - C.wav",
            sequence: [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0],
            mute: DEFAULT_MUTE,
            solo: DEFAULT_SOLO,
          },
          {
            sample: "samples/hi_hat.wav",
            sequence: [0, 0, 1, 1, 1, 0, 0, 1, 0, 0, 1, 1, 1, 0, 1, 0],
            mute: DEFAULT_MUTE,
            solo: DEFAULT_SOLO,
          },
          {
            sample: "samples/Snare/Cymatics - Titan Snare 3 - C.wav",
            sequence: [0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0],
            mute: DEFAULT_MUTE,
            solo: DEFAULT_SOLO,
          },
        ],
      },
    },
  },
  {
    name: "Ching Bap",
    key: "Ching Bap",
    synthScore: DEFAULT_SCORE,
    samplerScore: DEFAULT_SCORE,
    scale: "cmaj",
    sections: {
      keyboard: {
        name: "keyboard",
        monosynth: DEFAULT_MONOSYNTH,
        tracks: [],
      },
      drums: {
        name: "drums",
        tracks: [
          {
            sample: "samples/Percussion/Cymatics - Synth Perc 28.wav",
            sequence: [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0],
            mute: DEFAULT_MUTE,
            solo: DEFAULT_SOLO,
          },
          {
            sample: "samples/hi_hat.wav",
            sequence: [0, 0, 1, 1, 1, 0, 0, 0, 0, 1, 0, 0, 1, 0, 1, 0],
            mute: DEFAULT_MUTE,
            solo: DEFAULT_SOLO,
          },
          {
            sample: "samples/Snare/Cymatics - Titan Snare 3 - C.wav",
            sequence: [0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0],
            mute: DEFAULT_MUTE,
            solo: DEFAULT_SOLO,
          },
        ],
      },
    },
  },
  {
    name: "Bellanova",
    key: "Cowbellnova",
    synthScore: DEFAULT_SCORE,
    samplerScore: DEFAULT_SCORE,
    scale: "cmaj",
    sections: {
      keyboard: {
        name: "keyboard",
        monosynth: DEFAULT_MONOSYNTH,
        tracks: [],
      },
      drums: {
        name: "drums",
        tracks: [
          {
            sample: "samples/kick.wav",
            sequence: [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0],
            mute: DEFAULT_MUTE,
            solo: DEFAULT_SOLO,
          },
          {
            sample: "samples/hihat.wav",
            sequence: [1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 0, 0],
            mute: DEFAULT_MUTE,
            solo: DEFAULT_SOLO,
          },
          {
            sample: "samples/cowbell.wav",
            sequence: [0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0],
            mute: DEFAULT_MUTE,
            solo: DEFAULT_SOLO,
          },
        ],
      },
    },
  },
  {
    name: "Minor Street",
    key: "Minor Street",
    synthScore: DEFAULT_SCORE,
    samplerScore: DEFAULT_SCORE,
    scale: "cmel",
    sections: {
      keyboard: {
        name: "keyboard",
        monosynth: DEFAULT_MONOSYNTH,
        tracks: [
          {
            sample: "c3",
            sequence: [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            synthType: "square",
          },
          {
            sample: "c4",
            sequence: [0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            synthType: "square",
          },
          {
            sample: "g3",
            sequence: [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0],
            synthType: "square",
          },
          {
            sample: "d#3",
            sequence: [0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0],
            synthType: "square",
          },
        ],
      },
      drums: {
        name: "drums",
        tracks: [],
      },
    },
  },
  {
    name: "Minor Street 3",
    key: "Minor Street 3",
    synthScore: DEFAULT_SCORE,
    samplerScore: DEFAULT_SCORE,
    scale: "cmel",
    sections: {
      keyboard: {
        name: "keyboard",
        monosynth: DEFAULT_MONOSYNTH,
        tracks: [
          {
            sample: "c3",
            sequence: [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            synthType: "square",
          },
          {
            sample: "c4",
            sequence: [0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            synthType: "square",
          },
          {
            sample: "g3",
            sequence: [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0],
            synthType: "square",
          },
          {
            sample: "d#3",
            sequence: [0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0],
            synthType: "square",
          },
        ],
      },
      drums: {
        name: "drums",
        tracks: [
          {
            sample: "samples/hihat.wav",
            sequence: [1, 0, 1, 0, 1, 1, 0, 1, 1, 0, 1, 0, 1, 1, 0, 1],
          },
          {
            sample: "samples/Percussion/Cymatics - Grime Perc 25.wav",
            sequence: [0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0],
          },
          {
            sample: "samples/kick.wav",
            sequence: [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          },
        ],
      },
    },
  },
  {
    name: "Beachin",
    key: "Beachin",
    synthScore: DEFAULT_SCORE,
    samplerScore: DEFAULT_SCORE,
    scale: "cmaj",
    sections: {
      keyboard: {
        name: "keyboard",
        monosynth: DEFAULT_MONOSYNTH,
        tracks: [
          {
            sample: "c3",
            sequence: [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            synthType: "square",
          },
          {
            sample: "b3",
            sequence: [0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0],
            synthType: "square",
          },
          {
            sample: "g3",
            sequence: [0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            synthType: "square",
          },
          {
            sample: "d3",
            sequence: [0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0],
            synthType: "square",
          },
        ],
      },
      drums: {
        name: "drums",
        tracks: [
          {
            sample: "samples/hihat.wav",
            sequence: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          },
          {
            sample: "samples/Percussion/Cymatics - Grime Perc 25.wav",
            sequence: [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0],
          },
          {
            sample: "samples/kick.wav",
            sequence: [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0],
          },
        ],
      },
    },
  },
  {
    name: "Flute Skeleton",
    key: "Flute Skeleton",
    synthScore: DEFAULT_SCORE,
    samplerScore: DEFAULT_SCORE,
    scale: "cmaj",
    sections: {
      keyboard: {
        name: "keyboard",
        monosynth: DEFAULT_MONOSYNTH,
        tracks: [
          {
            sample: "b3",
            sequence: [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            synthType: "square",
          },
          {
            sample: "a3",
            sequence: [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            synthType: "square",
          },
          {
            sample: "e3",
            sequence: [0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0],
            synthType: "square",
          },
          {
            sample: "d3",
            sequence: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0],
            synthType: "square",
          },
        ],
      },
      drums: {
        name: "drums",
        tracks: [],
      },
    },
  },
  {
    name: "Flute Full",
    key: "Flute Full",
    synthScore: DEFAULT_SCORE,
    samplerScore: DEFAULT_SCORE,
    scale: "cmaj",
    sections: {
      keyboard: {
        name: "keyboard",
        monosynth: DEFAULT_MONOSYNTH,
        tracks: [
          {
            sample: "b3",
            sequence: [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            synthType: "triangle",
          },
          {
            sample: "a3",
            sequence: [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            synthType: "triangle",
          },
          {
            sample: "e3",
            sequence: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0],
            synthType: "triangle",
          },
          {
            sample: "c3",
            sequence: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0],
            synthType: "triangle",
          },
        ],
      },
      drums: {
        name: "drums",
        tracks: [
          {
            sample: "samples/kick.wav",
            sequence: [1, 0, 1, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0],
          },
          {
            sample: "samples/Snare/Cymatics - Titan Snare 3 - C.wav",
            sequence: [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0],
          },
          {
            sample: "samples/hi_hat.wav",
            sequence: [0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 1, 0, 0, 1, 0],
          },
        ],
      },
    },
  },
]
