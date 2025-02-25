import {
  IResourceComponentsProps,
  GetListResponse,
  useTranslate,
  CrudFilters,
  useExport,
  useCustom,
  useApiUrl,
} from "@refinedev/core";
import {
  TextField,
  useSelect,
} from "@refinedev/antd";
import {
  Table,
  Space,
  DatePicker,
  Button,
  Form,
  Input,
  Card,
  Typography,
  Tooltip,
  Row,
  Col,
  Select,
  Spin,
  Empty,
  Popover,
} from "antd";

import { IPost, ICategory } from "src/interfaces";
import React, { useEffect, useMemo, useState } from "react";
import { commonServerSideProps } from "src/commonServerSideProps";
import { useTeam } from "src/teamProvider";
import { CustomIcon } from "@components/datacomponents/CustomIcon";
import router from "next/router";
import dayjs from "dayjs";
import AvatarField from "@components/datacomponents/AvatarField";

export const getServerSideProps = commonServerSideProps;
const UserList: React.FC<IResourceComponentsProps<GetListResponse<IPost>>> = ({
  initialData,
}) => {
  const { RangePicker } = DatePicker;
  const t = useTranslate();
  const apiUrl = useApiUrl();

  const { setSelectedMenu, setHeaderTitle } = useTeam();
  const [record, setRecord] = useState([]);
  const [loading, setLoading] = useState(false);

  const [filterValues, setFilterValues] = React.useState<any>(null);
  const [queryFilter, setQueryFilter] = React.useState<any>(null);
  const [newFilterValues, setNewFilterValues] = React.useState<any>(null);
 const [startDate, setStartDate] = useState(dayjs().startOf('month').format('YYYY-MM-DD'));
  const [endDate, setEndDate] = useState(dayjs().endOf('month').format('YYYY-MM-DD'));
  

  useEffect(() => {
    setSelectedMenu("/reports", "/reports/salessummary");
    setHeaderTitle(t("merchantsalessummary"));
    btnAction();
  }, []);

  useEffect(() => {
    if (queryFilter) {
      console.log('queryFilter', queryFilter);
      setRecord([]);
      //setNewFilterValues(null);
      /*
		let obj = {};
		if(queryFilter?.shopid)
		{
			obj = { id : queryFilter?.shopid };
		}
		*/
      setNewFilterValues(queryFilter);
      btnAction();
    }
  }, [queryFilter]);

  const btnAction = async () => {
    setLoading(true);
    const { data } = await refetch();
  };

  const onDatechange = (dates, dateStrings) => {
    setStartDate(dates?.[0].format('YYYY-MM-DD'));
    setEndDate(dates?.[1].format('YYYY-MM-DD'));
  };
    
  let queryOption = {
    query: {
      search: filterValues?.search ? filterValues?.search : null,
      //limit : -1,
      //fields : ["*","banner.*","logo.*","zone.*"],
      //sort : filters?.sorting ? filters?.sorting : null,
      filter: newFilterValues ? newFilterValues : null,
    },
  };

  // For merchant custom Query
  const { refetch, isLoading: dataLoading } = useCustom<any>({
    url: apiUrl + "reports/salessummary",
    method: "get",
    config: queryOption,
    queryOptions: {
      enabled: true,
      onSuccess: (data) => {
        console.log("data **", data);
        setLoading(false);
        setRecord(data?.data);
      },
      onError: (error) => {
        console.log("error", error);
      },
    },
  });


  const { selectProps: merchantSelectProps } = useSelect({
    resource: "merchant",
    optionLabel: "name",
    optionValue: "id",
    pagination:{
      pageSize:20
    },

    onSearch: (params: any) => {
      const filters: CrudFilters = [];

      filters.push({
        field: "search",
        operator: "contains",
        value: params,
      });
      return filters;
    },
    sorters: [
      {
        field: "name",
        order: "asc",
      },
    ],
  });

  const { selectProps: merchantCity } = useSelect({
    resource: "city",
    optionLabel: "name",
    optionValue: "id",
    sorters: [
      {
        field: "name",
        order: "asc",
      },
    ],
    filters: [
      {
        field: "name",
        operator: "ne",
        value:"Namakkal",
      },
    ],
    pagination:{
      pageSize:-1
    },
  });

  const { triggerExport, isLoading } = useExport<any>({
    resource: apiUrl + "reports/salessummary",
    mapData: (response) => {
      console.log("response", response);
      var item = response?.data;
      return {
        //Reference_no:item?.referenceno,
        Merchant_Name: item?.merchant?.name,
        Total_Sales: item?.totalsales,
        Total_Amount: item?.totalamount,
        Paynow: item?.paynow,
        COD: item?.cod,
        Delivery_cost: item?.deliverycost,
        Commission: item?.commission,
        Extra_cost: item?.extracost,
      };
    },
  });

  const content=(
    <div>
        <Form.Item name="shopcity" className="card-search mt-20 ml-10">
                <Select                 
                    showSearch
                    placeholder={t("city")}
                    allowClear
                    {...merchantCity}
                />
                </Form.Item>
                    
                <Form.Item name="shopid" className="card-search mt-20 ml-10">
                  <Select                 
                    showSearch
                    placeholder={t("merchantname")}
                    allowClear
                    {...merchantSelectProps}
                  />
                </Form.Item>

                 <Form.Item name="daterange" className="card-search mt-20 ml-10">   
                <RangePicker                
                 allowClear={false}								 
								//defaultValue={[dayjs(startDate, 'YYYY-MM-DD'), dayjs(endDate, 'YYYY-MM-DD')]}
                 placeholder={[t('startdate'),t('enddate')]}
							 	onChange={onDatechange}
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
    </div>
  )


  return (
    <>
    <Form
			layout="vertical"
      onValuesChange={(changedValues, allValues) => {
        setQueryFilter(allValues);
     //   console.log("allValues", allValues);
      setQueryFilter({
        shopcity: allValues.shopcity,
        shopid: allValues.shopid,
        daterange:allValues.daterange && [allValues.daterange?.[0].format("YYYY-MM-DD"), allValues.daterange?.[1].format("YYYY-MM-DD")],
      })

      }}
		>
		    <div className="card-container stickyheader">
          <div className="flex-row" style={{ alignItems: "center" }}>
            <Typography.Title level={5} className="headTitle">
            {t("merchantsalessummary")}
            </Typography.Title>
          </div>
            <div style={{justifyContent:"flex-end",marginRight:50}}>
                <Space> 
                  <Tooltip title={t("Filter")}>
                              <Popover
                                placement="bottom"
                                trigger="hover"
                                content={content}                     
                              >
                                <Button
                                  size="middle"                      
                                  icon={<CustomIcon type="FilterFilled" />}
                                  className="filter-btn"                           
                                />
                              </Popover>
                            </Tooltip>	           
                  </Space>
              </div>                 
        </div>      
	   </Form>

    {record.length > 0 ? 
      <Table
        dataSource={record.length > 0 ? record : null}
        loading={record.length > 0 ? false : true}
        rowKey="id"
        scroll={{ y: "calc(100vh - 225px)", x: "1300px" }}
        pagination={{
          hideOnSinglePage: true,
          pageSize:record?.length                 
        }}
        summary={(pageData) => {
          let totalsales = 0;
          let totalamount = 0;
          let paynow = 0;
          let cod = 0;
          let delivery = 0;
          let commission = 0;
          let extra = 0;
            pageData.forEach((item) => {
            totalsales += parseFloat(item.totalsales);
            totalamount += parseFloat(item.totalamount);
            paynow += parseFloat(item.paynow);
            cod += parseFloat(item.cod);
            delivery += parseFloat(item.delivery);
            commission += isNaN(parseFloat(item.commission)) ? 0 : parseFloat(item.commission);          
            extra += parseFloat(item.extra);
          });

          return (
            <Table.Summary fixed>
            <Table.Summary.Row>
            <Table.Summary.Cell index={0}></Table.Summary.Cell>
            <Table.Summary.Cell index={1}>
              <TextField value={t("total")} style={{fontWeight:600,color:'#000',textAlign:'center',marginLeft:40}} />
            </Table.Summary.Cell>
            <Table.Summary.Cell index={2}>
              <TextField value={totalsales} style={{fontWeight:600}} />
            </Table.Summary.Cell>
            <Table.Summary.Cell index={3}>
              <TextField value={totalamount?.toFixed(2)} style={{fontWeight:600}} />
            </Table.Summary.Cell>
            <Table.Summary.Cell index={4}>
              <TextField value={paynow?.toFixed(2)} style={{fontWeight:600}} />
            </Table.Summary.Cell>
            <Table.Summary.Cell index={5}>
              <TextField value={cod?.toFixed(2)} style={{fontWeight:600}} />
            </Table.Summary.Cell>
            <Table.Summary.Cell index={6}>
              <TextField value={delivery?.toFixed(2)} style={{fontWeight:600}} />
            </Table.Summary.Cell>
            <Table.Summary.Cell index={7}>
            <TextField value={commission?.toFixed(2)} style={{ fontWeight: 600 }}/>
            </Table.Summary.Cell>
            <Table.Summary.Cell index={8}>
              <TextField value={extra?.toFixed(2)} style={{fontWeight:600}}/>
            </Table.Summary.Cell>          
            </Table.Summary.Row>
            </Table.Summary>
          );      
          }}
      >

     <Table.Column
				width={50}
				dataIndex="sno"
				key="sno"
				title={t("sno")}
				render={(_, record, index: any) => index + 1}         
        	/>

        <Table.Column
          width={150}
          dataIndex={"name"}
          key="merchant"
          title={t("merchantname")}
          render={(_, item: any) => {
            return (
              <AvatarField
                avatarImageProps={{
                  className: "mr-5",
                }}
                title={item?.name}
                linkUrl={undefined}
                linkSrc={undefined}
                imagesrc={item?.logo}
              />
            );
          }}
        />

        <Table.Column
          width={110}
          dataIndex={"totalsales"}
          key="totalsales"
          title={t("totalsales")}
          render={(value) => value && <TextField value={value} />}
        />

        {
          <Table.Column
            width={100}
            dataIndex={"totalamount"}
            key="totalamount"
            title={t("totalamount")}
            render={(value) => value && <TextField value={value} />}
          />
        }

        {
          <Table.Column
            width={90}
            dataIndex={"paynow"}
            key="paynow"
            title={t("paynow")}
            render={(value) => value && <TextField value={value} />}
          />
        }
        {
          <Table.Column
            width={80}
            dataIndex={"cod"}
            key="cod"
            title={t("COD")}
            render={(value) => value && <TextField value={value} />}
          />
        }

      {
          <Table.Column
            width={130}
            dataIndex={"delivery"}
            key="deliverycost"
            title={t("deliverycost")}
            render={(value,item: any) => value && <TextField 
              style={{color: item?.deliveryoffer ? "green" : "black"}}
              value={value} />}
          />
        }

        {        
          <Table.Column
            width={100}
            dataIndex={"commission"}
            key="commission"
            title={t("commission")}
            render={(value,item: any) => isNaN(value) ? <TextField value={0} /> : 
            <TextField 
              style={{color: item?.deliveryoffer ? "green" : "black"}}
               value={value}/> }
          />
        }

        {
          <Table.Column
            width={100}
            dataIndex={"extra"}
            key="extracost"
            title={t("extracost")}
            render={(value,item: any) => value && <TextField 
              style={{color: item?.deliveryoffer ? "green" : "black"}}
              value={value} />}
          />
        }
      </Table>: <div className="spincontainer"> {loading ? <Spin /> : <Empty />}</div>
	  }

    </>
  );
};
export default UserList;
