import { Tabs, Breadcrumb } from "antd";
import { useRouter } from "next/router";
import Section1 from "../../src/components/websettings/hrpayroll/section";
import Section2 from "../../src/components/websettings/hrpayroll/section2";
import Section3 from "../../src/components/websettings/hrpayroll/section3";
import Section4 from "../../src/components/websettings/hrpayroll/section4";
import Section5 from "../../src/components/websettings/hrpayroll/section5";
import Section6 from "../../src/components/websettings/hrpayroll/section6";
import Section7 from "../../src/components/websettings/hrpayroll/section7";
import Section8 from "../../src/components/websettings/hrpayroll/section8";
import Section9 from "../../src/components/websettings/hrpayroll/section9";
import Section10 from "../../src/components/websettings/hrpayroll/section10";
import Section11 from "../../src/components/websettings/hrpayroll/section11";
import { commonServerSideProps } from "src/commonServerSideProps";

export const getServerSideProps = commonServerSideProps;

const WebsettingsPage = () => {
  const router = useRouter();
  const sectionTitle = router.query.section_title || "HrpayrollSection1";

  const handleTabChange = (key: string) => {
    router.push({
      pathname: router.pathname,
      query: { section_title: key },
    });
  };

  const tabItems = [
    { key: "HrpayrollSection1", label: "Section 1" },
    { key: "HrpayrollSection2", label: "Section 2" },
    { key: "HrpayrollSection3", label: "Section 3" },
    { key: "HrpayrollSection4", label: "Section 4" },
    { key: "HrpayrollSection5", label: "Section 5" },
    { key: "HrpayrollSection6", label: "Section 6" },
    { key: "HrpayrollSection7", label: "Section 7" },
    { key: "HrpayrollSection8", label: "Section 8" },
    { key: "HrpayrollSection9", label: "Section 9" },
    { key: "HrpayrollSection10", label: "Section 10" },
    { key: "HrpayrollSection11", label: "Section 11" },
  ];

  return (
    <div>
      <Breadcrumb style={{ margin: "16px" }}>
        <Breadcrumb.Item
          className="clickable"
          onClick={() => router.push("/website-settings")}
        >
          Web Settings
        </Breadcrumb.Item>
        <Breadcrumb.Item>HR and Payroll</Breadcrumb.Item>
      </Breadcrumb>

      <Tabs
        activeKey={sectionTitle.toString()}
        onChange={handleTabChange}
        type="card"
        style={{ margin: 24 }}
        items={tabItems.map((item) => ({
          ...item,
          children: (() => {
            switch (item.key) {
              case "HrpayrollSection1":
                return <Section1 callback={function (status: string): void {
                  throw new Error("Function not implemented.");
                } } visible={false} />;
              case "HrpayrollSection2":
                return <Section2 callback={function (status: string): void {
                  throw new Error("Function not implemented.");
                } } visible={false} />;
              case "HrpayrollSection3":
                return <Section3 callback={function (status: string): void {
                  throw new Error("Function not implemented.");
                } } visible={false} />;
              case "HrpayrollSection4":
                return <Section4 callback={function (status: string): void {
                  throw new Error("Function not implemented.");
                } } visible={false} />;
              case "HrpayrollSection5":
                return <Section5 callback={function (status: string): void {
                  throw new Error("Function not implemented.");
                } } visible={false} />;
              case "HrpayrollSection6":
                return <Section6 callback={function (status: string): void {
                  throw new Error("Function not implemented.");
                } } visible={false} />;
              case "HrpayrollSection7":
                return <Section7 callback={function (status: string): void {
                  throw new Error("Function not implemented.");
                } } visible={false} />;
              case "HrpayrollSection8":
                return <Section8 callback={function (status: string): void {
                  throw new Error("Function not implemented.");
                } } visible={false} />;
              case "HrpayrollSection9":
                return <Section9 callback={function (status: string): void {
                  throw new Error("Function not implemented.");
                } } visible={false} />;
              case "HrpayrollSection10":
                return <Section10 callback={function (status: string): void {
                  throw new Error("Function not implemented.");
                } } visible={false} />;
              case "HrpayrollSection11":
                return <Section11 callback={function (status: string): void {
                  throw new Error("Function not implemented.");
                } } visible={false} />;
              default:
                return null;
            }
          })(),
        }))}
      />
    </div>
  );
};

export default WebsettingsPage;
