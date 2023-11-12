import React, { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { postTransaction, getTransactionStatus, getTransactionById, updateTransaction, fetchSucursalData } from '././services/api';
import { Spinner, Container, Card, Row, Col, Button } from 'react-bootstrap';
import { MdMenuBook, MdReceipt, MdHelpOutline, MdLocationOn, MdAccessTime } from 'react-icons/md';
import { FaUser } from 'react-icons/fa';
import './styles/MainContent.css';

function Home() {
  const { idSucursal, mesaUUID } = useParams();
  const [transaction, setTransaction] = useState(null); // State to store the transaction object
  const [isLoading, setIsLoading] = useState(true);
  const [isAsistenciaLoading, setIsAsistenciaLoading] = useState(false);
  const [isCuentaLoading, setIsCuentaLoading] = useState(false);
  const navigate = useNavigate();
  const [sucursalData, setSucursalData] = useState({});

  useEffect(() => {
    setIsLoading(true);
    const savedIdTransaccion = localStorage.getItem('idTransaccion');

    fetchSucursalData()
      .then(data => {
        setSucursalData(data);
        console.log(data);
      })
      .catch(error => {
        console.log(error);
      });

    const fetchTransaction = (id) => {

      getTransactionById(id)
        .then(response => {
          const transaccion = response.data.data;
          if (transaccion.resuelto === 1) {
            if (!idSucursal && !mesaUUID) {
              navigate('/gracias');
            } else {
              postTransaction(idSucursal, mesaUUID)
                .then(newTransactionResponse => {
                  console.log('Success:', newTransactionResponse.data);
                  localStorage.setItem('idTransaccion', newTransactionResponse.data.data.idTransaccion);
                  setTransaction(newTransactionResponse.data.data);
                  setIsLoading(false);
                  const intervalId = setInterval(() => {
                    getTransactionStatus(newTransactionResponse.data.data.idTransaccion)
                      .then(statusResponse => {
                        console.log('Status Update:', statusResponse.data);
                        const updatedStatus = {
                          username: statusResponse.data.data.Username,
                          resuelto: statusResponse.data.data.Resuelto,
                          asistencia: statusResponse.data.data.Asistencia,
                          pideCuenta: statusResponse.data.data.PideCuenta,
                        };
                        setTransaction(prevTransaction => ({
                          ...prevTransaction,
                          ...updatedStatus,
                        }));
                      })
                      .catch(error => {
                        console.error('Error:', error);
                      });
                  }, 15000);
                  return () => clearInterval(intervalId);
                })
                .catch(error => {
                  console.error('Error:', error);
                });
            }
          } else {
            setTransaction(transaccion);
            setIsLoading(false);
            const intervalId = setInterval(() => {
              getTransactionStatus(transaccion.idTransaccion)
                .then(statusResponse => {
                  console.log('Status Update:', statusResponse.data);
                  const updatedStatus = {
                    resuelto: statusResponse.data.data.Resuelto,
                    asistencia: statusResponse.data.data.Asistencia,
                    pideCuenta: statusResponse.data.data.PideCuenta,
                    username: statusResponse.data.data.Username,
                  };
                  setTransaction(prevTransaction => ({
                    ...prevTransaction,
                    ...updatedStatus,
                  }));
                })
                .catch(error => {
                  console.error('Error:', error);
                });
            }, 15000);
            return () => clearInterval(intervalId);
          }
        })
        .catch(error => {
          console.error('Error:', error);
        });
    };

    if (savedIdTransaccion) {
      fetchTransaction(savedIdTransaccion);
    } else if (idSucursal && mesaUUID) {
      postTransaction(idSucursal, mesaUUID)
        .then(response => {
          console.log('Success:', response.data);
          localStorage.setItem('idTransaccion', response.data.data.idTransaccion);
          setTransaction(response.data.data);
          setIsLoading(false);
          const intervalId = setInterval(() => {
            getTransactionStatus(response.data.data.idTransaccion)
              .then(statusResponse => {
                console.log('Status Update:', statusResponse.data);
                const updatedStatus = {
                  resuelto: statusResponse.data.data.Resuelto,
                  asistencia: statusResponse.data.data.Asistencia,
                  pideCuenta: statusResponse.data.data.PideCuenta,
                  username: statusResponse.data.data.Username,
                };
                setTransaction(prevTransaction => ({
                  ...prevTransaction,
                  ...updatedStatus,
                }));
              })
              .catch(error => {
                console.error('Error:', error);
              });
          }, 15000);
          return () => clearInterval(intervalId);
        })
        .catch(error => {
          console.error('Error:', error);
        });
    } else {
      navigate('/gracias');
    }
  }, [idSucursal, mesaUUID, navigate]);

  const handlePedirAsistencia = () => {
    if (transaction && transaction.idTransaccion) {
      setIsAsistenciaLoading(true); // Start loading
      updateTransaction(transaction.idTransaccion, 0, 1, transaction.pideCuenta)
        .then(() => {
          setIsAsistenciaLoading(true);
          getTransactionById(transaction.idTransaccion)
            .then(response => {
              setTransaction(response.data.data); // Update the transaction state
              setIsAsistenciaLoading(false);
            })
            .catch(error => {
              console.error('Error:', error);
              setIsAsistenciaLoading(false);
            });
        })
        .catch(error => {
          console.error('Error:', error);
        })
        .finally(() => {
          setIsAsistenciaLoading(false); // Stop loading
        });
    }
  };

  useEffect(() => {
    if (transaction && transaction.resuelto === 1) {
      navigate('/gracias');
    }
  }, [transaction, navigate]);

  const handlePedirCuenta = () => {
    if (transaction && transaction.idTransaccion) {
      setIsCuentaLoading(true); // Start loading
      updateTransaction(transaction.idTransaccion, 0, transaction.asistencia, 1)
        .then(() => {
          setIsCuentaLoading(true);
          getTransactionById(transaction.idTransaccion)
            .then(response => {
              setTransaction(response.data.data); // Update the transaction state
              setIsCuentaLoading(false);
            })
            .catch(error => {
              console.error('Error:', error);
              setIsCuentaLoading(false);
            });

        })
        .catch(error => {
          console.error('Error:', error);
        })
        .finally(() => {
          setIsCuentaLoading(false); // Stop loading
        });
    }
  };



  if (isLoading) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
        <Spinner animation="border" variant="primary" />
      </Container>
    );
  }


  return (
    <Container className="text-center mt-5">
      <Row className="justify-content-md-center">
        <Col md={12}>
          <div className="decor-top-right"></div>
          <div className="decor-top-left"></div>
          <h1 className="display-4">Bienvenido a {sucursalData?.Sucursal || ''}</h1>
          <p><MdLocationOn /> {sucursalData.Direccion}</p>
          <p><MdAccessTime /> {sucursalData.Horario}</p>
        </Col>
      </Row>

      <Row className="justify-content-md-center">
        <Col md={8}>
          <Card className="mb-3 shadow">
            <Card.Header>

              <p className="lead">Explora nuestro restaurante y menú.</p>

              {/* <p >Mesa {transaction?.idMesa}</p> */}
              {transaction?.username && (<p><FaUser /> Estás siendo atendido por {transaction?.username}</p>)}
            </Card.Header>
            <Card.Body>
              <div className="d-flex flex-column align-items-center">
                <Link to="/app" className="btn btn-primary m-2" style={{ width: '200px' }}><MdMenuBook /> Ver Carta</Link>
                <Button variant="success" className="m-2" disabled={transaction?.pideCuenta === 1 || isCuentaLoading} onClick={handlePedirCuenta} style={{ width: '200px' }}>
                  {isCuentaLoading ? <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" /> : ""}<MdReceipt />  Pedir Cuenta
                </Button>
                <Button variant="danger" className="m-2" disabled={transaction?.asistencia === 1 || isAsistenciaLoading} onClick={handlePedirAsistencia} style={{ width: '200px' }}>
                  {isAsistenciaLoading ? <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" /> : ""} <MdHelpOutline /> Pedir Asistencia
                </Button>
                {(transaction?.pideCuenta === 1 || transaction?.asistencia === 1) && (
                  <div className="mt-3">
                    <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                    <span className="ml-2"> Tu mesero ha sido notificado, por favor espere<span className="dot-container"><span className="dot-animation"></span></span></span>
                  </div>
                )}

              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="justify-content-md-center">
        <Col md={12}>
          <div className="decor-bottom-right"></div>
          <div className="decor-bottom-left"></div>
        </Col>
      </Row>
    </Container>
  );



}

export default Home;
