import React, { Component } from "react"
import { observer } from "mobx-react"

import store from "../store"


@observer
class FamilySelect extends Component {
  handleSelectFamily = (e) => {
    store.selectFamily(e.target.value)
  }

  render() {
    const familyNamesOptions = store.familyNames.map((name) => {
      return (
        <option key={name} value={name}>
          {name}
        </option>
      )
    })

    return (
      <div>
        Family:
        {store.familyName}
        <select
          defaultValue={store.familyName}
          onChange={this.handleSelectFamily}
        >
          {familyNamesOptions}
        </select>
      </div>
    )
  }
}

export default FamilySelect
