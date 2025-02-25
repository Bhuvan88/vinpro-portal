import React, { useState } from 'react';
import { AppProps } from 'next/app';

import { Refine, useGetLocale } from '@refinedev/core';
import { useNotificationProvider } from '@refinedev/antd';
import { ConfigProvider } from 'antd';
import routerProvider from "@refinedev/nextjs-router/legacy";
import { dataProvider } from '@tspvivek/refine-directus';
import authProvider from 'src/authProvider';
import { Layout } from "@components/layout";
import { appWithTranslation, useTranslation } from 'next-i18next';
import { directusClient } from 'src/directusClient';
import { TeamProvider, useTeam } from 'src/teamProvider';
import "@refinedev/antd/dist/reset.css";
import '../src/styles/global.css';
import sv_SE from 'antd/locale/sv_SE';
import 'dayjs/locale/sv';

require("/src/styles/dark.css");

function LayoutWrapper({ Component, pageProps }: any): JSX.Element {
	const [isRouteChanging] = useState(false);
	if (Component.noLayout) {
	  return (
		<div>
		  {isRouteChanging}
		  <Component {...pageProps} />
		</div>
	  );
	} 
	return (
	  <div>
		{isRouteChanging}
		<Layout><Component {...pageProps} /></Layout>
	  </div>
	);
  }
  
  function ConfigWrapper({ Component, pageProps }: any): JSX.Element {
	  const locale = useGetLocale();
  	  const currentLocale = locale();
	return (			
		<ConfigProvider locale={currentLocale=="sv" && sv_SE}>
			<LayoutWrapper Component={Component} pageProps={pageProps} />
  		 </ConfigProvider>		
	);
}
 
function MyApp({ Component, pageProps }: AppProps): JSX.Element {
	const { t, i18n } = useTranslation();
	const { can } = useTeam();
	const i18nProvider = {
		translate: (key: string, params: object) => t(key, params),
		changeLocale: (lang: string) => i18n.changeLanguage(lang),
		getLocale: () => i18n.language
	};

	return (
		<Refine
			legacyRouterProvider={routerProvider}
			dataProvider={dataProvider(directusClient)}
			legacyAuthProvider={authProvider}
			accessControlProvider={{
				can: async ({ resource, action, params }) => {
					return can({ resource, action, params });
				}
			}}
			resources={[{ name: "", options: { route: "/home" } }]}
			i18nProvider={i18nProvider}
			notificationProvider={useNotificationProvider}
		>					  
			  <ConfigWrapper  Component={Component} pageProps={pageProps} />		
		</Refine>
	);
}

function SaasApp(appProps: AppProps): JSX.Element {
	return (		
			<TeamProvider>
			<MyApp {...appProps} /> 
			</TeamProvider>
	);
}

export default appWithTranslation(SaasApp);
