import React from 'react';
import { Typography } from "antd";
import { CustomIcon } from '@components/datacomponents/CustomIcon';

export declare type TextFieldProps = {
    textValue: string,
    label: string,
    icon: string;
    titleProps?: any;
    fieldProps?: any;
    styleProps?:any;
    horizontal?: boolean;
};

const TextField: React.FC<TextFieldProps> = ({ textValue, label, icon, titleProps, fieldProps, styleProps, horizontal }) => {

    return ( horizontal?
            <div className="flex-row mb-5">
                <Typography.Text {...titleProps} style={{color:'#FD576F', width:'49%'}}>{label}</Typography.Text>
                <Typography.Text {...fieldProps} style={{textAlign:'right'}}>{textValue}</Typography.Text>
            </div>:
        <div className="icon-text-field" {...styleProps}>
            <CustomIcon type={icon} styleProps={{ style: { fontSize: 20, marginRight:5 } }} />
            <div className="icon-text-field-column">
                <Typography.Text {...titleProps} style={{color:'#FD576F'}}>{label}</Typography.Text>
                <Typography.Text {...fieldProps}>{textValue}</Typography.Text>
            </div>
        </div>

    );
};

export default TextField;
