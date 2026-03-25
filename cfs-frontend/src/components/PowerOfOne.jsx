import React, { useState } from 'react';
import { Card, Form, Row, Col } from 'react-bootstrap';
import { documentStats as ds } from '../data/documentStats';

const PowerOfOne = () => {
  const [priceIncr, setPriceIncr] = useState(1); // Default 1% from Page 16
  
  // Logic: 1% Price Increase impact on Operating Profit
  const profitImpact = ds.revenue * (priceIncr / 100);

  return (
    <Card className="shadow-sm border-0 mb-4">
      <Card.Header className="bg-white font-weight-bold">The Power of One Impact</Card.Header>
      <Card.Body>
        <Row className="align-items-center">
          <Col md={8}>
            <Form.Label>Price Increase (%)</Form.Label>
            <Form.Range 
              min="0" max="5" step="0.5" 
              value={priceIncr} 
              onChange={(e) => setPriceIncr(e.target.value)} 
            />
          </Col>
          <Col md={4} className="text-center">
            <div className="p-3 bg-light rounded">
              <small className="text-muted">Impact on Profit</small>
              <h4 className="text-success">+₹{Math.round(profitImpact).toLocaleString()}</h4>
            </div>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
};

export default PowerOfOne;