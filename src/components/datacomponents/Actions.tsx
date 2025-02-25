import { EditOutlined, EyeOutlined, DeleteOutlined, MoreOutlined } from '@ant-design/icons';
import {
    Space,
    Dropdown,
    Menu
} from "antd";
import { useDelete, useTranslate } from '@refinedev/core';


function handleMenuClick(e) {
    console.log('click', e);
}

const menu = (props) => {
    const { mutate } = useDelete();
    const t = useTranslate();

    return props.id && (
        <Menu onClick={handleMenuClick}>
            <Menu.Item
                key="1"
                icon={<EyeOutlined />}
                onClick={() => {
                  //  props.view(true);
                    props.showId(props.id);
                    props.show(props.id);
                }}
            >
              {t("view")}
            </Menu.Item>
            <Menu.Item
                key="2"
                icon={<EditOutlined />}
                onClick={() => props.edit(props.id)}
            >
               {t("edit")}
            </Menu.Item>
            <Menu.Item
                key="3"
                icon={<DeleteOutlined />}
                onClick={() => 
                    mutate({
                        resource: props.resource,
                        id: props.id,
                        mutationMode: "undoable"
                    })}
            >
               {t("delete")}
            </Menu.Item>
        </Menu>
    )
}

const Actions: React.FC<any> = (props) => {
    return (
        <Space wrap>
            <Dropdown overlay={menu(props)} trigger={['click']}>
                <MoreOutlined />
            </Dropdown>
        </Space>
    )
}

export default Actions;