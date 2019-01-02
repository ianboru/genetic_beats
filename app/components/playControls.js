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


const StyledPlayControls = styled.div`
  background: ${colors.gray.light};
  border-radius: 5px;
  box-shadow: 0px 0px 3px 1px #111;
  display: inline-block;
  margin: 0 0 10px;
  padding: 5px 20px;
  vertical-align: middle;

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

    const PlayStopButton = playingStore.playingCurrentBeat ? MdStop : MdPlayArrow
    return (
      <StyledPlayControls>
        <span title="Previous Beat">
          <MdSkipPrevious
            size    = {size}
            onClick = {store.prevBeat}
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
