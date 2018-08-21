import Raven from 'raven-js'
import React, { Component } from "react"
import ReactFileReader from 'react-file-reader'
import { observer } from "mobx-react"
import styled from "styled-components"

import store from "./store"
import mateGeneration from "./generateChildren"
import "./index.css"
import {
  panelBackground,
  headerFooterBgColor,
} from "./colors"

import Arrangement from "./components/arrangement"
import Beat from "./components/beat"
import Button from "./components/button"
import ConfigManager from "./components/configManager"
import NewBeatManager from "./components/newBeatManager"
import FamilySelect from "./components/familySelect"
import FamilyTree from "./components/familyTree"
import Player from "./components/player"
import SplitPane from "react-split-pane"

//import DevTools from "mobx-react-devtools"


if (process.env.SENTRY_PUBLIC_DSN) {
  Raven.config(process.env.SENTRY_PUBLIC_DSN)
}


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
  font-family: "Hind Madurai";
  margin: 0 0 5px;
`

const familyTreeWidth = 500
let timerInterval
let noteTimerStartTime
var delay = ( function() {
      var timer = 0;
      return function(callback, ms) {
          clearTimeout (timer);
          timer = setTimeout(callback, ms);
      };
  })();

@observer
class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
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

  toggleNoteTimer = () => {

    store.toggleNoteTimer()
  }
  handlePlayToggle = () => {
    store.togglePlayCurrentBeat()
    this.toggleNoteTimer()
  }

  setScore = (e) => {
    if(this.state.inputScore){
      store.setScore(parseInt(this.state.inputScore))
      this.setState({inputScore: ""})
    }
    e.preventDefault()
    this.toggleNoteTimer()
    store.nextBeat()
  }
  handleNextBeat = () => {
    
      store.nextBeat()
        this.toggleNoteTimer()
  }
  handlePrevBeat = () => {
    store.prevBeat()

    this.toggleNoteTimer()
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

    const nextGeneration = mateGeneration(
      options.newCurrentGeneration,
    )

    store.addGeneration(nextGeneration)
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
    const selectedBeats = store.selectPairMode ? store.selectedBeats : [`${store.generation}.${store.beatNum}`]

    const beats = selectedBeats.map( (key) => {
      const keyInfo = key.split(".")
      const generation = keyInfo[0]
      const beatNum = keyInfo[1]

      return (
        <Beat
          key               = {key}
          beat              = {store.allGenerations[generation][beatNum]}
          handleRemoveTrack = {(trackNum) => store.removeTrackFromBeat(generation, beatNum, trackNum) }
          handleToggleNote  = {(trackNum, note) => store.toggleNoteOnBeat(generation, beatNum, trackNum, note) }
          handleSetSample   = {(trackNum, sample) => store.setSampleOnBeat(generation, beatNum, trackNum, sample) }
        />
      )
    })

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
              playing    = {store.playingCurrentBeat}
              resolution = {currentBeatResolution}
            />
            <Header>
              <Button
                active  = {store.playingCurrentBeat}
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
              {
                (!store.selectPairMode ||
                 store.selectedBeats.length > 0) ?
                beats :
                <div>
                  <div>Select Mode Enabled.</div>
                  <div>Select beats in Family Tree graph to display and mate.</div>
                </div>
              }

            </div>
            <Footer style={{textAlign: "center"}}>
              <Button onClick={this.handlePrevBeat}>
                &lt; Previous Beat
              </Button>

              <Info>
                <form style={{display: "inline-block"}} onSubmit={this.setScore}>
                  <label>
                    <input
                      type        = "number"
                      step        = "0.1"
                      value       = {this.state.inputScore}
                      onChange    = {this.handleInputChange}
                      placeholder = "Rate Beat"
                      style={{
                        fontSize: 22,
                        height: 24,
                        verticalAlign: "bottom",
                        textAlign: "center",
                      }}
                    />
                  </label>
                </form>
              </Info>

              <Button onClick={this.handleNextBeat}>
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

          <FamilyTree
            height     = {this.state.familyTreeHeight}
            width      = {this.state.familyTreeWidth}
            familyTree = {store.allGenerations}
          />

          <Footer>
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
