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

import store from "../stores/store"
import playingStore from "../stores/playingStore"
import familyStore from "../stores/familyStore"


const StyledPlayControls = styled.div`
  margin: 8px 28px;
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

    const PlayStopButton = playingStore.beatPlayers[familyStore.currentBeat.key] ? MdStop : MdPlayArrow
    return (
      <StyledPlayControls>
        <span title="Previous Beat">
          <MdSkipPrevious
            size    = {size}
            onClick = {playingStore.prevBeat}
          />
        </span>
        <span title="Play / Stop">
          <PlayStopButton
            size    = {size}
            onClick = {playingStore.togglePlayCurrentBeat}
          />
        </span>
        <span title="Next Beat">
          <MdSkipNext
            size    = {size}
            onClick = {playingStore.nextBeat}
          />
        </span>
      </StyledPlayControls>
    )
  }
}

export default PlayControls
