import React, { useState, useMemo } from 'react';
import { 
  Container, Row, Col, Card, Nav, Table, Form, 
  Navbar, Badge, Button, Offcanvas 
} from 'react-bootstrap';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, Cell 
} from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import { calculateFullStory } from './data/documentStats';

function App() {
  const [activeTab, setActiveTab] = useState('profit');
  const [showInputs, setShowInputs] = useState(false); // Mobile sidebar state
  
  const [financials, setFinancials] = useState({
    revenue: 211317765, cogs: 91312451, overheads: 50355021, 
    depreciation: 7803922, interestPaid: 5054944, taxation: 22608371,
    cash: 20882183, accountsReceivable: 36092425, inventory: 29833778,
    fixedAssets: 79265357, accountsPayable: 26756635, equity: 107864635,
    otherCurrentAssets: 2307511, otherNonCurrentAssets: 19528229,
    bankLoansCurrent: 0, bankLoansNonCurrent: 51256712, otherCurrentLiabilities: 2031500
  });

  const results = useMemo(() => calculateFullStory(financials), [financials]);

  const handleClose = () => setShowInputs(false);
  const handleShow = () => setShowInputs(true);

  const chartData = useMemo(() => {
    switch(activeTab) {
      case 'profit':
        return [
          { name: 'Gross %', value: results.ch1.grossMarginPct },
          { name: 'Oper %', value: results.ch1.operatingProfitPct },
          { name: 'Net %', value: results.ch1.netProfitPct }
        ];
      case 'wc':
        return [
          { name: 'AR Days', value: results.ch2.arDays },
          { name: 'Inv Days', value: results.ch2.inventoryDays },
          { name: 'AP Days', value: results.ch2.apDays }
        ];
      default: return [];
    }
  }, [activeTab, results]);

  // Sidebar Component for reuse
  const InputFields = () => (
    <Form className="p-1">
      {Object.keys(financials).map(key => (
        <Form.Group key={key} className="mb-3">
          <Form.Label className="small text-muted mb-1 text-capitalize fw-semibold">
            {key.replace(/([A-Z])/g, ' $1')}
          </Form.Label>
          <Form.Control 
            size="sm" type="number" 
            className="border-light-subtle bg-light shadow-none"
            value={financials[key]} 
            onChange={(e) => setFinancials({...financials, [key]: Number(e.target.value)})} 
          />
        </Form.Group>
      ))}
    </Form>
  );

  return (
    <div className="bg-light min-vh-100 pb-5">
      <Navbar bg="dark" variant="dark" expand="lg" className="px-3 px-md-4 shadow-sm mb-4 sticky-top">
        <Navbar.Brand className="fw-bold d-flex align-items-center">
          <span className="fs-4">Cash Flow Story</span>
          <Badge bg="primary" className="ms-2 d-none d-sm-inline-block" style={{fontSize: '0.6rem'}}>PRO</Badge>
        </Navbar.Brand>
        <Button variant="outline-light" size="sm" className="ms-auto d-lg-none" onClick={handleShow}>
          Edit Data
        </Button>
      </Navbar>

      <Container fluid className="px-3 px-md-4">
        <Row>
          {/* Desktop Sidebar */}
          <Col lg={3} className="d-none d-lg-block">
            <Card className="border-0 shadow-sm sticky-top" style={{ top: '85px', maxHeight: 'calc(100vh - 110px)', overflowY: 'auto' }}>
              <Card.Header className="bg-white border-bottom-0 py-3">
                <h6 className="mb-0 fw-bold text-uppercase text-muted small">Financial Data</h6>
              </Card.Header>
              <Card.Body className="pt-0">
                <InputFields />
              </Card.Body>
            </Card>
          </Col>

          {/* Mobile Drawer (Offcanvas) */}
          <Offcanvas show={showInputs} onHide={handleClose} placement="start">
            <Offcanvas.Header closeButton className="border-bottom">
              <Offcanvas.Title className="fw-bold">Financial Data</Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
              <InputFields />
            </Offcanvas.Body>
          </Offcanvas>

          {/* Main Dashboard Area */}
          <Col lg={9}>
            {/* Tabs Scrollable on Mobile */}
            <Card className="border-0 shadow-sm mb-4 overflow-hidden">
              <div className="overflow-x-auto text-nowrap border-bottom">
                <Nav variant="underline" className="px-3" activeKey={activeTab} onSelect={(k) => setActiveTab(k)}>
                  <Nav.Item><Nav.Link eventKey="profit" className="px-3 py-3 small fw-bold">Profitability</Nav.Link></Nav.Item>
                  <Nav.Item><Nav.Link eventKey="wc" className="px-3 py-3 small fw-bold">Working Capital</Nav.Link></Nav.Item>
                  <Nav.Item><Nav.Link eventKey="capital" className="px-3 py-3 small fw-bold">Other Capital</Nav.Link></Nav.Item>
                  <Nav.Item><Nav.Link eventKey="funding" className="px-3 py-3 small fw-bold">Funding</Nav.Link></Nav.Item>
                  <Nav.Item><Nav.Link eventKey="valuation" className="px-3 py-3 small fw-bold">Valuation</Nav.Link></Nav.Item>
                </Nav>
              </div>
            </Card>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
              >
                {/* Visual Chart - Responsive Height */}
                {chartData.length > 0 && (
                  <Card className="border-0 shadow-sm mb-4 p-3 p-md-4">
                    <div className="d-flex align-items-center mb-3">
                       <h6 className="fw-bold mb-0">Visual Analysis</h6>
                       <div className="ms-auto" style={{height: '4px', width: '40px', background: '#0d6efd', borderRadius: '2px'}}></div>
                    </div>
                    <div style={{ width: '100%', height: 250 }}>
                      <ResponsiveContainer>
                        <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                          <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fontWeight: 500}} />
                          <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10}} />
                          <Tooltip cursor={{fill: '#f8f9fa'}} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 8px 24px rgba(0,0,0,0.1)' }} />
                          <Bar dataKey="value" radius={[4, 4, 0, 0]} barSize={window.innerWidth < 768 ? 30 : 50}>
                            {chartData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={index === 0 ? '#0d6efd' : index === 1 ? '#6610f2' : '#0dcaf0'} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </Card>
                )}

                {/* Data Table Section */}
                <ResultsTable activeTab={activeTab} results={results} />
              </motion.div>
            </AnimatePresence>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

const ResultsTable = ({ activeTab, results }) => {
  const currentData = {
    profit: results.ch1,
    wc: results.ch2,
    capital: results.ch3,
    funding: results.ch4,
    valuation: results.valuation
  }[activeTab];

  return (
    <Card className="border-0 shadow-sm overflow-hidden">
      <Card.Header className="bg-white py-3 border-bottom d-flex align-items-center">
        <h6 className="mb-0 fw-bold">Metrics Overview</h6>
        <Badge bg="light" text="dark" className="ms-auto border fw-normal">Live Stats</Badge>
      </Card.Header>
      <div className="table-responsive">
        <Table hover className="mb-0 align-middle">
          <thead className="bg-light">
            <tr>
              <th className="ps-3 ps-md-4 text-muted small py-3" style={{width: '60%'}}>DESCRIPTION</th>
              <th className="pe-3 pe-md-4 text-end text-muted small py-3">VALUE</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(currentData).map(([key, val]) => (
              <tr key={key}>
                <td className="ps-3 ps-md-4 py-3 text-secondary small text-capitalize fw-medium">
                  {key.replace(/([A-Z])/g, ' $1')}
                </td>
                <td className="pe-3 pe-md-4 text-end fw-bold text-dark">
                  {typeof val === 'number' 
                    ? val.toLocaleString(undefined, {
                        maximumFractionDigits: 2,
                        minimumFractionDigits: (key.includes('Pct') || key.includes('Days')) ? 2 : 0
                      }) 
                    : val}
                  <span className="text-muted ms-1 small fw-normal" style={{fontSize: '0.75rem'}}>
                    {(key.includes('Pct') || key.includes('Ratio')) ? '%' : key.includes('Days') ? 'd' : ''}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </Card>
  );
};

export default App;