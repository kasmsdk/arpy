import React from 'react';
import MidiSelector from '../components/MidiSelector';

const Arpy: React.FC = () => {
    return (
        <div style={{ padding: '2em' }}>
            WebMIDI Arpy arpeggios pattern Browser and Editor Tool.<br />
            <p className="sunken-paragraph">
                Arpy is a collection of arpeggios that are play whilst keys are held or are latched to keep playing out</p>
            <div style={{ margin: '20px 0' }}>
                <div>
                    Connect to your MIDI device... (you might need a <a href="https://help.ableton.com/hc/en-us/articles/209774225-Setting-up-a-virtual-MIDI-bus" target="_blank">virtual MIDI bus</a>)
                    <MidiSelector />
                </div>
            </div>
            <div style={{ marginTop: '2rem', width: '100%', display: 'flex', justifyContent: 'center' }}>
                <iframe
                    src="https://kasmsdk.github.io/latest/arpy.html"
                    title="Kasm Demo"
                    width="90%"
                    height="1024"
                    style={{ border: '2px solid #ccc', borderRadius: '12px', boxShadow: '0 2px 16px rgba(0,0,0,0.12)' }}
                    allowFullScreen
                />
            </div>

        </div>
    );
};

export default Arpy;
