import React from 'react';
import { Button, Typography } from "antd";
import { CustomIcon } from '@components/datacomponents/CustomIcon';

export declare type IconInputProps = {
    textColor: string;
    text: string;
    activeColor:string;
    onClick: () => void;
    className?: string; 
    icon?:any;
};

const ColoredButton: React.FC<IconInputProps> = ({ text, textColor, onClick, className, activeColor, icon}) => {
    return (
        <div className={'outlineBtn'} onClick={onClick} style={{backgroundColor: activeColor, borderColor : activeColor != 'transparent'? activeColor : textColor }}>
            {icon && <CustomIcon type={icon} styleProps={{ style: { fontSize: 18, marginTop:3, marginLeft: 5, marginRight: 5, color: activeColor != 'transparent' ? '#fff' :textColor } }} />}
            <Typography.Text className="text-field-text" style={{color: activeColor != 'transparent' ? '#fff' :textColor, fontSize:12.5, paddingLeft:5, paddingRight:5 }}>{text}</Typography.Text>
        </div>
    );
};

export default ColoredButton;
