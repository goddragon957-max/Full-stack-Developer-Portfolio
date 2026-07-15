import Phaser from 'phaser';
import { BootScene } from './scenes/BootScene';
import { FarmVillageScene } from './scenes/FarmVillageScene';
import type { PhaserBridge } from './bridge';

export function createPhaserGame(parent: HTMLElement, bridge: PhaserBridge) {
  const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    parent,
    width: Math.max(1, parent.clientWidth),
    height: Math.max(1, parent.clientHeight),
    backgroundColor: '#18130f',
    transparent: false,
    pixelArt: true,
    antialias: false,
    roundPixels: true,
    autoFocus: true,
    audio: { noAudio: true },
    scale: {
      mode: Phaser.Scale.RESIZE,
      width: '100%',
      height: '100%',
      autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    scene: [new BootScene(bridge), new FarmVillageScene(bridge)],
  };

  return new Phaser.Game(config);
}
