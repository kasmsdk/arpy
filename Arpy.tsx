import React, { useState, useRef } from 'react';
import MidiSelector from '../latest/MidiSelector';
import ArpyCanvas from '../latest/ArpyCanvas';
import type { ArpyCanvasHandle } from '../latest/ArpyCanvas';
import LatestDemoArpy from '../src/components/LatestDemoArpy';
import MidiKeyboard from '../src/components/MidiKeyboard';

// Extend window type for inlet_5_emanator
declare global {
    interface Window {
        inlet_5_emanator?: string;
    }
}

const NUM_CANVASES = 10; // Easily changeable for arbitrary number

const Arpy: React.FC = () => {
    // Store MIDI data in state
    const [midiData, setMidiData] = useState<{ note: number; velocity: number; isCC: boolean } | null>(null);
    // Array of refs for ArpyCanvas, initialized once
    const refsArray: React.RefObject<ArpyCanvasHandle | null>[] = Array.from({ length: NUM_CANVASES }, () => React.createRef<ArpyCanvasHandle>());
    const arpyCanvasRefs = useRef(refsArray);
    // Handler for note on
    const handleNoteOn = (note: number, velocity: number) => {
        window.inlet_5_emanator = '1';
        setMidiData({ note, velocity, isCC: false });
        arpyCanvasRefs.current.forEach(ref => {
            if (ref.current) {
                ref.current.callKasmFunction('update_canvas_data', { pitch: note, velocity, cc: false });
                ref.current.postHello();
            }
        });
    };
    // Handler for note off
    const handleNoteOff = (note: number) => {
        setMidiData({ note, velocity: 0, isCC: false });
        arpyCanvasRefs.current.forEach(ref => {
            if (ref.current) {
                ref.current.callKasmFunction('update_canvas_data', { pitch: note, velocity: 0, cc: false });
            }
        });
    };
    return (
        <div className="kasm-landing-container">
            <h1>Arpy arpeggio pattern Browser and Editor Tool</h1>
            <p>
                Arpy is a collection of arpeggios that play whilst keys are held or are latched to keep playing out</p>
            <p>
                Pattern gallery/browser<br/>
                {arpyCanvasRefs.current.map((ref, idx) => (
                    <ArpyCanvas
                        key={idx}
                        ref={ref}
                        title={`Arpy Canvas ${idx + 1}`}
                        midiData={midiData}
                    />
                ))}
            </p>
            <MidiSelector/>
            <div style={{ display: 'flex', justifyContent: 'center', margin: '20px 0' }}>
                <MidiKeyboard onNoteOn={handleNoteOn} onNoteOff={handleNoteOff} />
            </div>

            <LatestDemoArpy />

        </div>
    );
};

export default Arpy;
