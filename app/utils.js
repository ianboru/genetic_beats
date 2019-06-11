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
    "c3",
    "d3",
    "e3",
    "f3",
    "g3",
    "a3",
    "b3",
    "c4",
  ],
  cmin : [
    "c3",
    "d3",
    "d#3",
    "f3",
    "g3",
    "a3",
    "a#3",
    "c4",
  ],
  cmel : [
    "c3",
    "d3",
    "d#3",
    "f3",
    "g3",
    "a3",
    "b3",
    "c4",
  ],
  cphryg : [
    "c3",
    "d3",
    "e3",
    "f#3",
    "g3",
    "a3",
    "b3",
    "c4",
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
  starterSamples
}
