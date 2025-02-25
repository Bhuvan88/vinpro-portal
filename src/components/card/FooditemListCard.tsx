import { CustomIcon } from "@components/datacomponents/CustomIcon";
import { useApiUrl } from '@refinedev/core';

import {
    ImageField,
} from "@refinedev/antd";
import {
	Card,
	Row,
	Col,
    Typography,
    Button
} from "antd";

const FooditemCard: React.FC<any> = ({ title, imagesrc, data, callback, addbutton }) => {
    const apiUrl = useApiUrl();
    return (
        <div className="p-5">
            <div className="card-flex"> 
                <div className="flex">
                    {imagesrc &&
                        <ImageField
                            preview={true}
                            value={imagesrc ? apiUrl+"assets/" + imagesrc : '/images/default.png'}
                            imageTitle={title} style={{width:'100%', height:60,}}
                        />
                    }
                    <div>
                        <p className="blackText ml-10" style={{fontWeight:500, fontSize:15}}>{data?.itemname} </p>
                        <Typography.Paragraph className="blackText ml-10" ellipsis={{ rows: 2 }} style={{ width: '95%', fontSize:13 }} >{data?.itemdescription}</Typography.Paragraph>
                    </div>
                </div>
                {data.discount && data?.itemdiscountprice != null ?
                    <p className="greyText" > <span style={{ textDecoration: "line-through", marginRight: 10 }}>{data?.itemprice + ' kr '}</span>{data?.discountprice + ' kr'} </p>
                    : <Typography.Title level={5}>{data?.itemprice + ' kr'}</Typography.Title>
                }
            </div>
        </div>
    )
}

export default FooditemCard;