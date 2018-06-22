const arrayOfRandomIntegers = (numIntegers, arrayLength) => {
  let randomIntegerArray = []
  for (let i = 0; i < numIntegers; i++) {
    var randomInteger = Math.floor(Math.random() * arrayLength)
    while (randomIntegerArray.indexOf(randomInteger) > -1) {
      randomInteger = Math.floor(Math.random() * arrayLength)
    }
    randomIntegerArray.push(randomInteger)
  }
  return randomIntegerArray
}

const arrayFromIndexList = (array, indexList) => {
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


const mateCurrentPair = (mom,dad) => {
  console.log("mating current pair")
  console.log(mom)
  console.log(dad)
  let percentDifference = 0
  const mutationRate = .05

  if(Math.max(dad["score"],mom["score"]) > 0){
    percentDifference = Math.abs((dad["score"] - mom["score"])/Math.max(dad["score"],mom["score"]))
  }
  const inheritanceComparitor = 100*(.5 - percentDifference)
  const mutationComparitor = 100*mutationRate

  let fittestBeat = {}
  let weakestBeat = {}
  if (dad["score"] > mom["score"]) {
    fittestBeat = dad
    weakestBeat = mom
  } else {
    fittestBeat = mom
    weakestBeat = dad
  }
  let childBeat = []
  for (let noteIndex = 0; noteIndex < mom["beat"].length; noteIndex++) {
    let randomInteger = Math.floor(Math.random() * 100)
    let survivingNote = 0
    if (randomInteger > inheritanceComparitor) {
      survivingNote = fittestBeat["beat"][noteIndex]
    } else {
      survivingNote = weakestBeat["beat"][noteIndex]
    }
    randomInteger = Math.floor(Math.random() * 100)
    if(randomInteger < mutationComparitor){
      survivingNote = 1 - survivingNote
    }
    childBeat.push(survivingNote)
  }
  return childBeat
}


export {
  arrayOfRandomIntegers,
  arrayFromIndexList,
  findInJSON,
  mateCurrentPair,
}
