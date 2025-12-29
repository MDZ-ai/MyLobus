export const playSound = (type: 'click' | 'hover' | 'success' | 'error' | 'scan' | 'pay') => {
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
    
    // Envelope for "glassy" sound (fast attack, exponential decay)
    gain.gain.setValueAtTime(0, startTime);
    gain.gain.linearRampToValueAtTime(vol, startTime + 0.005);
    gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
    
    osc.start(startTime);
    osc.stop(startTime + duration);
  };

  switch (type) {
    case 'click':
      // High pitch, short, like tapping a crystal glass
      createOsc(1200, 'sine', now, 0.08, 0.05);
      break;
    case 'hover':
      // Very subtle air puff
      createOsc(800, 'sine', now, 0.03, 0.01);
      break;
    case 'success':
      // Bright major triad (C6, E6, G6)
      createOsc(1046.50, 'sine', now, 0.4, 0.05); 
      createOsc(1318.51, 'sine', now + 0.05, 0.4, 0.05);
      createOsc(1567.98, 'sine', now + 0.1, 0.6, 0.05);
      break;
    case 'scan':
      // Futuristic light scanning flutter
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, now);
      osc.frequency.linearRampToValueAtTime(1500, now + 0.5);
      
      // Tremolo effect for flutter
      const lfo = ctx.createOscillator();
      lfo.frequency.value = 15;
      const lfoGain = ctx.createGain();
      lfoGain.gain.value = 500;
      lfo.connect(lfoGain.gain);
      
      gain.gain.setValueAtTime(0.05, now);
      gain.gain.linearRampToValueAtTime(0, now + 0.5);
      
      osc.start(now);
      osc.stop(now + 0.5);
      break;
    case 'pay':
      // "Swoosh" up, clean energy
      createOsc(400, 'sine', now, 0.4, 0.1);
      createOsc(800, 'triangle', now, 0.4, 0.05);
      break;
    case 'error':
      // Soft thud, not jarring
      createOsc(150, 'triangle', now, 0.2, 0.1);
      createOsc(140, 'sine', now + 0.05, 0.2, 0.1);
      break;
  }
};