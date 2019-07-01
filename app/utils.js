import { toJS } from "mobx"


const deepClone = (obj) => {
  return JSON.parse(JSON.stringify(obj))
}

const noteOrder = {
  c: 1,
  d: 2,
  e: 3,
  f: 4,
  g: 5,
  a: 6,
  b: 7,
}

const completeScale = (beat) => {
  beat = deepClone(beat)
  const beatNotes = []
  let synthType = "triangle"
  beat.sections.keyboard.tracks.forEach((track)=>{
    beatNotes.push(track.sample)
    synthType = track.synthType
  })
  let scale
  if(beat.scale){
    scale = SCALES[beat.scale]
  }else{
    scale = SCALES["cmaj"]
  }
  const difference = [...scale].filter(note => !beatNotes.includes(note))
  difference.forEach((note)=>{
    beat.sections.keyboard.tracks.unshift({
      trackType: "synth",
      synthType: synthType,
      sample: note,
      sequence: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, ],
      duration: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, ]
    })
  })
  beat.sections.keyboard.tracks.sort(compareTracksByNote)
  return beat
}

const compareTracksByNote = (first,second) => {
  const firstNote = first.sample.split("")
  const secondNote = second.sample.split("")
  //force sharp to be last element
  //force octage to second element
  if(firstNote[1] == "#"){
    firstNote[3] = "#"
    firstNote[1] = firstNote[2]
  }
  if(secondNote[1] == "#"){
    secondNote[3] = "#"
    secondNote[1] = secondNote[2]
  }
  //check octave first
  if(firstNote[1] > secondNote[1]){
    return -1
  }else if(firstNote[1] < secondNote[1]){
    return 1
  }

  //check letter second
  if(noteOrder[firstNote[0]] > noteOrder[secondNote[0]]){
    return -1
  }else if(noteOrder[firstNote[0]] < noteOrder[secondNote[0]]){
    return 1
  }

  //check sharp last
  if(firstNote[3] && !secondNote[3]){
    return -1
  }else if(!firstNote[3] && secondNote[3]){
    return 1
  }
  return 0
}

const completeSamples = (beat) => {
  beat = deepClone(beat)
  const beatSamples = beat.sections.drums.tracks.map( (track) => { track.sample } )
  const difference = [...starterSamples].filter(sample => !beatSamples.includes(sample))
  difference.forEach((sample) => {
    beat.sections.drums.tracks.push(
      {
        trackType: "sampler",
        sample: sample,
        sequence: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, ],
        duration: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, ],
      }
    )
  })
  return beat
}
function generateFamilyName(){
  const words = [
    "ball",
    "belt",
    "blouse",
    "boot",
    "camp",
    "club",
    "day",
    "hat",
    "house",
    "jacket",
    "pant",
    "plant",
    "pocket",
    "scarf",
    "shirt",
    "sleeve",
    "sock",
    "space",
    "town",
    "trouser",
    "vest",
  ]
  const curDate = new Date()
  const dateString = curDate.getDate() + "/"
                + (curDate.getMonth()+1)  + "/"
                + curDate.getFullYear() + " @ "
                + curDate.getHours() + ":"
                + curDate.getMinutes() + ":"
                + curDate.getSeconds();
  const familyName = Array(3).fill().map(() => {
    return words[Math.floor(Math.random() * words.length)]
  }).join("-") + " " + dateString
  return familyName
}

const noteLetters = ["c","d","e","f","g","a","b"]
const octaves = [2,3]

const SCALES = {
  cmaj : [
    "c4",
    "b3",
    "a3",
    "g3",
    "f3",
    "e3",
    "d3",
    "c3",
  ],
  cmin : [
    "c4",
    "a#3",
    "a3",
    "g3",
    "f3",
    "d#3",
    "d3",
    "c3",
  ],
  cmel : [
    "c4",
    "b3",
    "a3",
    "g3",
    "f3",
    "d#3",
    "d3",
    "c3",
  ],
  cphryg : [
    "c4",
    "b3",
    "a3",
    "g3",
    "f#3",
    "e3",
    "d3",
    "c3",
  ],
}

const synthTypes = ["triangle","square"]
const starterSamples = ["samples/hi_hat.wav","samples/kick.wav","samples/snare.wav","samples/clave.wav"]


export {
  deepClone,
  generateFamilyName,
  SCALES,
  synthTypes,
  starterSamples,
  completeScale,
  completeSamples
}
