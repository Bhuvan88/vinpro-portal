import React from 'react';
import { BooleanField } from "@refinedev/antd";
import { Typography } from "antd";

import { CustomIcon } from '@components/datacomponents/CustomIcon';

export declare type TextFieldProps = {
    textValue: string,
    label: string,
    icon: string;
    titleProps?: any;
    fieldProps?: any;
};

const TextField: React.FC<TextFieldProps> = ({ textValue, label, icon, titleProps, fieldProps }) => {

    return (
        <div className="icon-text-field">
            <CustomIcon type={icon} styleProps={{ style: { fontSize: 20, marginRight:5 } }} />
            <div className="icon-text-field-column">
                <Typography.Text {...titleProps} style={{color:'#3DD598'}}>{label}</Typography.Text>
                <BooleanField {...fieldProps} value={textValue} trueIcon={<CustomIcon type="CheckCircleOutlined" styleProps={{ style: { color: "green" } }} />} falseIcon={<CustomIcon type="CloseCircleOutlined" styleProps={{ style: { color: "red" } }} />} />
            </div>
        </div>

    );
};

export default TextField;
