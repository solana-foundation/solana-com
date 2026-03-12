interface WaterEffectOptions {
  damping?: number;
  pressure?: number;
  resolution?: number;
  wakeLength?: number;
  wakeWidth?: number;
}

export class WaterEffect {
  width: number;
  height: number;
  damping: number;
  pressure: number;
  resolution: number;
  wakeLength: number;
  wakeWidth: number;
  rippleMap1: Int16Array;
  rippleMap2: Int16Array;
  texture: Uint8ClampedArray;
  oldIndex: number;
  newIndex: number;
  frame: number;
  lastX: number;
  lastY: number;

  constructor(width: number, height: number, options: WaterEffectOptions = {}) {
    this.width = width;
    this.height = height;
    this.damping = options.damping || 10;
    this.pressure = options.pressure || 512;
    this.resolution = options.resolution || 1;
    this.wakeLength = options.wakeLength || 20;
    this.wakeWidth = options.wakeWidth || 5;
    this.lastX = -1;
    this.lastY = -1;

    const size = width * height;
    this.rippleMap1 = new Int16Array(size);
    this.rippleMap2 = new Int16Array(size);
    this.texture = new Uint8ClampedArray(size * 4);
    this.oldIndex = 0;
    this.newIndex = 1;
    this.frame = 0;
  }

  ripple(x: number, y: number, radius = 5, strength = this.pressure) {
    for (let j = y - radius; j <= y + radius; j++) {
      for (let i = x - radius; i <= x + radius; i++) {
        if (i >= 0 && i < this.width && j >= 0 && j < this.height) {
          const dx = i - x;
          const dy = j - y;
          const distSq = dx * dx + dy * dy;

          if (distSq < radius * radius) {
            const falloff = Math.exp(-distSq / (radius * radius));
            const index = j * this.width + i;
            this.rippleMap1[index] =
              (this.rippleMap1[index] ?? 0) + strength * falloff;
          }
        }
      }
    }
  }

  disturb(x: number, y: number, strength = this.pressure) {
    if (this.lastX === -1 || this.lastY === -1) {
      this.lastX = x;
      this.lastY = y;
      return;
    }

    const dx = x - this.lastX;
    const dy = y - this.lastY;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < 1) {
      return;
    }

    const dirX = dx / distance;
    const dirY = dy / distance;

    for (let i = 0; i < this.wakeLength; i++) {
      const t = i / this.wakeLength;
      const wakeX = this.lastX + dx * t;
      const wakeY = this.lastY + dy * t;

      for (let j = -this.wakeWidth; j <= this.wakeWidth; j++) {
        const perpX = wakeX - dirY * j;
        const perpY = wakeY + dirX * j;

        if (
          perpX >= 0 &&
          perpX < this.width &&
          perpY >= 0 &&
          perpY < this.height
        ) {
          const index = Math.floor(perpY) * this.width + Math.floor(perpX);
          const falloff = Math.exp(
            -(j * j) / (this.wakeWidth * this.wakeWidth),
          );
          const timeFalloff = Math.exp(-i / (this.wakeLength * 0.5));
          this.rippleMap1[index] =
            (this.rippleMap1[index] ?? 0) + strength * falloff * timeFalloff;
        }
      }
    }

    this.lastX = x;
    this.lastY = y;
  }

  update() {
    const { width, height, rippleMap1, rippleMap2, damping } = this;

    for (let y = 1; y < height - 1; y += this.resolution) {
      for (let x = 1; x < width - 1; x += this.resolution) {
        const i = y * width + x;
        rippleMap2[i] =
          (((rippleMap1[i - 1] ?? 0) +
            (rippleMap1[i + 1] ?? 0) +
            (rippleMap1[i - width] ?? 0) +
            (rippleMap1[i + width] ?? 0)) >>
            1) -
          (rippleMap2[i] ?? 0);

        rippleMap2[i] =
          (rippleMap2[i] ?? 0) - ((rippleMap2[i] ?? 0) >> damping);
      }
    }

    for (let y = 1; y < height - 1; y++) {
      for (let x = 1; x < width - 1; x++) {
        const i = y * width + x;
        rippleMap2[i] =
          ((rippleMap2[i] ?? 0) +
            (rippleMap2[i - 1] ?? 0) +
            (rippleMap2[i + 1] ?? 0) +
            (rippleMap2[i - width] ?? 0) +
            (rippleMap2[i + width] ?? 0)) /
          5;
      }
    }

    [this.rippleMap1, this.rippleMap2] = [this.rippleMap2, this.rippleMap1];
  }

  render(sourceImageData: ImageData) {
    const { width, height, rippleMap1, texture } = this;
    const source = sourceImageData.data;
    const result = new Uint8ClampedArray(source.length);

    texture.set(source);

    for (let y = 1; y < height - 1; y++) {
      for (let x = 1; x < width - 1; x++) {
        const i = y * width + x;
        const offsetX =
          ((rippleMap1[i - 1] ?? 0) - (rippleMap1[i + 1] ?? 0)) >> 3;
        const offsetY =
          ((rippleMap1[i - width] ?? 0) - (rippleMap1[i + width] ?? 0)) >> 3;

        let dx = x + offsetX;
        let dy = y + offsetY;

        dx = Math.min(width - 1, Math.max(0, dx));
        dy = Math.min(height - 1, Math.max(0, dy));

        const srcIndex = (dy * width + dx) * 4;
        const dstIndex = (y * width + x) * 4;

        result[dstIndex] = texture[srcIndex] ?? 0;
        result[dstIndex + 1] = texture[srcIndex + 1] ?? 0;
        result[dstIndex + 2] = texture[srcIndex + 2] ?? 0;
        result[dstIndex + 3] = 255;
      }
    }

    sourceImageData.data.set(result);
    return sourceImageData;
  }

  clear() {
    this.rippleMap1.fill(0);
    this.rippleMap2.fill(0);
  }
}
