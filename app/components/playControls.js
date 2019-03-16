import React, { Component } from "react"
import { observer } from "mobx-react"
import styled from "styled-components"

import {
  MdPlayArrow,
  MdSkipNext,
  MdSkipPrevious,
  MdStop,
} from "react-icons/md"

import {colors} from "../colors"

import Tooltip from "./tooltip"

import store from "../stores/store"
import playingStore from "../stores/playingStore"
import familyStore from "../stores/familyStore"
import beatViewStore from "../stores/beatViewStore"

const StyledPlayControls = styled.div`
  margin: 10px 28px;
  vertical-align: baseline;

  svg {
    display: inline-block;
    transition: 0.2s color;
    vertical-align: middle;
  }

  svg:hover {
    cursor: pointer;
    color: lightgreen;
  }
`


@observer
class PlayControls extends Component {

  static defaultProps = {
    size: 50,
  }

  render() {
    const {
      size,
    } = this.props

    const PlayStopButton = beatViewStore.playing ? MdStop : MdPlayArrow
    return (
      <StyledPlayControls>
        <Tooltip
          position="top"
          text="Previous Beat"
        >
          <MdSkipPrevious
            size    = {size}
            onClick = {playingStore.prevBeat}
          />
        </Tooltip>
        <Tooltip
          position="top"
          text="Play / Stop"
        >
          <PlayStopButton
            size    = {size}
            onClick = {beatViewStore.togglePlaying}
          />
        </Tooltip>
        <Tooltip
          position="top"
          text="Next Beat"
        >
          <MdSkipNext
            size    = {size}
            onClick = {playingStore.nextBeat}
          />
        </Tooltip>
      </StyledPlayControls>
    )
  }
}

export default PlayControls
