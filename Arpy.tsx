import React, { useState } from 'react';
import MidiSelector from '../latest/MidiSelector';
import ArpyCanvas from '../latest/ArpyCanvas';
import LatestDemoArpy from '../src/components/LatestDemoArpy';
import MidiKeyboard from '../src/components/MidiKeyboard';

const Arpy: React.FC = () => {
    // Store MIDI data in state
    const [midiData, setMidiData] = useState<{ note: number; velocity: number; isCC: boolean } | null>(null);
    // Handler for note on
    const handleNoteOn = (note: number, velocity: number) => {
        window.inlet_5_emanator = 'Arpy';
        setMidiData({ note, velocity, isCC: false });
        // if (typeof kasm_rust !== 'undefined' && typeof kasm_rust.update_canvas_data === 'function') {
        //     kasm_rust.update_canvas_data(note, velocity, false);
        // }
    };
    // Handler for note off
    const handleNoteOff = (note: number) => {
        setMidiData({ note, velocity: 0, isCC: false });
        // if (typeof kasm_rust !== 'undefined' && typeof kasm_rust.update_canvas_data === 'function') {
        //     kasm_rust.update_canvas_data(note, 0, false);
        // }
    };
    return (
        <div className="kasm-landing-container">
            <h1>Arpy arpeggio pattern Browser and Editor Tool</h1>
            <p>
                Arpy is a collection of arpeggios that are play whilst keys are held or are latched to keep playing out</p>
            <p>
                Pattern gallery/browser<br/>
                <ArpyCanvas title="Arpy Canvas 1" midiData={midiData} />
                <ArpyCanvas title="Arpy Canvas 2" midiData={midiData} />
                <ArpyCanvas title="Arpy Canvas 3" midiData={midiData} />
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
