import "./style.css";
//@ts-ignore
import freeice from "freeice";

const answerInput = document.getElementById("answer");
const connectButton = document.getElementById("sendAnswer");
const offerContainer = document.getElementById("yourOffer") as HTMLElement;
const generateOfferButton = document.getElementById("generateOffer");
const sendMessage = document.getElementById("sendMessage");
const inputText = document.getElementById("chatText");
const chat = document.getElementById("chat");

//@ts-ignore
const messages = [];

const peerConnection = new RTCPeerConnection({ iceServers: freeice() });
// @ts-ignore
let dataChannel;

generateOfferButton?.addEventListener("click", async (event) => {
  event.preventDefault();

  dataChannel = peerConnection.createDataChannel("test");
  dataChannel.onopen = () => {
    console.log("channel open");
  };
  dataChannel.onmessage = (e) => {
    console.log("message:", e.data);
    messages.push(e.data);
    render();
  };

  // @ts-ignore
  peerConnection.onicecandidate = () => {
    console.log("offer token");
    console.log(JSON.stringify(peerConnection.localDescription));

    offerContainer.innerText = JSON.stringify(peerConnection.localDescription);
  };

  const offer = await peerConnection.createOffer();

  peerConnection.setLocalDescription(offer);
});

connectButton?.addEventListener("click", async (event) => {
  event.preventDefault();

  //@ts-ignore
  const token = answerInput.value;

  // @ts-ignore
  const typeToken = document.querySelector('input[name="type"]:checked').value;
  if (typeToken === "offer") {
    peerConnection
      .setRemoteDescription(new RTCSessionDescription(JSON.parse(token)))
      .catch((e) => console.log(e));

    // @ts-ignore
    peerConnection.onicecandidate = () => {
      console.log("answer token");
      console.log(JSON.stringify(peerConnection.localDescription));

      offerContainer.innerText = JSON.stringify(
        peerConnection.localDescription
      );
    };

    peerConnection.ondatachannel = (e) => {
      dataChannel = e.channel;
      dataChannel.onopen = () => {
        console.log("channel open");
      };
      dataChannel.onmessage = (e) => {
        console.log("message:", e.data);
        messages.push(e.data);
        render();
      };
    };

    //@ts-ignore
    console.log(dataChannel);

    const answer = await peerConnection.createAnswer();

    peerConnection.setLocalDescription(answer);
  } else {
    peerConnection.setRemoteDescription(
      new RTCSessionDescription(JSON.parse(token))
    );
  }
});

sendMessage?.addEventListener("click", () => {
  // @ts-ignore
  const text = inputText.value;

  messages.push(text);

  // @ts-ignore
  dataChannel.send(text);

  //@ts-ignore
  inputText.value = "";

  render();
});

function render() {
  let result = "";
  // @ts-ignore
  messages.forEach((msg) => {
    result += `<div>${msg}</div>`;
  });

  //@ts-ignore
  chat.innerHTML = result;
}
