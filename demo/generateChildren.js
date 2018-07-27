import {
  getRandomIndices,
  getSubarray,
  findInJSON,
  matePair,
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
  const makeChildFromNewSample = (samples, currentBeatSampleKeys, numSteps) => {
    let randomInteger = Math.floor(Math.random() * 100)
    const sampleMutationRateDecimal = sampleMutationRate/100
    const sampleMutationComparitor = 100 * sampleMutationRateDecimal
    if(randomInteger < sampleMutationComparitor){

      let validSampleKeys = Object.keys(samples)
      currentBeatSampleKeys.forEach(key =>{
        validSampleKeys.splice( validSampleKeys.indexOf(key), 1 );
      })
      const randomIndex = Math.floor(Math.random() * validSampleKeys.length)
      const randomSampleKey = validSampleKeys[randomIndex]

      const newSamplePath = samples[randomSampleKey].path
      let newSampleSequence = Array(numSteps).fill(0)
      let newSampleObject = { "score" : 0, "sequence" : newSampleSequence}
      newSampleSequence = matePair(newSampleObject, newSampleObject, Math.min(30,mutationRate*2))
      if(newSampleSequence.includes(1)){
        return {
                  sample   : newSamplePath,
                  sequence : newSampleSequence,
                }
      }else{
        return null
      }
      
    }else{
        return null
    }
  }
  const normalizeSubdivisions = (beat, newSubdivisions) => {
    const subdivisionRatio = newSubdivisions / beat.tracks[0].sequence.length

    beat.tracks.forEach( (track, i) => {
      let newSequence = []
      track.sequence.forEach( (note) => {
        newSequence.push(note)
        for (let j = 0; j < subdivisionRatio-1; j++) {
          newSequence.push(0)
        }
      })
      beat.tracks[i].sequence = newSequence
    })
    return beat
  }

  let nextGeneration = []
  const threshold = getScoreThreshold(currentGen)
  
  // For all mom, dad pairs for all children in number of children per generation
  currentGen.forEach( (momBeat, momIndex) => {
    currentGen.forEach( (dadBeat, dadIndex) => {
      // Don't mate beat with itself
      if (momIndex === dadIndex) { return }

      // Don't mate unfit pairs

      if ( (momBeat.score < threshold || dadBeat.score < threshold) &&
            nextGeneration.length > 5 ) {

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
      let currentBeatSampleKeys = []

      for (let i=0; i < numChildren; i++) {
        let newBeatTracks = []
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
            newBeatTracks.push({
              sample   : path,
              sequence : childSequence,
            })
          }
        })
        
        const newSampleChild = makeChildFromNewSample(samples, currentBeatSampleKeys, newBeatTracks[0].sequence.length)
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
    })
  })

  // Can't have more survivors than members of the generation so generations don't get huge.
  nextGeneration = keepRandomSurvivors(Math.min(numInitialSurvivors, nextGeneration.length), nextGeneration)
  nextGeneration = nextGeneration.map( (beat, i) => {
    return { ...beat,
      key: `${generation + 1}.${i}`,
    }
  })

  return nextGeneration
}
