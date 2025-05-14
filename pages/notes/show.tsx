import { useTranslate } from "@refinedev/core";
import { useShow } from "@refinedev/core";
import TextField from "@components/fields/TextField";
import DateTextField from "@components/fields/DateTextField";
import { Table } from "antd";
import { Show } from "@refinedev/antd";
import { commonServerSideProps } from "src/commonServerSideProps";
import { List, Divider } from "antd";

export const getServerSideProps = commonServerSideProps;

const CurrencyShow: React.FC<any> = ({ id }) => {
  const t = useTranslate();

  // Fetch details
  const { queryResult } = useShow<any>({
    resource: "currency",
    id,
    metaData: {
      fields: ["*"],
    },
  });

  const { data, isLoading } = queryResult;
  const record = data?.data;
 
  return (
    <Show title="Currency List" isLoading={isLoading}>
      
      <TextField
        icon=""
        label="Currency Name"
        textValue={record?.name}
      />
      <TextField
        icon=""
        label="Exchange Rate"
        textValue={record?.rate}
      />
    

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

export default CurrencyShow;
