import React, { useState, useEffect, useRef } from 'react';

// Add global type declarations for kasmWebMIDI and kasm_rust
declare global {
  interface Window {
    kasmWebMIDI?: any;
    kasm_rust?: any;
  }
}

const Arpy: React.FC = () => {
  // State for MIDI device, channel, and playback status
  const [midiDevice, setMidiDevice] = useState('');
  const [midiChannel, setMidiChannel] = useState('0');
  const [playbackStatus, setPlaybackStatus] = useState('');

  // Dummy device list for now
  const [midiDevices, setMidiDevices] = useState([
    { value: '', label: 'Select MIDI Device...' }
  ]);
  const [isScriptsLoaded, setIsScriptsLoaded] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Dynamically load kasm_WASM_rust.js and kasm_webmidi.js
  useEffect(() => {
    const loadScript = (src: string) => {
      return new Promise<void>((resolve, reject) => {
        if (document.querySelector(`script[src='${src}']`)) return resolve();
        const script = document.createElement('script');
        script.src = src;
        script.async = true;
        script.onload = () => resolve();
        script.onerror = () => reject();
        document.body.appendChild(script);
      });
    };
    Promise.all([
      loadScript('https://kasmsdk.github.io/latest/kasm_WASM_rust_obs.js'),
      loadScript('https://kasmsdk.github.io/latest/kasm_webmidi_obs.js')
    ]).then(() => setIsScriptsLoaded(true));
  }, []);

  // Populate MIDI device list
  const updateMidiDeviceList = () => {
    if (!window.kasmWebMIDI || typeof window.kasmWebMIDI.getOutputDevices !== 'function') return;
    const outputs = window.kasmWebMIDI.getOutputDevices();
    const devices = [
      { value: '', label: 'Select MIDI Device...' },
      ...outputs.map((dev: any, i: number) => ({ value: dev.id || i.toString(), label: dev.name }))
    ];
    setMidiDevices(devices);
  };

  // Refresh MIDI devices when scripts are loaded
  useEffect(() => {
    if (isScriptsLoaded) {
      updateMidiDeviceList();
      // Optionally listen for device state changes
      if (window.kasmWebMIDI && typeof window.kasmWebMIDI.setCallback === 'function') {
        window.kasmWebMIDI.setCallback('onDeviceStateChange', updateMidiDeviceList);
      }
    }
  }, [isScriptsLoaded]);

  // Play/Stop MIDI
  const handlePlay = () => {
    if (window.kasmWebMIDI && typeof window.kasmWebMIDI.startPlayback === 'function') {
      window.kasmWebMIDI.startPlayback();
      setPlaybackStatus('Playing...');
    }
  };
  const handleStop = () => {
    if (window.kasmWebMIDI && typeof window.kasmWebMIDI.stopPlayback === 'function') {
      window.kasmWebMIDI.stopPlayback();
      setPlaybackStatus('Stopped');
    }
  };

  // State for root note and semitone offset
  const [rootNote, setRootNote] = useState(60); // MIDI note number
  const [rootNoteName, setRootNoteName] = useState('C4');
  const [semitoneOffset, setSemitoneOffset] = useState(0);

  // Note name input handlers
  const handleNoteNameBlur = () => {
    if (window.kasmWebMIDI && typeof window.kasmWebMIDI.noteNameToMidi === 'function') {
      const midiNum = window.kasmWebMIDI.noteNameToMidi(rootNoteName);
      if (typeof midiNum === 'number' && midiNum >= 0 && midiNum <= 127) {
        setRootNote(midiNum);
      }
    }
  };
  const handleNoteNameKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleNoteNameBlur();
  };

  // Canvas update (if kasm_rust is available)
  useEffect(() => {
    if (isScriptsLoaded && window.kasm_rust && typeof window.kasm_rust.update_canvas_data === 'function') {
      window.kasm_rust.update_canvas_data(rootNote, 100, false); // Example usage
    }
  }, [isScriptsLoaded, rootNote]);

  // State for arpeggiator mode and tempo
  const [arpMode, setArpMode] = useState('1');
  const [tempo, setTempo] = useState(120);

  // Arpeggiator mode options
  const arpModes = [
    { value: '1', label: 'arp:Up Classic ascending arpeggiator' },
    { value: '2', label: 'arp:Down Classic descending arpeggiator' },
    { value: '3', label: 'arp:Up/Down Pendulum arpeggiator' },
    { value: '4', label: 'arp:Down/Up Reverse pendulum arpeggiator' },
    { value: '5', label: 'arp:Random Random arpeggiator' },
    { value: '6', label: 'arp:Flow Flow arpeggiator' },
    { value: '7', label: 'arp:Up In Converging inward' },
    { value: '8', label: 'arp:Down In Converging inward from high' },
    { value: '9', label: 'arp:Expanding Up Expanding outward from center (up)' },
    { value: '10', label: 'arp:Expanding Down Expanding outward from center (down)' },
    { value: '11', label: 'arp:Low and Up Alternates lowest note with ascending' },
    { value: '12', label: 'arp:Low and Down Alternates lowest note with descending' },
    { value: '13', label: 'arp:Hi and Up Alternates highest note with ascending' },
    { value: '14', label: 'arp:Hi and Down Alternates highest note with descending' },
    { value: '15', label: 'arp:Chord Strum Plays all held notes simultaneously' },
    { value: '16', label: 'arp:Octave Spread Octave spreading' },
  ];


  // Helper for dial rotation (0-127 -> 0-270deg)
  const dialRotation = (value: number) => (value / 127) * 270;

  return (
    <div className="arpy-main-ui" data-testid="arpy-root" style={{ padding: '2em' }}>
      <h1 style={{ fontSize: '2.5em', marginBottom: '0.5em' }}>Arpy MIDI Arpeggiator Editor</h1>
      <p style={{ marginBottom: '2em' }}>
        WebMIDI Arpeggiator Editor Tool.<br />
        <em>Mechanism to view arpeggiators and edit them coming soon...</em>
      </p>
      {/* MIDI Device/Channel UI */}
      <div style={{ margin: '20px 0', padding: '10px', background: '#f9f9f9' }}>
        Connect to your MIDI device... (you might need a <a href="https://help.ableton.com/hc/en-us/articles/209774225-Setting-up-a-virtual-MIDI-bus" target="_blank">virtual MIDI bus</a>)
        <div style={{ marginBottom: '10px' }}>
          <label>
            <select
              value={midiDevice}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setMidiDevice(e.target.value)}
              style={{ padding: '3px', marginLeft: '10px' }}
            >
              {midiDevices.map((dev: { value: string; label: string }) => (
                <option key={dev.value} value={dev.value}>{dev.label}</option>
              ))}
            </select>
          </label>
          <button style={{ marginLeft: '10px', padding: '3px 8px' }} onClick={updateMidiDeviceList}>&lt;</button>
          <label style={{ marginLeft: '20px' }}>
            MIDI Channel:
            <select
              value={midiChannel}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setMidiChannel(e.target.value)}
              style={{ padding: '3px', width: '40px', marginLeft: '10px' }}
            >
              {[...Array(16)].map((_, i) => (
                <option key={i} value={i.toString()}>{i + 1}</option>
              ))}
            </select>
          </label>
          <button
            style={{ padding: '5px 15px', background: '#4CAF50', color: 'white', border: 'none', borderRadius: '3px', cursor: 'pointer', marginLeft: '10px' }}
            onClick={handlePlay}
          >&gt;</button>
          <button
            style={{ padding: '5px 15px', background: '#f44336', color: 'white', border: 'none', cursor: 'pointer', marginLeft: '10px' }}
            onClick={handleStop}
          >!</button>
          <span style={{ marginLeft: '15px', fontWeight: 'bold' }}>{playbackStatus}</span>
        </div>
      </div>
      {/* End MIDI Device/Channel UI */}
      {/* Canvas for visual output */}
      <canvas
        ref={canvasRef}
        id="kasmHTMLCanvas"
        width={150}
        height={150}
        style={{ width: '150px', height: '150px', border: '2px solid #333', background: '#000', display: 'block', margin: '10px 0' }}
      />
      {/* Arpeggiator mode and tempo */}
      <div style={{ margin: '20px 0', padding: '10px', background: '#f9f9f9' }}>
        <label>
          Arpeggiator Mode:
          <select
            value={arpMode}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setArpMode(e.target.value)}
            style={{ padding: '3px', marginLeft: '10px' }}
          >
            {arpModes.map((mode: { value: string; label: string }) => (
              <option key={mode.value} value={mode.value}>{mode.label}</option>
            ))}
          </select>
        </label>
        <br />
        <label style={{ marginTop: '10px', display: 'inline-block' }}>
          Tempo (BPM):
          <input
            type="number"
            value={tempo}
            min={20}
            max={999}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTempo(Number(e.target.value))}
            style={{ width: '100px', marginLeft: '10px' }}
          />
        </label>
      </div>
      {/* Root Note and Semitone Offset Controls */}
      <div style={{ margin: '20px 0', padding: '10px', background: '#f9f9f9' }}>
        <div style={{ display: 'inline-block', margin: '10px', textAlign: 'center' }}>
          <label>Root Note<br/>(inlet_0):</label><br />
          <div style={{ position: 'relative', width: '60px', height: '60px', margin: '5px auto' }}>
            <svg width="60" height="60">
              <circle cx="30" cy="30" r="25" fill="none" stroke="#333" strokeWidth="2" />
              <circle cx="30" cy="30" r="25" fill="none" stroke="#0af" strokeWidth="3"
                strokeDasharray="157" strokeDashoffset={157 - (rootNote / 127) * 157}
                transform="rotate(-90 30 30)" strokeLinecap="round" />
              <line x1="30" y1="10" x2="30" y2="18" stroke="#0af" strokeWidth="2"
                transform={`rotate(${dialRotation(rootNote)} 30 30)`} />
            </svg>
            <input type="range" min={0} max={127} value={rootNote}
              style={{ position: 'absolute', top: 0, left: 0, width: '60px', height: '60px', opacity: 0, cursor: 'pointer' }}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setRootNote(Number(e.target.value))} />
          </div>
          <div style={{ margin: '5px auto', width: '120px' }}>
            <input type="number" min={0} max={127} value={rootNote}
              style={{ width: '60px', marginRight: '5px' }}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setRootNote(Number(e.target.value))} />
            <input type="text" value={rootNoteName}
              style={{ width: '45px', textAlign: 'center', fontSize: '12px', color: '#666', padding: '2px' }}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setRootNoteName(e.target.value)}
              onBlur={handleNoteNameBlur}
              onKeyDown={handleNoteNameKeyDown}
              title="Type note name (e.g. C4, F#3, Bb5)" />
          </div>
        </div>
        <div style={{ display: 'inline-block', margin: '10px', textAlign: 'center' }}>
          <label>Semitone offset<br/>(inlet_1):</label><br />
          <div style={{ position: 'relative', width: '60px', height: '60px', margin: '5px auto' }}>
            <svg width="60" height="60">
              <circle cx="30" cy="30" r="25" fill="none" stroke="#333" strokeWidth="2" />
              <circle cx="30" cy="30" r="25" fill="none" stroke="#fa0" strokeWidth="3"
                strokeDasharray="157" strokeDashoffset={157 - ((semitoneOffset + 12) / 24) * 157}
                transform="rotate(-90 30 30)" strokeLinecap="round" />
              <line x1="30" y1="10" x2="30" y2="18" stroke="#fa0" strokeWidth="2"
                transform={`rotate(${((semitoneOffset + 12) / 24) * 270} 30 30)`} />
            </svg>
            <input type="range" min={-12} max={12} value={semitoneOffset}
              style={{ position: 'absolute', top: 0, left: 0, width: '60px', height: '60px', opacity: 0, cursor: 'pointer' }}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSemitoneOffset(Number(e.target.value))} />
          </div>
          <input type="number" min={-12} max={12} value={semitoneOffset}
            style={{ width: '60px', marginTop: '5px' }}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSemitoneOffset(Number(e.target.value))} />
        </div>
      </div>
    </div>
  );
};

export default Arpy;
