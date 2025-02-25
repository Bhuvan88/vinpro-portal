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
	BooleanField,
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
	Popconfirm
  } from "antd";
import { IPost, ICategory } from "src/interfaces";
import React, { useEffect, useMemo, useState } from "react";
import { commonServerSideProps } from "src/commonServerSideProps";
import { useTeam } from "src/teamProvider";
import { CustomIcon } from "@components/datacomponents/CustomIcon";
import router from "next/router";
import dayjs from "dayjs";
import AvatarField from "@components/datacomponents/AvatarField";
import { Footer } from "@components/layout";
import { parse } from "path";

export const getServerSideProps = commonServerSideProps;
const UserList: React.FC<IResourceComponentsProps<GetListResponse<IPost>>> = ({
  initialData,
}) => {
  const { RangePicker, MonthPicker } = DatePicker;
  const t = useTranslate();
  const apiUrl = useApiUrl();

  const { setSelectedMenu, setHeaderTitle, isAdmin, identity } = useTeam();
  const [toggleFilter, setToggleFilter] = useState(false);
  const statusType = [
    "pending",
    "cancelled",
    "delivered",
    "paid",
    "accepted",
    "nekad",
  ];
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

  useEffect(() => {
    setSelectedMenu("/reports", "/reports/monthlyreport");
    setHeaderTitle(t("merchantmonthlyreport"));
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
    url: apiUrl + "reports/monthlyreport",
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
    resource: apiUrl + "reports/monthlyreport",
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

  const confirm = async (record:any) => {
	//start loading
	setLoading(true);
	//console.log('record', record);

	//get Start Date and End Date of the month
	let startDate = dayjs().startOf("month").format("YYYY-MM-DD");
	let endDate = dayjs().endOf("month").format("YYYY-MM-DD");
	if(queryFilter && queryFilter.month){
		startDate = dayjs(queryFilter.month).startOf("month").format("YYYY-MM-DD");
		endDate = dayjs(queryFilter.month).endOf("month").format("YYYY-MM-DD");
	}
	record.startDate = startDate;
	record.endDate = endDate;

	console.log('record', record);
	let data = record;
	data.status = 'approved';
	fetch( process.env.NEXT_PUBLIC_API_URL +'reports/invoiceapprove/', {
		method: 'POST',
		headers: {
		  Accept: 'application/json',
		  'Content-Type': 'application/json;charset=UTF-8',
		},
		body: JSON.stringify(record),
	  }) .then((response) => response.json())
	  .then((data) => {
		console.log('Success:', data);
		//display success message
		//stop loading
		setLoading(false);
		//refresh the data
		btnAction();

	  })
	  .catch((error) => {
		console.error('Error:', error);
	  } );

  }

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
					{t("merchantmonthlyreport")}
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

	  	{record.length > 0 ?  
		<Table
			dataSource={record}			
			loading={record.length > 0 ? false : true}
			rowKey="id"
			scroll={{ y: "calc(100vh - 225px)", x: "1850px" }}
			pagination={{
				hideOnSinglePage: true,
				pageSize:record?.length                 
			  }}
			 
			summary={(pageData) => {
			let totalamount = 0;
			let merchamount = 0;
			let merchmoms = 0;
			let cod = 0;
			let delivery = 0;
			let commission = 0;
			let extra = 0;
			let merchantcomm = 0;
			let provi = 0;
			let provimoms = 0;
			let proviwithmoms = 0;
			pageData.forEach((item) => {
				totalamount += parseFloat(item.totalamount);
				merchamount += isNaN(parseFloat(item.merchamount)) ? 0 : parseFloat(item.merchamount);
				merchmoms += isNaN(parseFloat(item.merchmoms)) ? 0 : parseFloat(item.merchmoms);
				cod += parseFloat(item.cod);
				delivery += parseFloat(item.delivery);
				commission += isNaN(parseFloat(item.commission)) ? 0 : parseFloat(item.commission);
				extra += parseFloat(item.extra);
				merchantcomm += parseFloat(item.merchantcomm);
				provi += isNaN(parseFloat(item.provi)) ? 0 : parseFloat(item.provi);
				provimoms += isNaN(parseFloat(item.provimoms)) ? 0 : parseFloat(item.provimoms);
				proviwithmoms +=  parseFloat(item.proviwithmoms);

			});
			
			return (
				<Table.Summary fixed>
				<Table.Summary.Row >
					<Table.Summary.Cell index={0}></Table.Summary.Cell>
				<Table.Summary.Cell index={1}>
					<TextField value={t("total")} style={{fontWeight:600,color:'#000',textAlign:'center',marginLeft:40}} />
				</Table.Summary.Cell>
				<Table.Summary.Cell index={2}>
					<TextField value={totalamount?.toFixed(2)} style={{fontWeight:600}} />
				</Table.Summary.Cell>
				<Table.Summary.Cell index={3}>
				<TextField value={merchamount?.toFixed(2)} style={{fontWeight:600}} />
				</Table.Summary.Cell>
				<Table.Summary.Cell index={4}>
					<TextField value={merchmoms?.toFixed(2)} style={{fontWeight:600}} />
				</Table.Summary.Cell>
				<Table.Summary.Cell index={5}>
					<TextField value={cod?.toFixed(2)} style={{fontWeight:600}} />
				</Table.Summary.Cell>
				<Table.Summary.Cell index={6}>
					<TextField value={delivery?.toFixed(2)} style={{fontWeight:600}} />
				</Table.Summary.Cell>
				<Table.Summary.Cell index={7}>
					<TextField value={commission?.toFixed(2)} style={{fontWeight:600}} />
				</Table.Summary.Cell>
				<Table.Summary.Cell index={8}>
					<TextField value={extra?.toFixed(2)} style={{fontWeight:600}}/>
				</Table.Summary.Cell>
				<Table.Summary.Cell index={9}>
					<TextField value={merchantcomm?.toFixed(2)} style={{fontWeight:600}} />
				</Table.Summary.Cell>
				<Table.Summary.Cell index={10}>
					<TextField value={provi?.toFixed(2)} style={{fontWeight:600}} />
				</Table.Summary.Cell>
				<Table.Summary.Cell index={11}>
					<TextField value={proviwithmoms?.toFixed(2)} style={{fontWeight:600}} />
				</Table.Summary.Cell>
				<Table.Summary.Cell index={12}>
					<TextField value={provimoms?.toFixed(2)} style={{fontWeight:600}} />
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
				width={200}
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
			}}/>

			<Table.Column
				width={150}
				dataIndex={"totalamount"}
				key="totalt"
				title={t("Totalt")}
				render={(value) => value && <TextField value={value} />}
			/>

			<Table.Column
				width={130}
				dataIndex={"merchamount"}
				key="total"
				title={t("merchamt")}
				render={(value) => isNaN(value)?  <TextField value={0} /> : <TextField  value={value}/> }
			/>

			<Table.Column
				width={130}
				dataIndex={"merchmoms"}
				key="moms"
				title={t("merchmoms")}
				render={(value) => isNaN(value)?  <TextField value={0} /> : <TextField  value={value}/> }
			/>

			<Table.Column
				width={100}
				dataIndex={"cod"}
				key="cod"
				title={t("cod")}
				render={(value) => value && <TextField value={value} />}
			/>

			<Table.Column
				width={100}
				dataIndex={"delivery"}
				key="Delivery"
				title={t("delivery")}
				render={(value) => value && <TextField value={value} />}
			/>

			<Table.Column
				width={120}
				dataIndex={"commission"}
				key="commission"
				title={t("commission")}
				render={(value) => isNaN(value)?  <TextField value={0} /> : <TextField  value={value}/> }
			/>

			<Table.Column
				width={100}
				dataIndex={"extra"}
				key="extra"
				title={t("extra")}
				render={(value) => value && <TextField value={value} />}
			/>

			<Table.Column
				width={150}
				dataIndex={"merchantcomm"}
				key="merccomm"
				title={t("merchcomm%")}
				render={(value) => value && <TextField value={value} />}
			/>

			<Table.Column
				width={100}
				dataIndex={"provi"}
				key="provi"
				title={t("provi")}
				render={(value,item: any) => isNaN(value)? 
				 <TextField style={{color: item?.deliveryoffer ? "green" : "black"}} value={0} /> : 
				 <TextField 
					style={{color: item?.deliveryoffer ? "green" : "black"}}
				 	value={value}/> }
			/>

			<Table.Column
				width={130}
				dataIndex={"proviwithmoms"}
				key="proviwithmoms"
				title={t("provi+moms")}
				render={(value,item: any) =>  
				 //<TextField value={0} style={{color: item?.deliveryoffer ? "green" : "black"}} /> :
				 <TextField value={value}
				   style={{color: item?.deliveryoffer ? "green" : "black"}}
					/> }
			/>
			<Table.Column
				width={130}
				dataIndex={"provimoms"}
				key="provimoms"
				title={t("provimoms")}
				render={(value,item: any) => isNaN(value)?  <TextField value={0} style={{color: item?.deliveryoffer ? "green" : "black"}}/> : 
				<TextField 
				style={{color: item?.deliveryoffer ? "green" : "black"}}
				value={value}/> }
			/>

		  <Table.Column
				width={100}
				dataIndex={"status"}
				key="status"
				title={t("status")}
				render={(value) => value && <TextField value={value} />}
			/>		 

         <Table.Column
          title={t("actions")}
          dataIndex="actions"
          render={(_, record:any) => (
			(record.invoiceApproved == true ? <Button disabled>{t("approved")}</Button> :
			<Popconfirm
                    title={t("areyousurewanttoapprove?")}
                    onConfirm={() => confirm(record)}
                    okText={t("yes")}
                    cancelText={t("no")}
                  >
                    
                     <Button >{t("approve")}</Button>
                  
                  </Popconfirm>
			)
          )}
        /> 
		
		</Table>
		: <div className="spincontainer"> {loading ? <Spin /> : <Empty />}</div>
	} 
    </>
  );
};
export default UserList;
