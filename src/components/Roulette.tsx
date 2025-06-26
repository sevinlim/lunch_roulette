import Button from '@mui/material/Button';
import { useEffect, useRef, useState } from 'react';
import type { RouletteProps } from '../models/RouletteProps';
import './Roulette.css';

function generateRouletteColors(count: number) {
    const colors = [];
    for (let i = 0; i < count; i++) {
        const hue = Math.round((360 / count) * i);
        colors.push(hslToHex(hue, 100, 50));
    }
    return colors;
}

function hslToHex(h: number, s: number, l: number) {
    s /= 100;
    l /= 100;
    const k = (n: number) => (n + h / 30) % 12;
    const a = s * Math.min(l, 1 - l);
    const f = (n: number) =>
        Math.round(255 * (l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)))));
    return `#${f(0).toString(16).padStart(2, '0')}${f(8).toString(16).padStart(2, '0')}${f(4).toString(16).padStart(2, '0')}`;
}


function Roulette(props: RouletteProps) {
    const [spinning, setSpinning] = useState(false);
    const [rotation, setRotation] = useState(0);
    const [winner, setWinner] = useState("");
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const sectors = props.placeList;
    const numSectors = sectors.length;

    const colors = generateRouletteColors(numSectors);


    let bodyStyle = getComputedStyle(window.document.body);
    const wheelWidth = parseInt(bodyStyle.width.replace("px", ""), 10) / 2;
    const indicatorWidth = wheelWidth / 20;
    const indicatorHeight = indicatorWidth / 2;

    useEffect(() => {
        if (canvasRef.current) {
            drawWheel();
        }
    }, [sectors, rotation]);

    const drawWheel = () => {
        const canvas = canvasRef.current!;
        const ctx = canvas.getContext('2d')!;
        const radius = canvas.width / 2;
        const sliceAngle = (2 * Math.PI) / numSectors;

        // Clear previous drawing
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.translate(radius, radius);
        ctx.rotate(-rotation * (Math.PI / 180));

        // Draw sectors
        for (let i = 0; i < numSectors; i++) {
            const startAngle = i * sliceAngle;
            const endAngle = (i + 1) * sliceAngle;
            const sectorName = sectors[i]?.name || '';
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.arc(0, 0, radius, startAngle, endAngle);
            ctx.closePath();
            ctx.fillStyle = colors[i % colors.length];
            ctx.fill();


            // Draw the name in the sector
            ctx.save();
            ctx.rotate((startAngle + endAngle) / 2);
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillStyle = 'black';
            ctx.font = '16px Arial';
            ctx.shadowColor = 'rgba(0, 0, 0, 0.7)';
            ctx.shadowOffsetX = 1;
            ctx.shadowOffsetY = 1;
            ctx.shadowBlur = 3;
            ctx.strokeStyle = 'white';
            ctx.lineWidth = 5;
            ctx.lineJoin = 'round';
            ctx.strokeText(sectorName, radius * 0.5, 0);
            ctx.fillText(sectorName, radius * 0.5, 0);
            ctx.restore();
        }

        ctx.rotate(rotation * (Math.PI / 180)); // Reset rotation
        ctx.translate(-radius, -radius);

        // Draw the static indicator
        ctx.save();
        ctx.translate(canvas.width, canvas.height / 2);
        ctx.beginPath();
        ctx.moveTo(0, -indicatorHeight / 2);
        ctx.lineTo(-indicatorWidth, 0);
        ctx.lineTo(0, indicatorHeight / 2);
        ctx.lineTo(0, -indicatorHeight / 2);
        ctx.closePath();
        ctx.fillStyle = 'black';
        ctx.fill();
        ctx.restore();
    };

    const startSpin = () => {
        if (spinning) return;
        setSpinning(true);
        setWinner("")

        // Set the number of full rotations and calculate final rotation
        const numFullRotations = (Math.random() * 5) + 5; // Between 5 and 10 full rotations
        const totalRotation = numFullRotations * 360;
        const finalRotation = (rotation - totalRotation) % 360;

        const spinDuration = 6000;
        const easing = (t: number) => {
            // Ease-out cubic
            return 1 - Math.pow(1 - t, 3);
        };

        let startTime: number;

        const animate = (time: number) => {
            if (!startTime) startTime = time;
            const elapsed = time - startTime;
            const t = Math.min(elapsed / spinDuration, 1);
            const easeT = easing(t);
            const currentRotation = rotation - (totalRotation * easeT);

            setRotation(currentRotation);

            if (elapsed < spinDuration) {
                requestAnimationFrame(animate);
            } else {
                setSpinning(false);
                determineWinner(finalRotation);
            }
        };

        requestAnimationFrame(animate);
    };

    const determineWinner = (finalRotation: number) => {
        const sliceAngle = 360 / numSectors;
        const normalizedRotation = ((finalRotation % 360) + 360) % 360;
        const winningSector = Math.floor(normalizedRotation / sliceAngle);

        setWinner(props.placeList[winningSector]?.name);
    };

    return (
        <div className='roulette-container'>
            <div className='winner-display'>{winner}</div>
            <canvas
                ref={canvasRef}
                width={wheelWidth}
                height={wheelWidth}
                style={{ borderRadius: '50%', border: '2px solid black' }}
            />
            <hr />
            <Button variant='contained' onClick={startSpin}>
                Spin Roulette
            </Button>
        </div>
    );
}

export default Roulette;