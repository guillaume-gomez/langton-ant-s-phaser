function init() {
  document.getElementById('play-pause').style.visibility = 'hidden';
  window.play = true;
}

function showValue(newValue, id)
{
  document.getElementById(id).innerHTML=newValue;
  switch(id) {
    case 'rangeSpeed':
      window.ElapsedTime = newValue;
    break;
    case 'gridSize':
      window.gridSize = newValue;
    break;
    case 'historyValue':
    break;
  }
}

function startGame() {
  if(!window.gameInstance) {
    window.gameInstance = new window.game();
    document.getElementById('play-pause').style.visibility = 'visible';
    document.getElementById('submit').style.visibility = 'hidden';
    document.getElementById('grid').disabled = true;
  }
}

function playPause() {
  if(window.play === undefined) {
    window.play = true;
    return;
  }
  window.play = !window.play;
  if(window.play) {
    window.gameInstance.state.states.GameState.updatePosition();
  }
}