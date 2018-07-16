import { createStore } from "redux"
import { createActions, handleActions } from "redux-actions"

import initialGeneration from "./initialGeneration"
import { updateObjectInArray } from "./utils"


const defaultState = {
  beatNum        : 0,
  generation     : 0,
  allGenerations : [initialGeneration],
}


const actions = createActions({
  ADD_BEAT       : (newBeat) => ({ newBeat }),
  ADD_GENERATION : (newGeneration) => ({ newGeneration }),
  SELECT_BEAT    : (generation, beatNum) => ({ generation, beatNum }),
  SET_GAIN       : (gain, trackNum) => ({ gain, trackNum }),
  SET_BEAT_NUM   : (beatNum) => ({ beatNum }),
  SET_GENERATION : (generation) => ({ generation }),
  SET_SCORE      : (score) => ({ score }),
  NEXT_BEAT      : null,
  PREV_BEAT      : null,
})



const reducer = handleActions({
  [actions.addBeat]: (state, { payload: { newBeat }}) => {
    return { ...state,
      allGenerations: [ ...state.allGenerations, newGeneration ],
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

  [actions.selectBeat]: (state, { payload: { generation, beatNum }}) => {
    return { ...state, generation, beatNum }
  },

  [actions.setGeneration]: (state, { payload: { generation }}) => {
    return { ...state, generation }
  },

  [actions.setBeatNum]: (state, { payload: { beatNum }}) => {
    return { ...state, beatNum }
  },

  [actions.setGain]: (state, { payload: { gain, trackNum }}) => {
    let updatedGeneration = state.allGenerations[state.generation]
    // FIXME: This is a mutable operation
    updatedGeneration[state.beatNum].tracks[trackNum].gain = gain

    const newAllGenerations = updateObjectInArray(
      state.allGenerations,
      state.generation,
      updatedGeneration
    )

    return { ...state, allGenerations: newAllGenerations}
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
