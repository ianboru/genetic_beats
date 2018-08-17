import { toJS } from "mobx"

const deepClone = (obj) => {
  return JSON.parse(JSON.stringify(obj))
}

const updateObjectInArray = (arr, index, update) => {
  return [
    ...arr.slice(0, index),
    update,
    ...arr.slice(index + 1),
  ]
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
    while (randomIntegerArray.indexOf(randomInteger) > -1) {
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
  console.log("getting sub array")
  return indexList.map((i) => { return array[i] })
}


const findInJSON = (object, key, value) => {
  let result = {}
  let found = false
  object.forEach((element) => {
    if (element[key] && element[key] == value ) {
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

  return Array(3).fill().map(() => {
    return words[Math.floor(Math.random() * words.length)]
  }).join("-")
}
const noteLetters = ["c","d","e","f","g","a","b"]
const octaves = [2,3,4]

let allNotesInRange = []
octaves.forEach((octave)=>{
  noteLetters.forEach((letter)=>{
    allNotesInRange.push(`${letter}${octave}`)
    if(!["b","e"].includes(letter)){
      allNotesInRange.push(`${letter}#${octave}`)
    }
  })
}) 
console.log(allNotesInRange)
export {
  deepClone,
  getRandomIndices,
  getSubarray,
  findInJSON,
  normalizeSubdivisions,
  generateFamilyName,
  allNotesInRange,
}
