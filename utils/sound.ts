export const playSound = (type: 'click' | 'hover' | 'success' | 'error' | 'scan' | 'pay' | 'logout') => {
  const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
  if (!AudioContext) return;
  
  const ctx = new AudioContext();
  const now = ctx.currentTime;

  const createOsc = (freq: number, type: OscillatorType, startTime: number, duration: number, vol: number) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.type = type;
    osc.frequency.setValueAtTime(freq, startTime);
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    // Smooth envelope
    gain.gain.setValueAtTime(0, startTime);
    gain.gain.linearRampToValueAtTime(vol, startTime + (duration * 0.1));
    gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
    
    osc.start(startTime);
    osc.stop(startTime + duration);
  };

  switch (type) {
    case 'click':
      // Softer, woody/bubble click
      createOsc(800, 'sine', now, 0.05, 0.1);
      break;
    case 'hover':
      // Very high, barely audible air
      createOsc(1200, 'sine', now, 0.02, 0.02);
      break;
    case 'success':
      // Modern UI Success Chime (Major 7th ish)
      createOsc(600, 'sine', now, 0.2, 0.1);
      createOsc(900, 'sine', now + 0.05, 0.2, 0.1);
      createOsc(1200, 'sine', now + 0.1, 0.4, 0.1);
      break;
    case 'scan':
      // Digital Flutter
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = 'square';
      osc.frequency.setValueAtTime(400, now);
      osc.frequency.linearRampToValueAtTime(1200, now + 0.2);
      
      gain.gain.setValueAtTime(0.05, now);
      gain.gain.linearRampToValueAtTime(0, now + 0.2);
      
      osc.start(now);
      osc.stop(now + 0.2);
      break;
    case 'pay':
      // Cash Register / Coin drop feeling
      createOsc(1500, 'sine', now, 0.1, 0.1);
      createOsc(2000, 'sine', now + 0.05, 0.3, 0.1);
      break;
    case 'error':
      // Soft low deny
      createOsc(150, 'sawtooth', now, 0.15, 0.1);
      createOsc(120, 'sawtooth', now + 0.1, 0.15, 0.1);
      break;
    case 'logout':
      // Power down / Swoosh out
      createOsc(600, 'sine', now, 0.2, 0.1);
      createOsc(300, 'sine', now + 0.1, 0.2, 0.1);
      break;
  }
};