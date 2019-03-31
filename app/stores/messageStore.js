import { action, configure, computed, observable, reaction, toJS } from "mobx"


configure({ enforceActions: "always" })


const MESSAGE_DURATION = 4000

class MessageStore {
  //  
  // STATE
  //

  @observable messageQueue = []

  //
  // ACTIONS
  //

  @action addMessageToQueue(message){
    this.messageQueue.push(message)
    setTimeout(()=>{
      this.popMessageFromQueue()
    }, MESSAGE_DURATION)
  }
  @action popMessageFromQueue(){
    this.messageQueue.pop()
  }

}

const messageStore = new MessageStore()

export default messageStore
