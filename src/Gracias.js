import React, { useState, useEffect } from 'react';
import { getTransactionById, calificarTransaction } from './services/api';
import { Card, Container, Form, Button, Row, Spinner } from 'react-bootstrap';
import { FaStar, FaPaperPlane } from 'react-icons/fa';

const Gracias = () => {
  const [transaction, setTransaction] = useState(null);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionComplete, setSubmissionComplete] = useState(false);
  const savedIdTransaccion = localStorage.getItem('idTransaccion');

  useEffect(() => {
    if (savedIdTransaccion) {
      getTransactionById(savedIdTransaccion)
        .then(response => {
          const transactionData = response.data.data;
          // Check if calificacion is not null, if so, set submissionComplete to true
          if (transactionData.calificacion !== null) {
            setSubmissionComplete(true);
          }
          setTransaction(transactionData);
        })
        .catch(error => {
          console.error('Error fetching transaction:', error);
        });
    }
  }, [savedIdTransaccion]);

  const handleRatingChange = (newRating) => {
    setRating(newRating);
  };

  const handleCommentChange = (event) => {
    setComment(event.target.value);
  };

  const handleSubmit = () => {
    setIsSubmitting(true);
    calificarTransaction(savedIdTransaccion, rating, comment)
      .then(response => {
        console.log('Rating submitted:', response);
        setSubmissionComplete(true);
      })
      .catch(error => {
        console.error('Error submitting rating:', error);
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  const starStyle = (index) => ({
    cursor: 'pointer',
    transition: 'color 200ms, box-shadow 200ms',
    color: (hoverRating || rating) >= index ? "gold" : "grey",
    shadow: rating === 5 ? '0 0 48px gold' : 'none'
  });

  return (
    <Container className='text-center mt-5 align-items-center' style={{ minHeight: '100vh' }}>
      <h1 className="display-4">¡Gracias por usar nuestro servicio!</h1>
      <p className="lead">Esperamos que hayas disfrutado de tu experiencia.</p>
      <br></br>
      <br></br>
      <br></br>
      
      {!submissionComplete && (
        <Row className="justify-content-md-center">
        {transaction && !submissionComplete && (
          <Card className="mb-4 shadow" >
            <Card.Body className="justify-content-center">
              <Card.Title>¿Qué te pareció la atención?</Card.Title>
              <Card.Subtitle>Por favor, califícanos y déjanos un comentario. Tu opinión es importante para mejorar nuestro servicio.</Card.Subtitle>
              <br />
              <div>
                {[...Array(5)].map((star, index) => {
                  index += 1;
                  return (
                    <FaStar
                      key={index}
                      size={48}
                      onMouseEnter={() => setHoverRating(index)}
                      onMouseLeave={() => setHoverRating(0)}
                      onClick={() => handleRatingChange(index)}
                      style={starStyle(index)}
                    />
                  );
                })}
              </div>
              <br />
              <Form.Group className="mb-3 form-floating" controlId="comment">
                <Form.Control
                  as="textarea"
                  placeholder=""
                  style={{ height: '100px' }}
                  value={comment}
                  onChange={handleCommentChange}
                  maxLength={500}
                />
                <Form.Label>Comentarios</Form.Label>
              </Form.Group>
              <Button variant="success" size="lg" onClick={handleSubmit} disabled={rating === 0 || isSubmitting}>
                {isSubmitting ? <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" /> : <FaPaperPlane />}
                {isSubmitting ? ' Enviando...' : ' Enviar'}
              </Button>
            </Card.Body>
          </Card>
          )}
          </Row>
        )}
        {submissionComplete && (
          <Row className="justify-content-md-center">
          <Card className="mb-4 shadow">
            <Card.Body className="justify-content-center">
              <Card.Title><FaPaperPlane/> Calificación enviada.</Card.Title>
            </Card.Body>
          </Card>
          </Row>
        )}
      
    </Container>
  );
};

export default Gracias;
