import React,{Component} from 'react'
import { connect } from 'react-redux'

import { actions } from "../store"

import cytoscape from 'cytoscape'


class GraphContainer extends React.Component {
    handleSelectNode(id){
      this.props.handleSelectNode(id)
    }

    componentDidMount() {
      this.familyTreeToGraph()
    }

    componentDidUpdate() {
      this.familyTreeToGraph()
    }

    familyTreeToGraph = () => {
      let edges = []
      let nodes = []

      this.props.familyTree.forEach((generation) => {
        const key = `${this.props.generation}.${this.props.beatNum}`

        generation.forEach((beat) => {
          if (beat.momKey && beat.dadKey ) {
            edges.push({ data: { source: beat.momKey, target: beat.key  } })
            edges.push({ data: { source: beat.dadKey, target: beat.key  } })
          }

          nodes.push({ data: {
            selected : (key === beat.key ? 1 : 0),
            id       : beat.key,
            name     : beat.key,
            score    : beat.score,
          }})
        })
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
            'height'           : 120,
            'width'            : 120,
            'background-color' : 'mapData(score, 0, 20, white, red)',
            'background-fit'   : 'cover',
            'border-color'     : 'mapData(selected, 0, 1, black, red)',
            'border-width'     : 3,
            'border-opacity'   : 0.5,
            'content'          : 'data(name)',
            'text-valign'      : 'center',
            'label'            : 'data(id)',
          })
          .selector('edge')
          .css({
            'width'              : 6,
            'target-arrow-shape' : 'triangle',
            'line-color'         : '#ffaaaa',
            'target-arrow-color' : '#ffaaaa',
            'curve-style'        : 'bezier'
          })
          ,
      })
      var that = this
      this.cy.on('click', 'node', function(evt){
        that.props.selectNode(this.id())
      })
    }

    render() {
      let cyStyle = {
        'border' : '1px solid #333',
        'height' : '400px',
        'width'  : '400px',
        'margin' : '20px 0px',
        ...this.props.style
      }

      return <div style={cyStyle}  id="cy"/>
    }
}


export default connect(
  (state) => {
    return {
      beatNum: state.beatNum,
      generation: state.generation,
    }
  }, (dispatch) => {
    return {
      selectNode: (id) => {
        const idData = id.split(".")
        const generation = parseInt(idData[0])
        const beatNum = parseInt(idData[1])
        dispatch(actions.selectBeat(generation, beatNum))
      }
    }
  }
)(GraphContainer)
