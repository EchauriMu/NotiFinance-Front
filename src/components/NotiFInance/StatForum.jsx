import React, { useState, useEffect } from 'react';
import { Card, Button, List, Avatar, Space, Typography, Divider, Progress, Modal, Input, Skeleton, Alert } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined, CommentOutlined } from '@ant-design/icons';
import axiosInstance from "../../api/axiosInstance";

const { TextArea } = Input;
const { Title, Text } = Typography;

export const StatForum = ({ symbol }) => {
  const [foro, setForo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [nuevoComentario, setNuevoComentario] = useState("");
  const [error, setError] = useState(null);
  const [votado, setVotado] = useState(false);

  useEffect(() => {
    if (symbol) {
      setLoading(true);
      setError(null);
      setTimeout(() => {
        axiosInstance.get(`/foro/get/${symbol}`)
          .then(response => setForo(response.data))
          .catch(error => {
            if (error.response && error.response.status === 404) {
              setError("Foro no encontrado en la base de datos");
            } else {
              console.error("Error al obtener foro:", error);
            }
          })
          .finally(() => setLoading(false));
      }, 3000);
    }
  }, [symbol]);

  const manejarVoto = (positivo) => {
    if (!foro || votado) return;
    setVotado(true);
    const updatedVotosPositivos = positivo ? foro.votosPositivos + 1 : foro.votosPositivos - 1;
    const updatedTotalVotos = foro.totalVotos + 1;
    
    axiosInstance.put(`/foro/put/${symbol}`, {
      votosPositivos: updatedVotosPositivos,
      totalVotos: updatedTotalVotos,
    }).then(() => setForo(prev => ({ ...prev, votosPositivos: updatedVotosPositivos, totalVotos: updatedTotalVotos })))
    .catch(error => console.error("Error al actualizar votos:", error));
  };

  const agregarComentario = () => {
    if (!foro || !nuevoComentario.trim()) return;
    
    axiosInstance.post(`/foro/post/${symbol}/comentario`, {
      contenido: nuevoComentario,
    }).then(response => {
      setForo(prev => ({ ...prev, comentarios: response.data.comentarios }));
      setNuevoComentario("");
      setModalVisible(false);
    }).catch(error => console.error("Error al agregar comentario:", error));
  };

  const porcentajePositivo = foro?.totalVotos > 0 ? Math.round((foro.votosPositivos / foro.totalVotos) * 100) : 0;

  return (
    <Card title={'Prediccion de la comunidad'}style={{ marginBottom:15 }}>
      {!symbol ? (
        <Alert message="Para ver el foro selecciona un símbolo" type="warning" showIcon />
      ) : loading ? (
        <>
          
          <Skeleton.Input style={{ width: 380, height: 60 }} active />
          <Skeleton paragraph={{ rows: 4 }} active />
          <Skeleton.Input style={{ width: 100, height: 30, marginTop: 10 }} active />
        </>
      ) : error ? (
        <Alert message={error} type="warning" showIcon />
      ) : foro ? (
        <>
          <Space direction="vertical" style={{ width: '100%' }} size="large">
            <Space>
              
              <Text type="secondary" style={{ color: 'white' }}>{foro.totalVotos} votos</Text>
            </Space>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Button type="primary" style={{background:'green'}} icon={<ArrowUpOutlined />} onClick={() => manejarVoto(true)} disabled={votado}>
                {porcentajePositivo}%
              </Button>
              <Progress percent={porcentajePositivo} success={{ percent: porcentajePositivo }} trailColor="#ff4d4f" showInfo={false} style={{ flex: 1 }} />
              <Button type="primary" danger icon={<ArrowDownOutlined />} onClick={() => manejarVoto(false)} disabled={votado}>
                {100 - porcentajePositivo}%
              </Button>
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
                <List.Item.Meta avatar={<Avatar size={40} src={`https://api.dicebear.com/9.x/dylan/svg?seed=${encodeURIComponent(item.autor)}`} />} title={<a href="#" style={{ color: 'white' }}>{item.autor}</a>} description={<><Text style={{ color: 'white' }}>{item.contenido}</Text> <Text type="secondary" style={{ color: 'white' }}>{item.tiempo}</Text></>} />
              </List.Item>
            )}
          />
          <Divider />
          <Button type="primary" icon={<CommentOutlined />} onClick={() => setModalVisible(true)}>
            Comentar
          </Button>
        </>
      ) : null}

      <Modal
        title="Agregar un comentario"
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        onOk={agregarComentario}
        okText="Publicar"
        cancelText="Cancelar"
      >
        <TextArea rows={4} value={nuevoComentario} onChange={(e) => setNuevoComentario(e.target.value)} placeholder="Comparte tu opinión..." />
      </Modal>
    </Card>
  );
};
