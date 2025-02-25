import { useNavigation, useTranslate } from '@refinedev/core';
import { Layout as AntdLayout, Spin } from 'antd';
import { useEffect } from 'react';
import { useTeam } from 'src/teamProvider';
import { commonServerSideProps } from "src/commonServerSideProps";

export const getServerSideProps = commonServerSideProps;

const HomePage: React.FC<any> = ({ }) => {
    const t = useTranslate();

    const { identity, selectedRole } = useTeam();
    const { push } = useNavigation();

    useEffect(() => {
        if (identity?.id) {

            if (selectedRole === "Driver") {
                push("/driverReports");
            }
            if (selectedRole === "Administrator" || selectedRole === "Owner") {
                push("/customerlist");
            }
        }
    }, [identity, selectedRole]);

    return (
        <Spin spinning={true} size="large" tip={t("loading")}>
            <AntdLayout style={{ minHeight: '100vh', flexDirection: 'row', background: '#f8f9fe' }} />
        </Spin>
    );
};
export default HomePage;