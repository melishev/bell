import './index.css'

// TEMPLATE
document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <button id="button">GO</button>
  <video id="video" autoplay playsinline></video>
`

// JS
const video = document.querySelector('#video')
const button = document.querySelector('#button')

async function init() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: false,
      video: true
    });
    video.srcObject = stream;
  } catch (e) {
    // 
  }
}

button?.addEventListener('click', init)
