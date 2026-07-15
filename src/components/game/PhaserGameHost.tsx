import { useEffect, useRef, useState } from 'react';
import type Phaser from 'phaser';
import {
  PhaserBridge,
  type PhaserInputIntent,
  type PhaserRuntimeState,
  type PhaserWorldSnapshot,
} from '../../game/phaser/bridge';

type PhaserGameHostProps = {
  snapshot: PhaserWorldSnapshot;
  onInputIntent: (intent: PhaserInputIntent) => void;
  onReady: (renderer: 'webgl' | 'canvas') => void;
  onError: (message: string) => void;
};

export function PhaserGameHost({ snapshot, onInputIntent, onReady, onError }: PhaserGameHostProps) {
  const hostRef = useRef<HTMLDivElement>(null);
  const gameRef = useRef<Phaser.Game | null>(null);
  const bridgeRef = useRef<PhaserBridge | null>(null);
  const snapshotRef = useRef(snapshot);
  const inputRef = useRef(onInputIntent);
  const readyRef = useRef(onReady);
  const errorRef = useRef(onError);
  const [runtimeState, setRuntimeState] = useState<PhaserRuntimeState | null>(null);

  snapshotRef.current = snapshot;
  inputRef.current = onInputIntent;
  readyRef.current = onReady;
  errorRef.current = onError;

  useEffect(() => {
    const parent = hostRef.current;
    if (!parent || gameRef.current) return;

    let cancelled = false;
    let game: Phaser.Game | null = null;
    let canvas: HTMLCanvasElement | null = null;
    let resizeObserver: ResizeObserver | null = null;
    const bridge = new PhaserBridge();
    bridge.publishSnapshot(snapshotRef.current);
    bridgeRef.current = bridge;
    const unsubscribeInput = bridge.subscribeInputIntent((intent) => inputRef.current(intent));
    const unsubscribeRuntime = bridge.subscribeRuntimeState((state) => {
      setRuntimeState(state);
      if (state.status === 'ready') {
        const activeCanvas = parent.querySelector('canvas');
        activeCanvas?.setAttribute('data-phaser-canvas', 'farm-village');
        activeCanvas?.setAttribute('aria-label', 'Playable Farm Village Phaser game canvas');
        readyRef.current(state.renderer);
      } else {
        errorRef.current(state.message);
      }
    });
    const onContextLost = (event: Event) => {
      event.preventDefault();
      errorRef.current('The WebGL context was lost. Switched to the DOM renderer.');
    };

    const startGame = async () => {
      try {
        const { createPhaserGame } = await import('../../game/phaser/config');
        if (cancelled) return;
        game = createPhaserGame(parent, bridge);
        gameRef.current = game;
        canvas = game.canvas;
        canvas?.addEventListener('webglcontextlost', onContextLost, { once: true });
        resizeObserver = new ResizeObserver(([entry]) => {
          const activeGame = gameRef.current;
          if (!activeGame || !entry) return;
          const width = Math.max(1, Math.round(entry.contentRect.width));
          const height = Math.max(1, Math.round(entry.contentRect.height));
          activeGame.scale.resize(width, height);
          activeGame.renderer.resize(width, height);
          parent.dataset.phaserRenderWidth = String(width);
          parent.dataset.phaserRenderHeight = String(height);
          parent.dataset.phaserRendererWidth = String(activeGame.renderer.width);
          parent.dataset.phaserRendererHeight = String(activeGame.renderer.height);
        });
        resizeObserver.observe(parent);
      } catch (error) {
        if (cancelled) return;
        const message = error instanceof Error ? error.message : 'Phaser could not start.';
        errorRef.current(message);
      }
    };

    void startGame();

    return () => {
      cancelled = true;
      resizeObserver?.disconnect();
      canvas?.removeEventListener('webglcontextlost', onContextLost);
      unsubscribeInput();
      unsubscribeRuntime();
      bridgeRef.current = null;
      gameRef.current = null;
      if (game) game.destroy(true);
      bridge.dispose();
    };
  }, []);

  useEffect(() => {
    bridgeRef.current?.publishSnapshot(snapshot);
  }, [snapshot]);

  return (
    <div
      ref={hostRef}
      className="phaser-game-host"
      data-phaser-host="farm-village"
      data-phaser-status={runtimeState?.status ?? 'booting'}
      data-phaser-runtime={runtimeState?.status === 'ready' ? runtimeState.renderer : 'pending'}
      aria-busy={runtimeState?.status !== 'ready'}
    />
  );
}
