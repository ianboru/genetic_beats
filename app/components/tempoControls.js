import React, {Component} from "react"
import {observer} from "mobx-react"
import styled from "styled-components"
import Metronome from "../svg/metronome.svg"
import MetronomeActive from "../svg/metronome-active.svg"
import playingStore from "../stores/playingStore"

const BILabel = styled.span`
  color: #77777f;
  margin: 4px;
`

const MetronomeButton = styled.div`
  display: inline-block;
  margin-bottom: -8px;
  margin-right: 5px;
  padding: 0;
  vertical-align: middle;
  cursor: pointer;
`

const StyledTempoControls = styled.div`
  margin: 8px;

  input[type="number"] {
    width: 45px;
    font-size: 14px;
  }
`

@observer
class TempoControls extends Component {
  render() {
    const MetronomeIcon = playingStore.metronome ? MetronomeActive : Metronome

    return (
      <StyledTempoControls>
        <span style={{fontSize: 15}}>Tempo</span>
        <input
          type="number"
          value={playingStore.tempo}
          min={40}
          max={200}
          onChange={(e) => playingStore.setTempo(parseInt(e.target.value))}
        />
        &nbsp;
        <MetronomeButton>
          <MetronomeIcon
            height={24}
            width={25}
            onClick={playingStore.toggleMetronome}
          />
        </MetronomeButton>
      </StyledTempoControls>
    )
  }
}

export default TempoControls
