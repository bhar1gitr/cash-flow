import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Table, Navbar } from 'react-bootstrap';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { calculateRatios } from './utils/formulas';

function App() {
  // Initial state using data from PDF Page 2
  const [financials, setFinancials] = useState({
    revenue: 211317765,
    cogs: 91312451,
    accountsReceivable: 36092425,
    inventory: 29833778,
    accountsPayable: 26756635
  });

  const [ratios, setRatios] = useState({});

  useEffect(() => {
    setRatios(calculateRatios(financials));
  }, [financials]);

  const handleChange = (e) => {
    setFinancials({ ...financials, [e.target.name]: Number(e.target.value) });
  };

  const chartData = [
    { name: 'AR Days', value: Number(ratios.arDays) },
    { name: 'Inv Days', value: Number(ratios.inventoryDays) },
    { name: 'AP Days', value: Number(ratios.apDays) }
  ];

  return (
    <div className="bg-light min-vh-100 pb-5">
      <Navbar bg="dark" variant="dark" className="mb-4">
        <Container><Navbar.Brand>Cash Flow Story Generator</Navbar.Brand></Container>
      </Navbar>

      <Container>
        <Row>
          {/* Section 1: Data Entry (Mirroring PDF Page 2) */}
          <Col lg={4}>
            <Card className="shadow-sm mb-4">
              <Card.Header className="bg-white font-weight-bold">Input Financial Data</Card.Header>
              <Card.Body>
                <Form>
                  <Form.Group className="mb-3">
                    <Form.Label>Revenue</Form.Label>
                    <Form.Control name="revenue" type="number" value={financials.revenue} onChange={handleChange} />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Cost of Goods (COGS)</Form.Label>
                    <Form.Control name="cogs" type="number" value={financials.cogs} onChange={handleChange} />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Accounts Receivable</Form.Label>
                    <Form.Control name="accountsReceivable" type="number" value={financials.accountsReceivable} onChange={handleChange} />
                  </Form.Group>
                </Form>
              </Card.Body>
            </Card>
          </Col>

          {/* Section 2: Visual Story (Mirroring PDF Page 5 & 7) */}
          <Col lg={8}>
            <Card className="shadow-sm mb-4">
              <Card.Header className="bg-white font-weight-bold">Working Capital Trends</Card.Header>
              <Card.Body style={{ height: '300px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill="#1e40af" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </Card.Body>
            </Card>

            <Card className="shadow-sm">
              <Card.Header className="bg-white font-weight-bold">Chapter 2 - Working Capital Ratios</Card.Header>
              <Card.Body>
                <Table hover responsive>
                  <thead className="table-light">
                    <tr>
                      <th>Ratio Description</th>
                      <th>Calculated Result</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Accounts Receivable Days</td>
                      <td className="text-primary fw-bold">{ratios.arDays} Days</td>
                    </tr>
                    <tr>
                      <td>Inventory Days</td>
                      <td className="text-primary fw-bold">{ratios.inventoryDays} Days</td>
                    </tr>
                    <tr>
                      <td>Working Capital Days</td>
                      <td className="text-success fw-bold">{ratios.workingCapitalDays} Days</td>
                    </tr>
                  </tbody>
                </Table>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default App;