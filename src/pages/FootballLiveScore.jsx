import React, { useState, useEffect } from 'react';
import { Button, Card, Container, Row, Col, Badge } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import './FootballLiveScore.css';

const FootballLiveScore = () => {
  const { matchId } = useParams();
  const [matchData, setMatchData] = useState({
    team1: 'Manchester United',
    team2: 'Manchester City',
    score1: 0,
    score2: 0,
    time: 0,
    status: 'Live',
    possession: { team1: 50, team2: 50 },
    shots: { team1: 0, team2: 0 },
    shotsOnTarget: { team1: 0, team2: 0 },
    corners: { team1: 0, team2: 0 },
    fouls: { team1: 0, team2: 0 },
    yellowCards: { team1: 0, team2: 0 },
    redCards: { team1: 0, team2: 0 },
    recentEvents: []
  });

  useEffect(() => {
  }, []);

  const handleScoreUpdate = (team, type) => {
    setMatchData(prev => {
      const newData = { ...prev };
      
      switch (type) {
        case 'goal':
          newData[`score${team}`] = prev[`score${team}`] + 1;
          newData.recentEvents.unshift(`⚽ Goal - ${newData[`team${team}`]}`);
          break;
        case 'yellow':
          newData.yellowCards[`team${team}`]++;
          newData.recentEvents.unshift(`🟨 Yellow Card - ${newData[`team${team}`]}`);
          break;
        case 'red':
          newData.redCards[`team${team}`]++;
          newData.recentEvents.unshift(`🟥 Red Card - ${newData[`team${team}`]}`);
          break;
        case 'corner':
          newData.corners[`team${team}`]++;
          newData.recentEvents.unshift(`🚩 Corner - ${newData[`team${team}`]}`);
          break;
        case 'shot':
          newData.shots[`team${team}`]++;
          newData.recentEvents.unshift(`🎯 Shot - ${newData[`team${team}`]}`);
          break;
        default:
          break;
      }

      // Keep only last 10 events
      newData.recentEvents = newData.recentEvents.slice(0, 10);
      
      return newData;
    });
  };

  return (
    <div className="football-score-container">
      <Container className="py-5">
        <Card className="main-score-card">
          <Card.Header className="score-header">
            <h2 className="text-center mb-0">Live Football Score</h2>
          </Card.Header>
          <Card.Body>
            <div className="text-center score-content">
              <div className="match-status mb-3">
                <Badge bg="danger" className="px-3 py-2">
                  {matchData.time}' {matchData.status}
                </Badge>
              </div>

              <div className="teams-score-display">
                <Row className="align-items-center">
                  <Col md={5} className="text-end">
                    <h3>{matchData.team1}</h3>
                  </Col>
                  <Col md={2}>
                    <h1 className="score">
                      {matchData.score1} - {matchData.score2}
                    </h1>
                  </Col>
                  <Col md={5} className="text-start">
                    <h3>{matchData.team2}</h3>
                  </Col>
                </Row>
              </div>

              <div className="match-stats mt-4">
                <Row className="stat-row">
                  <Col md={4} className="text-end">
                    {matchData.possession.team1}%
                  </Col>
                  <Col md={4} className="text-center">
                    Possession
                  </Col>
                  <Col md={4} className="text-start">
                    {matchData.possession.team2}%
                  </Col>
                </Row>
                {/* Add more stats rows for shots, corners, etc. */}
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
                    <h5>{matchData.team1} Controls</h5>
                    <div className="d-grid gap-2">
                      <Button variant="outline-success" onClick={() => handleScoreUpdate(1, 'goal')}>
                        Add Goal
                      </Button>
                      <Button variant="outline-warning" onClick={() => handleScoreUpdate(1, 'yellow')}>
                        Yellow Card
                      </Button>
                      <Button variant="outline-danger" onClick={() => handleScoreUpdate(1, 'red')}>
                        Red Card
                      </Button>
                    </div>
                  </Col>
                  <Col md={6}>
                    <h5>{matchData.team2} Controls</h5>
                    <div className="d-grid gap-2">
                      <Button variant="outline-success" onClick={() => handleScoreUpdate(2, 'goal')}>
                        Add Goal
                      </Button>
                      <Button variant="outline-warning" onClick={() => handleScoreUpdate(2, 'yellow')}>
                        Yellow Card
                      </Button>
                      <Button variant="outline-danger" onClick={() => handleScoreUpdate(2, 'red')}>
                        Red Card
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

export default FootballLiveScore;
