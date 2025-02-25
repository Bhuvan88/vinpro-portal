import React from 'react';
import { ImageField } from "@refinedev/antd";
import { Typography } from "antd";
import { CustomIcon } from '@components/datacomponents/CustomIcon';
import { useApiUrl } from '@refinedev/core';

export declare type FieldProps = {
    imageValue?: any,
    label: string,
    icon: string;
    titleProps?: any;
    fieldProps?: any;
    size?: any;
    mode?: string;
};

const TextField: React.FC<FieldProps> = ({ imageValue, label, icon, titleProps, fieldProps, size, mode }) => {
    const apiUrl = useApiUrl();

    return (
        <div className="icon-text-field">
            <CustomIcon type={icon} styleProps={{ style: { fontSize: 20, marginRight: 5 } }} />
            <div className="icon-text-field-column">
                <Typography.Text {...titleProps} style={{ color: '#3DD598' }}>{label}</Typography.Text>
                {mode == 'multiple' ?
                    imageValue && imageValue.map((item: any, index: any) => {
                        console.log('item', item);
                        return (<div style={{ margin: 5 }}><ImageField
                            value={apiUrl + "assets/" + item.directus_files_id.id}
                            imageTitle={"Image"}
                            width={size}
                        /></div>)
                    })
                    :
                    imageValue && <ImageField
                        value={apiUrl + "assets/" + imageValue}
                        imageTitle={"Image"}
                        width={size}
                    />}

            </div>
        </div>

    );
};

export default TextField;
