import React, { useEffect, useState } from 'react';
import { Link, useParams, useNavigate  } from 'react-router-dom';
import { postTransaction, getTransactionStatus, getTransactionById, updateTransaction    } from '././services/api'; // Import the function
import { Spinner, Container } from 'react-bootstrap';

function Home() {
  const { idSucursal, mesaUUID } = useParams();
  const [transaction, setTransaction] = useState(null); // State to store the transaction object
  const [isLoading, setIsLoading] = useState(true);
  const [isAsistenciaLoading, setIsAsistenciaLoading] = useState(false);
  const [isCuentaLoading, setIsCuentaLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setIsLoading(true);
    const savedIdTransaccion = localStorage.getItem('idTransaccion');

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
  <div className="container text-center mt-5">
    <h1 className="display-4">Bienvenido a {transaction?.sucursal || ''}</h1>
    <p className="lead">Explora nuestro restaurante y menú.</p>
    {transaction?.username && (
      <p className="text-info">Estás siendo atendido por {transaction?.username}</p>
    )}
    <div className="d-flex flex-column align-items-center">
      <Link to="/app" className="btn btn-primary m-2" style={{ width: '200px' }}>Ver Carta</Link>
      <button className="btn btn-success m-2" disabled={transaction?.pideCuenta === 1 || isCuentaLoading} onClick={handlePedirCuenta} style={{ width: '200px' }}>
        {isCuentaLoading ? <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" /> : ""}  Pedir Cuenta
      </button>
      <button className="btn btn-danger m-2" disabled={transaction?.asistencia === 1 || isAsistenciaLoading} onClick={handlePedirAsistencia} style={{ width: '200px' }}>
        {isAsistenciaLoading ? <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" /> : ""} Pedir Asistencia
      </button>
    </div>
  </div>
);

  
}

export default Home;
