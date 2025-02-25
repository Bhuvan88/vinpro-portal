import React from 'react';
import { Tag, Avatar, Tooltip,Typography } from 'antd';
import Link from 'next/link';
import { API_URL } from 'src/directusClient';

export declare type AvatarProps = {
	title?: string;
	linkUrl?: string;
	linkSrc?: string;
	imagesrc?: string;
	initials?: string;
	tooltipSrc?:string;
	avatarImageProps?:any;
	style?:any;
};

const AvatarField: React.FC<AvatarProps> = ({ title,tooltipSrc,linkUrl, linkSrc, imagesrc, initials, avatarImageProps, style }) => {

	return (

		<div style={{display:'inline-flex',alignItems:'center',gap:'4px'}}>
			<div style={{width:"35px"}}>
			<Tooltip title={tooltipSrc} placement="top">
				{imagesrc ? (
					<Avatar size={"default"} src={API_URL+"assets/" + imagesrc} {...avatarImageProps} />
				) : (
					initials && <Avatar size={"default"} style={{ backgroundColor: '#0f2b71' }}>{initials}</Avatar>
				)}
			</Tooltip>
			</div>
			{linkUrl && linkSrc ? (
				<Link href={linkUrl + linkSrc} as={linkUrl + linkSrc}>
					{title && <a>{title}</a>}
				</Link>
			) : (
				title &&<Typography.Text style={style}>{title}</Typography.Text> 
			)}
		</div>

	);
};

export default AvatarField;
