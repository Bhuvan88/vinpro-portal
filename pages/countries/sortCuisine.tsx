import {
    IResourceComponentsProps,
    useTranslate,
    CrudFilters,
    useNavigation,
  } from "@refinedev/core";
  
  import {
    useSimpleList,
  } from "@refinedev/antd";  
  import {
    Card,
    Typography,
    Button,
    Tooltip,
  } from "antd";
  import React, { useEffect, useState } from "react";
  import { CustomIcon } from "src/components/datacomponents/CustomIcon";
  
  import { commonServerSideProps } from "src/commonServerSideProps";
  import { useTeam } from "src/teamProvider";
  
  import { DndProvider, useDrag, useDrop } from "react-dnd";
  import { HTML5Backend } from "react-dnd-html5-backend";
  import NextRouter from "@refinedev/nextjs-router";
  import { directusClient } from "src/directusClient";

  const { Link } = NextRouter;
  
  export const getServerSideProps = commonServerSideProps;
  
  const CuisineSort: React.FC<IResourceComponentsProps> = ({ initialData }) => {
    const t = useTranslate();
    const { setSelectedMenu, setHeaderTitle, isAdmin, identity } = useTeam();
    const [showCreateDrawer, setShowCreateDrawer] = useState(false);
    const [showEditDrawer, setShowEditDrawer] = useState(false);
    const { goBack } = useNavigation();
  
    const [items, setItems] = useState<any>([]);
    const [loadingIds, setLoadingIds] = useState<any>([]);
  
    useEffect(() => {
        setSelectedMenu("/cuisine", "/cuisine");
        setHeaderTitle(t("sortcuisine"));
      }, []);
  
    const filterObj = (): CrudFilters => {
      if (isAdmin()) {
        return [];
      } else {
        return [
          {
            field: "merchant",
            operator: "eq",
            value: identity?.merchant?.id,
          },
        ];
      }
    };
  
    const {
      queryResult: formQuery,
    } = useSimpleList<any>({
      resource: "cuisine",
      syncWithLocation: true,
      queryOptions: {
        initialData,
      },
      pagination: {
        pageSize:-1,
      },
      metaData: {
        fields: ["id","name"],
      },
      initialFilter: filterObj(),
      onSearch: (params: any) => {
        const filters: CrudFilters = [];
        const { search } = params;
  
        filters.push({
          field: "search",
          operator: "contains",
          value: search,
        });
        return filters;
      },
      sorters:{
        permanent: [
          {
            field: "sort",
            order: "asc",
          },
        ],
        initial: [
          {
            field: "sort",
            order: "asc",
          },
        ],
      },
      
    });
  
    const record = formQuery?.data?.data;
    useEffect(() => {
      if (record) {
        setItems(record);
      } else {
        setItems([]);
      }
    }, [record]);
  
  
    const createCallback = (status) => {
      if (status === "success") {
        setShowCreateDrawer(false);
        formQuery.refetch();
      }
      if (status === "error") {
        setShowCreateDrawer(false);
      }
      if (status === "close") {
        setShowCreateDrawer(false);
      }
    };
  
    const editCallback = (status) => {
      if (status === "success") {
        setShowEditDrawer(false);
        formQuery.refetch();
      }
      if (status === "error") {
        setShowEditDrawer(false);
      }
      if (status === "close") {
        setShowEditDrawer(false);
      }
    };
  
    function DraggableListItem({ item, index, moveListItem }) {

      const [, drag] = useDrag(() => ({
        type: "ITEM",
        item: { id: item.id, index },
      }));
  
      const [{ isOverSibling }, dropSibling] = useDrop({
        accept: "ITEM",
        drop(item: any, monitor) {
          console.log(item.index);
          if (item.index !== index) {
            moveListItem(item.index, index);
            item.index = index;
          }
        },
        collect: (monitor) => ({
          isOverSibling: monitor.isOver(),
        }),
      });
  
      const siblingAreaStyle = {
        height: isOverSibling ? "40px" : "7px",
        backgroundColor: isOverSibling ? "lightblue" : "transparent",
        border: isOverSibling ? "1px dashed grey" : "none",
      };
  
      return (
        <div ref={drag} style={{ paddingLeft: 30 * (item.level ?? 0) }}>
          <Card            
            styles={{body:{ padding: 10}}}          
          >
            <div>             
              <Button ghost shape="circle" icon={<CustomIcon type="DragOutlined" />} />

              <Typography.Text style={{ padding: 5, margin: 0 }}>
                {item?.name}
              </Typography.Text>
            </div>
          </Card>
          <Card
            ref={dropSibling}
            style={siblingAreaStyle}
            styles={{body:{ padding: 0}}} 
          ></Card>
        </div>
      );
    }
  
    const moveListItem = async (dragIndex, hoverIndex, updateParent = true) => {
      const dragItem: any = items[dragIndex];
      const dropItem: any = items[hoverIndex];
      console.log("dragItem", dragItem);
      console.log("dropItem", dropItem);
  
      setLoadingIds([dragItem.id, dropItem.id]);
  
      if (dragItem.id != dropItem.id) {
        // await directusClient.request(utilitySort("chapters_content", dragItem.id, dropItem.id));
        // await refetch();
      }
      if (dragItem.id != dropItem.id) {
        await directusClient.items("cuisine").updateOne(dragItem.id, {
          sort: hoverIndex + 1,
        });
        await directusClient.items("cuisine").updateOne(dropItem.id, {
          sort: dragIndex + 1,
        });
        formQuery.refetch();
      }
  
      setLoadingIds([]);
    };
  
    return (
      <>
        <div className="stickyheader">
          <div className="flex-row" style={{ alignItems: "center" }}>
            {/* <div style={{ marginLeft: 10 }}>
              <Link to={`/cuisine`}>
              <div>
                <CustomIcon type="ArrowLeftOutlined" />
              </div> 
               </Link>
            </div> */}
            <Tooltip title={t("goback")}>
              <Button
                type="text"
                size="large"
                icon={<CustomIcon type="ArrowLeftOutlined" />}
                className="mr-10"
                onClick={() => goBack()}
              />
            </Tooltip>
            <Typography.Title level={5} className="headTitle">
              {t("cuisine")}
            </Typography.Title>
          </div>
  
          <div style={{ marginRight: 30 }}></div>
        </div>
        
          <div style={{ height: "calc(100vh - 150px)", overflow: "auto" }}>
              <DndProvider backend={HTML5Backend}>
                  {record &&
                  record.map((item, index) => (
                    
                      <DraggableListItem
                          key={item.id}
                          item={{ id: item.id, name: item.name}}
                          index={index}
                          moveListItem={moveListItem}
                          />
                                                
                  ))}
              </DndProvider>
          </div>
        
      </>
    );
  };
  
  export default CuisineSort;
  