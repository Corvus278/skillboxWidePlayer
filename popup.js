const changeWidthButton = document.querySelector('#button-toggle')
const changeWidthButtonTexts = {
  isWideText: 'Обычный плеер',
  isNormalText: 'Широкий плеер',
}

// Take text for button from client
sendMessage({ type: 'getText' }, setButtonText)

// Change player width
changeWidthButton.addEventListener('click', () => {
  sendMessage({ type: 'changeWidth' }, setButtonText)
})

async function sendMessage(messageObj, cbfn = () => { }) {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true })

  chrome.tabs.sendMessage(tab.id, messageObj, cbfn)
}

function setButtonText(playerState) {
  if (playerState.isWide) {
    changeWidthButton.textContent = changeWidthButtonTexts.isWideText
  } else {
    changeWidthButton.textContent = changeWidthButtonTexts.isNormalText
  }
}
