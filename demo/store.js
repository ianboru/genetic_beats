import { createStore } from "redux"
import { createActions, handleActions } from "redux-actions"

import initialGeneration from "./initialGeneration"
import samples from "./samples"
import {
  deepClone,
  updateObjectInArray,
} from "./utils"

import {generateFamilyName} from "./utils"
const originalFamilyNames = JSON.parse(localStorage.getItem("familyNames"))
const defaultState = {
  newBeat        : { tracks: [] },
  beatNum        : 0,
  generation     : 0,
  allGenerations : [initialGeneration],
  samples        : samples,
  selectPairMode : false,
  selectedBeats  : [],
  sampleMutationRate : 30,
  mutationRate   : 5,
  numSurvivors   : 7,
  numChildren    : 3,
  scoreThreshold : 75,
  familyName     : generateFamilyName(),
  familyNames    : originalFamilyNames ? originalFamilyNames : [],
  tempo          : 90, 
  metronome      : false,
}


const actions = createActions({
  ADD_BEAT                    : (newBeat) => ({ newBeat }),
  ADD_GENERATION              : (newGeneration) => ({ newGeneration }),
  KILL_SUBSEQUENT_GENERATIONS : (generation) => ({ generation }),
  SELECT_BEAT                 : (generation, beatNum) => ({ generation, beatNum }),
  TOGGLE_SELECT_PAIR_MODE     : null,
  SET_GAIN                    : (gain, sample) => ({ gain, sample }),
  SET_BEAT_NUM                : (beatNum) => ({ beatNum }),

  SET_NEW_BEAT                : (newBeat) => ({ newBeat }),
  RESET_NEW_BEAT              : null,
  ADD_NEW_BEAT_TO_CURRENT_GEN : null,
  ADD_TRACK_TO_NEW_BEAT       : (sample, sequence) => ({ sample, sequence }),
  REMOVE_TRACK_FROM_NEW_BEAT  : (trackNum) => ({ trackNum }),

  REMOVE_TRACK_FROM_BEAT      : (generation, beatNum, trackNum) => ({ generation, beatNum, trackNum }),

  REMOVE_TRACK_FROM_CURRENT_BEAT : (trackNum) => ({ trackNum }),
  SET_CURRENT_BEAT            : (newBeat) => ({ newBeat }),

  SET_GENERATION              : (generation) => ({ generation }),
  SET_SCORE                   : (score) => ({ score }),
  NEXT_BEAT                   : null,
  PREV_BEAT                   : null,
  SET_MUTATION_RATE           : (mutationRate) => ({mutationRate}),
  SET_SAMPLE_MUTATION_RATE    : (sampleMutationRate) => ({sampleMutationRate}),

  SET_NUM_CHILDREN            : (numChildren) => ({numChildren}),
  SET_NUM_SURVIVORS           : (numSurvivors) => ({numSurvivors}),
  SET_SCORE_THRESHOLD         : (scoreThreshold) => ({scoreThreshold}),
  SET_FAMILY_NAME             : (familyName) => ({familyName}),
  UPDATE_FAMILY_IN_STORAGE    : null,
  CLEAR_SAVED_FAMILIES        : null,
  SET_TEMPO                   :(tempo) => ({tempo}),
  SET_METRONOME               : null
})



const reducer = handleActions({
  [actions.addBeat]: (state, { payload: { newBeat }}) => {
    const currentGeneration = state.allGenerations[state.generation]

    newBeat = { ...newBeat,
      key: `${state.generation}.${currentGeneration.length}`,
      score: 0,
    }

    const newAllGenerations = updateObjectInArray(
      state.allGenerations,
      state.generation,
      [...currentGeneration, newBeat]
    )

    return { ...state, allGenerations: newAllGenerations}
  },
  [actions.saveFamily]: (state, {payload: {newFamilyName, newFamily}}) => {
    return {
      ...state,
    }
  },  
  [actions.addGeneration]: (state, { payload: { newGeneration }}) => {
    return {
      ...state,
      allGenerations: [ ...state.allGenerations, newGeneration ],
      generation: state.generation + 1,
      beatNum: 0,
    }
  },
  [actions.killSubsequentGenerations]: (state, { payload: { generation }}) => {
    return { ...state, allGenerations: state.allGenerations.slice(0,generation+1)}
  },

  [actions.selectBeat]: (state, { payload: { generation, beatNum }}) => {
    const selectedKey = `${generation}.${beatNum}`

    let newState = { ...state, generation, beatNum }

    if (state.selectPairMode && !state.selectedBeats.includes(selectedKey)) {
      newState.selectedBeats = [...state.selectedBeats, selectedKey]
      return newState
    } else if (state.selectPairMode && state.selectedBeats.includes(selectedKey)) {
      const newSelectedBeats = [...state.selectedBeats]
      newSelectedBeats.splice( newSelectedBeats.indexOf(selectedKey), 1 )
      newState.selectedBeats = newSelectedBeats
      return newState
    } else {
      newState.selectedBeats = [selectedKey]
      return newState
    }
  },

  [actions.toggleSelectPairMode]: (state) => {
    return { ...state,  selectPairMode: !state.selectPairMode, selectedBeats: []}
  },
  [actions.setGeneration]: (state, { payload: { generation }}) => {
    return { ...state, generation }
  },
  [actions.setFamilyName]: (state, { payload: { familyName }}) => {
    return { ...state, familyName, allGenerations:JSON.parse(localStorage.getItem(familyName)), beatNum : 0, generation: 0 }
  },
  [actions.clearSavedFamilies]: (state) => {
    localStorage.clear()
    return { ...state}
  },
  [actions.updateFamilyInStorage]: (state) => {
    let newFamilyNames = state.familyNames
    if(state.familyNames.length > 0 && !state.familyNames.includes(state.familyName)){
      newFamilyNames.push(state.familyName)
    }else if(state.familyNames.length == 0){
      newFamilyNames = [state.familyName]
    }
    //MOVE OUT
    localStorage.setItem("familyNames",JSON.stringify(newFamilyNames))
    localStorage.setItem(state.familyName,JSON.stringify(state.allGenerations))
    return { ...state, familyNames: newFamilyNames}
  },
  [actions.setMutationRate]: (state, { payload: { mutationRate }}) => {
    return { ...state, mutationRate }
  },
  [actions.setTempo]: (state, { payload: { tempo }}) => {
    return { ...state, tempo }
  },
  [actions.setSampleMutationRate]: (state, { payload: { sampleMutationRate }}) => {
    return { ...state, sampleMutationRate }
  },
  [actions.setNumChildren]: (state, { payload: { numChildren }}) => {
    return { ...state, numChildren }
  },
  [actions.setNumSurvivors]: (state, { payload: { numSurvivors }}) => {
    return { ...state, numSurvivors }
  },
  [actions.setScoreThreshold]: (state, { payload: { scoreThreshold }}) => {
    return { ...state, scoreThreshold }
  },

  [actions.setMetronome]: (state) => {
    return { ...state, metronome : !state.metronome }
  },
  [actions.setBeatNum]: (state, { payload: { beatNum }}) => {
    return { ...state, beatNum }
  },

  [actions.setNewBeat]: (state,  { payload: { newBeat }}) => {
    return { ...state, newBeat: deepClone(newBeat) }
  },

  [actions.setCurrentBeat]: (state, { payload: { newBeat }} ) => {
    const beat = state.allGenerations[state.generation][state.beatNum]

    const allGenerations = updateObjectInArray(
      state.allGenerations,
      state.generation,
      updateObjectInArray(
        state.allGenerations[state.generation],
        state.beatNum,
        deepClone(newBeat)
      )
    )

    return { ...state, allGenerations }
  },

  [actions.resetNewBeat]: (state) => {
    return { ...state, newBeat: { tracks: [] } }
  },

  [actions.addNewBeatToCurrentGen]: (state) => {
    const currentGeneration = state.allGenerations[state.generation]

    const newBeat = { ...state.newBeat,
      key: `${state.generation}.${currentGeneration.length}`,
      score: 0,
    }

    const newAllGenerations = updateObjectInArray(
      state.allGenerations,
      state.generation,
      [...currentGeneration, newBeat]
    )

    return { ...state, allGenerations: newAllGenerations, newBeat: { tracks: [] } }
  },

  [actions.addTrackToNewBeat]: (state, { payload: { sample, sequence }}) => {
    const newBeat = { ...state.newBeat,
      tracks: [
        ...state.newBeat.tracks,
        { sample, sequence },
      ]
    }
    return { ...state, newBeat }
  },

  [actions.removeTrackFromNewBeat]: (state, { payload: { trackNum }} ) => {
    const newBeat = { ...state.newBeat,
      tracks: [
        ...state.newBeat.tracks.slice(0, trackNum),
        ...state.newBeat.tracks.slice(trackNum+1),
      ]
    }
    return { ...state, newBeat }
  },

  [actions.removeTrackFromBeat]: (state, { payload: { generation, beatNum, trackNum }} ) => {
    const beat = state.allGenerations[generation][beatNum]
    const newBeat = { ...beat,
      tracks: [
        ...beat.tracks.slice(0, trackNum),
        ...beat.tracks.slice(trackNum+1),
      ]
    }

    const allGenerations = updateObjectInArray(
      state.allGenerations,
      generation,
      updateObjectInArray(
        state.allGenerations[generation],
        beatNum,
        newBeat
      )
    )

    return { ...state, allGenerations }
  },

  [actions.removeTrackFromCurrentBeat]: (state, { payload: { trackNum }} ) => {
    const beat = state.allGenerations[state.generation][state.beatNum]
    const newBeat = { ...beat,
      tracks: [
        ...beat.tracks.slice(0, trackNum),
        ...beat.tracks.slice(trackNum+1),
      ]
    }

    const allGenerations = updateObjectInArray(
      state.allGenerations,
      state.generation,
      updateObjectInArray(
        state.allGenerations[state.generation],
        state.beatNum,
        newBeat
      )
    )

    return { ...state, allGenerations }
  },

  [actions.setGain]: (state, { payload: { gain, sample }}) => {
    const samples = { ...state.samples, [sample]: { ...state.samples[sample], gain }}

    return { ...state, samples }
  },

  [actions.setScore]: (state, { payload: { score }}) => {
    let updatedGeneration = state.allGenerations[state.generation]
    // FIXME: This is a mutable operation
    updatedGeneration[state.beatNum].score = score

    const newAllGenerations = updateObjectInArray(
      state.allGenerations,
      state.generation,
      updatedGeneration
    )

    return { ...state, allGenerations: newAllGenerations}
  },

  [actions.nextBeat]: (state) => {
    let currentGeneration = state.allGenerations[state.generation]

    const beatNum = (state.beatNum + 1) % currentGeneration.length
    return { ...state, beatNum }
  },

  [actions.prevBeat]: (state) => {
    let currentGeneration = state.allGenerations[state.generation]

    let beatNum = state.beatNum
    if (beatNum == 0) {
      beatNum = currentGeneration.length - 1
    } else {
      beatNum = (state.beatNum - 1) % currentGeneration.length
    }
    return { ...state, beatNum }
  },
}, defaultState)


export { actions }

export default createStore(reducer)
