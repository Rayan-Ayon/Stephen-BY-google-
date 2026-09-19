class PCMProcessor extends AudioWorkletProcessor {
  constructor(options) {
    super();
    this.targetSampleRate = 16000;
    this.nativeSampleRate = sampleRate; 
    this.needsResample = this.nativeSampleRate !== this.targetSampleRate;
    this.resampleRatio = this.targetSampleRate / this.nativeSampleRate;
    this.chunkSize = 4096;
    this.buffer = [];
  }

  resample(float32Input) {
    if (!this.needsResample) return float32Input;
    const outputLength = Math.floor(float32Input.length * this.resampleRatio);
    const output = new Float32Array(outputLength);
    for (let i = 0; i < outputLength; i++) {
      const srcIndex = i / this.resampleRatio;
      const idxLow = Math.floor(srcIndex);
      const idxHigh = Math.min(idxLow + 1, float32Input.length - 1);
      const frac = srcIndex - idxLow;
      output[i] = float32Input[idxLow] * (1 - frac) + float32Input[idxHigh] * frac;
    }
    return output;
  }

  floatTo16BitPCM(float32Array) {
    const buffer = new ArrayBuffer(float32Array.length * 2);
    const view = new DataView(buffer);
    for (let i = 0; i < float32Array.length; i++) {
      // Clamp to prevent overflow distortion
      let s = Math.max(-1, Math.min(1, float32Array[i]));
      // Asymmetric scale for 16-bit PCM
      s = s < 0 ? s * 0x8000 : s * 0x7FFF;
      // 'true' forces Little-Endian (Required by Gemini)
      view.setInt16(i * 2, s, true); 
    }
    return buffer;
  }

  process(inputs) {
    const input = inputs[0];
    if (!input || !input[0]) return true;
    
    const channelData = input[0]; 
    const resampled = this.resample(channelData);
    
    for (let i = 0; i < resampled.length; i++) {
      this.buffer.push(resampled[i]);
    }
    
    while (this.buffer.length >= this.chunkSize) {
      const chunk = new Float32Array(this.buffer.splice(0, this.chunkSize));
      const pcm16Buffer = this.floatTo16BitPCM(chunk);
      this.port.postMessage(pcm16Buffer, [pcm16Buffer]);
    }
    return true;
  }
}
registerProcessor('pcm-processor', PCMProcessor);
