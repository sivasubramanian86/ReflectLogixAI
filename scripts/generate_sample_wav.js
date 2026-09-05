import fs from 'fs';
import path from 'path';

const sampleRate = 44100;
const duration = 5; // seconds
const numSamples = sampleRate * duration;
const buffer = Buffer.alloc(44 + numSamples * 2);

// RIFF header
buffer.write('RIFF', 0);
buffer.writeUInt32LE(36 + numSamples * 2, 4);
buffer.write('WAVE', 8);
buffer.write('fmt ', 12);
buffer.writeUInt32LE(16, 16); // SubChunk1Size
buffer.writeUInt16LE(1, 20); // PCM
buffer.writeUInt16LE(1, 22); // Mono
buffer.writeUInt32LE(sampleRate, 24);
buffer.writeUInt32LE(sampleRate * 2, 28); // ByteRate
buffer.writeUInt16LE(2, 32); // BlockAlign
buffer.writeUInt16LE(16, 34); // BitsPerSample
buffer.write('data', 36);
buffer.writeUInt32LE(numSamples * 2, 40);

for (let i = 0; i < numSamples; i++) {
  const t = i / sampleRate;
  // Harmonic meditative chime frequencies
  const freq1 = 432;
  const freq2 = 528;
  const env = Math.exp(-t * 0.6) * (0.8 + 0.2 * Math.sin(Math.PI * t));
  const sampleVal = 0.5 * Math.sin(2 * Math.PI * freq1 * t) + 0.3 * Math.sin(2 * Math.PI * freq2 * t);
  const int16 = Math.max(-32768, Math.min(32767, Math.floor(sampleVal * env * 22000)));
  buffer.writeInt16LE(int16, 44 + i * 2);
}

const outDir = path.resolve('apps/web/public/assets');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}
const outPath = path.join(outDir, 'sample_voice_note.wav');
fs.writeFileSync(outPath, buffer);
console.log('Successfully created sample_voice_note.wav at', outPath, 'Bytes:', buffer.length);
