import { toJS } from "mobx"

const deepClone = (obj) => {
  return JSON.parse(JSON.stringify(obj))
}

const getNormalProbability = (x, mean, sd) =>{
    const variance = Math.pow(sd,2)
    const pi = 3.1415926
    const denom = Math.pow(2*pi*variance,.5)
    const num = Math.pow(
      Math.E,
      -1*Math.pow((x-mean),2)/(2*variance)
    )
    return num/denom
}

const calculateSampleDifference = (beat1,beat2) => {
  const beat1Samples = beat1.tracks.map((track)=>{
    return track.sample
  })
  const beat2Samples = beat2.tracks.map((track)=>{
    return track.sample
  })
  let numDifferent = 0
  beat1Samples.forEach((sample)=>{
    if(!beat2Samples.includes(sample)){
      ++numDifferent
    }
  })
  beat2Samples.forEach((sample)=>{
    if(!beat1Samples.includes(sample)){
      ++numDifferent
    }
  })
  return numDifferent
}

const normalizeSubdivisions = (beat, newSubdivisions) => {
  // Deep clone beat object
  let newBeat = JSON.parse(JSON.stringify(toJS(beat)))
  const subdivisionRatio = newSubdivisions / newBeat.tracks[0].sequence.length
  newBeat.tracks.forEach( (track, i) => {
    let newSequence = []
    track.sequence.forEach( (note) => {
      newSequence.push(note)
      for (let j = 0; j < subdivisionRatio-1; j++) {
        newSequence.push(0)
      }
    })
    newBeat.tracks[i].sequence = newSequence
  })
  return newBeat
}

const getRandomIndices = (numIntegers, arrayLength) => {
  let randomIntegerArray = []
  for (let i = 0; i < numIntegers; i++) {
    var randomInteger = Math.floor(Math.random() * arrayLength)
    if(randomIntegerArray.indexOf(randomInteger) == -1){
      randomIntegerArray.push(randomInteger)
      continue
    }
    let numTries = 0
    while (randomIntegerArray.indexOf(randomInteger) > -1) {
      ++numTries
      if(numTries > 20){
        break
      }
      randomInteger = Math.floor(Math.random() * arrayLength)
      if(randomIntegerArray.indexOf(randomInteger) == -1){
        randomIntegerArray.push(randomInteger)
        break
      }
    }
  }
  return randomIntegerArray
}

const getSubarray = (array, indexList) => {
  return indexList.map((i) => { return array[i] })
}

const findInJSON = (object, key1, value1, key2, value2 ) => {
  let result = {}
  let found = false
  object.forEach((element) => {
    if (element[key1] && element[key1] == value1  && element[key2] == value2) {
      result = element
      found = true
    }
  })
  if(found){
    return result
  }else{
    return null
  }
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

// TODO: This can move out of the store
const completeScale = (beat) => {
  beat = deepClone(beat)
  const beatNotes = []
  let synthType = "triangle"
  beat.tracks.forEach((track)=>{
    if(track.trackType == "synth"){
      beatNotes.push(track.sample)
      synthType = track.synthType
    }
  })
  let scale
  if(beat.scale){
    scale = SCALES[beat.scale]
  }else{
    scale = SCALES["cmaj"]
  }
  const difference = [...scale].filter(note => !beatNotes.includes(note))
  difference.forEach((note)=>{
    beat.tracks.unshift({
      trackType: "synth",
      synthType: synthType,
      sample: note,
      sequence: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, ],
      duration: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, ]
    })
  })
  beat.tracks.sort(compareTracksByNote)
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
  const beatSamples = []
  beat.tracks.forEach((track)=>{
    if(track.trackType == "sampler"){
      beatSamples.push(track.sample)
    }
  })

  const difference = [...starterSamples].filter(sample => !beatSamples.includes(sample))
  difference.forEach((sample)=>{
    beat.tracks.push(
      {
        trackType: "sampler",
        sample: sample,
        sequence: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, ],
        duration: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, ]
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

let allNotesInRange = []
octaves.forEach((octave)=>{
  noteLetters.forEach((letter)=>{
    allNotesInRange.push(`${letter}${octave}`)
    if(!["b","e"].includes(letter)){
      allNotesInRange.push(`${letter}#${octave}`)
    }
  })
})

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
  getRandomIndices,
  getSubarray,
  findInJSON,
  normalizeSubdivisions,
  generateFamilyName,
  allNotesInRange,
  getNormalProbability,
  calculateSampleDifference,
  SCALES,
  synthTypes,
  starterSamples,
  completeScale,
  completeSamples
}
