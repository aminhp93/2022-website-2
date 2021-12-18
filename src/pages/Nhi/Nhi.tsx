
import { JigsawPuzzle } from 'react-jigsaw-puzzle/lib'
import 'react-jigsaw-puzzle/lib/jigsaw-puzzle.css'
import React, { useCallback, useEffect, useRef, useState } from "react";
import ReactCanvasConfetti from "react-canvas-confetti";
import { Progress } from 'antd'
import { GiftOutlined, HeartOutlined } from '@ant-design/icons';
import moment from 'moment'

const img1 = require('./IMG_2426.PNG')
const img2 = require('./IMG_2432.JPG')

export default function Nhi() {

    const [solved1, setSolved1] = useState(false)
    const [solved2, setSolved2] = useState(false)
    const refAnimationInstance = useRef(null);
    const [intervalId, setIntervalId] = useState(null);

    const getInstance = useCallback((instance) => {
        refAnimationInstance.current = instance;
    }, []);

    const nextTickAnimation = useCallback(() => {
        if (refAnimationInstance.current) {
            refAnimationInstance.current(getAnimationSettings(0.1, 0.3));
            refAnimationInstance.current(getAnimationSettings(0.7, 0.9));
        }
    }, []);

    const startAnimation = useCallback(() => {
        if (!intervalId) {
            setIntervalId(setInterval(nextTickAnimation, 400));
        }
        setTimeout(() => {
            stopAnimation()
        }, 5 * 1000)
    }, [intervalId, nextTickAnimation]);

    const pauseAnimation = useCallback(() => {
        clearInterval(intervalId);
        setIntervalId(null);
    }, [intervalId]);

    const stopAnimation = useCallback(() => {
        clearInterval(intervalId);
        setIntervalId(null);
        refAnimationInstance.current && refAnimationInstance.current.reset();
    }, [intervalId]);

    useEffect(() => {
        return () => {
            clearInterval(intervalId);
        };
    }, [intervalId]);

    let percent = 0;
    if (solved1 || solved2) {
        percent = 50
    }
    if (solved1 && solved2) {
        percent = 100
    }

    const startDate = moment("2021-08-11", "YYYY-MM-DD")
    const now = moment();
    const diffCountDay = now.diff(startDate, 'days')
    const percentCountDay = Number((diffCountDay * 100 / (50 * 365)).toFixed(0))

    return <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
        <div style={{ height: "100px", background: 'lightpink', display: "flex", alignItems: 'center', justifyContent: "center", fontSize: "30px" }}>
            {`Chuc Nhi sinh nhat vui ve`}
        </div>
        <div style={{ flex: 1, display: "flex", background: 'lightpink', justifyContent: "space-between", padding: "0 200px", alignItems: "center" }}>
            <div style={{
                width: "300px",
                background: "lightpink",
            }}>
                <JigsawPuzzle
                    rows={3}
                    columns={3}
                    onSolved={() => {
                        setSolved1(true)
                        if (solved2) startAnimation()
                    }}
                    imageSrc={img1.default} />
                <div style={{ width: "100%", display: "flex", justifyContent: "center", marginTop: "20px" }}>
                    {solved1 ?

                        <Progress type="circle" percent={100} width={50} />

                        : <div style={{ fontSize: "24px" }}>Solve to unlock</div>
                    }
                </div>
            </div>
            <div>
                {solved1 && solved2
                    ? <div style={{ fontSize: "30px", color: "red", display: "flex", flexDirection: "column" }}><div>{`You are perfect couple`}</div> <HeartOutlined style={{ fontSize: '100px', color: 'red' }} /> </div>
                    : <div style={{ fontSize: "24px" }}><GiftOutlined style={{ fontSize: '150px', color: 'red' }} /></div>}
            </div>
            <div style={{
                width: "300px",
                background: "lightpink",
            }}>
                <JigsawPuzzle
                    rows={3}
                    columns={3}
                    onSolved={() => {
                        setSolved2(true)
                        if (solved1) startAnimation()
                    }}
                    imageSrc={img2.default} />
                <div style={{ width: "100%", display: "flex", justifyContent: "center", marginTop: "20px" }}>
                    {solved2
                        ? <Progress type="circle" percent={100} width={50} />
                        : <div style={{ fontSize: "24px" }}>Solve to unlock</div>
                    }
                </div>
            </div>
            {/* <div>
                <button onClick={startAnimation}>Start</button>
                <button onClick={pauseAnimation}>Pause</button>
                <button onClick={stopAnimation}>Stop</button>
            </div> */}
            <ReactCanvasConfetti refConfetti={getInstance} style={{
                position: "fixed",
                pointerEvents: "none",
                width: "100%",
                height: "100%",
                top: 0,
                left: 0
            }} />

        </div>

        <div style={{ height: "200px", background: "rgb(51 195 51)", display: "flex", justifyContent: "center", padding: "0 40px" }}>
            {solved1 && solved2 &&
                <div style={{ display: 'flex', alignItems: "center", justifyContent: "center" }}>
                    <Progress type="circle" percent={percentCountDay} format={percent => `${diffCountDay} Days`} />
                    <div style={{ marginTop: "10px" }}>{`Total: 50 Years`}</div>
                </div>
            }
        </div>
    </div>
}

function randomInRange(min: any, max: any) {
    return Math.random() * (max - min) + min;
}

function getAnimationSettings(originXA: any, originXB: any) {
    return {
        startVelocity: 30,
        spread: 360,
        ticks: 60,
        zIndex: 0,
        particleCount: 150,
        origin: {
            x: randomInRange(originXA, originXB),
            y: Math.random() - 0.2
        }
    };
}
