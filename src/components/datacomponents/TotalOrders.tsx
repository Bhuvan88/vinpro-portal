import React, { useEffect, useState } from 'react';
import { Card, Col, Row, Statistic } from 'antd';
import { useList, useTranslate } from '@refinedev/core';
import dayjs from "dayjs";
import moment from 'moment';
import { useTeam } from 'src/teamProvider';

const TotalOrders: React.FC = () => {
  const [todayOrders, setTodayOrders] = useState(0);
  const [weeklyOrders, setWeeklyOrders] = useState(0);
  const [monthlyOrders, setMonthlyOrders] = useState(0);
  const  t  = useTranslate();
  const { identity,selectedRole } = useTeam();
  const [isLoading, setLoading] = useState(true);

  const { data } = useList({
    resource: 'orders',
    metaData: {
      fields: ["id","merchant.name","customername","merchantorderstatus","date_created"]
    },
    pagination: {
      pageSize:-1
    },
    config: {
      filters: [
        {
          field: 'date_created',
          operator: 'gte',
          value: dayjs().startOf('month').format('YYYY-MM-DD'),
        },
        {
          field: 'date_created',
          operator: 'lte',
          value: dayjs().endOf('month').format('YYYY-MM-DD'),
        },
        {
          field:"merchant",
          operator:"eq",
          value:selectedRole== "Owner" ? identity?.merchant?.id : "",
        },
        {
          field:"merchantorderstatus",
          operator:"eq",
          value:"accepted",
        }      
      ],
    },
  });

  const TotalOrders = (orders: any[]) => {
    const today = moment().startOf('day'); 
    const startOfWeek = moment().startOf('week'); 
    const startOfMonth = moment().startOf('month');

    let todayCount = 0;
    let weeklyCount = 0;
    let monthlyCount = 0;

    orders.forEach(order => {
      const orderDate = moment(order?.date_created);
  
      //  today's orders
      if (orderDate?.isSame(today, 'day')) {
        todayCount += 1;
      }
  
      // weekly orders
      if (orderDate?.isSameOrAfter(startOfWeek, 'day')) {
        weeklyCount += 1;
      }
  
      // monthly orders
      if (orderDate?.isSameOrAfter(startOfMonth, 'day')) {
        monthlyCount += 1;
      }
    });

    setTodayOrders(todayCount);
    setWeeklyOrders(weeklyCount);
    setMonthlyOrders(monthlyCount);
  };

  useEffect(() => {
    if (data) {
      TotalOrders(data?.data);
      setLoading(false);
    }
  }, [data]);

 // console.log("data>>>>>", data);

  // console.log("todayOrders", todayOrders);
  // console.log("weeklyOrders", weeklyOrders);
  // console.log("monthlyOrders", monthlyOrders);

  return (
    <div>
      <Row gutter={16}>
        <Col span={8}>
          <Card bordered={false}>
            <Statistic
              title={t("Today Orders")}
              value={todayOrders}
              valueStyle={{ color:'black'}}
              suffix="orders"
              loading={isLoading}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card bordered={false}>
            <Statistic
              title={t("Weekly Orders")}
              value={weeklyOrders}
              valueStyle={{ color:'black' }}
              suffix="orders"
              loading={isLoading}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card bordered={false}>
            <Statistic
              title={t("Monthly Orders")}
              value={monthlyOrders}
              valueStyle={{ color:'black' }}
              suffix="orders"
              loading={isLoading}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default TotalOrders;
