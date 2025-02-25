import {
  IResourceComponentsProps,
  GetListResponse,
  useTranslate,
  CrudFilters,
  useExport,
} from "@refinedev/core";

import {
  TextField,
  DateField,
  useTable,
  ExportButton,
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
	Avatar,
	Popover,
  } from "antd";

import { IPost } from "src/interfaces";
import React, { useEffect, useState } from "react";
import { commonServerSideProps } from "src/commonServerSideProps";
import { useTeam } from "src/teamProvider";
import { CustomIcon } from "@components/datacomponents/CustomIcon";

import dayjs from "dayjs";
import AvatarField from "@components/datacomponents/AvatarField";


export const getServerSideProps = commonServerSideProps;
const UserList: React.FC<IResourceComponentsProps<GetListResponse<IPost>>> = ({
  initialData,
}) => {
  const { RangePicker } = DatePicker;
  const t = useTranslate();
  const { setSelectedMenu, setHeaderTitle, isAdmin, identity } = useTeam();
  const [toggleFilter, setToggleFilter] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  useEffect(() => {
    setSelectedMenu("/reports", "/reports");
    setHeaderTitle(t("merchantsalesreport"));
  }, []);

  const merchantFilter = ():CrudFilters =>{
    
    if(isAdmin())
    {
      return [
        {
          field: "paymentstatus",
          operator: "eq",
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

  const { tableProps, sorters, searchFormProps, filters, tableQueryResult } =
    useTable<any>({
      resource: "orders",
      syncWithLocation: true,
      pagination:{
			pageSize:20
		},
      queryOptions: {
        initialData,
      },
      metaData: {
        fields: ["merchant.name", "merchant.logo.id","referenceno","paymentstatus",
			  "paymenttype","ordertype","price","date_created","service_offer","orderdata"],
      },

      initialFilter:merchantFilter(),

      onSearch: (params: any) => {
        const filters: CrudFilters = [];
        const { search, merchant, status, daterange } = params;

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
			field: "paymentstatus",
			operator: "eq",
			value: status,
		});

		filters.push({
			field:"date_created",
			operator:"between",
			value:daterange?[startDate, endDate]:null,
		  });

        return filters;
      },
	  sorters:{
		initial: [
			{
			  field: "date_created",
			  order: "desc",
			},
		  ],
	  }
      
    });


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

  const { selectProps: merchantSelectProps } = useSelect({
    resource: "merchant",
    optionLabel: "name",
    optionValue: "id",
	pagination:{
		pageSize:20,
		mode:"server"
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

  const { triggerExport, isLoading } = useExport<any>({
	resource: "orders",
	filters,
	metaData: {
		fields: ["merchant.name","referenceno","paymentstatus","paymenttype","ordertype","price","date_created"],
	},
	mapData: (item) => {
		return {
			Reference_no:item?.referenceno,
			Merchant_Name: item?.merchant?.name ,
			Trans_type: item?.ordertype,
			Payment_type: item?.paymenttype,
			Total: item?.price? 'SEK '+item.price : '',
			Status: item?.paymentstatus,
			Date_created: dayjs(item?.date_created, 'YYYY-MM-DD HH:mm').format('DD-MM-YYYY HH:mm'),
		};
	},
});

const content =(
	<div>												
				<Form.Item name="merchant" className="card-search mt-20 ml-10">
					<Select
					showSearch
					placeholder={t("merchantname")}
					allowClear
					{...merchantSelectProps}
					/>
				</Form.Item>
			
				<Form.Item name="status" className="card-search mt-20 ml-10">							
					<Select
						showSearch
						placeholder={t("status")}
						allowClear
						options={[
						{ label: t("accepted"), value: 'accepted' },
						{ label: t("pending"), value: 'pending' },														
						{ label: t("rejected"), value: 'rejected' },													
						]}
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
)

  return (
    <>
	 <Form 
		layout="vertical"
		{...searchFormProps}
		onValuesChange={() => {
			searchFormProps.form?.submit();
		}}
	  >
        <div className="card-container stickyheader">
          <div className="flex-row" style={{ alignItems: "center" }}>
            <Typography.Title level={5} className="headTitle">
            {t("merchantsalesreport")}
            </Typography.Title>
            </div>
           
            <div style={{justifyContent:"flex-end",marginRight:40}}>
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
       		
      <Table
        {...tableProps}
        rowKey="id"
        scroll={{ y:"calc(100vh - 220px)", x: "1100px" }}
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
      >
        <Table.Column
          width={70}
          dataIndex="referenceno"
          key="referenceno"
          title={t("ref#")}
		  render={(value, record: any) => <TextField 
			style={{color: record?.service_offer ? "green" : "black"}}
			value={value} />}
        />
        
        <Table.Column
          width={110}
          dataIndex={["merchant", "name"]}
          key="merchant"
          title={t("merchantname")}
          render={(_, record: any) => {
			return (
			  <AvatarField
				avatarImageProps={{
				  className: "mr-5",
				}}
				title={record?.merchant?.name}
				linkUrl={undefined}
				linkSrc={undefined}
				imagesrc={record?.merchant?.logo?.id}
				style={{color: record?.service_offer ? "green" : "black"}}
			  />
			);
		  }}
        />
        {<Table.Column
			width={90}
			dataIndex={'ordertype'}
			key="ordertype"
			title={t("transactiontype")}
			render={(value, record: any) => value && <TextField 
				style={{color: record?.service_offer ? "green" : "black",textTransform:'capitalize'}}
				value={t(value)}/>}
			/>
        }
		{<Table.Column
			width={90}
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
					  <TextField value={record?.paymenttype} 
					    style={{textTransform:'capitalize',color: record?.service_offer ? "green" : "black"}}/>
					  </div>
				  :
				   record?.paymenttype == "cod" ?
					  <div>
					  <Avatar  src="/images/cod.png" style={{marginRight:"5px"}}></Avatar>
					  <TextField value={t(record?.paymenttype)} 
					      style={{textTransform:'capitalize',color: record?.service_offer ? "green" : "black"}}/>
					  </div>
				  :
					  <div>
					  <Avatar  src="/images/klarna.png" style={{marginRight:"5px"}}></Avatar>
					  <TextField value={record?.paymenttype} 
					     style={{textTransform:'capitalize',color: record?.service_offer ? "green" : "black"}}/>
					  </div>
				  }               
				  </div>
	
						 
				);
			  }}
			/>  
        }

	  <Table.Column
          width={110}
          dataIndex="price"
          key="price"
          title={t("total")}
          render={(value,record:any) =>{
            const processingFee = record?.orderdata?.processingfee;
            const price = record?.price;
            const total = price + processingFee;          
            return (
            <TextField
             style={{color: record?.service_offer ? "green" : "black"}}            
             value={total + " kr"} />
            );
          }}
        />

		{<Table.Column
			width={90}
			dataIndex={'paymentstatus'}
			key="status"
			title={t("status")}
			render={(value, record: any) => value && <TextField 
				style={{color: record?.service_offer ? "green" : "black",textTransform:'capitalize'}}
				value={t(value)}/>}
			/>
        }

        <Table.Column
          width={100}
          dataIndex="date_created"
          key="date_created"
          title={t("datecreated")}
          render={(value,record: any) => value && <DateField 
			style={{color: record?.service_offer ? "green" : "black"}}
			value={value} format="MMM DD, YYYY HH:mm" />}
          //defaultSortOrder={getDefaultSortOrder("date_created", sorters)}
          sorter
        />
       
      </Table>
    </>
  );
};
export default UserList;
