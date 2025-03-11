import { useGetLocale, useLogout, useTranslate } from '@refinedev/core';
import {
	Layout as AntdLayout,
	Space,
	Menu,
	Button,
	Dropdown,
	Avatar,
	Affix,
	Typography,
	Badge,
	Popover,
	Tooltip
} from 'antd';
import {DownOutlined, UserOutlined, CaretDownOutlined, MailOutlined, BellOutlined, StopFilled} from "@ant-design/icons"
import NextRouter from '@refinedev/nextjs-router';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useGetIdentity } from '@refinedev/core';
import { useEffect } from 'react';
import { API_URL } from 'src/directusClient';
import Notification from './notification';
import { useTeam } from 'src/teamProvider';
import { CustomIcon } from '@components/datacomponents/CustomIcon';

const { Link } = NextRouter;


export declare type HeaderProps = {
	title?: string;
};

export const Header: React.FC<HeaderProps> = ({ title }) => {
	const locale = useGetLocale();
	const { locales } = useRouter();
	const { identity, shadowToken } = useTeam();
	const { headerTitle, stopShadowing } = useTeam();
	const t = useTranslate();
	const currentLocale = locale();
	const { mutate: logout } = useLogout({
		v3LegacyAuthProviderCompatible: true,
	  });

	const menu = (
		<Menu selectedKeys={[currentLocale]}>
			{[...(locales || [])].sort().map((lang: string) => (
				<Menu.Item
					key={lang}
					icon={
						<span style={{ marginRight: 8 }}>
							<Avatar size={16} src={`/images/flags/${lang}.svg`} />
						</span>
					}
					style={{ color: '#00d889' }}
				>
					<Link  locale={lang} to={''}>
						{lang === 'en' ? 'English' : 'Swedish'}			
					</Link>
				</Menu.Item>
			))}
		</Menu>
	);

	const UserMenu = (
		<Menu>		  
		  <Menu.Item
			  key="1"
			  icon={
				<CustomIcon
				  type={"UserOutlined"}
				  styleProps={{
					style: {
					  marginRight:8,
					  fontSize: 15,
					  alignItems: "center",					 
					},
				  }}
				/>
			  }
			>
			  <Link
					href={"../profile"}
					 to={''} >
					<span style={{ color: "#0f2b71", alignItems: "center" }}>My Profile</span>
			  </Link>
			</Menu.Item>

			<Menu.Item
				key="2"
				icon={
					<CustomIcon
					type={"LogoutOutlined"}
					styleProps={{
					  style: {
						marginRight:8,
						fontSize: 15,
						alignItems: "center",						
					  },
					}}
				  />
				}
       			 onClick={() => logout()}
     		 >       
			<span style={{ color: "#0f2b71", alignItems: "center" }}>Logout</span>
		</Menu.Item>
		</Menu>
	);

	return (
		<Affix>
			<AntdLayout.Header
				style={{
					display: 'flex',
					justifyContent: 'space-between',
					alignItems: 'center',
					padding: '0px 24px',
					height: '48px',
					backgroundColor: '#ffff',
					borderBottom: "1.5px solid #0f2b71"
				}}
			>
				<Head>
					<title>{headerTitle ? headerTitle : title}</title>
				</Head>
				<div style={{display:'flex',gap:40}}>
					{/*<Button type={'primary'} icon={<CustomIcon type={'DashboardOutlined'} />}>
						Dashboard
					</Button>
					<Button type={'ghost'} icon={<CustomIcon type={'QuestionCircleOutlined'} />}>
						Ticket Desk
					</Button>
					<Button type={'ghost'} icon={<CustomIcon type={'CheckSquareOutlined'} />}>
						Approvals
					</Button>
					<Button type={'ghost'} icon={<CustomIcon type={'SnippetsOutlined'} />}>
						Reports
					</Button>
					*/}
				</div>
				<div className='flex-align-center'>
					{/* <Dropdown overlay={menu}>
						<Button type="link" style={{ color: '#DC5700' }}>
							<Space>
								<Avatar size={20} src={`/images/flags/${currentLocale}.svg`} />
					
								<CaretDownOutlined />
							</Space>
						</Button>
					</Dropdown> */}
					{/* <div style={{display:"flex"}}>
						<Badge
							dot
							offset={[-1, 1]}
						>
							<MailOutlined style={{ fontSize: 18 }} />
						</Badge>
					</div> */}

				{shadowToken && (
					<div style={{ display: 'flex', backgroundColor: 'black', marginRight: 10 }}>
						<Tooltip title={t("stopshadowing")}>
							<Button type="link" style={{ color: '#ffffff' }} icon={<StopFilled />} onClick={() => {
								stopShadowing();
							}} />
						</Tooltip>
					</div>
				)}

				{/* <Popover content={<Notification />} trigger="click">
					<div className="mr-20" style={{ display: 'flex', cursor: 'pointer' }}>
						<Badge dot offset={[-2, 2]}>
							<BellOutlined style={{ fontSize: 20 }} />
						</Badge>
					</div>
				</Popover> */}

		<Dropdown overlay={UserMenu}>
			<div style={{ display: "flex", alignItems: "center" }}>
				{identity && identity?.avatar ? (
					<Avatar
						size={{ xs: 24, sm: 30, md: 30, lg: 35, xl: 35, xxl: 35 }}
						src={API_URL + 'assets/' + identity?.avatar?.id}
					/>
				) : (
					<Avatar size={{ xs: 24, sm: 30, md: 30, lg: 35, xl: 35, xxl: 35 }} icon={<UserOutlined />} />
				)}
					<a className="ant-dropdown-link" onClick={(e) => e.preventDefault()}>
						{identity && (
							<Typography.Text className="ml-10 txt-capitalize" style={{ color: '#0f2b71' }}>
								{identity?.first_name} {identity?.last_name}
							</Typography.Text>
						)}
						
					</a>
				</div>
			</Dropdown>
				{/* <Dropdown overlay={UserMenu}>
					<a className="ant-dropdown-link" onClick={(e) => e.preventDefault()}>
						{identity && (
							<Typography.Text className="ml-10 txt-capitalize" style={{ color: '#ffffff' }}>
								{identity.first_name + ' ' + identity.last_name}{' '}
							</Typography.Text>
						)}
						<CaretDownOutlined style={{ color: '#ffffff' }} />
					</a>
				</Dropdown> */}
				</div>
			</AntdLayout.Header>
		</Affix>
	);
};
