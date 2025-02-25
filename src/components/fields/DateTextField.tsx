import React from 'react';
import { DateField } from "@refinedev/antd";
import { Typography } from "antd";

import { CustomIcon } from '@components/datacomponents/CustomIcon';

export declare type DateFieldProps = {
    textValue: string,
    label: string,
    icon: string;
    titleProps?: any;
    format?: any;
    dateProps?: any;
    horizontal?: boolean;

};

const DateTextField: React.FC<DateFieldProps> = ({ textValue, label, icon, titleProps, format, dateProps, horizontal }) => {
    return ( horizontal?
        <div className="flex-row mb-5">
            <Typography.Text {...titleProps} style={{color:'#FD576F', width:'49%'}}>{label}</Typography.Text>
            {textValue && <DateField format={format} {...dateProps} value={textValue} />}
        </div>:
        <div className="icon-text-field">
            <CustomIcon type={icon} styleProps={{ style: { fontSize: 20, marginRight: 5 } }} />
            <div className="icon-text-field-column">
                <Typography.Text {...titleProps} style={{ color: '#FD576F' }}>{label}</Typography.Text>
                {textValue && <DateField format={format} {...dateProps} value={textValue} />}
            </div>
        </div>
    );
};

export default DateTextField;
