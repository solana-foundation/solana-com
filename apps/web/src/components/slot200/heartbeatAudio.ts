"use client";

/**
 * The audible heartbeat: one short low blip per block, same voicing as the
 * perp200 dashboard (190 Hz, 90 ms decay). Created on user gesture only.
 */
export class HeartbeatAudio {
  private ctx: AudioContext | null = null;

  get on(): boolean {
    return this.ctx !== null;
  }

  toggle(): boolean {
    if (this.ctx) {
      void this.ctx.close();
      this.ctx = null;
      return false;
    }
    this.ctx = new AudioContext();
    return true;
  }

  tick(): void {
    const ctx = this.ctx;
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.frequency.value = 190;
    gain.gain.setValueAtTime(0.12, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.09);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.1);
  }

  dispose(): void {
    if (this.ctx) void this.ctx.close();
    this.ctx = null;
  }
}
