import React from 'react';
import { 
    useTranslate,
    useCustom,
    useApiUrl
  } from "@refinedev/core";
import { Popconfirm } from 'antd';
import { Button, Typography } from "antd";
export declare type IconInputProps = {
    item?: any;
    label: string;
    callBack?:any;
    resource: string;
    role?: any;
    method?: any;
    //onClick: () => void;
};
import { useTeam } from "src/teamProvider";
import { CustomIcon } from '@components/datacomponents/CustomIcon';

const ApprovalButton: React.FC<IconInputProps> = ({ item, label, callBack, resource, role, method }) => {
    const t = useTranslate();
    const { getTeamObj } = useTeam();
    const [loading, setLoading] = React.useState(false);
    
    const btnAction = async() => {
        setLoading(true);
        const { data } = await refetch();
    };
    let obj = {};
    if(role?.name == 'Supervisor' ){
        obj = {
            approvallevel1: 'approved',
            approvedbylevel1: item?.user?.id, 
        }
    }

    let queryOption = {};
    if(method == 'get')
    {
        queryOption = { query: {
                id : item.id,
                ...obj,
                ...getTeamObj()
            }
        }
    }else{
        queryOption = { payload: {
                ...obj,
                ...getTeamObj()
            }
        }
    }

        const { refetch } = useCustom<any>({
            url: method == 'get' ? resource : resource+'/'+item.id,
            method: method,
            config: queryOption,
            queryOptions: {
                enabled: false,
                onSuccess: (data) => {
                    console.log('data', data);
                    setLoading(false);
                    callBack('success');
                },
                onError: (error) => {
                    console.log('error', error);
                    setLoading(false);
                }

            },
        });
    


    return (
        <Popconfirm
                title={t('areyousureyouwanttoapprove')}
                okText={t("yes")}
                cancelText={t("no")}
                onConfirm={() => {
                    btnAction()
                }}
		>
            <Button type="default"
            icon={<CustomIcon type="CheckCircleOutlined" />} loading={loading} className="btn-success" 
            >
                {label}
            </Button>
        </Popconfirm>
    );
};

export default ApprovalButton;
