import { useTranslate } from "@refinedev/core";
import { useShow } from "@refinedev/core";
import TextField from "@components/fields/TextField";
import DateTextField from "@components/fields/DateTextField";
import { Table } from "antd";
import { Show } from "@refinedev/antd";
import { commonServerSideProps } from "src/commonServerSideProps";
import { List, Divider } from "antd";

export const getServerSideProps = commonServerSideProps;

const CTCShow: React.FC<any> = ({ id }) => {
  const t = useTranslate();

  // Fetch details
  const { queryResult } = useShow<any>({
    resource: "ctc",
    id,
    metaData: {
      fields: ["*", "country.id", "country.name", "regime.id", "regime.title"],
    },
  });

  const { data, isLoading } = queryResult;
  const record = data?.data;

  // Ensure details are properly parsed
  let earning_details:any, deduction_details:any = [];
  
  try {
    earning_details = record?.earnings ? JSON.parse(record.earnings) : [];
    deduction_details = record?.deductions? JSON.parse(record.deductions) : [];
  } catch (error) {
    console.error("Error parsing details:", error);
  }

  // Table Columns
  const columns = [
    {
      title: "Label",
      dataIndex: "key",
      key: "key",
    },
    {
      title: "Value %",
      dataIndex: "value",
      key: "value",
    },
  ];

  return (
    <Show title="CTC List" isLoading={isLoading}>
      {/* Title */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
      <TextField
        icon=""
        label="Country Name"
        textValue={record?.country.name}
      />
      <TextField
        icon=""
        label="Regime Name"
        textValue={record?.regime.title}
      />
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
        }}
      >
      <TextField
        icon=""
        label="Management Fee"
        textValue={record?.managementfee}
      />
      <TextField
        icon=""
        label="Professional Tax"
        textValue={record?.professionaltax}
      />
      </div>

  
      {/* Details in Table Format */}
      <div className="view-info-card">
        <Divider orientation="left">Earnings</Divider>
        <Table 
          dataSource={earning_details} 
          columns={columns} 
          pagination={false} 
          rowKey={(record, index) => index} 
          bordered
        />

      <Divider orientation="left">Deductions</Divider>
        <Table 
          dataSource={deduction_details} 
          columns={columns} 
          pagination={false} 
          rowKey={(record, index) => index} 
          bordered
        />
      </div>

      {/* Date Created */}
      <div className="view-info-card">
        <DateTextField
          icon={undefined}
          label={t("datecreated")}
          format={"MMM DD, YYYY HH:mm"}
          textValue={record?.date_created}
        />

      </div>
    </Show>
  );
};

export default CTCShow;
