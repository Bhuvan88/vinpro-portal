import React, {  useEffect, useState } from "react";
import { CrudFilters, useList, useTranslate } from "@refinedev/core";
import { Col, DatePicker, Row, Typography, Space, Form, Table} from "antd";
import dayjs from "dayjs";
import moment from "moment";

const DriverOrders: React.FC = () => {
    
  const { Title } = Typography; 
  const t = useTranslate();
  const { RangePicker } = DatePicker; 
  const [startDate, setStartDate] = useState(dayjs().startOf('month').format('YYYY-MM-DD'));
  const [endDate, setEndDate] = useState(dayjs().endOf('month').format('YYYY-MM-DD'));
  const [loading, setLoading] = useState(true);
  const [DriverOrders, setDriverOrders] = useState([]);


const { refetch ,isLoading} = useList<any>({
  resource: 'orders',
  metaData: {
      fields: ["driver_id.*","deliverystatus","date_created"],
  },
  pagination: {
      pageSize:-1
  },
  sorters: [
      {
          field: 'date_created',
          order: 'desc',
      },
  ],
  config: {
      filters: [
          {
              field: 'deliverystatus',
              operator: 'eq',
              value: 'delivered',
          },
          {
              field: 'driver_id.role',
              operator: 'eq',
              value: '4aa0accb-66b0-4c0f-87da-373b130413b4',
          },
          {
            field:"ordertype",
            operator:"eq",
            value:"delivery"
          },
          {
            field: 'date_created',
            operator: 'between',
            value:[dayjs(startDate).startOf("day"),dayjs(endDate).endOf("day")] 
          },
          
      ]
  },
  
  queryOptions: {
    onSuccess: (data) => {
      if (data?.data?.length > 0) {

        const groupedData = data?.data.reduce((record, item) => {
          const date = moment(item?.date_created).format('YYYY-MM-DD');
          const driverId = item?.driver_id?.id;
          const driverName = `${item?.driver_id?.first_name} ${item?.driver_id?.last_name}`;
          
          const key = `${driverId}_${date}`;
          
          if (!record[key]) {
            record[key] = { driverName, driverId, date, totalOrders: 0 };
          }
          record[key].totalOrders += 1;

          return record;
        }, {});

        const formattedData = Object.values(groupedData);
        setDriverOrders(formattedData);
      }
      else {
        setDriverOrders([]);
      }
      setLoading(false);
    },
    onError: (error) => {
      console.log(error);
      setLoading(false);
    },
  },
});

// console.log("DriverOrders list>>>",DriverOrders);

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
  if (!isLoading && DriverOrders?.length === 0) {
      setLoading(false);
  } else if(!isLoading) {
      setLoading(false);
  }
}, [isLoading, DriverOrders]);


  return (        
            <div className="whitecard-new" style={{ height: 532 }} >
                 <Form layout="vertical">
                    <Row gutter={[16, 16]} >               
                     <Col xs={24} sm={12} md={4}>
                      <div style={{ paddingBottom: 20 }}>
                        <Title
                          level={5}
                          style={{ fontSize: 18, fontWeight: 700 }}
                        > {t("Drivers")} </Title>
                      </div>
                       </Col>                                                        
                   <Col xs={24} sm={12} md={20} style={{display:"flex",justifyContent:"flex-end"}}>                   
                       <Space>                                
                    <Form.Item name="daterange" className="card-search">							
                        <RangePicker              
                          allowClear={true}                         
                          placeholder={[t('startdate'),t('enddate')]}
                          onChange={onDatechange}
                          value={[dayjs(startDate), dayjs(endDate)]}
                          defaultValue={[dayjs(startDate), dayjs(endDate)]}
                          ranges={{ 
                            [t('today')]: [dayjs(), dayjs()], 
                            [t('yesterday')]: [dayjs().subtract(1, 'day'), dayjs().subtract(1, 'day')],                 
                            [t('thismonth')]: [dayjs().startOf('month'), dayjs().endOf('month')],
                            [t('lastmonth')]: [dayjs().subtract(1, 'month').startOf('month'), dayjs().subtract(1, 'month').endOf('month')],           
                            [t('q1')]: [dayjs().startOf('month').month(0), dayjs().endOf('month').month(2)],
                            [t('q2')]: [dayjs().startOf('month').month(3), dayjs().endOf('month').month(5)],
                            [t('q3')]: [dayjs().startOf('month').month(6), dayjs().endOf('month').month(8)],
                            [t('q4')]: [dayjs().startOf('month').month(9), dayjs().endOf('month').month(11)]
                          }}
                        />            
                      </Form.Item>  
                      </Space>                                                
                        </Col>                                
                    </Row>
                  </Form>
                                             
         <div>            
          <Table                        
                rowKey="id" 
                scroll={{ y: 320 }} 
                dataSource={DriverOrders}  
                loading={loading}                                                                                                                  
            >                                       
          
            <Table.Column
              dataIndex="driverName"
              key="driverName"
              title="Driver Name"
              render={(value) => <span>{value}</span>}
            />

            <Table.Column
              dataIndex="date"
              key="date"
              title="Date"
              render={(value) => <span>{value}</span>}
            />

            <Table.Column
              dataIndex="totalOrders"
              key="totalOrders"
              title="Total Orders Delivered"
              render={(value) => <span>{value}</span>}
            />

         </Table>
        </div>
     </div>          
  );
};

export default DriverOrders;
