import { action, configure, computed, observable, reaction, toJS } from "mobx"


configure({ enforceActions: "always" })

class MessageStore {
  //
  // STATE
  //

  @observable messageQueue = []


  //
  // ACTIONS
  //

  @action addMessageToQueue(message){
    console.log("adding message",message)
    this.messageQueue.push(message)
    setTimeout(()=>{
      this.popMessageFromQueue()
    }, 2000)
  }
  @action popMessageFromQueue(){
    this.messageQueue.pop()
    console.log(this.messageQueue)
  }

}

const messageStore = new MessageStore()

export default messageStore
