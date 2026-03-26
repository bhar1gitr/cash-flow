import React, { useState, useMemo } from 'react';
import { Container, Row, Col, Card, Nav, Table, Form, Navbar, Badge } from 'react-bootstrap';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, ReferenceLine } from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import { calculateFullStory } from './data/documentStats';

function App() {
  const [activeTab, setActiveTab] = useState('profit');
  const [financials, setFinancials] = useState({
    revenue: 211317765, cogs: 91312451, overheads: 50355021, 
    depreciation: 7803922, interestPaid: 5054944, taxation: 22608371,
    cash: 20882183, accountsReceivable: 36092425, inventory: 29833778,
    fixedAssets: 79265357, accountsPayable: 26756635, equity: 107864635,
    otherCurrentAssets: 2307511, otherNonCurrentAssets: 19528229,
    bankLoansCurrent: 0, bankLoansNonCurrent: 51256712, otherCurrentLiabilities: 2031500
  });

  const results = useMemo(() => calculateFullStory(financials), [financials]);

  // Data mapping for charts based on PDF Chapters
  const chartData = useMemo(() => {
    switch(activeTab) {
      case 'profit':
        return [
          { name: 'Gross Margin %', value: results.ch1.grossMarginPct },
          { name: 'Operating Profit %', value: results.ch1.operatingProfitPct },
          { name: 'Net Profit %', value: results.ch1.netProfitPct }
        ];
      case 'wc':
        return [
          { name: 'AR Days', value: results.ch2.arDays },
          { name: 'Inventory Days', value: results.ch2.inventoryDays },
          { name: 'AP Days', value: results.ch2.apDays }
        ];
      default: return [];
    }
  }, [activeTab, results]);

  return (
    <div className="bg-light min-vh-100">
      <Navbar bg="dark" variant="dark" className="px-4 shadow-sm mb-4">
        <Navbar.Brand className="fw-bold">Cash Flow Story <small className="text-muted fw-normal">| Analyzer</small></Navbar.Brand>
      </Navbar>

      <Container fluid className="px-4">
        <Row>
          {/* Sidebar: Inputs */}
          <Col lg={3} className="mb-4">
            <Card className="border-0 shadow-sm sticky-top" style={{ top: '20px', maxHeight: '90vh', overflowY: 'auto' }}>
              <Card.Header className="bg-white border-bottom-0 py-3">
                <h6 className="mb-0 fw-bold text-uppercase text-muted small">Financial Inputs</h6>
              </Card.Header>
              <Card.Body className="pt-0">
                {Object.keys(financials).map(key => (
                  <Form.Group key={key} className="mb-3">
                    <Form.Label className="small text-muted mb-1 text-capitalize">
                      {key.replace(/([A-Z])/g, ' $1')}
                    </Form.Label>
                    <Form.Control 
                      size="sm" type="number" 
                      className="border-light-subtle bg-light"
                      value={financials[key]} 
                      onChange={(e) => setFinancials({...financials, [key]: Number(e.target.value)})} 
                    />
                  </Form.Group>
                ))}
              </Card.Body>
            </Card>
          </Col>

          {/* Main Content: Story & Charts */}
          <Col lg={9}>
            <Card className="border-0 shadow-sm mb-4">
              <Nav variant="underline" className="px-3 pt-2" activeKey={activeTab} onSelect={(k) => setActiveTab(k)}>
                <Nav.Item><Nav.Link eventKey="profit" className="px-3 py-3">Profitability</Nav.Link></Nav.Item>
                <Nav.Item><Nav.Link eventKey="wc" className="px-3 py-3">Working Capital</Nav.Link></Nav.Item>
                <Nav.Item><Nav.Link eventKey="capital" className="px-3 py-3">Other Capital</Nav.Link></Nav.Item>
                <Nav.Item><Nav.Link eventKey="funding" className="px-3 py-3">Funding</Nav.Link></Nav.Item>
                <Nav.Item><Nav.Link eventKey="valuation" className="px-3 py-3">Valuation</Nav.Link></Nav.Item>
              </Nav>
            </Card>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                {/* Visual Chart Section */}
                {chartData.length > 0 && (
                  <Card className="border-0 shadow-sm mb-4 p-4">
                    <h5 className="fw-bold mb-4">{activeTab === 'profit' ? 'Profitability Trends' : 'Working Capital Cycle'}</h5>
                    <div style={{ width: '100%', height: 300 }}>
                      <ResponsiveContainer>
                        <BarChart data={chartData}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                          <XAxis dataKey="name" axisLine={false} tickLine={false} />
                          <YAxis axisLine={false} tickLine={false} />
                          <Tooltip cursor={{fill: '#f8f9fa'}} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                          <Bar dataKey="value" radius={[6, 6, 0, 0]} barSize={50}>
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
  const titles = {
    profit: "Chapter 1: Profitability",
    wc: "Chapter 2: Working Capital",
    capital: "Chapter 3: Other Capital",
    funding: "Chapter 4: Funding",
    valuation: "Business Valuation Indicator"
  };

  const currentData = {
    profit: results.ch1,
    wc: results.ch2,
    capital: results.ch3,
    funding: results.ch4,
    valuation: results.valuation
  }[activeTab];

  return (
    <Card className="border-0 shadow-sm">
      <Card.Header className="bg-white py-3 border-bottom-0">
        <div className="d-flex justify-content-between align-items-center">
          <h5 className="mb-0 fw-bold">{titles[activeTab]}</h5>
          <Badge bg="primary-subtle" text="primary" className="px-3 py-2">Current Period</Badge>
        </div>
      </Card.Header>
      <Table responsive className="mb-0 align-middle">
        <thead className="bg-light">
          <tr>
            <th className="px-4 text-muted small fw-bold">METRIC DESCRIPTION</th>
            <th className="text-end px-4 text-muted small fw-bold">CALCULATED VALUE</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(currentData).map(([key, val]) => (
            <tr key={key}>
              <td className="px-4 text-capitalize py-3 text-secondary">{key.replace(/([A-Z])/g, ' $1')}</td>
              <td className="text-end px-4 fw-bold">
                {typeof val === 'number' 
                  ? val.toLocaleString(undefined, {
                      maximumFractionDigits: 2,
                      minimumFractionDigits: (key.includes('Pct') || key.includes('Days')) ? 2 : 0
                    }) 
                  : val}
                {(key.includes('Pct') || key.includes('Ratio')) ? '%' : key.includes('Days') ? ' Days' : ''}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Card>
  );
};

export default App;