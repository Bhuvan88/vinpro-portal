import React, { useEffect, useState } from 'react';
import { Col, Form, Row, Space, Typography, Spin, ConfigProvider, DatePicker } from 'antd';
import dayjs from "dayjs";
import { useList, useTranslate } from '@refinedev/core';

import dynamic from 'next/dynamic';
import moment from 'moment';


const Pie = dynamic(() => import("@ant-design/plots").then(({ Pie }) => Pie), {
    ssr: false,
});

const PieChart: React.FC = () => {
    const { Title } = Typography;
    const [loading, setLoading] = useState(false);
    const t = useTranslate();
    const [startDate, setStartDate] = useState(dayjs().startOf('month').format('YYYY-MM-DD'));
    const [endDate, setEndDate] = useState(dayjs().endOf('month').format('YYYY-MM-DD'));
    const {RangePicker} = DatePicker;
    const [orderdata, setOrderdata] = useState([]);

    const { refetch, isLoading } = useList<any>({
        resource: 'orders',
        metaData: {
            fields: ["paymenttype",'date_created'],
        },
        pagination: {
            pageSize:-1
        },
        config: {
            filters: [                             
                {
                  field: 'date_created',
                  operator: 'between',
                  value:[dayjs(startDate).startOf("day"),dayjs(endDate).endOf("day")] 
                },
                {
                    field: 'paymentstatus',
                    operator: 'eq',
                    value: 'paid'
                },
                {
                    field: 'merchantorderstatus',
                    operator: 'eq',
                    value: 'accepted'
                }
                
            ]
        },
        queryOptions: {
            onSuccess: (data) => {
              //  console.log("data>>>>>", data);
                if (data?.data?.length > 0) {
                    const orderdata = data?.data.reduce((record, item) => {
                        const paymenttype = item?.paymenttype;  
                        if (!record[paymenttype]) {
                            record[paymenttype] = { type: paymenttype, orders: 0 };
                        }
                        record[paymenttype].orders += 1;
                        return record;
                    }, {});
                    setOrderdata(Object.values(orderdata));
                }
                setLoading(false); 
            },
            onError: (error) => {
                console.error("Error fetching data", error);
                setLoading(false);  
            }
        },
      });
                   

    const config = {
      data:orderdata,
      angleField: 'orders',
      colorField: 'type',
      label: {
        text: 'orders',
        style: {
          fontWeight: 'bold',
        },
      },
      tooltip: {
        title: 'type',
      },
      legend: {
        color: {
          title: false,
          position: 'right',
          rowPadding: 5,
        },
      },
    };


    const onDatechange = (dates, dateStrings) => {
        if (dates) {
         
          const newStartDate = dates[0].format('YYYY-MM-DD');
          const newEndDate = dates[1].format('YYYY-MM-DD');
      
          setStartDate(newStartDate);
          setEndDate(newEndDate);
          setLoading(true);
          refetch();
        }
         else {  
          setStartDate(dayjs().startOf('month').format('YYYY-MM-DD'));
          setEndDate(dayjs().endOf('month').format('YYYY-MM-DD'));
          setLoading(true);
          refetch();
        }
      };

      useEffect(() => {
        if (!isLoading && orderdata?.length === 0) {
            setLoading(false);
        } else if(!isLoading) {
            setLoading(false);
        }
      }, [isLoading, orderdata]);
      
      const disabledDate = (current) => {
        return current && current > dayjs().endOf('day');
      };
      
    return (
        <>
            <div className="whitecard-new" style={{ height: 450 }}>
                <Form>
                    <Row gutter={[16, 16]}>
                        <Col xs={24} sm={8}>
                            <div>
                                <Title style={{ fontSize: 17, fontWeight: 700 }}>Orders/Payment Type</Title>
                            </div>
                        </Col>
                        <Col xs={24} sm={16}>
                            <Form layout="vertical">
                                <div style={{ display: "flex", justifyContent: "flex-end" }}>
                                    <Space>
                                    <Form.Item name="daterange" className="card-search">							
                                    <RangePicker              
                                        allowClear={true} 
                                        onChange={onDatechange}
                                        value={[dayjs(startDate), dayjs(endDate)]}
                                        disabledDate={disabledDate}
                                        ranges={{ 
                                          [t('I dag')]: [dayjs(), dayjs()], 
                                          [t('Igår')]: [dayjs().subtract(1, 'day'), dayjs().subtract(1, 'day')],                 
                                          [t('Den här månaden')]: [dayjs().startOf('month'), dayjs().endOf('month')],
                                          [t('Förra månaden')]: [dayjs().subtract(1, 'month').startOf('month'), dayjs().subtract(1, 'month').endOf('month')],                               
                                        }}
                                      />            
                                  </Form.Item> 
                                    </Space>
                                </div>
                            </Form>
                        </Col>
                    </Row>
                </Form>

                {loading ? (
                    <div style={{ textAlign: 'center', marginTop: 150 }}>
                        <Spin />
                    </div>
                ) : (
                    <div style={{ height: 350, marginTop: 20 }}>
                        <Pie {...config} />
                    </div>
                )}
            </div>
        </>
    );
};

export default PieChart;
