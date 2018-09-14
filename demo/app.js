import Raven from 'raven-js'
import React, { Component } from "react"
import ReactFileReader from 'react-file-reader'
import { observer } from "mobx-react"
import styled from "styled-components"
import SplitPane from "react-split-pane"

import {
  TiChevronLeft,
  TiChevronRight,
} from "react-icons/ti"

import store from "./store"
import { mateGeneration, mateSelectedMembers} from "./generateChildren"
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
import StarRating from "./components/starRating"

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

const PanelLabel = styled.div`
  font-size: 28px;
  font-family: "Hind Madurai";
  margin: 0 0 5px;

  &::after {
    content: "";
    clear: both;
    display: table;
  }
`

const InfoRow = styled.div`
  text-align: center;
  color: gray;
  font-size: 16px;
`
const Spacer = styled.div`
  height: ${props => props.height ? props.height : 10}px;
`

const familyTreeWidth = 440


@observer
class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      familyTreeHeight : window.innerHeight,
      familyTreeWidth  : familyTreeWidth,
    }
    //store.fetchAllSamples()
  }
  componentDidMount = () => {
    document.addEventListener("keydown", this.handleKeyPress, false);
    window.addEventListener("resize", this.handleWindowResize)
  }

  componentWillUnmount = () => {
    document.removeEventListener("keydown", this.handleKeyPress, false);
    window.removeEventListener("resize", this.handleWindowResize)
  }

  handleWindowResize = (e) => {
    this.setState({ familyTreeHeight: e.target.innerHeight})
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
    if (store.generation < store.allGenerations.length - 1 && !store.selectPairMode) {
      if (confirm(`Mating now will clear all generations after the currently selected one (${store.generation}).`)) {
        store.killSubsequentGenerations()
      } else {
        return
      }
    }

    let options = {}
    let members = store.currentGeneration
    let nextGeneration
    if (store.selectPairMode) {
      members = store.selectedBeats.map( (currentKey) => {
        const currentKeyInfo = currentKey.split(".")
        const generation = currentKeyInfo[0]
        const beatNum = currentKeyInfo[1]
        return store.allGenerations[generation][beatNum]
      })
      nextGeneration = mateSelectedMembers(members)
    } else {
      nextGeneration = mateGeneration(members)
    }

    store.addGeneration(nextGeneration)
    if(store.selectPairMode){store.toggleSelectPairMode()}
  }

  handleUploadSample = (files) => {
    var file    = document.querySelector('input[type=file]').files[0]
    var reader  = new FileReader()

    reader.addEventListener("load", function () { }, false)

    if (file) {
      reader.readAsDataURL(file)
    }
  }
  handleKeyPress = (e) => {
    if(e.code == "Space"){
      e.preventDefault()
      store.togglePlay()
    }else if(e.code =="ArrowRight"){
      store.nextBeat()
    }else if(e.code =="ArrowLeft"){
      store.prevBeat()
    }  

  }
  render() {
    const beat = [store.currentBeat].map( (beat) => {
      const keyInfo = beat.key.split(".")
      const generation = keyInfo[0]
      const beatNum = keyInfo[1]

      return (
        <Beat
          key               = {beat.key}
          beat              = {beat}
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
        onKeyPress={this.handleKeyPress}
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
        <SplitPane split="horizontal" defaultSize={300} minSize={300}>
          <div style={{flex: 1}}>
            <Player
              beat       = {store.currentBeat}
              playing    = {store.playingCurrentBeat}
              resolution = {currentBeatResolution}
            />
            <Header>
              <Button
                active  = {store.playingCurrentBeat}
                onClick = {store.togglePlayCurrentBeat}
              >
                {store.playingCurrentBeat ? 'Stop' : 'Play Current'}
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

            <div style={{overflow: "auto", textAlign: "center"}}>
              {beat}
            </div>
            <Footer style={{textAlign: "center"}}>
              <Button onClick={store.prevBeat}>
                <TiChevronLeft style={{verticalAlign: "bottom"}} size={15} />
                Previous Beat
              </Button>

              <StarRating
                score = {store.currentBeat.score}
                handleSetScore = { (score) => {
                  store.setScore(score)
                  store.nextBeat()
                }}
              />

              <Button onClick={store.nextBeat}>
                Next Beat
                <TiChevronRight style={{verticalAlign: "bottom"}} size={15} />
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

              <Button right large onClick={this.handleMate}>
                Mate
              </Button>
            </PanelLabel>
          </Header>

          <FamilyTree
            height     = {this.state.familyTreeHeight}
            width      = {this.state.familyTreeWidth}
            familyTree = {store.allGenerations}
          />

          <Footer>
            <InfoRow>
              scroll to zoom
            </InfoRow>

            <Spacer />

            <div style={{textAlign:"center"}}>
              <Button
                active  = {store.selectPairMode}
                onClick = {store.toggleSelectPairMode}
              >
                Select beats to mate
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
