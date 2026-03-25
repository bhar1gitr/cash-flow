import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { documentStats as ds } from '../data/documentStats';

const SummaryHeader = () => {
  const formatINR = (val) => "₹" + val.toLocaleString('en-IN');

  return (
    <Container fluid className="mb-4">
      <Row>
        <Col md={4}>
          <Card className="shadow-sm border-0 bg-primary text-white">
            <Card.Body>
              <h6>REVENUE</h6>
              <h3>{formatINR(ds.revenue)}</h3>
              <small><TrendingUp size={14}/> +{formatINR(ds.changes.revenue)}</small>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="shadow-sm border-0">
            <Card.Body>
              <h6>GROSS MARGIN</h6>
              <h3 className="text-success">{formatINR(ds.grossMargin)}</h3>
              <small className="text-danger"><TrendingDown size={14}/> {ds.changes.grossMarginPct}%</small>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="shadow-sm border-0">
            <Card.Body>
              <h6>NET PROFIT</h6>
              <h3 className="text-info">{formatINR(ds.netProfit)}</h3>
              <small className="text-danger"><TrendingDown size={14}/> {ds.changes.netProfitPct}%</small>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default SummaryHeader;