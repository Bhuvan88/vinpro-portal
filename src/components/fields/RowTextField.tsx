import React from 'react';
import { Button, Typography } from "antd";
import { CustomIcon } from '@components/datacomponents/CustomIcon';

export declare type TextFieldProps = {
    textValue: string,
    label: string,
    icon: string;
    btnColor:string;
    iconColor :string
    titleProps?: any;
    fieldProps?: any;
};

const TextField: React.FC<TextFieldProps> = ({ textValue, label, icon, titleProps, fieldProps,iconColor, btnColor  }) => {

    return (
        <div className="card-text-field-row">
            <div className="card-text-field-row">
                <div className="roundedIcon" style={{backgroundColor:iconColor,}}>
                    <CustomIcon type={icon}  styleProps={{ style: { fontSize: 15,} }} />
                </div>
                <Typography.Text {...titleProps} >{label}</Typography.Text>
            </div>
            <Button {...fieldProps} style={{borderColor:btnColor, backgroundColor:btnColor, opacity:0.8 ,height:30 ,color:'#ccc'}}>{textValue}</Button>
        </div>

    );
};

export default TextField;
