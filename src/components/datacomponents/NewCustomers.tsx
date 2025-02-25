import React, { useEffect, useState } from 'react';
import { Col, Form, Row, Space, Typography, Spin, ConfigProvider, DatePicker, DatePickerProps, Tooltip } from 'antd';
import {  useList, useTranslate } from '@refinedev/core';
import dynamic from 'next/dynamic';
import moment from 'moment';
import dayjs from "dayjs";

const Line = dynamic(() => import("@ant-design/plots").then(({ Line }) => Line), {
    ssr: false,
});

const NewCustomers: React.FC = () => {
    const { Title } = Typography;
    const [loading, setLoading] = useState(false);
    const t = useTranslate();
    const [NewCustomers, setNewCustomers] = useState([]);
    const [selectedDate, setSelectedDate] = useState(null);
    const [filteredCustomers, setFilteredCustomers] = useState([]);

    const { refetch ,isLoading} = useList<any>({
        resource: 'directus_users',
        metaData: {
            fields: ["email","date_created"],
        },
        pagination: {
            pageSize: -1
        },
        sorters: [
            {
                field: 'date_created',
                order: 'asc',
            },
        ],
        config: {
            filters: [
                {
                    field: "role",
                    operator: "eq",
                    value: "200958aa-6f9e-40c3-be90-d1ea555e3e56",
                }
            ]
        },
        queryOptions: {          
            onSuccess: (data) => {
                if (data?.data?.length > 0) {
                  //  console.log('NewCustomers', data);

                    const customerCounts = data?.data.reduce((count, item) => {
                       
                    const date = moment(item?.date_created).format('YYYY-MM-DD');
                        if (count[date]) {
                            count[date] += 1; 
                        } else {
                            count[date] = 1;
                        }
                        return count;
                    }, {});
                  
                    const formattedData = Object.keys(customerCounts).map(date => ({
                        Date: date,
                        NewCustomers: customerCounts[date], 
                    }));
                    setNewCustomers(formattedData); 

                    const currentMonth = dayjs().format('YYYY-MM');
                    const currentMonthData = formattedData.filter(item =>
                        dayjs(item?.Date).format('YYYY-MM') === currentMonth
                    );
                    setFilteredCustomers(currentMonthData);
                }
            },
            onError: (error) => {
                console.log(error);
            }
        }     
    });
        
    const onChange: DatePickerProps["onChange"] = (date, dateString) => {
        setSelectedDate(date ? dayjs(date).format("YYYY-MM-DD") : null);
        setLoading(true); 

        if (!date) 
            {           
                const currentMonth = dayjs().format("YYYY-MM"); 
                const clearedData = NewCustomers.filter(item => dayjs(item?.Date).format("YYYY-MM") === currentMonth);
                setFilteredCustomers(clearedData);
             } 
        else 
             {           
                 const filteredData = NewCustomers.filter(item => item?.Date === dayjs(date).format("YYYY-MM-DD"));
                 setFilteredCustomers(filteredData);
             }
            setLoading(false);
    };

    useEffect(() => {
        if (isLoading) {
            setLoading(true);
            refetch();
        } else {
            setLoading(false);
        }
    }, [isLoading]);


    const config = {
        data: filteredCustomers,
        xField: 'Date',
        yField: 'NewCustomers',
        point: {
            shape: 'circle',
            size: 5,
        },  
        smooth: true,          
    };

    const disabledDate = (current) => {
        return current && current > dayjs().endOf('day');
      };

    return (
        <>
            <div className="whitecard-new" style={{ height: 400 }}>
                <Form>
                    <Row gutter={[16, 16]}>
                        <Col xs={24} sm={8}>
                            <div>
                                <Title style={{ fontSize: 17, fontWeight: 700 }}>New Customers</Title>
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
                                                    value={selectedDate ? dayjs(selectedDate) : null}
                                                    onChange={onChange}  
                                                    disabledDate={disabledDate}                                                                                                                                        
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
                    <div style={{ textAlign: 'center', marginTop: 130 }}>
                        <Spin />
                    </div>
                 ) : (
                    filteredCustomers.length === 0 ? (
                    <div style={{ textAlign: 'center', marginTop: 130 }}>
                        <Typography.Text style={{color:'#FD576F' }}>No New Customer</Typography.Text>
                    </div>
                 ):
                    <div style={{ height: 300, marginTop: 20 }}>                    
                            <Line {...config} />              
                    </div>
                )}
            </div>
        </>
    );
};

export default NewCustomers;
