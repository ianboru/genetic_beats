import { createStore } from "redux"
import { createActions, handleActions } from "redux-actions"

import initialGeneration from "./initialGeneration"
import samples from "./samples"
import { updateObjectInArray } from "./utils"


const defaultState = {
  beatNum        : 0,
  generation     : 0,
  allGenerations : [initialGeneration],
  samples        : samples,
  selectPairMode : false,
  selectedBeats  : [],
}


const actions = createActions({
  ADD_BEAT       : (newBeat) => ({ newBeat }),
  ADD_GENERATION : (newGeneration) => ({ newGeneration }),
  KILL_SUBSEQUENT_GENERATIONS : (generation) => ({ generation }),
  SELECT_BEAT    : (generation, beatNum) => ({ generation, beatNum }),
  TOGGLE_SELECT_PAIR_MODE : null,
  SET_GAIN       : (gain, sample) => ({ gain, sample }),
  SET_BEAT_NUM   : (beatNum) => ({ beatNum }),
  SET_GENERATION : (generation) => ({ generation }),
  SET_SCORE      : (score) => ({ score }),
  NEXT_BEAT      : null,
  PREV_BEAT      : null,
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
      console.log(newState.selectedBeats === state.selectedBeats)
      return newState
    }
  },

  [actions.toggleSelectPairMode]: (state) => {
    return { ...state,  selectPairMode: !state.selectPairMode, selectedBeats: []}
  },
  [actions.setGeneration]: (state, { payload: { generation }}) => {
    return { ...state, generation }
  },

  [actions.setBeatNum]: (state, { payload: { beatNum }}) => {
    return { ...state, beatNum }
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
