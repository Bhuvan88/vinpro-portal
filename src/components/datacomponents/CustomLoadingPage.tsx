import { useTranslate } from '@refinedev/core';
import { Layout as AntdLayout, Spin } from 'antd';

export const CustomLoadingPage: React.FC<any> = ({}) => {
	const t = useTranslate();
	return (
		<Spin spinning={true} size="large" tip={t("loading")}>
			<AntdLayout style={{ minHeight: '100vh', flexDirection: 'row', background: '#f8f9fe' }} />
		</Spin>
	);
};
