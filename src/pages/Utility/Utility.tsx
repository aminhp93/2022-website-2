import { useState } from 'react';
import { Button, Modal } from 'antd';

import Game from './Game/Game';
import Music from './Music/Music';

export default function Utility() {
    const [modal, setModal] = useState(null)
    return <div onMouseDown={e => e.stopPropagation()}>
        <div>Utility</div>
        <Button onClick={() => setModal("Game")}>Game</Button>
        <br />
        <Button onClick={() => setModal("Music")}>Music</Button>
        <Button onClick={() => setModal("Music")}>Sport</Button>
        {
            modal && <Modal className="custom-modal" visible={true} onCancel={() => setModal(null)} footer={null}>
                {modal === "Game" && <Game />}
                {modal === "Music" && <Music />}
            </Modal>
        }
    </div>
}
