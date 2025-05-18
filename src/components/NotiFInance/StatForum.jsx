import React, { useState, useEffect } from 'react';
import {
  Card, Button, List, Avatar, Space, Typography, Divider,
  Progress, Modal, Input, Skeleton, Alert, Tooltip
} from 'antd';
import {
  ArrowUpOutlined, ArrowDownOutlined, CommentOutlined
} from '@ant-design/icons';
import axiosInstance from "../../api/axiosInstance";

const { TextArea } = Input;
const { Title, Text } = Typography;

//En produccion hay que cambiar esto Pardo me recuerdas
//1 segundo = 1,000 milisegundos
//1 minuto = 60 segundos = 60,000 milisegundos
//1 hora = 60 minutos = 3,600,000 milisegundos

const ONE_HOUR = 3600000; 

export const StatForum = ({ symbol }) => {
  const [foro, setForo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [nuevoComentario, setNuevoComentario] = useState("");
  const [error, setError] = useState(null);
  const [votado, setVotado] = useState(false);

  useEffect(() => {
    if (!symbol) return;

    setLoading(true);
    setError(null);

    const fetchForo = () => {
      axiosInstance.get(`/foro/get/${symbol}`)
        .then(response => setForo(response.data))
        .catch(error => {
          if (error.response && error.response.status === 404) {
            axiosInstance.post(`/foro/inicializar/${symbol}`)
              .then(() => axiosInstance.get(`/foro/get/${symbol}`))
              .then(response => setForo(response.data))
              .catch(err => {
                console.error("Error al inicializar foro:", err);
                setError("Ocurrió un error al inicializar el foro.");
              });
          } else {
            console.error("Error al obtener foro:", error);
            setError("Ocurrió un error al cargar el foro.");
          }
        })
        .finally(() => setLoading(false));
    };

    setTimeout(fetchForo, 1000);

    const lastVotes = JSON.parse(localStorage.getItem("lastVotes") || "{}");
    const lastVoteTime = lastVotes[symbol];
    const now = Date.now();
    setVotado(lastVoteTime && now - lastVoteTime < ONE_HOUR);
  }, [symbol]);

  const manejarVoto = (positivo) => {
    if (!foro || votado) return;

    const now = Date.now();
    const lastVotes = JSON.parse(localStorage.getItem("lastVotes") || "{}");
    lastVotes[symbol] = now;
    localStorage.setItem("lastVotes", JSON.stringify(lastVotes));
    setVotado(true);

    const updatedVotosPositivos = positivo ? foro.votosPositivos + 1 : foro.votosPositivos;
    const updatedTotalVotos = foro.totalVotos + 1;

    axiosInstance.put(`/foro/put/${symbol}`, {
      votosPositivos: updatedVotosPositivos,
      totalVotos: updatedTotalVotos,
    })
      .then(() => {
        setForo(prev => ({
          ...prev,
          votosPositivos: updatedVotosPositivos,
          totalVotos: updatedTotalVotos,
        }));
      })
      .catch(error => console.error("Error al registrar voto:", error));
  };

  const agregarComentario = () => {
    if (!foro || !nuevoComentario.trim()) return;

    const comentarioNuevo = {
      contenido: nuevoComentario,
      autor: "Anónimo",
      tiempo: "hace un momento",
    };

    axiosInstance.post(`/foro/post/${symbol}/comentario`, comentarioNuevo)
      .then(response => {
        setForo(prev => ({
          ...prev,
          comentarios: response.data.comentarios || [comentarioNuevo],
        }));
        setNuevoComentario("");
        setModalVisible(false);
      })
      .catch(error => console.error("Error al agregar comentario:", error));
  };

  const porcentajePositivo = foro?.totalVotos > 0
    ? Math.round((foro.votosPositivos / foro.totalVotos) * 100)
    : 0;

  return (
    <Card
      title={
        <div>
       
          Predicción de la comunidad  - 
             {symbol && (
            <span style={{ color: '#ffa500', fontWeight: 700, fontSize: 14, marginRight: 12 }}>
             Criptomoneda  : {symbol}
            </span>
          )}
        </div>
      }
      style={{ marginBottom: 15 }}
    >
      {!symbol ? (
        <Alert message="Para ver el foro selecciona un símbolo" type="warning" showIcon />
      ) : loading ? (
        <>
          <Skeleton.Input style={{ width: 380, height: 60 }} active />
          <Skeleton paragraph={{ rows: 4 }} active />
          <Skeleton.Input style={{ width: 100, height: 30, marginTop: 10 }} active />
        </>
      ) : foro ? (
        <>
          <Space direction="vertical" style={{ width: '100%' }} size="large">
            <Space>
              <Text type="secondary" style={{ color: 'white' }}>{foro.totalVotos} votos</Text>
            </Space>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Tooltip title={votado ? "Espera 1 hora para volver a votar" : ""}>
                <Button
                  type="primary"
                  style={{ background: 'green' }}
                  icon={<ArrowUpOutlined />}
                  onClick={() => manejarVoto(true)}
                  disabled={votado}
                >
                  {porcentajePositivo}%
                </Button>
              </Tooltip>

              <Progress
                percent={porcentajePositivo}
                success={{ percent: porcentajePositivo }}
                trailColor="#ff4d4f"
                showInfo={false}
                style={{ flex: 1 }}
              />

              <Tooltip title={votado ? "Espera 1 hora para volver a votar" : ""}>
                <Button
                  type="primary"
                  danger
                  icon={<ArrowDownOutlined />}
                  onClick={() => manejarVoto(false)}
                  disabled={votado}
                >
                  {100 - porcentajePositivo}%
                </Button>
              </Tooltip>
            </div>
          </Space>
          <Divider />
          <Title level={5} style={{ color: 'white' }}>Discusión de la comunidad</Title>
          <List
            style={{ overflowY: 'auto', maxHeight: '120px' }}
            itemLayout="horizontal"
            dataSource={foro.comentarios}
            renderItem={item => (
              <List.Item>
                <List.Item.Meta
                  avatar={
                    <Avatar
                      size={40}
                      src={`https://api.dicebear.com/9.x/dylan/svg?seed=${encodeURIComponent(item.autor)}`}
                    />
                  }
                  title={<a href="#" style={{ color: 'white' }}>{item.autor}</a>}
                  description={
                    <>
                      <Text style={{ color: 'white' }}>{item.contenido}</Text>
                      <Text type="secondary" style={{ color: 'white', marginLeft: 8 }}>
                        {item.tiempo}
                      </Text>
                    </>
                  }
                />
              </List.Item>
            )}
          />
          <Divider />
          <Button type="primary" icon={<CommentOutlined />} onClick={() => setModalVisible(true)}>
            Comentar
          </Button>
        </>
      ) : (
        <Alert message="No se pudo cargar el foro." type="error" showIcon />
      )}

      <Modal
        title="Agregar un comentario"
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        onOk={agregarComentario}
        okText="Publicar"
        cancelText="Cancelar"
      >
        <TextArea
          rows={4}
          value={nuevoComentario}
          onChange={(e) => setNuevoComentario(e.target.value)}
          placeholder="Comparte tu opinión..."
        />
      </Modal>
    </Card>
  );
};
