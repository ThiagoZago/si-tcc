import { useState } from 'react';
import { Link } from 'react-router-dom';

function BtnComponent(props){

    const [isHovered, setIsHovered] = useState(false);

    const bntCustom = {
        color: isHovered ? '#fff' : `${props.textColor}`,
        border: `1px solid ${props.borderColor}`,
        transform: isHovered ? 'scale(1.05)' : 'scale(1)',
        background: isHovered ? '#5f0b0b' : `${props.backgroundColor}`,
        borderRadius: '100px',
        textTransform: 'uppercase',
        transition:'background 0.5s, transform 0.5s, color 0.5s',
        margin:'.8em 1.5em',
        padding: '10px 20px',
        fontWeight:'600',
    };


    return(
        <Link to={props.to} style={bntCustom} className="btn btn-md" onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>{props.textButton}</Link>
    );
}

export default BtnComponent;