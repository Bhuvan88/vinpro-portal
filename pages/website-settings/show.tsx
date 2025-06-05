import { useTranslate } from "@refinedev/core";
import { useShow } from "@refinedev/core";
import TextField from "@components/fields/TextField";
import DateTextField from "@components/fields/DateTextField";

import { Show } from "@refinedev/antd";
import { commonServerSideProps } from 'src/commonServerSideProps';
import ImageTextField from "@components/fields/ImageTextField";
export const getServerSideProps = commonServerSideProps;


const CuisineShow: React.FC<any> = ({ id }) => {
  const t = useTranslate();
  // Show Drawer
  const { showId, setShowId, queryResult } = useShow<any>({
    resource: "countries",
    id: id,
    metaData: {
      fields: ["name","date_created","date_updated"],
    },
  });

  const { data, isLoading } = queryResult;
  const record = data?.data;

  return (
    <Show
      title="Countries"
      headerProps={{
        extra: false,
        // subTitle: "View",
      }}
      isLoading={isLoading}
    >
      <TextField
        icon="UserOutlined"
        label="Name"
        textValue={record?.name}
      />
    
      <div className="view-info-card">
       
        <DateTextField
          icon={undefined}
          label={t("datecreated")}
          format={"MMM DD, YYYY HH:mm"}
          textValue={record?.date_created}
        />
        <DateTextField
          icon={undefined}
          label={t("dateupdated")}
          format={"MMM DD, YYYY HH:mm"}
          textValue={record?.date_updated}
        />
      </div>
    </Show>
  );
};

export default CuisineShow;
