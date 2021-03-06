import Grid from 'objects/Grid';
import Ant from 'objects/Ant';
import History from 'objects/History';

import { CellWidth, ElapsedTime, SizeTerrain, WidthCanvas, HeighCanvas } from '../constants';
import { endSimulation } from '../utils';

const CameraVelocity = 10;
const TimeoutRecord = 500;

class GameState extends Phaser.State {

  create() {
    const sizeT = window.gridSize || SizeTerrain;
    const Bounds = CellWidth * sizeT;
    console.log(Bounds)
    this.game.world.setBounds(0, 0, Bounds, Bounds);
    this.gridLayout = new Grid(this.game, Bounds/ CellWidth, Bounds/CellWidth, CellWidth);
    this.cursors = this.game.input.keyboard.createCursorKeys();

    this.ant = new Ant(this.game, 0, 0, "red");
    this.game.add.existing(this.ant);

    this.textStep = this.game.add.text(this.game.world.width * 0.01, this.game.world.height * 0.01, "Steps: ", { font: "20px Arial", fill: "#FFFFFF", align: "center" });
    this.textStep.fixedToCamera = true;
    this.textStep.stroke = '#000000';
    this.textStep.strokeThickness = 6;
    this.setAntCenter(Bounds);

    this.steps = 0;
    this.timer = this.game.time.create(false);
    this.timer.add(window.ElapsedTime || ElapsedTime, this.updatePosition, this);
    this.timer.start();

    this.game.time.advancedTiming = true;

    this.replay = new History();
    this.replay.start();
    this.replay.recordStep(this.steps, this.ant, this.gridLayout.getCellsArray());

    this.initCamera();
  }

  initCamera() {
    this.game.camera.x = this.game.world.width / 2 - WidthCanvas / 2;
    this.game.camera.y = this.game.world.height / 2 - HeighCanvas / 2;
  }

  setAntCenter(Bounds) {
    const indexX = Math.trunc( (Bounds / CellWidth) / 2 );
    const indexY = Math.trunc( (Bounds / CellWidth) / 2 );
    this.setAntOnCell(indexX, indexY);
  }

  setAntOnCell(indexX, indexY) {
    const cell = this.gridLayout.getCell(indexX, indexY);
    this.ant.x = cell.realPosition.x + CellWidth / 2 - this.ant.width / 2;
    this.ant.y = cell.realPosition.y + CellWidth / 2 - this.ant.height / 2;
  }

  preload() {
    this.game.stage.disableVisibilityChange = true;
    this.game.load.spritesheet('ant', 'res/ants.png', 32, 32);
  }

  updatePosition() {
    let cell = this.gridLayout.getCellAtPosition( this.ant.x, this.ant.y );
    if(cell === -1) {
      endSimulation();
      return;
    }
    this.ant.updateAnt(cell);
    cell.toggle();
    this.steps += 1;
    this.textStep.text = "Steps: " + this.steps;
    this.replay.recordStep(this.steps, this.ant, this.gridLayout.getCellsArray());
    //setTimeout(asyncRecord , TimeoutRecord);
    if(window.play === true) {
      this.timer.add(window.ElapsedTime || ElapsedTime, this.updatePosition, this);
      window.updateHistorySlider(this.steps);
    }
  }

  setSimulationTo(step) {
    this.timer.removeAll();
    const stepInt = parseInt(step || 1);
    const simulationData = this.replay.getTo(stepInt - 1);
    this.gridLayout.setStates(simulationData.grid);
    this.ant.goTo(simulationData.x, simulationData.y, simulationData.antRotation);
    this.steps = stepInt;
    this.timer.add(window.ElapsedTime || ElapsedTime, this.updatePosition, this);
  }

  update() {
      if (this.cursors.up.isDown)
      {
        this.game.camera.y -= CameraVelocity;
      }
      else if (this.cursors.down.isDown)
      {
        this.game.camera.y += CameraVelocity;
      }

      if (this.cursors.left.isDown)
      {
        this.game.camera.x -= CameraVelocity;
      }
      else if (this.cursors.right.isDown)
      {
        this.game.camera.x += CameraVelocity;
      }
  }

  render() {
    //this.game.debug.spriteBounds(this.ant);
    this.game.debug.text(this.game.time.fps, 2, 14, "#00ff00");
  }


}

export default GameState;
