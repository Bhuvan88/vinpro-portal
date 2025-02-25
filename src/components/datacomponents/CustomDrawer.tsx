import React, { useEffect, useState } from 'react';
import { CanAccess, useTranslate } from '@refinedev/core';
import { DeleteButton } from '@refinedev/antd';
import { Drawer, Tabs } from 'antd';
import { CustomIcon } from '@components/datacomponents/CustomIcon';
import { useTeam } from 'src/teamProvider';


type EditDrawerProps = {
	callback: (status: string) => void;
	visible: boolean;
	resource: string;
	id: string;
	viewProps?: any;
	editProps?: any;
	permissionResource?: string;
	module?: string;
	hideDelete?: boolean;
};

const DrawerShow: React.FC<EditDrawerProps> = ({ callback, visible, id, resource, viewProps, editProps, permissionResource, module, hideDelete }) => {
	const t = useTranslate();

	const OperationsSlot = {
		right: (
			<CanAccess resource={permissionResource} action={'delete'} params={{ module: module }} >
			{!hideDelete &&	<DeleteButton
				className="drawer-header-tab"
				type={'text'}							
				resource={resource}
				recordItemId={id}
				onSuccess={()=>{callback('success');}}
				meta={{type:'archive'}}
				accessControl={{enabled:true}}
				confirmTitle={t('confirm')}
				successNotification = {{
					message: t("deletedsuccessfully"),
					type: "success"
					}}
			>{t("delete")}</DeleteButton>}
			</CanAccess>
		)
	};

	const [showTab, setShowtab] = useState<string>(hideDelete ? '1' : '2');

	return (
		<Drawer
			open={visible}	
			width={450}
			onClose={() => { callback('close'); }}
			extra={
				<Tabs
					defaultActiveKey={hideDelete ? '1' : '2'}
					onChange={(key) => { setShowtab(key); }}
					tabBarExtraContent={OperationsSlot}
					className="tab-wrapper"
				>

					 <Tabs.TabPane
						tab={
							<span>
								<CustomIcon styleProps={{ className: 'pr-5' }} type={'EyeOutlined'} />{t("view")}
							</span>
						}
						key="1"
					/>

						<Tabs.TabPane
							tab={
								<CanAccess resource={permissionResource} action={'edit'} params={{ module: module }} >
								<span>
									<CustomIcon type={'EditOutlined'} styleProps={{ className: 'pr-5' }} />{t("edit")}
								</span>
								</CanAccess>
							}
							key="2"
						/>
					
				</Tabs>
			}
			styles={{header:{paddingTop:0,paddingBottom:0}}}
			className="drawer-header"
		>
			{showTab == '1' && viewProps
			}
			{showTab === '2' && editProps}
		</Drawer>
	);
};

export default DrawerShow;
