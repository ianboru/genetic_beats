import React, { Component } from "react"

class Generation extends Component {
  render = () => {
    console.log("family tree generation")
    console.log(this.props.generation)
    const generation = this.props.generation.map( (member, i)=>{
      console.log(member)
      var name = ""
      if(member[0].parents){
        name = member[0].parents
      }else{
        name = i
      }
      return <Member name={name} key={i}/>
    })
    return (
      <div>{generation}</div>
    )

  }
}
class Member extends Component {
  render = () => {
    console.log("member")
    console.log(this.props)
    return (
      <div className="member">{this.props.name} | </div>
    )
  }
}
export default class FamilyTree extends Component {
  render = () => {
    console.log("making family tree")
    console.log(this.props.familyTree)
    const allGenerations = this.props.familyTree.map( (generation, i) => {
      return <Generation key={i} generation={generation}/>
    })
    return <div className="familyTree">{allGenerations}</div>
  }

}