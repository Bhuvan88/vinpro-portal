import {
  IResourceComponentsProps,
  GetListResponse,
  useTranslate,
  CrudFilters,
} from "@refinedev/core";

import {
  TextField,
  getDefaultSortOrder,
  DateField,
  useTable,
  useSelect,
  TagField,
} from "@refinedev/antd";

import {
  Table,
  Form,
  Input,
  Card,
  Typography,
  Select,
  Row,
  DatePicker,
  Col,
  Avatar,
  Space,
  Tooltip,
  Popover,
  Button
} from "antd";

import { IPost } from "src/interfaces";
import AvatarField from "@components/datacomponents/AvatarField";
import React, { useEffect, useState } from "react";
import { commonServerSideProps } from "src/commonServerSideProps";
import { useTeam } from "src/teamProvider";
import { CustomIcon } from "@components/datacomponents/CustomIcon";
import dayjs from "dayjs";
import { CheckOutlined, CloseOutlined, SyncOutlined, TruckOutlined } from "@ant-design/icons";
import EditMissingStatus from "./edit";

export const getServerSideProps = commonServerSideProps;

const UserList: React.FC<IResourceComponentsProps<GetListResponse<IPost>>> = ({
  initialData,
}) => {
  const t = useTranslate();
  const { setSelectedMenu, setHeaderTitle, isAdmin, identity,selectedRole } = useTeam();
  const [tableHeight, setTableHeight] = useState(400);
  const {RangePicker}=DatePicker;
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [editId, setEditId] = useState<string | undefined>(undefined);
  const [ showDrawer, setShowDrawer] = useState<boolean>(false);

  useEffect(() => {
    // Calculate table height based on 20 rows per page
    const rowHeight = 54; // Assuming each row is 54px height
    const paginationHeight = 64; // Ant Design Pagination component height
    const newTableHeight = rowHeight * 20 + paginationHeight;
    setTableHeight(newTableHeight);
  }, []);

  useEffect(() => {
    setSelectedMenu("/reports", "/reports/Missingorders");
    setHeaderTitle(t("merchantmissingorders"));
  }, []);

  const merchantFilter = ():CrudFilters =>{
    
    if(isAdmin())
    {
      return [
        {
          field: "paymentstatus",
          operator: "ne",
          value: "paid",
        }
      ];
    }else{
      return [{
        field: "merchant",
        operator: "eq",
        value: identity?.merchant?.id,
      },
    ]
    }
  };

   const onDatechange = (dates, dateStrings) => {
    if (dates) {
      const start = dates[0].startOf("day").toISOString();
      const end = dates[1].endOf("day").toISOString();     
      setStartDate(start);
      setEndDate(end);
    }
  };
  useEffect(() => {
    const today = dayjs();
    const startOfDay = today.startOf("day").toISOString();
    const endOfDay = today.endOf("day").toISOString();
    setStartDate(startOfDay);
    setEndDate(endOfDay);
  }, []);

  const { tableProps, sorters, searchFormProps } =
    useTable<any>({
      resource: "orders",
     syncWithLocation: true,
     pagination:{
      pageSize:20,
      mode:"server"
     },
      queryOptions: {
        initialData,
      },
      metaData: {
        fields: ["id","merchant.name","merchant_mins","merchant.id","referenceno","customername","customermobile","merchantorderstatus",
                  "paymenttype","ordertype","price","deliveryaddress","date_created","service_offer","orderdata","paymentstatus","platform"]
      },
      initialFilter:merchantFilter(),

      onSearch: (params: any) => {
        const filters: CrudFilters = [];
        const { search,merchant,daterange } = params;

        filters.push({
          field: "search",
          operator: "contains",
          value: search,
        });
       
        filters.push({
        field: "merchant",
        operator: "eq",
        value: merchant,
       });


        filters.push({
          field:"date_created",
          operator:"between",
          value:daterange?[startDate, endDate]:null,
        });
    

      return filters;
    },
    sorters:{
      permanent: [
        {
          field: "date_created",
          order: "desc",
        },
      ]
    }
     
    });


    const colorStatus = (color) => {
      let colors = "";
      switch (color) {
         case "accepted":
          colors = "success";
          break;
         case "rejected":
           colors = "error";
          break;
         case "pending":
          colors = "processing";
          break;
      }
      return colors;
    };

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

    const content=(
      <div>
          <Form.Item name="merchant" className="card-search mt-20 ml-10">
                  <Select
                  showSearch                 
                  placeholder={t("merchantname")}
                  allowClear
                  {...merchantSelectProps}
                  />
                </Form.Item>

            <Form.Item name="daterange" className="card-search mt-20 ml-10">							
              <RangePicker                
								allowClear={true} 
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
    );

    const editCallback = () => {
      setShowDrawer(false);
      setEditId(undefined);
  
    };

  return (
    <>
       <Form layout="vertical" {...searchFormProps} 
	   onValuesChange={() => {
			searchFormProps.form?.submit();
		}}
	  >
        <div className="card-container stickyheader">
          <div className="flex-row" style={{ alignItems: "center" }}>
            <Typography.Title level={5} className="headTitle">
              {t("missingorders")}
            </Typography.Title>
           </div>
            <div style={{justifyContent:"flex-end",marginRight:50}}>
                <Space>
                <Form.Item name="search"className="card-search mt-20 ml-10">
                    <Input                  
                        allowClear 
                        className="search-input"
                        placeholder={t("search")}
                        prefix={<CustomIcon type="SearchOutlined" />}
                    />
                 </Form.Item>

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
             
      <Table {...tableProps} rowKey="id" 
      //scroll={{ x: 'max-content', y: tableHeight }}
      scroll={{ y: "calc(100vh - 220px)", x: "1480px" }}
      pagination={{
            ...tableProps.pagination,
            ...{
              size: "small", 
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) =>
                `${t("showing")} ${range[0]}-${range[1]} ${t("of")} ${total} ${t("items")}`,
            },
          }} 
      // if service offer this order then green color otheise black color
      //rowClassName={(record) => record.serviceoffer ? 'serviceoffer' : ''}
     
      >
        <Table.Column
        width={65}
          dataIndex="sno"
          key="sno"
          title={t("sno")}
          render={(_, record, index: any) => index + 1}
          
        />

         <Table.Column
          width={150}
          dataIndex="referenceno"
          key="referenceno"
          title={t("ref#")}
          render={(value,record:any) => value && 
            <>           
            <TextField
              style={{color: record?.service_offer ? "green" : "black"}}
               value={value}/>                                                           
              {record?.service_offer &&
                     <Tooltip title={t("deliveryserviceoffered")}>                     
                        <TruckOutlined style={{ color: 'green',marginLeft:5,fontSize:17 }} />
                     </Tooltip>
                    }  
           </>
            }
        />
        
        <Table.Column
         width={150}
          dataIndex={["merchant","name"]}
          key="merchant"
          title={t("merchant")}
          render={(value,record:any) => value && <TextField 
            style={{color: record?.service_offer ? "green" : "black"}}
            value={value}/>}
        />
         
        <Table.Column
         width={150}
          dataIndex="customername"
          key="first_name"
          title={t("name")}
         render={(value,record:any) => value && <TextField
          style={{color: record?.service_offer ? "green" : "black"}}
             value={value}/>}
        />
         
        <Table.Column
         width={120}
          dataIndex="customermobile"
          key="mobile"
          title={t("mobile")}
          render={(value,record:any) => <TextField
          style={{color: record?.service_offer ? "green" : "black"}}
             value={value} />}
          
        />
        
         {/* <Table.Column
         width={110}
          dataIndex="merchantorderstatus"
          key="merchantorderstatus"
          title={t("confirmed")}
          render={(value) => <TextField  
           // style={{color: value === "accepted" ? "green" : value === "rejected" ? "red" : value === "pending" ? "orange" : "black"}}
            value={t(value)}
             />}
        /> */}

        <Table.Column
         width={150}
          dataIndex="paymentstatus"
          key="paymentstatus"
          title={t("paymentstatus")}
          render={(_, record: any) => {            
                  return (
                    record && (                                 
                        <TagField
                          value={t(record?.paymentstatus)}                    
                          style={{textTransform: "capitalize",cursor:'pointer'}}
                          color={colorStatus(record?.paymentstatus)}
                          icon={record?.paymentstatus == "accepted" ? <CheckOutlined /> :
                            record?.paymentstatus == "rejected" ? <CloseOutlined/>  : <SyncOutlined/>}
                            onClick={() => {                     
                              setEditId(record);
                              setShowDrawer(true);
                            }}
                        />                
                    )
                  );
                }}
        />

      <Table.Column
         width={95}
          dataIndex="platform" 
          key="platform"
          title={t("Device")}
          render={(value,record:any) => <TextField 
            style={{color: record?.service_offer ? "green" : "black" , textTransform:'capitalize'}}
            value={t(value)}
           />}     
        />

        <Table.Column
         width={100}
          dataIndex="ordertype"
          key="ordertype"
          title={t("Trans.Type")}
          render={(value,record:any) => <TextField 
            style={{color: record?.service_offer ? "green" : "black" , textTransform:'capitalize'}}
            value={t(value)} />}      
        />
           
         <Table.Column
          width={130}
          dataIndex={'paymenttype'}
          key="paymenttype"
          title={t("paymenttype")}
          // render={(value) => value && <TextField value={value} />}
          render={(_, record: any) => {
            return (
      
              <div>
              {
              record?.paymenttype == "swish" ?
                <div>
                <Avatar  src="/images/swish.png" style={{marginRight:"5px"}}></Avatar>
                <TextField value={record?.paymenttype} style={{textTransform:'capitalize',color: record?.service_offer ? "green" : "black"}}/>
                </div>
              :
              record?.paymenttype == "cod" ?
                <div>
                <Avatar  src="/images/cod.png" style={{marginRight:"5px"}}></Avatar>
                <TextField value={t(record?.paymenttype)} style={{textTransform:'capitalize',color: record?.service_offer ? "green" : "black"}}/>
                </div>
              :
                <div>
                <Avatar  src="/images/klarna.png" style={{marginRight:"5px"}}></Avatar>
                <TextField value={record?.paymenttype} style={{textTransform:'capitalize',color: record?.service_offer ? "green" : "black"}}/>
                </div>
              }               
              </div>
                    
            );
            }}
          />       

      <Table.Column
          width={100}
          dataIndex="price"
          key="price"
          title={t("total")}
          render={(value,record:any) =>{
            const processingFee = selectedRole === "Owner" ? 0 : record?.orderdata?.processingfee;
            const price = record?.price;
            const total = price + processingFee;          
            return (
            <TextField
             style={{color: record?.service_offer ? "green" : "black"}}            
             value={total + " kr"} />
            );
          }}
        />

      <Table.Column
         width={120}
          dataIndex="deliveryaddress"
          key="zipcode"
          title={t("zipcode")}
          render={(value,record:any) =>
             <><TextField
                   style={{ color: record?.service_offer ? "green" : "black" }}
                   value={value?.zipcode} />  <br/>
              <TextField
                 style={{ color: record?.service_offer ? "green" : "black" }}
                 value={value?.city} />
              </>}
        /> 

        <Table.Column
          width={120}
          dataIndex="date_created"
          key="date_created"
          title={t("placed")}
          render={(value,record:any) => value && <DateField 
            style={{color: record?.service_offer ? "green" : "black"}}
            value={value} format="MMM DD, YYYY HH:mm" />}
          defaultSortOrder={getDefaultSortOrder("date_created", sorters)}
          //sorter
        />

    <Table.Column
          width={100}
          title={t("actions")}
          dataIndex="actions"
          render={(_, record:any) => (
            <Space>
              <div
                className="actionBtn"
                onClick={() => {
                  //setShowId(record);
                  //console.log("record",record);
                  setEditId(record);
                  setShowDrawer(true);
                }}
              >
                <CustomIcon type="EditOutlined" />
              </div>            
            </Space>
            
          )}
        /> 

      </Table>
      {editId && <EditMissingStatus callback={editCallback} visible={showDrawer} record={editId} id={"editId"} />}
    </>
  );
};

export default UserList;
