import React from 'react';
import MidiSelector from '../components/MidiSelector';
import ArpyCanvas from './ArpyCanvas';

const Arpy: React.FC = () => {
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
                <ArpyCanvas title="Arpy Canvas 2" />
                <ArpyCanvas title="Arpy Canvas 3" />
            </div>


        </div>
    );
};

export default Arpy;
