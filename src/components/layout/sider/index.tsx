import React, { useEffect, useState } from "react";

import {
    useTranslate,
    useLogout,
    useTitle,
    useNavigation,
    useRouterContext,
    CanAccess,
    useMenu
} from "@refinedev/core";
import {
    Layout as AntdLayout,
    Menu,
    Grid,
    Affix,
    Space,
    Tooltip,
    Card,
    Typography,
    Avatar,
    Button,
} from "antd";
import {LogoutOutlined} from "@ant-design/icons";
import {
    antLayoutSider,
    antLayoutSiderMobile,
    antLayoutSecondarySiderMobile,
    antLayoutSecondarySider,
} from "./styles";
import menulist from "./menulist.json";

import { CustomIcon } from "../../datacomponents/CustomIcon";
import { getInitials } from "src/functions";
import { useTeam } from "src/teamProvider";
import {Title} from "../title";

export declare type SiderProps = {
    selectedMain?: string;
    selectedSub?: string;
};

export const Sider: React.FC<SiderProps> = () => {
    const ISSERVER = typeof window === "undefined";

    const {
        selectedMain,
        selectedSub,
        identity,
        setSelectedRole,
        directusRole,
        setSelectedModule,
        selectedModule,
        isAdmin,
        selectedRole
    } = useTeam();

    const [collapsed, setCollapsed] = useState<boolean>(true);
    const [secondaryCollapsed, setSecondaryCollapsed] = useState<boolean>(
        !ISSERVER && localStorage.getItem("secondaryCollapsed") === "true"
            ? true
            : false
    );
    const [secondaryMenuList, setSecondaryMenuList] = useState<any>([]);
    const { mutate: logout } = useLogout({
        v3LegacyAuthProviderCompatible:true
    });
    const translate = useTranslate();
    const { menuItems, selectedKey } = useMenu();
    const { push } = useNavigation();
    const breakpoint = Grid.useBreakpoint();

    const { useLocation, useParams } = useRouterContext();
    const { pathname } = useLocation();
    const isMobile = !breakpoint.lg;
    //const [menuList, setMenuList] = useState<any>([ isAdmin() ? menulist :  merchantmenuList]);
    const [menuList, setMenuList] = useState<any>([ ]);
      const t = useTranslate();  

    useEffect(() => {
        if (selectedRole === "Administrator") {
            setMenuList(menulist);
        }       
        // else if(selectedRole === "Driver"){
        //      setMenuList(drivermenulist);
        //     }

    }, [selectedRole]);

    useEffect(() => {
        if (selectedMain) {
            //alert(selectedSub);
            const selectedModule = menuList.find(
                (item) => item.link === selectedMain
            );

            if (selectedModule) {
                setSelectedModule(selectedModule.module);
            }
            //console.log('selectedmenuListModule', menuList);
            if (
                selectedModule &&
                selectedModule.sublink &&
                selectedModule.sublink.length > 0
            ) {
                setSecondaryMenuList(selectedModule.sublink);
            } else {
                setSecondaryMenuList([]);
            }
        }
    }, [selectedMain, menuList]);

    useEffect(() => {
        !ISSERVER && localStorage.getItem("secondaryCollapsed")
            ? setSecondaryCollapsed(true)
            : setSecondaryCollapsed(false);
    }, []);

    //useeffect for secondaryCollapsed
    useEffect(() => {
        if (ISSERVER) {
            return;
        }
        if (secondaryCollapsed) {
            localStorage.setItem(
                "secondaryCollapsed",
                secondaryCollapsed.toString()
            );
        } else {
            localStorage.removeItem("secondaryCollapsed");
        }
    }, [secondaryCollapsed]);

    const menu = () => {
        return (
            <Menu
                selectedKeys={[selectedKey]}
                mode="inline"
                onClick={({ key }) => {
                    if (key === "logout") {
                        logout();
                        return;
                    }
                    if (!breakpoint.lg) {
                        setCollapsed(true);
                    }
                }}
                className={"antMainMenu"}
            >
                {menuList.map((item: any, index) => {
                    const {
                        icon,
                        title,
                        link,
                        resource,
                        module,
                        roles,
                    } = item;
                    const isSelected =
                        link === selectedMain;
                    return (
                            <CanAccess
                                key={link}
                                resource={resource}
                                action={"menu"}
                                params={{ module: module, roles: roles }}
                            >
                                <Tooltip
                                    overlay={null}
                                    //title={title} //{t(title)}
                                    placement="right"
                                    key={link}
                                >
                                    <Button
                                        type="text"
                                        size="large"
                                        icon={<CustomIcon type={icon} />}
                                        onClick={() => {
                                            push(link);
                                        }}
                                        //active ={isSelected ? true : false}
                                        className={
                                            isSelected
                                                ? "antMainMenuButton antMainMenuButtonSelected"
                                                : "antMainMenuButton"
                                        }
                                    >{title}</Button>
                                   
                                </Tooltip>
                           </CanAccess>
                        
                    );
                })}

                {/* <Menu.Item key="logout" icon={<LogoutOutlined />}>
                    {t("logout")}
                </Menu.Item> */}
                 <Button
                    type="text"
                    size="large"
                    icon={<LogoutOutlined />}
                    onClick={() =>  logout()}
                    //active ={isSelected ? true : false}
                    className={"antMainMenuButton"}
                >{t("logout")}</Button>
            </Menu>
        );
    };

    const renderMenuItem = ({ icon, title, link, resource, module, roles }) => {
        const isSelected = link === selectedSub;
        return (
            <CanAccess
                key={link}
                resource={resource}
                action={"menu"}
                params={{ module: module, roles: roles }}
            >
                <Menu.Item
                    style={{
                        height: secondaryCollapsed ? "42px" : "34px",
                        borderRadius: "6px",
                        backgroundColor: isSelected
                            ? "#00d889"
                            : secondaryCollapsed
                            ? "#fff"
                            : "#fff",
                        color :  isSelected
                        ? "#fff" : "#00d889",
                        border :isSelected ? 'none' : '1px solid #00d889',
                        fontWeight: isSelected ? "bold" : "bold",
                        width:'98%',
                        
                    }}
                    key={link}
                    icon={
                        icon ? (
                            <CustomIcon type={icon} styleProps={{
                                style: {marginLeft:2}}}/>
                        ) : (
                            <CustomIcon
                                type={"BarsOutlined"}
                                styleProps={{
                                    style: {
                                        fontSize: 20,
                                        alignItems: "center",
                                    },
                                }}
                            />
                        )
                    }
                >
                    {t(title)}
                    
         
                </Menu.Item>
            </CanAccess>
        );
    };

    const secondaryMenu = () => {
        return (
            <AntdLayout.Sider
                collapsible
                collapsed={secondaryCollapsed}
                onCollapse={(collapsed: boolean): void =>
                    setSecondaryCollapsed(collapsed)
                }
                collapsedWidth={isMobile ? 62 : 70}
                breakpoint="lg"
                style={
                    isMobile
                        ? antLayoutSecondarySiderMobile
                        : antLayoutSecondarySider
                }
            >
                {/* { secondaryCollapsed ? (
                    <div style={{ width: "100%", padding: 5 }}>
                       <Typography.Text
                                ellipsis
                                strong
                                style={{ fontSize: 22, color:"#DC5700", marginLeft:5 }}
                            >
                                H&K
                            </Typography.Text>
                    </div>
                ) : (
                    <div style={{ width: "100%" }}>
                        <div
                            //bordered={false}
                            style={{
                                backgroundColor: "#DC5700",
                                padding: 13,
                                borderRadius:0
                            }}
                        >
                            <Typography.Text
                                ellipsis
                                strong
                                style={{ fontSize: 14, color:"#fff" }}
                            >
                                Hemkörtochklart
                            </Typography.Text>
                        </div>
                    </div>
                ) } */}
               
                <Menu
                    selectedKeys={[selectedKey]}
                    mode="inline"
                    onClick={(item) => {
                        //console.log("MenuItem", item);
                        let key = item.key;
                        if (key === "logout") {
                            logout();
                            return;
                        }

                        if (!breakpoint.lg) {
                            setCollapsed(true);
                        }

                        push(key as string);
                    }}
                    style={{ borderRight: 0, fontSize: "12px", padding: 8,marginLeft:1}}
                >
                    {secondaryMenuList.map(
                        ({
                            icon,
                            title,
                            link,
                            sublink,
                            resource,
                            module,
                            roles,
                        }) => {
                            if (sublink && sublink.length > 0) {
                                {
                                    return (
                                        <Menu.ItemGroup
                                            title={
                                                secondaryCollapsed ? "" : title
                                            }
                                        >
                                            {sublink.map(
                                                ({
                                                    icon,
                                                    title,
                                                    link,
                                                    resource,
                                                    module,
                                                    roles,
                                                }) => {
                                                    return renderMenuItem({
                                                        icon,
                                                        title,
                                                        link,
                                                        resource,
                                                        module,
                                                        roles,
                                                    });
                                                }
                                            )}
                                        </Menu.ItemGroup>
                                    );
                                }
                            } else {
                                return renderMenuItem({
                                    icon,
                                    title,
                                    link,
                                    resource,
                                    module,
                                    roles,
                                });
                            }
                        }
                    )}
                </Menu>
            </AntdLayout.Sider>
        );
    };

    return (
        <Affix>
            <div style={{ display: "flex", flexDirection: "column" }}>
                <Space align="start" size={0}>
                    <AntdLayout.Sider
                        collapsed={false}
                        /*onCollapse={(collapsed: boolean): void =>
                            setCollapsed(collapsed)
                        } */
                        //collapsedWidth={isMobile ? 60 : 60 }
                        breakpoint="lg"
                        style={isMobile ? antLayoutSiderMobile : antLayoutSider}
                    >
                        <Title collapsed={secondaryCollapsed} />
                        {menu()}
                    </AntdLayout.Sider>
                    {/* secondaryMenu() */}
                </Space>
            </div>
        </Affix>
    );
};