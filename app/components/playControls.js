import React, {Component} from "react"
import {observer} from "mobx-react"
import styled from "styled-components"
import {MdPlayArrow, MdSkipNext, MdSkipPrevious, MdStop} from "react-icons/md"
import Tooltip from "./tooltip"
import familyStore from "../stores/familyStore"
import playingStore from "../stores/playingStore"

const StyledPlayControls = styled.div`
  margin: 0px 20px;
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
    const {size} = this.props

    const PlayStopButton = playingStore.player === playingStore.players.BEAT_DETAIL ? MdStop : MdPlayArrow
    return (
      <StyledPlayControls>
        <Tooltip position="top" text="Previous Beat">
          <MdSkipPrevious size={size} onClick={familyStore.prevBeatInLineage} />
        </Tooltip>
        <Tooltip position="top" text="Play / Stop">
          <PlayStopButton
            size={size + 30}
            onClick={playingStore.toggleBeatDetailPlayer}
          />
        </Tooltip>
        <Tooltip position="top" text="Next Beat">
          <MdSkipNext size={size} onClick={familyStore.nextBeatInLineage} />
        </Tooltip>
      </StyledPlayControls>
    )
  }
}

export default PlayControls
