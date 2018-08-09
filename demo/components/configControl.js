import React, { Component } from "react"

export default class ConfigControl extends Component {
  render() {
    const { name, value, changeHandler, min, max } = this.props

    return (
      <div>
        {name}
        <input type="text" value={value} onChange={changeHandler} />
        <input
          type="range"
          min={min}
          max={max}
          value={value}
          onChange={changeHandler}
        />
      </div>
    )
  }
}
