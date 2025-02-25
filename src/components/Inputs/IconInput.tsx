import React from 'react';
import { CustomIcon } from '@components/datacomponents/CustomIcon';

export declare type IconInputProps = {
    icon: string;
    children: React.ReactNode;
};

const IconInput: React.FC<IconInputProps> = ({ icon, children }) => {

    return (
        <div className="icon-input-field">
            <CustomIcon type={icon} styleProps={{ style: { fontSize: 20,marginTop:15 } }} />
            {children}
        </div>

    );
};

export default IconInput;
