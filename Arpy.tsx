import React, { useState, useRef } from 'react';
import MidiSelector from '../latest/MidiSelector';
import ArpyCanvas from '../latest/ArpyCanvas';
import type { ArpyCanvasHandle } from '../latest/ArpyCanvas';
import LatestDemo from '../src/components/LatestDemo';
import MidiKeyboard from '../src/components/MidiKeyboard';

// Extend window type for inlet_5_emanator
declare global {
    interface Window {
        inlet_5_emanator?: string;
    }
}

const NUM_CANVASES = 16; // Easily changeable for arbitrary number

const Arpy: React.FC = () => {
    // Store MIDI data in state
    const [midiData, setMidiData] = useState<{ note: number; velocity: number; isCC: boolean } | null>(null);
    // Array of refs for ArpyCanvas, initialized once
    const refsArray: React.RefObject<ArpyCanvasHandle | null>[] = Array.from({ length: NUM_CANVASES }, () => React.createRef<ArpyCanvasHandle>());
    const arpyCanvasRefs = useRef(refsArray);
    // Handler for note on
    const handleNoteOn = (note: number, velocity: number) => {
        setMidiData({ note, velocity, isCC: false });
        arpyCanvasRefs.current.forEach(ref => {
            if (ref.current) {
                ref.current.setInlets( { pitch: note, velocity, cc: false });

                // This will also show the current note played
                //ref.current.callKasmFunction('update_canvas_data', { pitch: note, velocity, cc: false });
            }
        });
    };
    // Simulate MIDI note-on for middle C on mount and repeat every 5 seconds
    React.useEffect(() => {
        setTimeout(() => {
            handleNoteOn(48, 100); // C
            handleNoteOn(52, 100); // E
            handleNoteOn(55, 100); // G
            handleNoteOn(60, 100); // C (octave)
            handleNoteOn(64, 100); // E (octave)
            handleNoteOn(67, 100); // G (octave)
        }, 1000);
    }, []);
    // Handler for note off
    const handleNoteOff = (note: number) => {
        setMidiData({ note, velocity: 0, isCC: false });
        arpyCanvasRefs.current.forEach(ref => {
            if (ref.current) {
                ref.current.setInlets({ pitch: note, velocity: 0, cc: false });

                // This will also show the current note played (off)
                // ref.current.callKasmFunction('update_canvas_data', { pitch: note, velocity: 0, cc: false });
            }
        });
    };
    return (
        <div className="kasm-landing-container">
            <h1>Arpy MIDI Pattern Browser and Editor Tool</h1>
            <p>
                Arpy is a collection of MIDI note patterns with CC articulations that continue playing, the concept
                of emanators is used in other contexts such as arpeggiators, and loops as they are all have similar results</p>

            <LatestDemo />

            <p style={{ maxHeight: '400px', overflowY: 'auto', display: 'block' }}>
                Pattern gallery/browser<br/>
                {arpyCanvasRefs.current.map((ref, idx) => (
                    <ArpyCanvas
                        key={idx}
                        ref={ref}
                        title={`Arpy ${idx + 1}`}
                        midiData={midiData}
                        inlet_5_emanator={idx}
                    />
                ))}
            </p>
            <MidiSelector/>
            <div style={{ display: 'flex', justifyContent: 'center', margin: '20px 0' }}>
                <MidiKeyboard onNoteOn={handleNoteOn} onNoteOff={handleNoteOff} />
            </div>

            <p>
                What is an emanator? Effectively it is a Rust function that is called upon to generate notes, each Arpy
                function has some common parameters like the root note and velocity to go on and a couple of generic encoders
                that change purpose depending on what the emanator is expected to do</p>

            <p>
                The file structure of Arpys is as follows, again there is no right or wrong way here...
                <ul>
                    <li>arpeggiation.rs</li>
                    <li>experimental.rs</li>
                    <li>lfo.rs</li>
                    <li>mathematical.rs</li>
                    <li>mod.rs</li>
                    <li>responsorial.rs</li>
                    <li>spatial.rs</li>
                    <li>drumpattern.rs</li>
                    <li>harmonic.rs</li>
                    <li>loopcounterpoint.rs</li>
                    <li>melodic.rs</li>
                    <li>progressions.rs</li>
                    <li>rhythmic.rs</li>
                </ul>
            </p>
        </div>
    );
};

export default Arpy;
