import { Tabs, Row, Col, Card, Typography } from "antd";
import { useRouter } from "next/router";
import Section1 from "../../src/components/websettings/home/section";
import Section2 from "../../src/components/websettings/home/section2";
import Section3 from "../../src/components/websettings/home/section3";
import Section4 from "../../src/components/websettings/home/section4";

const WebsettingsPage = () => {
  const router = useRouter();
  const sectionTitle = router.query.section_title || "Home page Section 1";

  const handleTabChange = (page: string) => {
    router.push(page);
  };

 
  return (
    <Row gutter={[16, 16]}>
      <Col span={8}>
        <div
          className="card-container"
          onClick={() => handleTabChange("/homeBanners")}
          style={{ cursor: "pointer" }}
        >
          <Card style={{ alignItems: "center", width: "100%" }}>
            <Typography.Title level={5} className="headTitle">
              Home Banners
            </Typography.Title>
            <img
              src="./images/homepage.png"
              alt="Refine"
              style={{ width: "100%", marginTop: 15 }}
            />
          </Card>
        </div>
      </Col>
      <Col span={8}>
        <div
          className="card-container"
          onClick={() => handleTabChange("/webhome")}
          style={{ cursor: "pointer" }}
        >
          <Card style={{ alignItems: "center", width: "100%" }}>
            <Typography.Title level={5} className="headTitle">
              Home Page
            </Typography.Title>
            <img
              src="./images/homepage.png"
              alt="Refine"
              style={{ width: "100%", marginTop: 15 }}
            />
          </Card>
        </div>
      </Col>
      <Col span={8}>
        <div className="card-container" onClick={() => handleTabChange("/webAbout")} style={{ cursor: "pointer" }}>
          <Card style={{ alignItems: "center", width: "100%" }}>
            <Typography.Title level={5} className="headTitle">
              About page
            </Typography.Title>
            <img
              src="./images/about.png"
              alt="Refine"
              style={{ width: "100%", marginTop: 15 }}
            />
          </Card>
        </div>
      </Col>
      <Col span={8}>
        <div className="card-container" onClick={() => handleTabChange("/webemployer")} style={{ cursor: "pointer" }}>
          <Card style={{ alignItems: "center", width: "100%" }}>
            <Typography.Title level={5} className="headTitle">
              Employer of records
            </Typography.Title>
            <img
              src="./images/employer.png"
              alt="Refine"
              style={{ width: "100%", marginTop: 15 }}
            />
          </Card>
        </div>
      </Col>
      <Col span={8}>
        <div className="card-container" onClick={() => handleTabChange("/webstaffing")} style={{ cursor: "pointer" }}>
          <Card style={{ alignItems: "center", width: "100%" }}>
            <Typography.Title level={5} className="headTitle">
              Staffing Solution
            </Typography.Title>
            <img
              src="./images/staffing.png"
              alt="Refine"
              style={{ width: "100%", marginTop: 15 }}
            />
          </Card>
        </div>
      </Col>

      <Col span={8}>
        <div className="card-container" onClick={() => handleTabChange("/webhr")} style={{ cursor: "pointer" }}>
          <Card style={{ alignItems: "center", width: "100%" }}>
            <Typography.Title level={5} className="headTitle">
              HR and Payroll
            </Typography.Title>
            <img
              src="./images/HRPAY.png"
              alt="Refine"
              style={{ width: "100%", marginTop: 15 }}
            />
          </Card>
        </div>
      </Col>
      <Col span={8}>
        <div className="card-container" onClick={() => handleTabChange("/webcontact")} style={{ cursor: "pointer" }}>
          <Card style={{ alignItems: "center", width: "100%" }}>
            <Typography.Title level={5} className="headTitle">
              Contact
            </Typography.Title>
            <img
              src="./images/contact.png"
              alt="Refine"
              style={{ width: "100%", marginTop: 15 }}
            />
          </Card>
        </div>
      </Col>
    </Row>
  );
};

export default WebsettingsPage;
