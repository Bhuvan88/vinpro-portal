import React from "react";
import { Avatar } from "antd";
import { CustomIcon } from "@components/datacomponents/CustomIcon";
import { useTranslate } from "@refinedev/core";

const t = useTranslate();

const notifications = [

    {
        image: 'https://via.placeholder.com/150x150',
        title: "Stella Johnson has recently posted an album",
        time: "4:10 PM",
        icon: "thumb-up gx-text-blue",
    }, {
        image: 'https://via.placeholder.com/150x150',
        title: "Alex Brown has shared Martin Guptil's post",
        time: "5:18 PM",
        icon: "chat gx-text-grey",
    }, {
        image: 'https://via.placeholder.com/640x420',
        title: "Domnic Brown has sent you a group invitation for Global Health",
        time: "5:36 PM",
        icon: "birthday text-info",
    }, {
        image: 'https://via.placeholder.com/150x150',
        title: "John Smith has birthday today",
        time: "5:54 PM",
        icon: "birthday gx-text-warning",
    }, {
        image: 'https://via.placeholder.com/150x150',
        title: "Chris has updated his profile picture",
        time: "5:25 PM",
        icon: "profile gx-text-grey",
    }
];


const NotificationItem = ({ notification }) => {
    const { icon, image, title, time } = notification;
    return (

        <li className="notification-media">
            <Avatar className="mr-15"
                alt={image}
                src={image}
                size={40}
            />
            <div className="notification-media-body">
                <p className="mb-0">{title}</p>
                <CustomIcon type={"FieldTimeOutlined"} styleProps={{ className: "pr-5" }} /> <span><small>{time}</small></span>
            </div>
        </li>
    );
};


const AppNotification = () => {
    return (
        <>
            <div className="notification-popover-header">
                <h3 className="mb-0">{t("notifications")}</h3>
            </div>
            <ul className="notification-sub-popover" >
                {notifications.map((notification, index) => <NotificationItem key={index}
                    notification={notification} />)
                }
            </ul>
        </>
    )
};

export default AppNotification;