import Phaser from 'phaser';
import { PhaserBridge, collectSnapshotAssets, getPhaserTextureKey } from '../bridge';

export class BootScene extends Phaser.Scene {
  constructor(private readonly bridge: PhaserBridge) {
    super('BootScene');
  }

  preload() {
    const snapshot = this.bridge.getSnapshot();
    if (!snapshot) {
      this.bridge.emitRuntimeState({ status: 'error', message: 'Outdoor world render snapshot was unavailable.' });
      return;
    }

    for (const asset of collectSnapshotAssets(snapshot)) {
      const key = getPhaserTextureKey(asset);
      if (!this.textures.exists(key)) this.load.image(key, asset);
    }

    this.load.once('loaderror', (file: Phaser.Loader.File) => {
      this.bridge.emitRuntimeState({ status: 'error', message: `Could not load pixel asset: ${file.src}` });
    });
  }

  create() {
    const snapshot = this.bridge.getSnapshot();
    if (!snapshot) return;

    for (const asset of collectSnapshotAssets(snapshot)) {
      const texture = this.textures.get(getPhaserTextureKey(asset));
      texture.setFilter(Phaser.Textures.FilterMode.NEAREST);
    }
    this.scene.start('WorldScene');
  }
}
