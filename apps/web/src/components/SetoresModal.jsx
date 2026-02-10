import { Modal, List, Avatar, Button, Typography, Empty, Spin } from 'antd';
import { WhatsAppOutlined, PhoneOutlined, MailOutlined, CloseOutlined } from '@ant-design/icons';
import { useGetSetoresQuery } from '../store/slices/apiSlice';

const { Title, Text } = Typography;

const SetoresModal = ({ visible, onClose, unidadeId, unidadeNome }) => {
  const { data: setoresResponse, isLoading } = useGetSetoresQuery(unidadeId, {
    skip: !unidadeId
  });
  const setores = setoresResponse?.data || [];

  const handleWhatsAppClick = (whatsapp, nome) => {
    // Remove caracteres não numéricos
    const numeroLimpo = whatsapp.replace(/\D/g, '');
    // Abre WhatsApp com mensagem pré-definida
    const mensagem = encodeURIComponent(`Olá, encontrei o contato do ${nome} no Mapa da Assistência Social de Corumbá. Gostaria de obter mais informações.`);
    window.open(`https://wa.me/55${numeroLimpo}?text=${mensagem}`, '_blank');
  };

  const handlePhoneClick = (numero) => {
    window.open(`tel:${numero}`, '_self');
  };

  const handleEmailClick = (email) => {
    window.open(`mailto:${email}`, '_blank');
  };

  return (
    <Modal
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '24px' }}>🏢</span>
          <Title level={4} style={{ margin: 0, color: '#1890ff' }}>
            Serviços - {unidadeNome}
          </Title>
        </div>
      }
      open={visible}
      onCancel={onClose}
      footer={null}
      width={700}
      closeIcon={<CloseOutlined />}
      styles={{
        header: {
          borderBottom: '2px solid #1890ff',
          paddingBottom: '16px',
        },
        body: {
          maxHeight: '60vh',
          overflowY: 'auto',
        },
      }}
    >
      {isLoading ? (
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <Spin size="large" />
          <div style={{ marginTop: '16px', color: '#666' }}>
            Carregando serviços...
          </div>
        </div>
      ) : setores.length === 0 ? (
        <Empty
          description="Nenhum serviço cadastrado para esta unidade"
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        />
      ) : (
        <>
          <div style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            padding: '16px',
            borderRadius: '8px',
            marginBottom: '20px',
            color: 'white',
          }}>
            <Text style={{ color: 'white', fontSize: '14px' }}>
              ✨ Serviços disponíveis nesta unidade. Clique nos botões de contato para se comunicar diretamente!
            </Text>
          </div>

          <List
            itemLayout="horizontal"
            dataSource={setores}
            renderItem={(setor) => (
              <List.Item
                style={{
                  padding: '16px',
                  marginBottom: '12px',
                  background: '#f9f9f9',
                  borderRadius: '8px',
                  border: '1px solid #e8e8e8',
                  transition: 'all 0.3s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#f0f5ff';
                  e.currentTarget.style.borderColor = '#1890ff';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(24, 144, 255, 0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = '#f9f9f9';
                  e.currentTarget.style.borderColor = '#e8e8e8';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
                actions={[
                  setor.whatsapp && (
                    <Button
                      type="primary"
                      icon={<WhatsAppOutlined />}
                      onClick={() => handleWhatsAppClick(setor.whatsapp, setor.nome)}
                      style={{
                        background: '#25D366',
                        borderColor: '#25D366',
                        fontWeight: '500',
                        height: '36px',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = '#128C7E';
                        e.currentTarget.style.borderColor = '#128C7E';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = '#25D366';
                        e.currentTarget.style.borderColor = '#25D366';
                      }}
                    >
                      WhatsApp
                    </Button>
                  ),
                  setor.numero && (
                    <Button
                      icon={<PhoneOutlined />}
                      onClick={() => handlePhoneClick(setor.numero)}
                      style={{
                        height: '36px',
                      }}
                    >
                      Ligar
                    </Button>
                  ),
                  setor.email && (
                    <Button
                      icon={<MailOutlined />}
                      onClick={() => handleEmailClick(setor.email)}
                      style={{
                        height: '36px',
                      }}
                    >
                      E-mail
                    </Button>
                  ),
                ].filter(Boolean)}
              >
                <List.Item.Meta
                  avatar={
                    <Avatar
                      size={64}
                      style={{
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        fontSize: '24px',
                        fontWeight: 'bold',
                      }}
                    >
                      {setor.nome.charAt(0)}
                    </Avatar>
                  }
                  title={
                    <Text strong style={{ fontSize: '16px', color: '#262626' }}>
                      {setor.nome}
                    </Text>
                  }
                  description={
                    <div style={{ marginTop: '8px' }}>
                      {setor.gestor && (
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          marginBottom: '6px',
                          color: '#595959',
                        }}>
                          <Text style={{ color: '#595959' }}>
                            <strong>Gestor:</strong> {setor.gestor}
                          </Text>
                        </div>
                      )}
                      {setor.numero && (
                        <div style={{ marginTop: '4px', color: '#8c8c8c', fontSize: '13px' }}>
                          <PhoneOutlined style={{ marginRight: '6px' }} />
                          {setor.numero}
                        </div>
                      )}
                      {setor.email && (
                        <div style={{ marginTop: '4px', color: '#8c8c8c', fontSize: '13px' }}>
                          <MailOutlined style={{ marginRight: '6px' }} />
                          {setor.email}
                        </div>
                      )}
                    </div>
                  }
                />
              </List.Item>
            )}
          />
        </>
      )}
    </Modal>
  );
};

export default SetoresModal;
