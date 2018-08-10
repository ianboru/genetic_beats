const deepClone = (obj) => {
  return JSON.parse(JSON.stringify(obj))
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
  return indexList.map((i) => { return array[i] })
}


const findInJSON = (object, key, value) => {
  let result = {}
  object.forEach((element) => {
    if (element[key] && element[key] == value ) {
      result = element
    }
  })
  return result
}


const matePair = (mom, dad, mutationRateInteger) => {
  let mutationRate = mutationRateInteger/100
  let percentDifference = 0

  if (Math.max(dad.score, mom.score) > 0) {
    percentDifference = Math.abs((dad.score - mom.score) / Math.max(dad.score, mom.score))
  }
  const inheritanceComparitor = 100 * (0.5 - percentDifference)
  const mutationComparitor = 100 * mutationRate

  let fittestBeat = {}
  let weakestBeat = {}
  if (dad.score > mom.score) {
    fittestBeat = dad
    weakestBeat = mom
  } else {
    fittestBeat = mom
    weakestBeat = dad
  }

  let childBeat = []
  mom.sequence.forEach( (note, noteIndex) => {
    let randomInteger = Math.floor(Math.random() * 100)
    let survivingNote = 0
    if (randomInteger > inheritanceComparitor) {
      survivingNote = fittestBeat.sequence[noteIndex]
    } else {
      survivingNote = weakestBeat.sequence[noteIndex]
    }
    randomInteger = Math.floor(Math.random() * 100)
    if(randomInteger < mutationComparitor){
      survivingNote = 1 - survivingNote
    }
    childBeat.push(survivingNote)
  })

  return childBeat
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

export {
  deepClone,
  getRandomIndices,
  getSubarray,
  findInJSON,
  matePair,
  generateFamilyName,
}
