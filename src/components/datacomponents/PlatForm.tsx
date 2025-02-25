import React, { useEffect, useState } from 'react';
import { Col, Form, Row, Space, Typography, Spin, ConfigProvider, DatePicker } from 'antd';
import dayjs from "dayjs";
import { useList, useTranslate } from '@refinedev/core';
import { useTeam } from 'src/teamProvider';
import dynamic from 'next/dynamic';
import { useTable } from '@refinedev/antd';
import { platform } from 'os';

const Column = dynamic(() => import("@ant-design/plots").then(({ Column }) => Column), {
    ssr: false,
});

const PlatForm: React.FC = () => {
    const { Title } = Typography;
    const [loading, setLoading] = useState(false);
    const t = useTranslate();
    const { identity, selectedRole } = useTeam();

    const { tableQueryResult:queryresult } = useTable<any>({
        resource: 'directus_users',
        metaData: {
            fields: ["email","date_created"]
        },
        pagination: {
            pageSize: -1
        },
        filters:{
            initial: [          
            {
                field: "merchant",
                operator: "eq",
                value: selectedRole === "Owner" ? identity?.merchant?.id : "",
            },
        ]},         
    });
    const { data, isLoading } = queryresult;
   
    // console.log('NewCustomers', data);

    useEffect(() => {
        if (isLoading) {
            setLoading(true);
        } else {
            setLoading(false);
        }
    }, [isLoading]);

    const data1 = [       
        { Date: '2024-11-22', Customers: 25 , platform:'Android'},
        { Date: '2024-11-22', Customers: 11 , platform:'Web'},
        { Date: '2024-11-22', Customers: 20 , platform:'IOS'},
        { Date: '2024-11-25', Customers: 7 , platform:'Web',},
        { Date: '2024-11-25', Customers: 8 , platform:'IOS', },
        { Date: '2024-11-26', Customers: 7 , platform:'Android'},
        { Date: '2024-11-26', Customers: 18 , platform:'IOS'},
        { Date: '2024-11-26', Customers: 12 , platform:'Web'},
      ];

      const config = {
        data: data1,
        xField: 'Date',
        yField: 'Customers',
        colorField: 'platform',
        stack: true,
        interaction: {
          tooltip: {
            shared: true,
          },
        },
      };

    return (
        <>
            <div className="whitecard-new" style={{ height: 450 }}>
                <Form>
                    <Row gutter={[16, 16]}>
                        <Col xs={24} sm={8}>
                            <div>
                                <Title style={{ fontSize: 17, fontWeight: 700 }}>Orders/Platform</Title>
                            </div>
                        </Col>
                        <Col xs={24} sm={16}>
                            <Form layout="vertical">
                                <div style={{ display: "flex", justifyContent: "flex-end" }}>
                                    <Space>
                                        <Form.Item name={"date"} className="card-search">
                                            <ConfigProvider>
                                                <DatePicker
                                                    picker="date"
                                                    allowClear
                                                    format="YYYY-MM-DD"                                                                                                
                                                />
                                            </ConfigProvider>
                                        </Form.Item>
                                    </Space>
                                </div>
                            </Form>
                        </Col>
                    </Row>
                </Form>

                {loading ? (
                    <div style={{ textAlign: 'center', marginTop: 20 }}>
                        <Spin />
                    </div>
                ) : (
                    <div style={{ height: 350, marginTop: 20 }}>
                        <Column {...config} />
                    </div>
                )}
            </div>
        </>
    );
};

export default PlatForm;
