import React, { Component } from "react"
import {
  Song,
  Sequencer,
  Sampler,
} from "../react-music"
import {observer} from "mobx-react"
import styled from "styled-components"
import chroma from "chroma-js"

import Button from "./button"
import Player from "./player"
import { toJS } from "mobx"

import store from "../stores/store"
import familyStore from "../stores/familyStore"
import playingStore from "../stores/playingStore"
import BeatBlock from "./beatBlock"
import { colors } from "../colors"



@observer
class Generation extends Component {

  render() {

    const beatBlocks = familyStore.allGenerations[this.props.index].map( (currentBeat, i) => {
      let splitKey = currentBeat.key.split(".")
      const currentBeatResolution = familyStore.allGenerations[splitKey[0]][splitKey[1]].tracks[0].sequence.length
      const highlight = (currentBeat.key === familyStore.currentBeat.key )
      return (
        <BeatBlock
          index     = {i}
          key       = {i}
          beatKey   = {currentBeat.key}
        >
          <Player
            beat       = {currentBeat}
            playing    = {playingStore.beatPlayers[currentBeat.key]}
            resolution = {currentBeatResolution}
            bars       = {1}
          />
        </BeatBlock>
      )
    })

    // This variable is accessed inside of a callback so mobx
    // can't see when it changes I guess.

    return (
     
        <div>
          {beatBlocks}
        </div>
    )
  }
}


export default Generation
