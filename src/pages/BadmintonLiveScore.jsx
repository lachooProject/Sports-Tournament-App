import React, { useState, useEffect } from 'react';
import { Button, Card, Container, Row, Col, Badge } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import './BadmintonLiveScore.css';

const BadmintonLiveScore = () => {
  const { matchId } = useParams();
  const [matchData, setMatchData] = useState({
    player1: 'Player 1',
    player2: 'Player 2',
    sets: [
      { player1: 0, player2: 0 },
      { player1: 0, player2: 0 },
      { player1: 0, player2: 0 }
    ],
    currentSet: 0,
    matchStatus: 'Live',
    servicePlayer: 1,
    recentEvents: []
  });

  useEffect(() => {
  }, [matchId]);

  const handleScoreUpdate = (player) => {
    setMatchData(prev => {
      const newData = { ...prev };
      const currentSetScore = newData.sets[newData.currentSet];
      
      // Update score for current set
      currentSetScore[`player${player}`]++;
      
      // Add to recent events
      newData.recentEvents.unshift(`🏸 Point - ${newData[`player${player}`]}`);
      
      // Check for set win (21 points with 2 point lead)
      if (currentSetScore[`player${player}`] >= 21 && 
          currentSetScore[`player${player}`] - currentSetScore[`player${player === 1 ? 2 : 1}`] >= 2) {
        newData.recentEvents.unshift(`🎉 Set ${newData.currentSet + 1} won by ${newData[`player${player}`]}`);
        if (newData.currentSet < 2) {
          newData.currentSet++;
        }
      }

      // Keep only last 10 events
      newData.recentEvents = newData.recentEvents.slice(0, 10);
      
      return newData;
    });
  };

  const handleService = (player) => {
    setMatchData(prev => ({
      ...prev,
      servicePlayer: player,
      recentEvents: [`🎯 Service changed to ${prev[`player${player}`]}`].concat(prev.recentEvents.slice(0, 9))
    }));
  };

  return (
    <div className="badminton-score-container">
      <Container className="py-5">
        <Card className="main-score-card">
          <Card.Header className="score-header">
            <h2 className="text-center mb-0">Live Badminton Score</h2>
          </Card.Header>
          <Card.Body>
            <div className="text-center score-content">
              <div className="match-status mb-3">
                <Badge bg="danger" className="px-3 py-2">
                  {matchData.matchStatus}
                </Badge>
              </div>

              <div className="service-indicator mb-3">
                <Badge bg="info" className="px-3 py-2">
                  Service: {matchData[`player${matchData.servicePlayer}`]}
                </Badge>
              </div>

              <div className="sets-display">
                {matchData.sets.map((set, index) => (
                  <Row key={index} className="mb-2">
                    <Col md={12}>
                      <h4>Set {index + 1}</h4>
                      <h3 className="score">
                        {set.player1} - {set.player2}
                      </h3>
                    </Col>
                  </Row>
                ))}
              </div>

              <div className="recent-events mt-4">
                <h5>Recent Events</h5>
                <div className="events-list">
                  {matchData.recentEvents.map((event, index) => (
                    <div key={index} className="event-item">
                      {event}
                    </div>
                  ))}
                </div>
              </div>

              <div className="score-controls mt-5">
                <Row className="mb-3">
                  <Col md={6}>
                    <h5>{matchData.player1} Controls</h5>
                    <div className="d-grid gap-2">
                      <Button variant="outline-success" onClick={() => handleScoreUpdate(1)}>
                        Add Point
                      </Button>
                      <Button variant="outline-info" onClick={() => handleService(1)}>
                        Set Service
                      </Button>
                    </div>
                  </Col>
                  <Col md={6}>
                    <h5>{matchData.player2} Controls</h5>
                    <div className="d-grid gap-2">
                      <Button variant="outline-success" onClick={() => handleScoreUpdate(2)}>
                        Add Point
                      </Button>
                      <Button variant="outline-info" onClick={() => handleService(2)}>
                        Set Service
                      </Button>
                    </div>
                  </Col>
                </Row>
              </div>
            </div>
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
};

export default BadmintonLiveScore;
