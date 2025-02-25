import React from 'react';
import { CustomIcon } from '@components/datacomponents/CustomIcon';

export declare type IconInputProps = {
    icon: string;
    text: string;
    iconColor: string;
    activeColor:string;
    onClick: () => void;
    className?: string; 
};

const LeftIconButton: React.FC<IconInputProps> = ({ icon, text, onClick, className, iconColor, activeColor }) => {
    return (
        <div className={className} onClick={onClick} style={{backgroundColor: activeColor}}>
            <div className="icon-text-field-row">
                <div className='chooseButton' style={{backgroundColor: iconColor, width:'30%'}}>
                    <CustomIcon type={icon} styleProps={{style:{fontSize:16,}}} />
                </div>
                <span className="text-field-text" style={{width: '65%', fontSize:13}}>{text}</span>
            </div>
        </div>
    );
};

export default LeftIconButton;
