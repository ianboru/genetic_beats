import store from "./stores/store"
import controlStore from "./stores/controlStore"
import { toJS } from "mobx"
import { allNotesInRange, deepClone, SCALES, synthTypes } from "./utils"

const mutateByKillTrack = (beat) => {
  let survivingTracks = []
  beat.tracks.forEach((track, i) => {
    const randomInteger = Math.floor(Math.random() * 100)
    // divide mutateRate by number of tracks so the total chance of killing is the same as the rate
    if(randomInteger > controlStore.sampleMutationRate/beat.tracks.length ||
       // Don't kill the last track
       (survivingTracks.length == 0 && i == beat.tracks.length-1)) {
      survivingTracks.push(track)
    }
  })
  beat.tracks = survivingTracks
  return beat
}

const mutateSamplersByMusicalEnhancement = (beat) => {
  let mutatedBeat = {}
  mutatedBeat.key = beat.key
  mutatedBeat.score = beat.score
  mutatedBeat.tracks = []
  if(beat.momKey){mutatedBeat.momKey = beat.momKey}
  if(beat.dadKey){mutatedBeat.dadKey = beat.dadKey}

  //catalogue number of samples playing on each step
  let samplerNotesPerStep =  Array(beat.tracks[0].sequence.length).fill(0)
  const exponentialConstant = 1.5
  const numSamplesBeforeMutating = 2
  beat.tracks.forEach((track)=>{
    if(track.trackType == "sampler"){
      track.sequence.forEach((note, index)=>{
        if(note){
          ++samplerNotesPerStep[index]
        }
      })
    }
  })
  let samplerDensityPerStep = Array(beat.tracks[0].sequence.length).fill(0)
  samplerNotesPerStep.forEach((numNotes,index)=>{
    if(index > 0){

        samplerDensityPerStep[index] = (samplerNotesPerStep[index] + samplerNotesPerStep[index-1])/ (2*beat.tracks.length)
    }else{
        samplerDensityPerStep[index] = samplerNotesPerStep[index]/beat.tracks.length
    }
  })
  //roll dice turn off notes if too many samples are playing
  beat.tracks.forEach((track)=>{
    if(track.trackType == "sampler"){
      track.sequence.forEach((note, index)=>{
        if(note == 1){
          let randomInteger = Math.floor(Math.random() * 100)
          let leaveNoteProbability = Math.pow(Math.E, -1*(samplerDensityPerStep[index])/exponentialConstant)*100
          if(randomInteger > leaveNoteProbability){
            track.sequence[index] = 0
            if(index < track.sequence.length-1){

                samplerDensityPerStep[index+1] = samplerDensityPerStep[index+1] - (1/ (2*beat.tracks.length))
            }
          }
        }
      })
    }
    if(track.sequence.includes(1)){
      mutatedBeat.tracks.push(track)
    }
  })
  return mutatedBeat
}

const mutateSynthsByMusicalEnhancement = (beat) => {
  const closeNoteProbability = 0
  let mutatedBeat = {}
  mutatedBeat.key = beat.key
  mutatedBeat.score = beat.score
  mutatedBeat.tracks = beat.tracks
  if(beat.momKey){mutatedBeat.momKey = beat.momKey}
  if(beat.dadKey){mutatedBeat.dadKey = beat.dadKey}

  let synthNotesPerStep = beat.tracks[0].sequence.map( () => {
    return []
  })

  // catalogue synth notes playing on each step
  beat.tracks.forEach((track, trackIndex)=>{
    if(track.trackType == "synth"){
      track.sequence.forEach((note, index)=>{
        if(note == 1){
          synthNotesPerStep[index].push([track.sample, trackIndex])
        }
      })
    }
  })
  // remove notes that are too close to each other.
  synthNotesPerStep.forEach((step, stepIndex)=>{
    let lastNote = null
    step.forEach((note, noteIndex)=>{
      const [trackSample, trackIndex] = note

      if(lastNote){
        const interval = allNotesInRange.indexOf(trackSample) - allNotesInRange.indexOf(lastNote)
        if(Math.abs(interval) < 3){
          const randomInteger = Math.floor(Math.random() * 100)
          if(randomInteger > closeNoteProbability){
            mutatedBeat.tracks[trackIndex].sequence[stepIndex] = 0
          } else {
            lastNote = trackSample
          }
        }
      } else {
        lastNote = trackSample
      }
    })
  })
  return mutatedBeat
}
const mutateSequence = (sequence) => {
  let mutatedSequence = sequence.map((note) => {
    const randomInteger = Math.floor(Math.random() * 100)
    if(randomInteger < controlStore.noteMutationRate){
      note = 1 - note
    }
    return note
  })
  const randomIndex = Math.floor(Math.random() * sequence.length)
  if(!mutatedSequence.includes(1)){
    mutatedSequence[randomIndex] = 1
  }
  return mutatedSequence
}


const mutateByAddTrack = (beat) => {
  let randomInteger = Math.floor(Math.random() * 100)
  if (randomInteger < controlStore.sampleMutationRate) {
    const currentBeatSampleKeys = beat.tracks.map(track => track.sample)

    let trackType = ""
    let validSampleKeys = []

    randomInteger = Math.floor(Math.random() * 100)
    if(randomInteger > 50){
      trackType = "sampler"
      validSampleKeys = Object.keys(store.samples)
    }else{
      trackType = "synth"
      validSampleKeys = allNotesInRange.slice(0)
    }

    // Remove samples from the pool of options if they're already in the beat
    currentBeatSampleKeys.forEach(key => {
      if(validSampleKeys.includes(key)){
        validSampleKeys.splice( validSampleKeys.indexOf(key), 1 );
      }
    })

    let randomIndex = Math.floor(Math.random() * validSampleKeys.length)

    const randomSampleKey = validSampleKeys[randomIndex]
    const numNotes = beat.tracks[0].sequence.length
    let newTrackSequence = mutateSequence( Array(numNotes).fill(0) )

    if (!newTrackSequence.includes(1)) {
      randomIndex = Math.floor(Math.random() * numNotes)
      newTrackSequence[randomIndex] = 1
    }

    beat.tracks.push({
      sample    : randomSampleKey,
      sequence  : newTrackSequence,
      trackType : trackType,
    })
  }
  return beat
}

const randomBit = (probOn) => {
  return Math.random() < probOn ? 1 : 0
}

const mutateMelody = (originalBeat)=>{
  console.log("mutatemelody")
  let newBeat = deepClone(toJS(originalBeat))
  let mutatedTracks = []
  newBeat.tracks[0].sequence.forEach((note, i)=>{
    let playedTrackIndex = null

    newBeat.tracks.forEach((track,j)=>{
      if (track.trackType === "sampler") {
        return
      }
      if (!playedTrackIndex && track.sequence[i]){
        playedTrackIndex = j
      }
    })

   //flip off to on
    const flipNote = Math.random()*10 > originalBeat.synthScore ? true : false
    const switchNote = Math.random()*10 > Math.min(originalBeat.synthScore,9.0)
    const randomNoteIndex = Math.floor(Math.random()*SCALES["cmaj"].length)

    if(flipNote && playedTrackIndex != null){
      newBeat.tracks[playedTrackIndex].sequence[i] = 0
    }else if(flipNote && playedTrackIndex == null){
      newBeat.tracks[randomNoteIndex].sequence[i] = randomBit(0.5)
    }
    if(switchNote && playedTrackIndex != null ){
      newBeat.tracks[playedTrackIndex].sequence[i] = 0
      newBeat.tracks[randomNoteIndex].sequence[i] = 1
    }
  })

  const switchScale =  (Math.random()*30-20) > Math.min(originalBeat.synthScore,9.0)
  if(switchScale){
    mutateScale(newBeat)
  }
  const switchSynthType = (Math.random()*30-20) > Math.min(originalBeat.synthScore,9.0)
  if(switchSynthType){
    mutateSynthType(newBeat)
  }
  return newBeat
}

const mutateScale = (newBeat) => {
  const scaleTypes = Object.keys(SCALES)
  const randomScaleIndex = Math.floor(Math.random()*scaleTypes.length)
  const scaleName = scaleTypes[randomScaleIndex]
  newBeat.scale = scaleName
  newBeat.tracks.forEach((track,j)=>{
    if (track.trackType === "synth") {
      track.sample = SCALES[scaleName][j]
    }
  })
}

const mutateSynthType = (newBeat) => {
  const randomSynth = synthTypes[Math.floor(Math.random()*synthTypes.length)]
  newBeat.tracks.forEach((track,j)=>{
    if (track.trackType === "synth") {
      track.synthType = randomSynth
    }
  })
}
const mutateSampler = (originalBeat)=>{
  let newBeat = deepClone(toJS(originalBeat))
  let mutatedTracks = []
  newBeat.tracks[0].sequence.forEach((note, i)=>{
    let playedTrackIndex = null

    newBeat.tracks.forEach((track,j)=>{
      if (track.trackType === "synth") {
        return
      }
      if (!playedTrackIndex && track.sequence[i]){
        playedTrackIndex = j
      }

      const randomNote = Math.random() * 10 > 7.5 ? 1 : 0

      track.sequence[i] = (Math.random()*20-10) > Math.min(originalBeat.samplerScore,9.0) ? randomNote : track.sequence[i]
    })
  })

  return newBeat
}

const mutateBeat = (originalBeat) => {
  let newBeat = deepClone(toJS(originalBeat))
  let mutatedTracks = []
  newBeat.tracks.forEach((track)=>{
    track.sequence = mutateSequence(track.sequence)
    if(track.sequence.includes(1)){
      mutatedTracks.push(track)
    }
  })
  newBeat.tracks = mutatedTracks
  if (originalBeat.tracks.length > 1) {
    newBeat = mutateByKillTrack(newBeat)
  }
  newBeat = mutateByAddTrack(newBeat)
  if(newBeat.tracks.length > 1){
      newBeat = mutateSamplersByMusicalEnhancement(newBeat)
  }
  if(newBeat.tracks.length > 1){
    newBeat = mutateSynthsByMusicalEnhancement(newBeat)
  }

  return newBeat
}


export {
  mutateSequence,
  mutateByAddTrack,
  mutateByKillTrack,
  mutateSamplersByMusicalEnhancement,
  mutateSynthsByMusicalEnhancement,
  mutateBeat,
  mutateMelody,
  mutateSampler,
}