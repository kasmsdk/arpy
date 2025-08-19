import React from 'react';
import MidiSelector from '../latest/MidiSelector';
import ArpyCanvas from '../latest/ArpyCanvas';
import NewsNewFeatures from '../src/components/NewsNewFeatures';
import LatestDemo from '../src/components/LatestDemo';
import MidiKeyboard from '../src/components/MidiKeyboard';

const Arpy: React.FC = () => {
    // Handler for note on
    const handleNoteOn = (note: number, velocity: number) => {
        window.inlet_5_emanator = 'Arpy';
        if (typeof window.update_canvas_data === 'function') {
            window.update_canvas_data({ note, velocity });
        }
    };
    // Handler for note off
    const handleNoteOff = (note: number) => {
        if (typeof window.update_canvas_data === 'function') {
            window.update_canvas_data({ note, velocity: 0 });
        }
    };
    return (
        <div className="kasm-landing-container">
            <h1>Arpy arpeggio pattern Browser and Editor Tool</h1>
            <p>
                Arpy is a collection of arpeggios that are play whilst keys are held or are latched to keep playing out</p>
            <p>
                Arpy sequence browser/gallery and web based editor tools are coming here soon...</p>
            <div style={{ margin: '20px 0' }}>
                <p>
                    Connect to your MIDI device... (you might need a <a href="https://help.ableton.com/hc/en-us/articles/209774225-Setting-up-a-virtual-MIDI-bus" target="_blank">virtual MIDI bus</a>)
                    <MidiSelector />
                </p>
            </div>
            <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', margin: '40px 0' }}>
                <ArpyCanvas title="Arpy Canvas 1" />
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', margin: '20px 0' }}>
                <MidiKeyboard onNoteOn={handleNoteOn} onNoteOff={handleNoteOff} />
            </div>

            <NewsNewFeatures />
            <LatestDemo />


        </div>
    );
};

export default Arpy;
