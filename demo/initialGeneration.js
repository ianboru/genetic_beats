export default [
  {
    key    : "0.0",
    score  : 0,
    type   : "sampler",

    tracks : [
      {
        sample   : "samples/kick.wav",
        sequence : [1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1, 0,],
      },
      {
        sample   : "samples/clave.wav",
        sequence : [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0],
      },
      {
        sample   : "samples/hihat.wav",
        sequence : [1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      },
    ],
  },
  {
    key    : "0.1",
    score  : 0,
    type   : "sampler",

    tracks : [
      {
        sample   : "samples/kick.wav",
        sequence : [1, 1, 0, 0, 0, 0, 1, 0],
      },
      {
        sample   : "samples/8580__ST_060.wav",
        sequence : [0, 0, 1, 0, 0, 0, 0, 0],
      },
      {
        sample   : "samples/hihat.wav",
        sequence : [1, 0, 1, 0, 1, 0, 1, 0],
      },
    ],
  },
  {
    key    : "0.2",
    score  : 0,
    
    tracks : [
      {
        trackType   : "synth",
        synthType   : "square",
        sample   : "c3",
        sequence : [0,1,0,1,0,0,0,0,0,0,0,0,0,0,0,0,],

      },
      { 
        trackType   : "synth",
        synthType   : "square",
        sample   : "d3",
        sequence : [0,0,0,0,0,1,0,0,0,0,0,1,0,0,0,0,],

      },
      {
        trackType   : "synth",
        synthType   : "square",
        sample   : "e3",
        sequence : [0,1,0,1,0,0,0,0,0,0,0,0,0,0,0,0,],

      },
      {
        trackType   : "synth",
        synthType   : "square",
        sample   : "f3",
        sequence : [0,0,0,1,0,1,0,0,1,0,0,1,0,0,0,0,],

      },
    ],
  },
]
