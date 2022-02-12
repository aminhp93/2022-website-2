import { useState } from 'react';
import { Button, Modal } from 'antd';

import Game from './Game/Game';
import Music from './Music/Music';
import Sport from './Sport/Sport';
import HistorialEvents from './HistorialEvents/HistorialEvents';
import MemorialSpeech from './MemorialSpeech/MemorialSpeech';
import Funny from './Funny/Funny';
import React from 'react';

export default function Utility() {
    const [modal, setModal] = useState(null)
    return <div onMouseDown={e => e.stopPropagation()}>
        <div>Utility</div>
        <Button onClick={() => setModal("Game")}>Game</Button>
        <br />
        <Button onClick={() => setModal("Music")}>Music</Button>
        <br />
        <Button onClick={() => setModal("Sport")}>Sport</Button>
        <br />
        <Button onClick={() => setModal("HistorialEvents")}>Historical Events</Button>
        <br />
        <Button onClick={() => setModal("MemorialSpeech")}>Memorial Speech</Button>
        <br />
        <Button onClick={() => setModal("Funny")}>Funny</Button>

        {
            modal && <Modal className="custom-modal" visible={true} onCancel={() => setModal(null)} footer={null}>
                {modal === "Game" && <Game />}
                {modal === "Music" && <Music />}
                {modal === "Sport" && <Sport />}
                {modal === "HistorialEvents" && <HistorialEvents />}
                {modal === "MemorialSpeech" && <MemorialSpeech />}
                {modal === "Funny" && <Funny />}
            </Modal>
        }
    </div>
}
