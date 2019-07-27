import {action, computed, observable, reaction, toJS} from "mobx"

const MESSAGE_DURATION = 4000

class MessageStore {
  //
  // STATE
  //

  @observable messageQueue = []

  //
  // ACTIONS
  //

  @action addMessageToQueue(message) {
    this.messageQueue.push(message)
    setTimeout(() => {
      this.shiftMessageFromQueue()
    }, MESSAGE_DURATION)
  }

  @action shiftMessageFromQueue() {
    this.messageQueue.shift()
  }
}

const messageStore = new MessageStore()

export default messageStore
