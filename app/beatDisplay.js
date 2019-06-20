import React, { Component } from "react"
import { observer } from "mobx-react"
import styled from "styled-components"
import chroma from "chroma-js"

import store from "./stores/store"
import familyStore from "./stores/familyStore"
import messageStore from "./stores/messageStore"

import { colors } from "./colors"
import { mutateBeat } from "./mutate"

import BeatDetail from "./components/beatDetail"
import Lineage from "./components/lineage"
import Button from "./components/button"
import MatingControls from "./components/matingControls"
import Tooltip from "./components/tooltip"


@observer
class BeatDisplay extends Component {
  render() {
    const beat = ((beat) => {
      if (!beat) {
        return null
      } else {
        return (
          <BeatDetail
            key  = {beat.key}
            beat = {beat}
          />
        )
      }
    })(familyStore.currentBeat)

    return (
      <div>
        <div>
          <MatingControls right view="beatDisplay" />
        </div>

        <div style={{
          overflow   : "visible",
          background : colors.gray.darkest,
        }}>
          {beat || (<h1>No Beat</h1>)}
        </div>
        <Lineage beats={familyStore.lineageBeats} />
      </div>
    )
  }
}


export default BeatDisplay
