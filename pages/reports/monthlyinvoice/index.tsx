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
  Popconfirm,
  message,
} from "antd";

import { IPost, ICategory } from "src/interfaces";
import React, { useEffect, useMemo, useState } from "react";
import { commonServerSideProps } from "src/commonServerSideProps";
import { useTeam } from "src/teamProvider";
import { CustomIcon } from "@components/datacomponents/CustomIcon";
import router from "next/router";
import dayjs from "dayjs";
import AvatarField from "@components/datacomponents/AvatarField";
import ColoredButton from "@components/buttons/ColoredButton";
import EditInvoice from "./edit";

export const getServerSideProps = commonServerSideProps;
const UserList: React.FC<IResourceComponentsProps<GetListResponse<IPost>>> = ({
  initialData,
}) => {
  const { RangePicker, MonthPicker } = DatePicker;
  const t = useTranslate();
  const apiUrl = useApiUrl();

  const { setSelectedMenu, setHeaderTitle, isAdmin, identity } = useTeam();
  const [toggleFilter, setToggleFilter] = useState(false);

  const statusType = [t('pending'), t('cancelled'), t('delivered'), t('paid'), t('accepted'), t('nekad')];
  
  const [startDate, setStartDate] = useState(
    dayjs().startOf("month").format("YYYY-MM-DD")
  );
  const [endDate, setEndDate] = useState(
    dayjs().endOf("month").format("YYYY-MM-DD")
  );
  const [record, setRecord] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filterValues, setFilterValues] = React.useState<any>(null);
  const [queryFilter, setQueryFilter] = React.useState<any>(null);
  const [newFilterValues, setNewFilterValues] = React.useState<any>(null);
  const [editId, setEditId] = useState<string | undefined>(undefined);
  const [ showDrawer, setShowDrawer] = useState<boolean>(false);
  const [loadingStates, setLoadingStates] = useState({});

  useEffect(() => {
    setSelectedMenu("/reports", "/reports/monthlyinvoice");
    setHeaderTitle(t("merchantmonthlyinvoice"));
    btnAction();
  }, []);

  useEffect(() => {
    if (queryFilter) {
      console.log('queryFilter', queryFilter);
      setRecord([]);
    
      setNewFilterValues(queryFilter);
      btnAction();
    }
  }, [queryFilter]);

  const btnAction = async () => {
    setLoading(true);
    const { data } = await refetch();
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
    url: apiUrl + "reports/monthlyinvoicereport",
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

  const onChangeMonth = (dates) => {
    console.log(dates);
  };

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
    resource: apiUrl + "reports/monthlyinvoicereport",
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

 
  const paidStatus = async (record:any) => {
    setLoading(true);
    console.log('record', record);

    let data = {
      id: record.id,
      status: 'paid'
    }
    fetch( process.env.NEXT_PUBLIC_API_URL +'reports/updateInvoicestatus/', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json;charset=UTF-8',
      },
      body: JSON.stringify(data),
      }) .then((response) => response.json())
      .then((data) => {
      console.log('Success:', data);
      setLoading(false);
      //refresh the data
      btnAction();
      
      
      })
      .catch((error) => {
      console.error('Error:', error);
      } );

  }

  const invoicemail = async (record:any) => {
    //setLoading(true);
    setLoadingStates(prev => ({ ...prev, [record.id]: true }));
    console.log('record', record);   
    fetch( process.env.NEXT_PUBLIC_API_URL +'invoice/sendinvoicepdf?id='+record.id, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json;charset=UTF-8',
      },    
      }) .then((response) => response.json())
      .then((data) => {
      console.log('Success:', data);
      //setLoading(false);
      setLoadingStates(prev => ({ ...prev, [record.id]: false }));
      message.success(t("mailsuccessfullysend"));
      btnAction();     
      })
      .catch((error) => {
      console.error('Error:', error);
      setLoading(false);
      }
     );
  }

  const deleteRecord = async (id:any) => {
    setLoading(true);
    console.log('delete record', id);
    fetch( process.env.NEXT_PUBLIC_API_URL +'reports/deleteInvoice/', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json;charset=UTF-8',
      },
      body: JSON.stringify({id:id}),
      }) .then((response) => response.json())
      .then((data) => {
      console.log('Success:', data);
      setLoading(false);
      //refresh the data
      btnAction();
      
      })
      .catch((error) => {
      console.error('Error:', error);
      } );
  }


  const editCallback = () => {
    setShowDrawer(false);
    setEditId(undefined);
    //refresh the data
    btnAction();

  };

  return (
    <>
     <Form
			layout="vertical"
      onValuesChange={(changedValues, allValues) => {
        setQueryFilter(allValues);
      }}
		>
		     <div className="card-container stickyheader">
           <div className="flex-row" style={{ alignItems: "center" }}>

            <Typography.Title level={5} className="headTitle">
              {t("merchantmonthlyinvoicereport")}
            </Typography.Title>         
					
            <Space>         	
                <Form.Item name="shopcity" className="card-search mt-20 ml-10">
                    <Select
						            style={{width:150}}
                        showSearch
                        placeholder={t("city")}
                        allowClear
                        {...merchantCity}
                    />
                    </Form.Item>            
         
              <Form.Item name="month" className="card-search mt-20 ml-10">
                  <MonthPicker
                      allowClear={false}
                      defaultValue={dayjs()}
                      format={"MMM"}
                      style={{ width: "100%" }}
                      onChange={(date, dateString) => {
                          onChangeMonth(date);
                      }}
                  />
              </Form.Item>
			  </Space>
          </div>       
        </div>  
	   </Form>
      
    {record.length > 0 ? <Table
            dataSource={record}
            loading={record.length > 0 ? false : true}
            rowKey="id"
            scroll={{ y: "calc(100vh - 240px)", x: "1350px" }}
            pagination={{
              hideOnSinglePage: true,
              pageSize:record?.length                 
            }}

            summary={(pageData) => {
              let totalsales = 0;
              let provision = 0;
              let catering = 0;
              let entryfee = 0;
              let advertsfee = 0;
              let otherfee = 0;
              let provision_moms = 0;
              let totalPay = 0;            
              pageData.forEach((item) => {
                totalsales += parseFloat(item.totalsales);
                provision += parseFloat(item.provision);
                catering += parseFloat(item.catering);
                entryfee += parseFloat(item.entryfee);
                advertsfee += parseFloat(item.advertsfee);
                otherfee += parseFloat(item.otherfee);
                provision_moms += parseFloat(item.provision_moms);
                totalPay +=isNaN(parseFloat(item.totalPay)) ? 0 : parseFloat(item.totalPay);            
              });
        
              
              return (
                <Table.Summary fixed>
                <Table.Summary.Row >
                  <Table.Summary.Cell index={0}/>
                <Table.Summary.Cell index={1}>
                  <TextField value={t("total")} style={{fontWeight:600,color:'#000',textAlign:'center',marginLeft:40}} />
                </Table.Summary.Cell>
                <Table.Summary.Cell index={2}/>                          
                <Table.Summary.Cell index={3}>
                  <TextField value={totalsales} style={{fontWeight:600}} />
                </Table.Summary.Cell>
                <Table.Summary.Cell index={4}>
                  <TextField value={provision} style={{fontWeight:600}} />
                </Table.Summary.Cell>
                <Table.Summary.Cell index={5}>
                  <TextField value={catering} style={{fontWeight:600}} />
                </Table.Summary.Cell>
                <Table.Summary.Cell index={6}>
                  <TextField value={entryfee} style={{fontWeight:600}} />
                </Table.Summary.Cell>
                <Table.Summary.Cell index={7}>
                  <TextField value={advertsfee} style={{fontWeight:600}} />
                </Table.Summary.Cell>
                <Table.Summary.Cell index={8}>
                  <TextField value={otherfee} style={{fontWeight:600}}/>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={9}>
                  <TextField value={provision} style={{fontWeight:600}} />
                </Table.Summary.Cell>
                <Table.Summary.Cell index={10}>
                  <TextField value={provision_moms} style={{fontWeight:600}} />
                </Table.Summary.Cell>
                <Table.Summary.Cell index={11}>
                  <TextField value={totalPay} style={{fontWeight:600}} />
                </Table.Summary.Cell>               
                </Table.Summary.Row>
                </Table.Summary>
              );
                   }}
            >
              <Table.Column
                width={70}
                dataIndex="sno"
                key="sno"
                title={t("sno")}
                render={(_, record, index: any) => index + 1}         
                  />
                         
            <Table.Column
                fixed
                width={150}
                dataIndex={"merchantname"}
                key="merchant"
                title={t("merchantname")}
                render={(_, item: any) => {
                    return (
                    <AvatarField
                        avatarImageProps={{
                        className: "mr-5",
                        }}
                        title={item?.merchantname}
                        linkUrl={undefined}
                        linkSrc={undefined}
                         imagesrc={item?.merchantlogo}
                    />
                    );
            }}/>

            <Table.Column
                width={120}
                dataIndex={"invoiceno"}
                key="invoiceno"
                title={t("invoiceno")}
                render={(_, item: any)=>{
                  return(
                    <div>{item?.merchant?.oldid}{"-"}{item?.invoiceno}</div>
                  )
                }}
            />

            <Table.Column
                width={110}
                dataIndex={"totalsales"}
                key="totalt"
                title={t("totalsales")}
                render={(value) => value && <TextField value={value} />}
            />

            <Table.Column
                width={120}
                dataIndex={"provision"}
                key="provision"
                title={t("provision")}
                render={(value) => value && <TextField value={value} />}
            />

             <Table.Column
                width={90}
                dataIndex={"catering"}
                key="cod"
                title={t("catering")}
                render={(value) => value && <TextField value={value} />}
            />

            <Table.Column
                width={90}
                dataIndex={"entryfee"}
                key="entryfee"
                title={t("entryfee")}
                render={(value) => value && <TextField value={value} />}
            />
            
              <Table.Column
                width={100}
                dataIndex={"advertsfee"}
                key="advertsfee"
                title={t("advertsfee")}
                render={(value) => value && <TextField value={value} />}
            />

              <Table.Column
                  width={90}
                  dataIndex={"otherfee"}
                  key="otherfee"
                  title={t("otherfee")}
                  render={(value) => value && <TextField value={value} />}
              />

            <Table.Column
                width={90}
                dataIndex={"total_fee"}
                key="provision"
                title={t("totalfee")}
                render={(value,item: any) => value && <TextField 
                  style={{color: item?.deliveryoffer ? "green" : "black"}}
                  value={value} />}
            />

            <Table.Column
                width={90}
                dataIndex={"provision_moms"}
                key="provision_moms"
                title={t("totalmoms")}
                render={(value,item: any) => value && <TextField 
                  style={{color: item?.deliveryoffer ? "green" : "black"}}
                  value={value} />}            
                 />

            <Table.Column
                width={90}
                dataIndex={"totalPay"}
                key="totalPay"
                title={t("totalpay")}
                render={(value,item: any) => value && <TextField 
                  style={{color: item?.deliveryoffer ? "green" : "black"}}
                  value={value} />}
            />
            
             <Table.Column
                width={120}
                dataIndex={"invoicedate"}
                key="invoicedate"
                title={t("invoicedate")}
                render={(value) => value && <TextField value={value} />}
            />                                   

            {/* <Table.Column
                width={90}
                dataIndex={"merchant_amount"}
                key="total"
                title={t("merchamt")}
                render={(value) => value && <TextField value={value} />}
            />

            <Table.Column
                width={90}
                dataIndex={"merchant_moms"}
                key="moms"
                title={t("merchmoms")}
                render={(value) => value && <TextField value={value} />}
            /> */}
                                   

            <Table.Column
                width={90}
                dataIndex={"status"}
                key="status"
                title={t("status")}
                render={((_, record:any) => (
                  (record.status=='unpaid') ? 
                  <Popconfirm
                  title={t("areyousuretowanttopaid?")}
                  onConfirm={() => paidStatus(record)}
                  okText={t("yes")}
                  cancelText={t("no")}
                >
                  <Button ghost style={{color:'red'}}
                  >{t("unpaid")}</Button>
                  
                  {/* <TextField value={'Unpaid'} style={{color:'red'}} /> */}
                
                </Popconfirm>
                : <Button ghost style={{color:'green'}} >{t("paid")}</Button>
                ))}
                
            />

            <Table.Column
                width={250}
                title={t("actions")}
                dataIndex="actions"
                render={(_, record:any) => (
                    <Space size="middle">
                        <Button
                            type="default"
                            onClick={() => {                               
                              setEditId(record);
                              setShowDrawer(true);
                            }}
                        >
                           <CustomIcon type="EditOutlined" styleProps={{ style: { color:'blue'} }} />
                        </Button>
                        {/* download pdf*/}
              
                        <a href={process.env.NEXT_PUBLIC_API_URL +`invoice/invoicepdf?id=${record.id}`} target="_blank">
                        <Button
                            type="default"
                           
                        >
                            <CustomIcon type="DownloadOutlined" styleProps={{ style: { color:'red'} }} />
                        </Button>
                        </a>
                          {/* send email */}
                          <Popconfirm
                             title={t("areyousuretosendmailtotherestaurant")} 
                             okText={t("yes")}
                             cancelText={t("no")}
                             onConfirm={() => invoicemail(record)}
                             >
                            <Button type="default" disabled={loadingStates[record.id]}>
                            {loadingStates[record.id] ? <Spin size="small" /> : <CustomIcon type="MailOutlined" styleProps={{ style: { color: 'green' } }} />}                          
                            </Button>
                        </Popconfirm> 
                        
                        {/* delete button */}
                       <Popconfirm  
                          title={t("areyousuretodelete?")}
                          onConfirm={() => {
                              deleteRecord(record.id);
                          }
                          }
                          okText={t("yes")}
                          cancelText={t("no")}
                                                 
                        >
                          <Button type="default">

                            <CustomIcon type="DeleteOutlined" styleProps={{ style: { color:'red'} }}/>
                          </Button>
                        </Popconfirm>
                        
                    </Space>
                )}
            />

        </Table>
        : <div className="spincontainer"> {loading ? <Spin /> : <Empty />}</div>
    }
     {editId && <EditInvoice callback={editCallback} visible={showDrawer} record={editId} id={"editId"}  />}
    </>
  );
};
export default UserList;
