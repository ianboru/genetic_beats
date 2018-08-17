import Raven from 'raven-js'
import React, { Component } from "react"
import ReactFileReader from 'react-file-reader'
import { observer } from "mobx-react"
import styled from "styled-components"

import store from "./store"
import generateChildren from "./generateChildren"
import "./index.css"
import {
  panelBackground,
} from "./colors"

import Arrangement from "./components/arrangement"
import Beat from "./components/beat"
import Button from "./components/button"
import ConfigManager from "./components/configManager"
import NewBeatManager from "./components/newBeatManager"
import FamilySelect from "./components/familySelect"
import GraphContainer from "./components/graphContainer"
import Player from "./components/player"

import SplitPane from "react-split-pane"

import DevTools from "mobx-react-devtools"


if (process.env.SENTRY_PUBLIC_DSN) {
  Raven.config(process.env.SENTRY_PUBLIC_DSN)
}

const headerFooterBgColor = "#1d1f27"

const Header = styled.div`
  background: ${headerFooterBgColor};
  width: 100%;
  padding: 0px 3px;
  box-sizing: border-box;
`

const Footer = styled.div`
  background: ${headerFooterBgColor};
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  width: 100%;
  padding: 0px 3px;
  box-sizing: border-box;
`

const Info = styled.span`
`

const PanelLabel = styled.div`
  font-size: 28px;
  margin: 5px 0;
`

const familyTreeWidth = 620


@observer
class App extends Component {
  constructor(props) {
    super(props)
    store.updateFamilyInStorage()
    this.state = {
      playingCurrentBeat : false,
      inputScore         : "",
      selectText         : "",
      familyTreeHeight   : window.innerHeight,
      familyTreeWidth    : familyTreeWidth,
    }
    //store.fetchAllSamples()
  }

  componentDidMount = () => {
    window.addEventListener("resize", this.handleWindowResize)
  }

  componentWillUnmount = () => {
    window.removeEventListener("resize", this.handleWindowResize)
  }

  handleWindowResize = (e) => {
    this.setState({ familyTreeHeight: e.target.innerHeight})
  }


  handlePlayToggle = () => {
    this.setState({
      playingCurrentBeat: !this.state.playingCurrentBeat,
    })
  }

  setScore = (e) => {
    store.setScore(parseInt(this.state.inputScore))
    store.nextBeat()
    this.setState({inputScore: ""})
    e.preventDefault()
  }

  handleInputChange = (e) => {
    this.setState({ inputScore: e.target.value })
  }

  newFamilyTree = () => {
    if (confirm("Are you sure you want to start a new family tree?")) {
      window.location.reload()
    }
  }

  clearSavedFamilies = () => {
    if (confirm("Are you sure you want to clear all families?")) {
      store.clearSavedFamilies()
      window.location.reload()
    }
  }

  handleMate = () => {
    if (store.generation < store.allGenerations.length - 1) {
      if (confirm(`Mating now will clear all generations after the currently selected one (${store.generation}).`)) {
        store.killSubsequentGenerations()
      } else {
        return
      }
    }

    let options = {}

    if (store.selectPairMode) {
      options.newCurrentGeneration = store.selectedBeats.map( (currentKey) => {
        const currentKeyInfo = currentKey.split(".")
        const generation = currentKeyInfo[0]
        const beatNum = currentKeyInfo[1]
        return store.allGenerations[generation][beatNum]
      })
      options.numGeneration = store.allGenerations.length - 1
      store.toggleSelectPairMode()
    } else {
      options.newCurrentGeneration = store.currentGeneration
      options.numGeneration = store.generation
    }

    const nextGeneration = generateChildren(
      options.newCurrentGeneration,
      options.numGeneration,
      store.samples,
      store.numSurvivors,
      store.numChildren,
      store.mutationRate,
      store.sampleMutationRate,
      store.scoreThreshold
    )

    store.addGeneration(nextGeneration)
    store.updateFamilyInStorage()
  }

  handleUploadSample = (files) => {
    var file    = document.querySelector('input[type=file]').files[0]
    var reader  = new FileReader()

    reader.addEventListener("load", function () { }, false)

    if (file) {
      console.log(file)
      reader.readAsDataURL(file)
      console.log(reader)
    }
  }

  render() {
    let selectText = ""
    if (store.selectPairMode) {
      selectText =
        "In Select Mode. Selecting beats : " +
        store.selectedBeats.join(" , ")
    } else {
      selectText = ""
    }

    //<input type="file" onChange={this.handleUploadSample} ></input>
    const currentBeatResolution = store.currentBeat.tracks[0].sequence.length
    return (
      <SplitPane
        split       = "vertical"
        primary     = "second"
        defaultSize = {familyTreeWidth}
        minSize     = {200}
        maxSize     = {800}
        onChange    = { (size) => {
          this.setState( { familyTreeWidth : size })
        } }
        pane1Style={{backgroundColor: panelBackground}}
        pane2Style={{backgroundColor: panelBackground}}
      >
        <SplitPane split="horizontal" defaultSize="50%" minSize={400}>
          <div style={{flex: 1}}>
            <Player
              beat       = {store.currentBeat}
              playing    = {this.state.playingCurrentBeat}
              resolution = {currentBeatResolution}
            />
            <Header>
              <Button
                active  = {this.state.playingCurrentBeat}
                onClick = {this.handlePlayToggle}
              >
                {this.state.playingCurrentBeat ? 'Stop' : 'Play Current'}
              </Button>

              <Button onClick={this.handleMate}>
                Mate
              </Button>

              <NewBeatManager />

              <ConfigManager right />

              <Button
                right
                active  = {store.metronome}
                onClick = {store.toggleMetronome}
              >
                Metronome
              </Button>
            </Header>

            <div style={{textAlign: "center"}}>
              <Beat
                beat              = {store.currentBeat}
                handleRemoveTrack = {store.removeTrackFromCurrentBeat}
                handleToggleNote  = {store.toggleNoteOnCurrentBeat}
                handleSetSample   = {store.setSampleOnCurrentBeat}
              />

            </div>
            <Footer style={{textAlign: "center"}}>
              <Button left onClick={store.prevBeat}>
                &lt; Previous Beat
              </Button>

              <Info>
                <span>Beat: {store.currentBeat.key} (score: {store.currentBeat.score})</span>
                &nbsp;&nbsp;&nbsp;&nbsp;
                <form style={{display: "inline-block"}} onSubmit={this.setScore}>
                  <label>Rate Beat:
                    <input
                      type        = "number"
                      step        = "0.1"
                      value       = {this.state.inputScore}
                      onChange    = {this.handleInputChange}
                      placeholder = "Enter Score"
                    />
                  </label>
                </form>
              </Info>

              <Button right onClick={store.nextBeat}>
                Next Beat
                &gt;
              </Button>
            </Footer>
          </div>

          <div>
            <Header>
              <PanelLabel>
                Arrangement
              </PanelLabel>
            </Header>

            <Arrangement/>

            <Footer>
              <FamilySelect />

              <Button title="Start new family" onClick={this.newFamilyTree}>
                New Family
              </Button>

              <Button title="Clear all saved families" onClick={this.clearSavedFamilies}>
                Clear All
              </Button>
            </Footer>
          </div>
        </SplitPane>

        <div>
          <Header>
            <PanelLabel>
              Family Tree
            </PanelLabel>
          </Header>

          <GraphContainer
            height     = {this.state.familyTreeHeight}
            width      = {this.state.familyTreeWidth}
            familyTree = {store.allGenerations}
          />

          <Footer>
            <div>{selectText}</div>
            <div>
              <Button
                active  = {store.selectPairMode}
                onClick = {store.toggleSelectPairMode}
              >
                Select
              </Button>
            </div>
          </Footer>
          {typeof DevTools !== "undefined" ? <DevTools /> : null}
        </div>
      </SplitPane>
    )
  }
}


export default App
