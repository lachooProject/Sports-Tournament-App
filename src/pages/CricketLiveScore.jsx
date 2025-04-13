import React, { useState, useEffect } from "react";
import { Button, Card, Container, Row, Col, Badge } from "react-bootstrap";
import { useParams } from "react-router-dom";
import "./CricketLiveScore.css"; // Create this file for custom styles

const CricketLiveScore = () => {
  const { matchId } = useParams();
  const [matchData, setMatchData] = useState({
    team1: "India",
    team2: "Australia",
    score: 0,
    wickets: 0,
    overs: 0.0,
    battingTeam: "India",
    bowlingTeam: "Australia",
    tossWinner: "India",
    tossDecision: "bat",
    status: "Live",
    currentOver: [],
    currentBatsmen: {
      striker: { name: "Virat Kohli", runs: 0, balls: 0 },
      nonStriker: { name: "Rohit Sharma", runs: 0, balls: 0 },
    },
    currentBowler: { name: "Mitchell Starc", overs: 0, runs: 0, wickets: 0 },
  });

  // Log component rendering for debugging
  useEffect(() => {
    console.log("CricketLiveScore component mounted");
    console.log("Match ID:", matchId);
    console.log("Current match data:", matchData);
  }, []);

  const handleScoreUpdate = (type) => {
    switch (type) {
      case "run1":
        updateScore(1);
        break;
      case "run2": // Add this case
        updateScore(2);
        break;
      case "run4":
        updateScore(4);
        break;
      case "run6":
        updateScore(6);
        break;
      case "wicket":
        updateScore("W");
        break;
      case "wide":
        updateExtras("Wd");
        break;
      case "noBall":
        updateExtras("Nb");
        break;
      default:
        break;
    }
  };

  const updateScore = (value) => {
    setMatchData((prev) => {
      const newCurrentOver = [...prev.currentOver, value];
      let newScore = prev.score;
      let newWickets = prev.wickets;
      let newOvers = prev.overs;

      if (value === "W") {
        newWickets += 1;
      } else {
        newScore += value;
      }

      // Update overs if current over is complete (6 balls)
      if (newCurrentOver.length === 6) {
        newOvers = Math.floor(prev.overs) + 1;
        return {
          ...prev,
          score: newScore,
          wickets: newWickets,
          overs: newOvers,
          currentOver: [],
        };
      }

      // Update partial over
      newOvers = Math.floor(prev.overs) + newCurrentOver.length * 0.1;

      return {
        ...prev,
        score: newScore,
        wickets: newWickets,
        overs: Number(newOvers.toFixed(1)),
        currentOver: newCurrentOver,
      };
    });
  };

  const updateExtras = (type) => {
    setMatchData((prev) => ({
      ...prev,
      score: prev.score + 1,
      currentOver: [...prev.currentOver, type],
    }));
  };

  const renderCurrentOver = () => {
    return matchData.currentOver.map((ball, index) => (
      <Badge key={index} bg={getBallColor(ball)} className="me-2 p-2">
        {ball}
      </Badge>
    ));
  };

  // Update the getBallColor function for better visual feedback
  const getBallColor = (ball) => {
    switch (ball) {
      case "W":
        return "danger";
      case 4:
        return "success";
      case 6:
        return "primary";
      case "Wd":
        return "warning";
      case "Nb":
        return "info";
      default:
        return "secondary";
    }
  };

  return (
    <div className="cricket-score-container">
      <Container className="py-5">
        <Card className="main-score-card">
          <Card.Header className="score-header">
            <h2 className="text-center mb-0">Live Cricket Score</h2>
          </Card.Header>
          <Card.Body>
            <div className="text-center score-content">
              <div className="toss-info mb-3">
                <Badge bg="info" className="px-3 py-2">
                  {matchData.tossWinner} won the toss and chose to{" "}
                  {matchData.tossDecision}
                </Badge>
              </div>

              <h3 className="match-teams">
                {matchData.team1} vs {matchData.team2}
              </h3>
              <div className="score-display">
                <h1>
                  {matchData.score}/{matchData.wickets}
                </h1>
                <h4>Overs: {matchData.overs}</h4>
              </div>

              <div className="player-stats mt-4">
                <Row className="batting-info">
                  <Col>
                    <h5>Batting</h5>
                    <div className="d-flex justify-content-around">
                      <span>
                        <strong>
                          {matchData.currentBatsmen.striker.name}*
                        </strong>
                        <br />
                        {matchData.currentBatsmen.striker.runs} (
                        {matchData.currentBatsmen.striker.balls})
                      </span>
                      <span>
                        <strong>
                          {matchData.currentBatsmen.nonStriker.name}
                        </strong>
                        <br />
                        {matchData.currentBatsmen.nonStriker.runs} (
                        {matchData.currentBatsmen.nonStriker.balls})
                      </span>
                    </div>
                  </Col>
                </Row>
                <Row className="bowling-info mt-3">
                  <Col>
                    <h5>Bowling</h5>
                    <span>
                      <strong>{matchData.currentBowler.name}</strong>
                      <br />
                      {matchData.currentBowler.wickets}-
                      {matchData.currentBowler.runs} (
                      {matchData.currentBowler.overs})
                    </span>
                  </Col>
                </Row>
              </div>

              <div className="current-over-display mt-4">
                <h5>Current Over:</h5>
                <div className="balls-display">{renderCurrentOver()}</div>
              </div>

              <div className="match-status mt-3">
                <Badge bg="primary" className="px-3 py-2">
                  {matchData.status}
                </Badge>
              </div>

              <div className="score-controls mt-5">
                <Row className="mb-3 g-3">
                  <Col md={3}>
                    <Button
                      variant="outline-primary"
                      className="w-100 score-btn"
                      onClick={() => handleScoreUpdate("run1")}
                    >
                      1 Run
                    </Button>
                  </Col>
                  <Col md={3}>
                    <Button
                      variant="outline-primary"
                      className="w-100 score-btn"
                      onClick={() => handleScoreUpdate("run2")}
                    >
                      2 Runs
                    </Button>
                  </Col>
                  <Col md={3}>
                    <Button
                      variant="outline-primary"
                      className="w-100 score-btn"
                      onClick={() => handleScoreUpdate("run4")}
                    >
                      4 Runs
                    </Button>
                  </Col>
                  <Col md={3}>
                    <Button
                      variant="outline-primary"
                      className="w-100 score-btn"
                      onClick={() => handleScoreUpdate("run6")}
                    >
                      6 Runs
                    </Button>
                  </Col>
                </Row>
                <Row className="g-3">
                  <Col md={4}>
                    <Button
                      variant="outline-warning"
                      className="w-100 score-btn"
                      onClick={() => handleScoreUpdate("wide")}
                    >
                      Wide
                    </Button>
                  </Col>
                  <Col md={4}>
                    <Button
                      variant="outline-warning"
                      className="w-100 score-btn"
                      onClick={() => handleScoreUpdate("noBall")}
                    >
                      No Ball
                    </Button>
                  </Col>
                  <Col md={4}>
                    <Button
                      variant="outline-danger"
                      className="w-100 score-btn"
                      onClick={() => handleScoreUpdate("wicket")}
                    >
                      Wicket
                    </Button>
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

export default CricketLiveScore;
