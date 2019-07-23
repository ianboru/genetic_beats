//Add sections to each beat
export default [{
        key: "Hip hop 1",
        name: "Hip hop 1",
        synthScore: 0,
        samplerScore: 0,
        scale : "cmaj",
        sections: {
          keyboard: {
            name: "keyboard",
            tracks: [],
            monosynth : true,
          },
          drums: {
            name: "drums",
            tracks: [
              {
                  sample: "samples/kick.wav",
                  sequence: [1, 1, 0, 1, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1, 0, ],
                  mute: false,
                  solo: false,
              },
              {
                  sample: "samples/snare.wav",
                  sequence: [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0],
                  mute: false,
                  solo: false,
              },
              {
                  sample: "samples/hihat.wav",
                  sequence: [1, 0, 1, 1, 0, 1, 1, 0, 1, 0, 1, 1, 0, 1, 1, 0],
                  mute: false,
                  solo: false,
              },
            ],
          }
        },
    },
    {
        key: "Synth 1",
        name: "Synth 1",
        synthScore: 0,
        samplerScore: 0,
        scale : "cmaj",
        sections: {
          keyboard: {
            name: "keyboard",
            monosynth : true,
            tracks: [{
                    synthType: "square",
                    sample: "c3",
                    sequence: [0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, ],
                    duration: [0, 2, 0, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, ],
                },
                {
                    synthType: "square",
                    sample: "d3",
                    sequence: [0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, ],
                    duration: [0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 4, 0, 0, 0, 0, ],
                },
                {
                    synthType: "square",
                    sample: "e3",
                    sequence: [0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, ],
                    duration: [0, 2, 0, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, ],
                },
                {
                    synthType: "square",
                    sample: "f3",
                    sequence: [0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, ],
                    duration: [0, 0, 0, 2, 0, 4, 0, 0, 2, 0, 0, 4, 0, 0, 0, 0, ],
                },
            ],
          },
          drums: {
            name: "drums",
            tracks: [],
          }
        },
    },
    //{
        //"name": "Buzzanova",
        //"synthScore": 0,
        //"samplerScore": 0,
        //"scale" : "cmaj",
        //"tracks": [{
            //"sample": "samples/hi_hat.wav",
            //"sequence": [1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0],
            //"mute": false,
            //"solo": false
        //}, {
            //"sample": "samples/6581__ST_012.wav",
            //"sequence": [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        //}, {
            //"sample": "samples/snare.wav",
            //"sequence": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0],
        //}],
        //"key": "Buzzanova"
    //},
    //{
        //"name": "Blip Hop",
        //"synthScore": 0,
        //"samplerScore": 0,
        //scale : "cmaj",
        //"tracks": [{
            //"sample": "samples/hi_hat.wav",
            //"sequence": [1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0],
            //"mute": false,
            //"solo": false
        //}, {
            //"sample": "samples/8580_PST_060.wav",
            //"sequence": [0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0],
            //"mute": false,
            //"solo": false
        //}, {
            //"sample": "samples/snare.wav",
            //"sequence": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            //"mute": false,
            //"solo": false
        //}, {
            //"sample": "samples/hihat.wav",
            //"sequence": [1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0],
            //"mute": false,
            //"solo": false
        //}],
        //"key": "Blip Hop"
    //},
    //{
        //"name": "Hard Boom Bap",
        //"synthScore": 0,
        //"samplerScore": 0,
        //scale : "cmaj",
        //"tracks": [{
            //"sample": "samples/Kicks/Cymatics - Trap Kick 1 - C.wav",
            //"sequence": [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0],
            //"mute": false,
            //"solo": false
        //}, {
            //"sample": "samples/hi_hat.wav",
            //"sequence": [0, 0, 1, 1, 1, 0, 0, 1, 0, 0, 1, 1, 1, 0, 1, 0],
            //"mute": false,
            //"solo": false
        //}, {
            //"sample": "samples/Snare/Cymatics - Titan Snare 3 - C.wav",
            //"sequence": [0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0],
            //"mute": false,
            //"solo": false
        //}],
        //"key": "Hard Boom Bap"
    //},
    //{
        //"name": "Ching Bap",
        //"synthScore": 0,
        //"samplerScore": 0,
        //scale : "cmaj",
        //"tracks": [{
            //"sample": "samples/Percussion/Cymatics - Synth Perc 28.wav",
            //"sequence": [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0],
            //"mute": false,
            //"solo": false
        //}, {
            //"sample": "samples/hi_hat.wav",
            //"sequence": [0, 0, 1, 1, 1, 0, 0, 0, 0, 1, 0, 0, 1, 0, 1, 0],
            //"mute": false,
            //"solo": false
        //}, {
            //"sample": "samples/Snare/Cymatics - Titan Snare 3 - C.wav",
            //"sequence": [0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0],
            //"mute": false,
            //"solo": false
        //}],
        //"key": "Ching Bap"
    //},
    //{
        //"name": "Bellanova",
        //"synthScore": 0,
        //"samplerScore": 0,
        //scale : "cmaj",
        //"tracks": [{
            //"sample": "samples/kick.wav",
            //"sequence": [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0],
            //"mute": false,
            //"solo": false
        //}, {
            //"sample": "samples/hihat.wav",
            //"sequence": [1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 0, 0],
            //"mute": false,
            //"solo": false
        //}, {
            //"sample": "samples/cowbell.wav",
            //"sequence": [0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0],
            //"mute": false,
            //"solo": false
        //}],
        //"key": "Cowbellnova"
    //},
    //{
        //"name": "Minor Street",
        //"synthScore": 0,
        //"samplerScore": 0,
        //scale : "cmel",
        //"tracks": [{

            //"sample": "c3",
            //"sequence": [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            //"synthType": "square"
        //}, {
            //"sample": "c4",
            //"sequence": [0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            //"synthType": "square"
        //}, {
            //"sample": "g3",
            //"sequence": [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0],
            //"synthType": "square"
        //}, {
            //"sample": "d#3",
            //"sequence": [0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0],
            //"synthType": "sine"
        //}],
        //"key": "Minor Street"
    //},
    //{
        //"name": "Minor Street 3",
        //"synthScore": 0,
        //"samplerScore": 0,
        //"scale" : "cmel",
        //"tracks": [{
            //"sample": "c3",
            //"sequence": [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            //"synthType": "square"
        //}, {
            //"sample": "c4",
            //"sequence": [0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            //"synthType": "square"
        //}, {
            //"sample": "g3",
            //"sequence": [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0],
            //"synthType": "square"
        //}, {
            //"sample": "d#3",
            //"sequence": [0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0],
            //"synthType": "square"
        //}, {
            //"sample": "samples/hihat.wav",
            //"sequence": [1, 0, 1, 0, 1, 1, 0, 1, 1, 0, 1, 0, 1, 1, 0, 1],
            //"synthType": "square"
        //}, {
            //"sample": "samples/Percussion/Cymatics - Grime Perc 25.wav",
            //"sequence": [0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0],
        //}, {
            //"sample": "samples/kick.wav",
            //"sequence": [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        //}],
        //"key": "Minor Street 3"
    //},
    //{
        //"name": "Beachin",
        //"synthScore": 0,
        //"samplerScore": 0,
        //"scale" : "cmaj",
        //"tracks": [{
            //"sample": "c3",
            //"sequence": [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            //"synthType": "sine"
        //}, {
            //"sample": "b3",
            //"sequence": [0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0],
            //"synthType": "square"
        //}, {
            //"sample": "g3",
            //"sequence": [0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            //"synthType": "square"
        //}, {
            //"sample": "d3",
            //"sequence": [0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0],
            //"synthType": "square"
        //}, {
            //"sample": "samples/hihat.wav",
            //"sequence": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        //}, {
            //"sample": "samples/Percussion/Cymatics - Grime Perc 25.wav",
            //"sequence": [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0],
        //}, {
            //"sample": "samples/kick.wav",
            //"sequence": [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0],
        //}],
        //"key": "Beachin"
    //},
    //{
        //"name": "Flute Skeleton",
        //"synthScore": 0,
        //"samplerScore": 0,
        //"scale" : "cmaj",
        //"tracks": [{
            //"sample": "b3",
            //"sequence": [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            //"synthType": "sine"
        //}, {
            //"sample": "a3",
            //"sequence": [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            //"synthType": "sine"
        //}, {
            //"sample": "e3",
            //"sequence": [0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0],
            //"synthType": "square"
        //}, {
            //"sample": "d3",
            //"sequence": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0],
            //"synthType": "sine"
        //}],
        //"key": "Flute Skeleton"
    //},
    //{
        //"name": "Flute Full",
        //"scale" : "cmaj",
        //"synthScore": 0,
        //"samplerScore": 0,
        //"tracks": [{
            //"sample": "b3",
            //"sequence": [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            //"synthType": "sine"
        //}, {
            //"sample": "a3",
            //"sequence": [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            //"synthType": "sine"
        //}, {
            //"sample": "e3",
            //"sequence": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0],
            //"synthType": "sine"
        //}, {
            //"sample": "c3",
            //"sequence": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0],
            //"synthType": "sine"
        //}, {
            //"sample": "samples/kick.wav",
            //"sequence": [1, 0, 1, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0],
        //}, {
            //"sample": "samples/Snare/Cymatics - Titan Snare 3 - C.wav",
            //"sequence": [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0],
        //}, {
            //"sample": "samples/hi_hat.wav",
            //"sequence": [0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 1, 0, 0, 1, 0],
        //}],
        //"key": "Flute Full"
    //}
]
