import Raven from 'raven-js'
import React, { Component } from "react"
import ReactFileReader from 'react-file-reader'
import { observer } from "mobx-react"
import styled from "styled-components"
import SplitPane from "react-split-pane"
import chroma from "chroma-js"

import {
  MdChevronLeft,
  MdChevronRight,
} from "react-icons/md"

import store from "./store"
import { mitosis} from "./generateChildren"
import { mateGeneration, mateSelectedMembers} from "./generateChildren"
import "./index.css"
import { colors } from "./colors"

import Arrangement from "./components/arrangement"
import Beat from "./components/beat"
import Button from "./components/button"
import ConfigControl from "./components/configControl"
import NewBeatManager from "./components/newBeatManager"
import FamilySelect from "./components/familySelect"
import FamilyTree from "./components/familyTree"
import MatingControls from "./components/matingControls"
import Player from "./components/player"
import StarRating from "./components/starRating"

//import DevTools from "mobx-react-devtools"


if (process.env.SENTRY_PUBLIC_DSN) {
  Raven.config(process.env.SENTRY_PUBLIC_DSN)
}


const Header = styled.div`
  background: ${colors.gray.darkest};
  width: 100%;
  padding: 0px 3px;
  box-sizing: border-box;
`

const Footer = styled.div`
  background: ${colors.gray.darkest};
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  width: 100%;
  padding: 0px 3px;
  box-sizing: border-box;
`

const BackgroundText = styled.div`
  left: 10px;
  right: 10px;
  bottom: 40px;
  position: absolute;
`

const BigText = styled.div`
  display: ${props => props.inlineBlock ? "inline-block" : "block"};
  color: #555;
  font-family: "Hind Madurai";
  font-size: 50px;
  vertical-align: middle;
  text-align: center;
`

const BeatOuterContainer = styled.div`
  flex: 1;
  position: relative;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
`

const BeatContainer = styled.div`
  position: relative;
  top: 0;
  left: 0;
  right: 0;
  bottom: 60px;
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
  padding: 10px;
`
const Spacer = styled.div`
  height: ${props => props.height ? props.height : 10}px;
`


const familyTreeWidth = 300


@observer
class BeatDisplay extends Component {
  render() {
    const beat = ((beat) => {
      if (!beat) {
        return null
      } else {
        const keyInfo = beat.key.split(".")
        const generation = keyInfo[0]
        const beatNum = keyInfo[1]

        return (
          <Beat
            key               = {beat.key}
            ref               = {r => { this.beat = r }}
            beat              = {beat}
            handleRemoveTrack = {(trackNum) => store.removeTrackFromBeat(generation, beatNum, trackNum) }
            handleToggleNote  = {(trackNum, note) => store.toggleNoteOnBeat(generation, beatNum, trackNum, note) }
            handleSetSample   = {(trackNum, sample) => store.setSampleOnBeat(generation, beatNum, trackNum, sample) }
          />
        )
      }
    })(store.currentBeat)

    if (!beat || store.showAddNewBeat) {
      return (
        <div style={{ textAlign: "center" }}>
          <NewBeatManager />
        </div>
      )
    }

    return (
      <div>
        <Header style={{
          borderTop : `1px solid ${colors.gray.light}`,
          textAlign : "center",
          position  : "relative",
        }}>
          <StarRating
            score = {store.currentBeat.score}
            handleSetScore = { (score) => {
              store.setScore(score)
              store.nextBeat()
            }}
          />
        </Header>

        <div style={{
          overflow   : "auto",
          background : colors.gray.darkest,
        }}>
          {beat}
        </div>
      </div>
    )
  }
}


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
    this.setState({ familyTreeHeight: e.target.innerHeight })
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
    if (e.code == "Space") {
      e.preventDefault()
      store.togglePlay()
    } else if (e.code == "ArrowRight") {
      store.nextBeat()
    } else if (e.code == "ArrowLeft") {
      store.prevBeat()
    }
  }

  getHorizontalSplitOptions = () => {
    return {
      onKeyPress  : this.handleKeyPress,
      split       : "vertical",
      primary     : "second",
      defaultSize : familyTreeWidth,
      minSize     : 300,
      maxSize     : 500,
      onChange    : (size) => { this.setState( { familyTreeWidth : size }) },
      pane1Style  : {backgroundColor: colors.gray.light},
      pane2Style  : {backgroundColor: colors.gray.light},
    }
  }

  getVerticalSplitOptions = () => {
    return {
      split       : "horizontal",
      defaultSize : 600,
      minSize     : 400,
      maxSize     : 700,
    }
  }

  handleClone = () => {
    store.addBeatToCurrentGen(store.currentBeat)
  }

  handleMutate = () => {
    const newBeat = mitosis(store.currentBeat)
    store.addBeatToCurrentGen(newBeat)
  }

  renderBeatPanel = () => {
    return (
      <BeatOuterContainer>
        <BeatContainer>
          <Header>
              <div style={{marginLeft: "15px", marginBottom: "25px"}} >
                <FamilySelect />

                <Button  style={{background : colors.gray.darkest, marginLeft : "20px"}} title="Start new family" onClick={this.newFamilyTree}>
                  New Family
                </Button>

                <Button style={{background : colors.gray.darkest, marginLeft : "20px"}} title="Clear all saved families" onClick={this.clearSavedFamilies}>
                  Clear All
                </Button>
              </div>

              {store.allGenerations[0].length >= 1 ?
                <Button
                  style={{marginLeft: "15px"}}
                  large
                  onClick={() => { store.toggleAddNewBeat(true) }}
                >
                  Add New Beat
                </Button> : null
              }

              {store.allGenerations[0].length >= 1 ?
                <Button
                  large
                  color={[colors.green.base]}
                  onClick = {this.handleMutate}
                >
                  Mutate
                </Button> : null
              }

              {store.allGenerations[0].length >= 1 ?
                <Button
                  large
                  color={[colors.green.base]}
                  onClick = {this.handleClone}
                >
                  Clone
                </Button> : null
              }

              {(store.allGenerations[0].length >= 2 &&
                store.allGenerations.length >= 1) ?
                  <Button
                    large
                    color={[colors.yellow.dark]}
                    onClick={store.toggleShowCreateArrangement}>
                    {store.showCreateArrangement ?
                      "Hide Beat Arrangements" :
                      "Show Beat Arrangements"
                    }
                  </Button> : null
              }
          </Header>

          <BeatDisplay />
        </BeatContainer>
      </BeatOuterContainer>
    )
  }

  renderFamilyTreePanel = () => {
    return (
      <div>
        <Header>
          <PanelLabel>
            <Button large color={[colors.green.base]} onClick={this.handleMate}>
              Mate
            </Button>

            <Button
              active  = {store.selectPairMode}
              onClick = {store.toggleSelectPairMode}
            >
              Select beats to mate
            </Button>

            <MatingControls />
          </PanelLabel>
        </Header>

        <BackgroundText>
          <BigText>
            Family Tree
          </BigText>
        </BackgroundText>

        <FamilyTree
          height     = {this.state.familyTreeHeight}
          width      = {this.state.familyTreeWidth}
          familyTree = {store.allGenerations}
        />

        <Footer>
          <InfoRow>
            scroll to zoom
          </InfoRow>
        </Footer>
        {typeof DevTools !== "undefined" ? <DevTools /> : null}
      </div>
    )
  }

  renderArrangementPanel = () => {
    return (
      <div>
        <Arrangement/>
      </div>
    )
  }

  renderBeat = () => {
    return this.renderBeatPanel()
  }

  renderBeatFamilyTree = () => {
    return (
      <SplitPane {...this.getHorizontalSplitOptions()}>
        {this.renderBeatPanel()}

        {this.renderFamilyTreePanel()}
      </SplitPane>
    )
  }

  renderBeatFamilyTreeArrangement = () => {
    return (
      <SplitPane {...this.getHorizontalSplitOptions()}>
        <SplitPane {...this.getVerticalSplitOptions()}>
          {this.renderBeatPanel()}

          {this.renderArrangementPanel()}
        </SplitPane>

        {this.renderFamilyTreePanel()}
      </SplitPane>
    )
  }

  render() {
    //<input type="file" onChange={this.handleUploadSample} ></input>

    if (store.allGenerations[0].length >= 2 &&
        store.allGenerations.length >= 1 &&
        store.showCreateArrangement) {
      return this.renderBeatFamilyTreeArrangement()
    } else if (store.allGenerations[0].length >= 2) {
      return this.renderBeatFamilyTree()
    } else {
      return this.renderBeat()
    }
  }
}


export default App
