import React from 'react';
import CloseIcon from '@material-ui/icons/Close';


const modals_styles = {
    position: 'fixed',
    top: '15px',
    padding: '40px',
    left: '50%',
    transform: 'translate(-50%,0)',
    zIndex: 1000
}


const OVER_BACKGROUND = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.4)',
    zIndex: 1000
}   




const Createboard = ({ open, children, close }) => {
    if (!open) {
        return null;
    }
    return (
        <>
            <div style={OVER_BACKGROUND} onClick={close} > </div>
            <div className="modals" style={modals_styles}>
                <div className="content" >
                    <div className="close" onClick={close}><CloseIcon/>
                    </div>{children}
                </div>
            </div>
        </>
    )
}

export default Createboard;