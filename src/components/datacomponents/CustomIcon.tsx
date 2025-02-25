import * as AntdIcons from '@ant-design/icons';
import * as FontIcons from 'react-icons/fa';
export declare type CustomIconProps = {
	type: string;
	styleProps?: any;
};

export const CustomIcon: React.FC<CustomIconProps> = ({ type, styleProps }) => {
	let AntdIcon: any = AntdIcons[type];
	let FontIcon: any = FontIcons[type];
	if (AntdIcon) {
		return <AntdIcon {...styleProps} />;
	}
	else{
		return type ? <FontIcon {...styleProps}  /> : null;
	}
	
};
