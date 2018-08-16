import {
  deepClone,
  getRandomIndices,
  getSubarray,
  findInJSON,
  matePair,
  normalizeSubdivisions,
  allNotesInRange
} from "./utils"


export default (currentGen, generation, samples, numInitialSurvivors, numChildren, mutationRate, sampleMutationRate,scoreThresholdInteger) => {
  const getScoreThreshold = (generation, survivorPercentile = scoreThresholdInteger) => {
    let scoreThreshold = scoreThresholdInteger/100
    let allScores = generation.map((beat) => { return beat.score })
    allScores = allScores.sort( (a, b) => (a - b) )

    let percentileIndex = Math.floor(allScores.length * scoreThreshold) - 1
    return allScores[percentileIndex]
  }

  const keepRandomSurvivors = (numSurvivors, nextGeneration) => {
    let randomIntegerArray = getRandomIndices(numSurvivors, nextGeneration.length)
    nextGeneration = getSubarray(nextGeneration, randomIntegerArray)
    return nextGeneration
  }
  const makeChildFromNewSample = (samples, allNotesInRange, currentBeatSampleKeys, numSteps,) => {
    let randomInteger = Math.floor(Math.random() * 100)
    const sampleMutationRateDecimal = sampleMutationRate/100
    const sampleMutationComparitor = 100 * sampleMutationRateDecimal
    if (randomInteger < sampleMutationComparitor) {

      let trackType = ""
      let validSampleKeys = []
      const synthSamplerComparitor = Math.floor(Math.random() * 100)

      if(synthSamplerComparitor > 50){
        trackType = "sampler"
        validSampleKeys = Object.keys(samples)

      }else{
        trackType = "synth"
        validSampleKeys = allNotesInRange.slice(0)
      }

      currentBeatSampleKeys.forEach(key =>{
        if(validSampleKeys.includes(key)){
          validSampleKeys.splice( validSampleKeys.indexOf(key), 1 );
        }
      })
      const randomIndex = Math.floor(Math.random() * validSampleKeys.length)
      const randomSampleKey = validSampleKeys[randomIndex]
      
      let newSampleSequence = Array(numSteps).fill(0)
      let newSampleObject = { "score" : 0, "sequence" : newSampleSequence}
      newSampleSequence = matePair(newSampleObject, newSampleObject, Math.min(30,mutationRate))
      if (newSampleSequence.includes(1)) {
        return {
          sample   : randomSampleKey,
          sequence : newSampleSequence,
          trackType : trackType
        }
      } else {
        return null
      }
    } else {
        return null
    }
  }

  const sampleMutationRateDecimal = sampleMutationRate/100
  const sampleMutationComparitor = 100 * sampleMutationRateDecimal
  let nextGeneration = []
  const threshold = getScoreThreshold(currentGen)
  console.log("score threshold", threshold)
  // For all mom, dad pairs for all children in number of children per generation
  for (let momIndex = 0; momIndex < currentGen.length-1;momIndex++){
    let momBeat = currentGen[momIndex]
    for (let dadIndex = momIndex+1; dadIndex < currentGen.length;dadIndex++){
    let dadBeat = currentGen[dadIndex]
      // Don't mate unfit pairs
      console.log(momBeat.score)
      console.log(dadBeat.score)
      if ( (momBeat.score < threshold || dadBeat.score < threshold) && nextGeneration.length > 5) {
        return
      }

      // To pass on to children
      let aveParentScore = (momBeat.score + dadBeat.score) / 2

      // If mom and dad have different beat lengths
      if (momBeat.tracks[0].sequence.length > dadBeat.tracks[0].sequence.length) {
        dadBeat = normalizeSubdivisions(dadBeat, momBeat.tracks[0].sequence.length)
      } else {
        momBeat = normalizeSubdivisions(momBeat, dadBeat.tracks[0].sequence.length)
      }

      for (let i=0; i < numChildren; i++) {
        let newBeatTracks = []
        let currentBeatSampleKeys = []
        let randomInteger

        // For Samplers
        Object.keys(samples).forEach( (key) => {
          // `sample` on a track comes from the `path` attribute of a
          // given sample in samples.js
          const path = samples[key].path

          let momTrack = findInJSON(momBeat.tracks, 'sample', path)
          let dadTrack = findInJSON(dadBeat.tracks, 'sample', path)

          // Handle case where mom and dad don't have the same samples
          if (momTrack.sample || dadTrack.sample) {
            if (!momTrack.sample) { momTrack = dadTrack }
            if (!dadTrack.sample) { dadTrack = momTrack }
            const childSequence = matePair(momTrack, dadTrack, mutationRate)
            currentBeatSampleKeys.push(path)
            randomInteger = Math.floor(Math.random() * 100)
            
            // Randomly remove tracks
            if(randomInteger > sampleMutationComparitor ){
              newBeatTracks.push({
                sample   : path,
                sequence : childSequence,
                trackType: "sampler"

              })
            }
          }
        })

        // For Synths 
        allNotesInRange.forEach( (noteName) => {
          // `sample` on a track comes from the `path` attribute of a
          // given sample in samples.js

          let momTrack = findInJSON(momBeat.tracks, 'sample', noteName)
          let dadTrack = findInJSON(dadBeat.tracks, 'sample', noteName)

          if (momTrack.sample || dadTrack.sample) {
            // Handle case where mom and dad don't have the same samples
            if (!momTrack.sample) { momTrack = dadTrack }
            if (!dadTrack.sample) { dadTrack = momTrack }

            const childSequence = matePair(momTrack, dadTrack, mutationRate)
            currentBeatSampleKeys.push(noteName)
            randomInteger = Math.floor(Math.random() * 100)
            
            // Randomly remove tracks
            if(randomInteger > sampleMutationComparitor ){
              newBeatTracks.push({
                sample   : noteName,
                sequence : childSequence,
                trackType: "synth"
              })
            }
            
          }
        })
        const newSampleChild = makeChildFromNewSample(samples, allNotesInRange, currentBeatSampleKeys, newBeatTracks[0].sequence.length)
        if(newSampleChild){
            newBeatTracks.push(newSampleChild)
        }

        nextGeneration.push({
          score  : aveParentScore,
          tracks : newBeatTracks,
          momKey : momBeat.key,
          dadKey : dadBeat.key,
        })
      }
    }
  }

  // Can't have more survivors than members of the generation so generations don't get huge.
  nextGeneration = keepRandomSurvivors(Math.min(numInitialSurvivors, nextGeneration.length), nextGeneration)
  nextGeneration = nextGeneration.map( (beat, i) => {
    return { ...beat,
      key: `${generation + 1}.${i}`,
    }
  })

  return nextGeneration
}
