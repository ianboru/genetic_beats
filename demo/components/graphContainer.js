import React,{Component} from 'react'
import cytoscape from 'cytoscape'


export default class GraphContainer extends React.Component {
    constructor(props){
      super(props)
      this.renderCytoscapeElement = this.renderCytoscapeElement.bind(this)
    }

    handleSelectNode(id){
      this.props.handleSelectNode(id)
    }

    componentDidMount() {
      this.familyTreeToGraph()
    }

    componentDidUpdate() {
      this.familyTreeToGraph()
    }

    familyTreeToGraph(){
      let nodes = []
      let edges = []
      let elements = []

      this.props.familyTree.forEach(
        function(currentGeneration){
          let memberNum = 0
          currentGeneration.forEach(
            function(currentMember){
              ++memberNum
              let id = currentMember.key

              if(currentMember.momKey && currentMember.dadKey ){
                edges.push({ data: { source: currentMember.momKey, target: id  } })
                edges.push({ data: { source: currentMember.dadKey, target: id  } })
              }

              nodes.push({ data: { id: id, name: id,score: currentMember.score} })
          })
      })
      elements = {
        "nodes" : nodes,
        "edges" : edges,
      }
      this.renderCytoscapeElement(elements)
    }

    renderCytoscapeElement(elements){
        this.cy = cytoscape(
        {
            container: document.getElementById('cy'),

            boxSelectionEnabled: false,
            autounselectify: true,

            style: cytoscape.stylesheet()
                .selector('node')
                .css({
                    'height': 120,
                    'width': 120,
                    'background-color': 'mapData(score, 0, 20, white, red)',
                    'background-fit': 'cover',
                    'border-color': '#000',
                    'border-width': 3,
                    'border-opacity': 0.5,
                    'content': 'data(name)',
                    'text-valign': 'center',
                    'label': 'data(id)',

                })
                .selector('edge')
                .css({
                    'width': 6,
                    'target-arrow-shape': 'triangle',
                    'line-color': '#ffaaaa',
                    'target-arrow-color': '#ffaaaa',
                    'curve-style': 'bezier'
                })
                ,
            elements: elements,

            layout: {
              name     : 'breadthfirst',
              directed : true,
              padding  : 10,
            }
        })
        var that = this
        this.cy.on('click', 'node', function(evt){
            that.handleSelectNode(this.id())
        })
    }

    render() {
      let cyStyle = {
        border : '1px solid #333',
        height : '400px',
        width  : '400px',
        margin : '20px 0px',
        ...this.props.style
      }
      return <div style={cyStyle}  id="cy"/>
    }
}



