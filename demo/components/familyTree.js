import React,{Component} from 'react'
import { observer } from "mobx-react"
import styled from "styled-components"

import cytoscape from 'cytoscape'

import store from "../store"


const footerClearance = 90

const sidePadding = 0
const topPadding = 0
const bottomPadding = 0
const borderWidth = 1

const StyledFamilyTree = styled.div`
  margin: 0;
  padding: ${topPadding}px ${sidePadding}px ${bottomPadding}px;
  display: inline-block;
  vertical-align: top;
`


@observer
class FamilyTree extends React.Component {
    componentDidMount() {
      this.familyTreeToGraph()
    }

    componentDidUpdate() {
      this.familyTreeToGraph()
    }

    familyTreeToGraph = () => {
      let edges = []
      let nodes = []
      let intermediateNodes = []
      let genNum = 0
      let intermediateNodeKey = ""

      this.props.familyTree.forEach((generation, i) => {
        // Show initial generation left-to-right (cytoscape reverses it for some reason)
        if (i === 0) {
          generation = generation.slice().reverse()
        }
        generation.forEach((beat) => {
          if (beat.momKey && beat.dadKey ) {
            const parentKeys = [beat.momKey, beat.dadKey]
            intermediateNodeKey = parentKeys.sort().join("|")
            nodes.push({ data: {
              id    : intermediateNodeKey,
              score : beat.score,
              size  : 0
            }})
            edges.push({ data: { source: intermediateNodeKey, target: beat.key, visible: 1 , arrowScale : 1 } })
            if (!intermediateNodes.includes(intermediateNodeKey)) {
              edges.push({ data: { source: beat.momKey, target: intermediateNodeKey, visible: 1 , arrowScale : 0} })
              edges.push({ data: { source: beat.dadKey, target: intermediateNodeKey, visible: 1  , arrowScale : 0} })
            }
            intermediateNodes.push(intermediateNodeKey)
          } else if (!(beat.momKey && beat.dadKey) && genNum > 0) {
            edges.push({ data: { source: intermediateNodeKey, target: beat.key, visible: 0  } })
          }

          const selectedBeats = store.selectPairMode ? store.selectedBeats : [`${store.generation}.${store.beatNum}`]

          nodes.push({ data: {
            selected : selectedBeats.includes(beat.key) ? 1 : 0,
            id       : beat.key,
            name     : beat.key,
            score    : beat.score,
            size     : 1,
          }})
        })
        ++genNum
      })

      this.renderCytoscapeElement({ edges, nodes })
    }

    renderCytoscapeElement = (elements) => {
      this.cy = cytoscape(
      {
        container: document.getElementById('cy'),
        boxSelectionEnabled: false,
        autounselectify: true,
        elements: elements,
        layout: {
          name     : 'breadthfirst',
          directed : true,
          padding  : 10,
        },
        style: cytoscape.stylesheet()
          .selector('node')
          .css({
            'height'           : 'mapData(size, 0, 1, 1, 120)',
            'width'            : 'mapData(size, 0, 1, 1, 120)',
            'background-color' : 'mapData(score, 0, 20, white, red)',
            'background-fit'   : 'cover',
            'border-color'     : 'mapData(selected, 0, 1, black, red)',
            'border-width'     : 'mapData(size, 0, 1, 1, 12)',
            'border-opacity'   : 0.6,
            'content'          : 'data(name)',
            'text-valign'      : 'center',
            'label'            : 'data(id)',
            'font-size'        : 40,
          })
          .selector('edge')
          .css({
            'width'                   : 5,
            'target-arrow-shape'      : 'triangle',
            'arrow-scale'     :       'mapData(arrowScale, 0, 1, .5, 3)',
            'line-color'              : 'mapData(visible, 0, 1, #292B30, white)',
            'target-arrow-color'      : 'mapData(visible, 0, 1, #292B30, white)',
            'curve-style'             : 'bezier',
            'control-point-step-size' : 0,
            'opacity'                 : .3,
          }),
      })
      this.cy.maxZoom(1)
      this.cy.minZoom(0.3)

      this.cy.on('click', 'node', function(evt) {
        const idData = this.id().split(".")
        const generation = parseInt(idData[0])
        const beatNum = parseInt(idData[1])
        store.selectBeat(generation, beatNum)
      })

      this.cy.on('mouseover', 'node', function(evt) {
        document.getElementsByTagName('body')[0].style.cursor = 'pointer'
      })
      this.cy.on('mouseout', 'node', function(evt) {
        document.getElementsByTagName('body')[0].style.cursor = 'default'
      })
    }

    render() {
      // Mobx will only respond to state used in react components' render methods
      // This is a hack so that this component re-renders when it's supposed to
      store.selectedBeats.join("")
      store.generation
      store.beatNum
      store.currentGeneration
      store.newBeat

      return <StyledFamilyTree
        id    = "cy"
        style = {{
          height : this.props.height - topPadding - bottomPadding - borderWidth*2 - footerClearance,
          width  : this.props.width - sidePadding*2 - borderWidth*2,
        }}
      />
    }

}


export default FamilyTree
