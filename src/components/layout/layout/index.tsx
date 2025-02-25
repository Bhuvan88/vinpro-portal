import React, { useEffect, useState } from 'react';
import { LayoutProps, useIsAuthenticated, useGetIdentity, useNavigation, useLogout, useList, useTranslate } from '@refinedev/core';
import { Layout as AntdLayout, Grid, message } from 'antd';
import { useTeam } from 'src/teamProvider';
import { CustomLoadingPage } from '@components/datacomponents/CustomLoadingPage';
import { useGetLocale } from '@refinedev/core';
import {Sider} from '../sider';
import { Header } from '../header';
import { OffLayoutArea } from '../offLayoutArea';
import { Footer } from '../footer';

import { useRouter } from 'next/router';


export const Layout: React.FC<LayoutProps> = ({ children}) => {
	const { data: identity } = useGetIdentity({
		v3LegacyAuthProviderCompatible:true
	});
	const { setIdentity, permissionList, selectedRole, isAdmin } = useTeam();
	const { push } = useNavigation();
	const { isError, isLoading } = useIsAuthenticated({
		v3LegacyAuthProviderCompatible:true
	});
	const locale = useGetLocale();
	const currentLocale = locale();
    const { mutate: logout } = useLogout({
		v3LegacyAuthProviderCompatible:true
	});
	const [orderid,setOrderid]=useState(null);
	const [showorderdrawer,setshoworderdrawer]=useState(false);

	const [DriverId,setDriverId]=useState(null);
	const [showDriverdrawer,setshowDriverdrawer]=useState(false);
	const t = useTranslate();

	const {pathname} = useRouter();

	useEffect(
		() => {
			if (identity?.id) {
				setIdentity(identity);
				selectedRole == "Customer" ? logout() : null;
			}	
		},
		[ identity, selectedRole ]
	);

	useEffect(
		() => {
			if (isError) {
				push('/login');
			}	
		},
		[ isError ]
	);

	
// 	const { refetch } = useList({
//     resource: "orders",
//     pagination: {
//       pageSize: -1,
//       mode: "off",
//     },
//     queryOptions: {
//       enabled: identity?.id ? true : false,
//       onSuccess(data) {
//        //  console.log("data", data);
// 		 if (data?.data?.length > 0) {				  
// 				message.info({
// 					content: (
// 					  <div style={{ textAlign: "left" }}>
// 						<div style={{ fontSize: 15 }}>
// 						  {data?.data?.length} {t("neworderhasbeenplaced")}
// 						</div>
// 						  <audio controls autoPlay playsInline hidden>
// 							<source src="/notify.mp3" type="audio/mpeg" />
// 						  </audio>				  
// 						{data?.data?.map((item, id) => {
// 						  return (
							
// 							<div>							
// 							  <a							  															  
// 								onClick={() => {
// 								if (identity?.id) {	
// 									if (selectedRole != "Driver")
// 									{
// 										setOrderid(item?.id);
// 										setshoworderdrawer(true);
// 									}
// 									else if (selectedRole == "Driver")
// 										{
// 										setDriverId(item?.id);
// 										setshowDriverdrawer(true);
// 										}	
// 									}								
// 								}}
// 								href="#"
// 								key={id}
// 							  >
// 								{t("clickheretoviewreference")} #:{item?.referenceno}
// 							  </a>
// 							</div>
// 						  );
// 						})}
// 					  </div>
// 					),
// 					icon: <div />,
// 					duration: 8,
// 				  })		
// 		  }
//         setTimeout(() => {
//           refetch();
//         }, 15000);
//       },
//     },
//     meta: {
//       fields: ["id", "referenceno","merchantorderstatus","deliverystatus","driver_id","city"],
//     },
// 	filters: [		
// 			  {
// 				field: "merchantorderstatus",
// 				operator: "eq",
// 				value:selectedRole != "Driver" && identity?.id ? "pending" : "accepted",
					 
// 			  },
// 			  {
// 				field: "paymentstatus",
// 				operator: "eq",
// 				value: "paid",
// 			  },
// 			  {
// 				field: "deliverystatus",
// 				operator: "eq",
// 				value:selectedRole == "Driver" && identity?.id ? "pending" : "",
// 			  },	
// 			//   {
// 			// 	field: "driver_id",
// 			// 	operator: "eq",
// 			// 	value:selectedRole == "Driver" &&  identity?.id,
// 			//   },
// 			  {
// 				  field:"city",
// 				  operator:"eq",
// 				  value: selectedRole == "Driver" ? identity?.city :"",
// 			  }
// 	  ],
//   });


	const finishedLoading = permissionList || isAdmin() || selectedRole;
	const userRoleFound = isAdmin() || selectedRole;	
	
	const viewCallback = () => {
		setOrderid(null);
		setshoworderdrawer(false);
		setDriverId(null);
		setshowDriverdrawer(false);
	  };	
	return userRoleFound && finishedLoading ? (
		<>
		{ pathname=="/home" ? <div>{children}</div> :
		
		<AntdLayout style={{ height: '100vh', flexDirection: 'row',overflowX: "hidden", minWidth: 1024, }} >
			<Sider />
			<AntdLayout>
				<Header />
				<AntdLayout.Content>
					<div
						style={{
							//padding: breakpoint.sm ? 24 : 12,
							//minHeight: 360
							padding: 5,
							//height: "calc(100vh - 96px)",
							overflow: "hidden",
						}}
					>
						{children}


					</div>
					{/* <OffLayoutArea /> */}
				</AntdLayout.Content>
				{/* <Footer /> */}
			</AntdLayout>
		</AntdLayout>
		}
		</>
	) : (
		<CustomLoadingPage />
		)
};
