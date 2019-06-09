//Mute/volume for each section
//Purpose of section is to enable display and manipulation of properties like scale, 
//and kit potentially for multiple synths or drumsets? name

//Add sections to each beat

//any time we reference beat.tracks we would need to reference section
//Currently mutate is the only action that involves sections, and it just uses a flag on the track


//Avoid making beats more complicated and refactoring everything
//that uses beats
// Currently beat is already 5 levels deep (beat.tracks[i].sequence)
export default [
    {
        key: "0.0",
        name: "Synth 1",
        score: 0,
        synthScore : 0,
        samplerScore: 0,
        scale : "cmaj",
        tracks: [{
                trackType: "synth",
                synthType: "square",
                sample: "c3",
                sequence: [0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, ],
                duration: [0, 2, 1, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, ]
            },
            {
                trackType: "synth",
                synthType: "square",
                sample: "d3",
                sequence: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, ],
                duration: [0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 4, 0, 0, 0, 0, ],
            },
            {
                trackType: "synth",
                synthType: "square",
                sample: "e3",
                sequence: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, ],
                duration: [0, 2, 0, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, ],
            },
            {
                trackType: "synth",
                synthType: "square",
                sample: "f3",
                sequence: [0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, ],
                duration: [0, 0, 0, 2, 0, 4, 0, 0, 2, 0, 0, 4, 0, 0, 0, 0, ],
            },
            {
                trackType: "synth",
                synthType: "square",
                sample: "g3",
                sequence: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, ],
                duration: [0, 0, 0, 2, 0, 4, 0, 0, 2, 0, 0, 4, 0, 0, 0, 0, ],
            },
            {
                trackType: "synth",
                synthType: "square",
                sample: "a3",
                sequence: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, ],
                duration: [0, 0, 0, 2, 0, 4, 0, 0, 2, 0, 0, 4, 0, 0, 0, 0, ],
            },
            {
                trackType: "synth",
                synthType: "square",
                sample: "b3",
                sequence: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, ],
                duration: [0, 0, 0, 2, 0, 4, 0, 0, 2, 0, 0, 4, 0, 0, 0, 0, ],
            },
            {
                trackType: "synth",
                synthType: "square",
                sample: "c4",
                sequence: [0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, ],
                duration: [0, 0, 0, 2, 0, 4, 0, 0, 2, 0, 0, 4, 0, 0, 0, 0, ],
            },
            {
              "trackType": "sampler",
              "sample": "samples/hi_hat.wav",
              "sequence": [1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0],
            }, {
              "trackType": "sampler",
              "sample": "samples/snare.wav",
              "sequence": [0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0],
            }, {
              "trackType": "sampler",
              "sample": "samples/kick.wav",
              "sequence": [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0],
            },

            {

              "trackType": "sampler",
              "sample": "samples/clave.wav",
              "sequence": [0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0],
            },
            
        ],
    },
    //{
        //"name": "Buzzanova",
        //"score": 0,
        //"tracks": [{
            //"trackType": "sampler",
            //"sample": "samples/hi_hat.wav",
            //"sequence": [1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0],
            //"mute": false,
            //"solo": false
        //}, {
            //"sample": "samples/6581__ST_012.wav",
            //"sequence": [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            //"trackType": "sampler"
        //}, {
            //"sample": "samples/snare.wav",
            //"sequence": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0],
            //"trackType": "sampler"
        //}],
        //"key": "0.2"
    //},
    //{
        //"name": "Blip Hop",
        //"score": 0,
        //"tracks": [{
            //"trackType": "sampler",
            //"sample": "samples/hi_hat.wav",
            //"sequence": [1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0],
            //"mute": false,
            //"solo": false
        //}, {
            //"sample": "samples/8580_PST_060.wav",
            //"sequence": [0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0],
            //"trackType": "sampler",
            //"mute": false,
            //"solo": false
        //}, {
            //"sample": "samples/snare.wav",
            //"sequence": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            //"trackType": "sampler",
            //"mute": false,
            //"solo": false
        //}, {
            //"sample": "samples/hihat.wav",
            //"sequence": [1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0],
            //"trackType": "sampler",
            //"mute": false,
            //"solo": false
        //}],
        //"key": "0.3"
    //},
    //{
        //"name": "Hard Boom Bap",
        //"score": 0,
        //"tracks": [{
            //"trackType": "sampler",
            //"sample": "samples/Kicks/Cymatics - Trap Kick 1 - C.wav",
            //"sequence": [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0],
            //"mute": false,
            //"solo": false
        //}, {
            //"sample": "samples/hi_hat.wav",
            //"sequence": [0, 0, 1, 1, 1, 0, 0, 1, 0, 0, 1, 1, 1, 0, 1, 0],
            //"trackType": "sampler",
            //"mute": false,
            //"solo": false
        //}, {
            //"sample": "samples/Snare/Cymatics - Titan Snare 3 - C.wav",
            //"sequence": [0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0],
            //"trackType": "sampler",
            //"mute": false,
            //"solo": false
        //}],
        //"key": "0.4"
    //},
    //{
        //"name": "Ching Bap",
        //"score": 0,
        //"tracks": [{
            //"trackType": "sampler",
            //"sample": "samples/Percussion/Cymatics - Synth Perc 28.wav",
            //"sequence": [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0],
            //"mute": false,
            //"solo": false
        //}, {
            //"sample": "samples/hi_hat.wav",
            //"sequence": [0, 0, 1, 1, 1, 0, 0, 0, 0, 1, 0, 0, 1, 0, 1, 0],
            //"trackType": "sampler",
            //"mute": false,
            //"solo": false
        //}, {
            //"sample": "samples/Snare/Cymatics - Titan Snare 3 - C.wav",
            //"sequence": [0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0],
            //"trackType": "sampler",
            //"mute": false,
            //"solo": false
        //}],
        //"key": "0.5"
    //},
    //{
        //"name": "Bellanova",
        //"score": 0,
        //"tracks": [{
            //"trackType": "sampler",
            //"sample": "samples/kick.wav",
            //"sequence": [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0],
            //"mute": false,
            //"solo": false
        //}, {
            //"sample": "samples/hihat.wav",
            //"sequence": [1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 0, 0],
            //"trackType": "sampler",
            //"mute": false,
            //"solo": false
        //}, {
            //"sample": "samples/cowbell.wav",
            //"sequence": [0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0],
            //"trackType": "sampler",
            //"mute": false,
            //"solo": false
        //}],
        //"key": "0.6"
    //},
    //{
        //"name": "Minor Street",
        //"score": 0,
        //"tracks": [{
            //"sample": "c2",
            //"sequence": [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            //"trackType": "synth",
            //"synthType": "square"
        //}, {
            //"sample": "c3",
            //"sequence": [0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            //"trackType": "synth",
            //"synthType": "square"
        //}, {
            //"sample": "g2",
            //"sequence": [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0],
            //"trackType": "synth",
            //"synthType": "square"
        //}, {
            //"sample": "d#3",
            //"sequence": [0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0],
            //"trackType": "synth",
            //"synthType": "sine"
        //}],
        //"key": "0.7"
    //},
    //{
        //"name": "Minor Street 2",
        //"score": 0,
        //"tracks": [{
            //"sample": "c2",
            //"sequence": [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            //"trackType": "synth",
            //"synthType": "square"
        //}, {
            //"sample": "c3",
            //"sequence": [0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            //"trackType": "synth",
            //"synthType": "square"
        //}, {
            //"sample": "g2",
            //"sequence": [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0],
            //"trackType": "synth",
            //"synthType": "square"
        //}, {
            //"sample": "d#3",
            //"sequence": [0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0],
            //"trackType": "synth",
            //"synthType": "square"
        //}, {
            //"sample": "samples/hihat.wav",
            //"sequence": [1, 0, 1, 0, 1, 1, 0, 1, 1, 0, 1, 0, 1, 1, 0, 1],
            //"trackType": "sampler",
            //"synthType": "square"
        //}, {
            //"sample": "samples/Percussion/Cymatics - Grime Perc 25.wav",
            //"sequence": [0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0],
            //"trackType": "sampler"
        //}, {
            //"sample": "samples/kick.wav",
            //"sequence": [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            //"trackType": "sampler"
        //}],
        //"key": "0.8"
    //},
    //{
        //"name": "Beachin",
        //"score": 0,
        //"tracks": [{
            //"sample": "c3",
            //"sequence": [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            //"trackType": "synth",
            //"synthType": "sine"
        //}, {
            //"sample": "b2",
            //"sequence": [0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0],
            //"trackType": "synth",
            //"synthType": "square"
        //}, {
            //"sample": "g2",
            //"sequence": [0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            //"trackType": "synth",
            //"synthType": "square"
        //}, {
            //"sample": "d3",
            //"sequence": [0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0],
            //"trackType": "synth",
            //"synthType": "square"
        //}, {
            //"sample": "samples/hihat.wav",
            //"sequence": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            //"trackType": "sampler"
        //}, {
            //"sample": "samples/Percussion/Cymatics - Grime Perc 25.wav",
            //"sequence": [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0],
            //"trackType": "sampler"
        //}, {
            //"sample": "samples/kick.wav",
            //"sequence": [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0],
            //"trackType": "sampler"
        //}],
        //"key": "0.9"
    //},
]
