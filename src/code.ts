import Time "mo:base/Time";
import HashMap "mo:base/HashMap";
import Principal "mo:base/Principal";
import Debug "mo:base/Debug";

actor TimeCapsule {

  public type Message = {
    content : Text;
    revealDate : Time.Time;
  };

  public type OperationResult = {
    #Ok: Message;
    #Err: Text;
  };

  private stable var messages = HashMap.HashMap<Principal, Message>(1, Principal.equal, Principal.hash);

  public shared func storeMessage(message : Message) : async OperationResult {
    let caller = msg.caller;

    Debug.print("Storing message");

    messages.put(caller, message);

    #Ok(message);
  };

  public shared query func getMessage(user : Principal) : async OperationResult {

    let result = messages.get(user);

    switch(result) {
      case (?message) {
        if(Time.now() < message.revealDate) {
          #Err("Message cannot be revealed yet");
        } else {
          #Ok(message);
        };
      };
      case null {
        #Err("Message not found for user");  
      };
    };

  };

  system func preupgrade() {
    // serialize messages
  };

  system func postupgrade() {
    // deserialize messages
  };

};
