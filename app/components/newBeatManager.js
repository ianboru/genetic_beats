import React, { Component } from "react"
import { observer } from "mobx-react"
import styled from "styled-components"
import chroma from "chroma-js"

import Button from "./button"

import { deepClone } from "../utils"

import beatTemplates from "../beatTemplates"
import store from "../store"
import { colors } from "../colors"


const BeatOptionHeader = styled.div`
  font-weight bold;
  margin: 8px 4px 12px;
`

const NewBeatOption = styled.div`
  background-color: ${chroma(colors.green.base).darken(0.1)};
  border-radius: 3px;
  border: 1px solid #555;
  display: inline-block;
  margin: 3px;
  padding: 4px 10px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background-color: ${chroma("green").brighten(1.2)};
  }
`

const NewBeatHeader = styled.div`
  font-size: 32px;
  font-family: "Hind Madurai";
`

const StyledNewBeatPanel = styled.div`
  background-color: ${colors.gray.darkest};
  font-family: sans-serif;
  font-size: 16px;
  padding: 10px;
  border-top: 1px solid ${colors.gray.light};
`


@observer
class NewBeatManager extends Component {
  handleClickOutside = () => {
    store.toggleAddNewBeat(false)
  }

  addEmptyBeat = () => {
    const numSteps = parseInt(this.stepsSelect.value)
    let emptyBeat = {
      name   : "",
      score  : 0,
      tracks : [
        {
          trackType : "sampler",
          sample   : "samples/kick.wav",
          sequence : (new Array(numSteps).fill(0)),
          mute     : false,
          solo     : false,
        },
      ],
    }

    store.addBeatToCurrentGen(emptyBeat)
    store.toggleAddNewBeat()
  }

  render() {
    const stepOptions = [ 2, 4, 8, 16, 32 ].map( (stepCount) => {
      return (
        <option
          key   = {stepCount}
          value = {stepCount}
        >{stepCount}</option>
      )
    })

    let copyOptions = store.allGenerations.map( (generation, i) => {
      const generationOptions = generation.map( (beat, i) => {
        return (
          <NewBeatOption
            key={i}
            onClick={() => {
              store.addBeatToCurrentGen(beat)
              store.toggleAddNewBeat()
            }}
          >
            {beat.key}
          </NewBeatOption>
        )
      })

      return <div key={i}>{generationOptions}</div>
    })

    const presetOptions = beatTemplates.map( (beat, i) => {
      return (
        <NewBeatOption
          key={i}
          onClick={
            () => { store.addBeatToCurrentGen(beat)
            store.toggleAddNewBeat()
          }}
        >
          {beat.name}
        </NewBeatOption>
      )
    })

    return (
      <StyledNewBeatPanel>
        <NewBeatHeader>
          Add new beat from
        </NewBeatHeader>

        <NewBeatOption onClick={this.addEmptyBeat}>
          Empty Beat
        </NewBeatOption>

        &nbsp;
        with
        &nbsp;

        <select
          ref={(c) => { this.stepsSelect = c }}
          defaultValue={16}
          style={{ fontSize: 20 }}
        >
          {stepOptions}
        </select>

        &nbsp;
        steps

        {
          presetOptions.length > 0 ?
            (
              <div>
                <BeatOptionHeader>Presets</BeatOptionHeader>
                {presetOptions}
              </div>
            ) : null
        }

        {
          copyOptions.length > 0 && copyOptions[0].length > 0 ?
            (
              <div>
                <BeatOptionHeader>From Family Tree</BeatOptionHeader>
                {copyOptions}
              </div>
            ) : null
        }

        {
          store.currentBeat ?
            <Button small color={[colors.red.darker]} onClick={store.toggleAddNewBeat}>Cancel</Button>
            :
            null
        }
      </StyledNewBeatPanel>
    )
  }
}


export default NewBeatManager