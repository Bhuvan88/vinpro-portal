import { useTranslate } from "@refinedev/core";
import { useShow } from "@refinedev/core";
import TextField from "@components/fields/TextField";
import DateTextField from "@components/fields/DateTextField";
import { Table } from "antd";
import { Show } from "@refinedev/antd";
import { commonServerSideProps } from "src/commonServerSideProps";
import { List, Divider } from "antd";

export const getServerSideProps = commonServerSideProps;

const RegimeShow: React.FC<any> = ({ id }) => {
  const t = useTranslate();

  // Fetch details
  const { queryResult } = useShow<any>({
    resource: "ctc_regime",
    id,
    metaData: {
      fields: ["*", "country.id", "country.name" ],
    },
  });

  const { data, isLoading } = queryResult;
  const record = data?.data;

  // Ensure details are properly parsed
  let slab_details:any= [];
  
  try {
    slab_details = record?.slab ? JSON.parse(record.slab) : [];
  } catch (error) {
    console.error("Error parsing details:", error);
  }

  // Table Columns
  const columns = [
    {
      title: "name",
      dataIndex: "slab",
      key: "slab",
    },
    {
      title: "From",
      dataIndex: "from",
      key: "from",
    },
    {
      title: "To",
      dataIndex: "to",
      key: "to",
    },
    {
      title: "Tax/Amount",
      dataIndex: "rate",
      key: "rate",
    },
  ];

  return (
    <Show title="Regime List" isLoading={isLoading}>
      {/* Title */}
    
      <TextField
        icon=""
        label="Regime Name"
        textValue={record?.title}
      />
     

      <TextField
        icon=""
        label="Country Name"
        textValue={record?.country.name}
      />
    
    
      {/* Details in Table Format */}
      <div className="view-info-card">
        <Divider orientation="left">Slab</Divider>
        <Table 
          dataSource={slab_details} 
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

export default RegimeShow;
