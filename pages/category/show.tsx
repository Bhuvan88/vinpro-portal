import { useEffect } from "react";
import { useTranslate } from "@refinedev/core";
import { useShow } from "@refinedev/core";
import TextField from "@components/fields/TextField";
import DateTextField from "@components/fields/DateTextField";
import { commonServerSideProps } from 'src/commonServerSideProps';
export const getServerSideProps = commonServerSideProps;


import { Show } from "@refinedev/antd";
import { dotTocomma } from "src/functions";

	const ShowRegion: React.FC<any> = ({id}) => 
	{
		const t = useTranslate();
		// Show Drawer
		const { showId, setShowId, queryResult } = useShow<any>({
			resource: 'category', 
			metaData: {
				fields: ["name","commission","date_created","date_updated" ]
			} 
		});

		useEffect(
			() => {
				if (id) {
					setShowId(id);
				}
			},
			[ id ]
		);

		const { data, isLoading } = queryResult;
		const record = data?.data;

		return (
			<Show
				title={t('category')}
				headerProps={{
					extra: false,
					//subTitle: "View"
				}}
				isLoading={isLoading}
			>
				<TextField icon="DiffOutlined" label={t('name')} textValue={record?.name} />

				{record?.commission ? <TextField icon="DollarOutlined" label={t("commission")} textValue={record?.commission ? dotTocomma(parseFloat(record?.commission).toFixed(2)) + " kr" : ""} /> : null}

				<DateTextField
					icon={"CalendarOutlined"}
					label={t("datecreated")}
					format={"YYYY-MM-DD"}
					textValue={record?.date_created}
				/>
				<DateTextField
					icon={"CalendarOutlined"}
					label={t("dateupdated")}
					format={"YYYY-MM-DD"}
					textValue={record?.date_updated}
				/>
			</Show>
		);
};

export default ShowRegion;