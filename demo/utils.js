const updateObjectInArray = (arr, index, update) => {
  return [
    ...arr.slice(0, index),
    update,
    ...arr.slice(index + 1),
  ]
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


const matePair = (mom, dad) => {
  let percentDifference = 0
  const mutationRate = .05

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


export {
  updateObjectInArray,
  getRandomIndices,
  getSubarray,
  findInJSON,
  matePair,
}
