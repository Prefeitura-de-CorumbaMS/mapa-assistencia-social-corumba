import { Card, Row, Col, Statistic, Table, Tag, Progress, Space, Typography } from 'antd'
import {
  EnvironmentOutlined,
  TagsOutlined,
  PictureOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  EyeOutlined,
  RiseOutlined,
  TeamOutlined,
  CalendarOutlined,
  FieldTimeOutlined,
  ClockCircleOutlined,
  GlobalOutlined
} from '@ant-design/icons'
import { useGetUnidadesQuery, useGetCategoriasQuery, useGetIconesQuery, useGetAccessStatsQuery } from '../../store/slices/apiSlice'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { useMemo } from 'react'

const { Title, Text } = Typography

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D', '#FFC658', '#FF6B9D']

export default function DashboardPage() {
  const { data: unidadesData } = useGetUnidadesQuery({ limit: 1000 })
  const { data: categoriasData } = useGetCategoriasQuery()
  const { data: iconesData } = useGetIconesQuery({ ativo: true })
  const { data: todasIconesData } = useGetIconesQuery({})
  const { data: accessStatsData } = useGetAccessStatsQuery()

  const unidades = unidadesData?.data || []
  const categorias = categoriasData?.data || []
  const icones = iconesData?.data || []
  const todosIcones = todasIconesData?.data || []
  const accessStats = accessStatsData?.data || { today: 0, this_week: 0, this_month: 0, this_year: 0 }

  // Estatísticas calculadas
  const stats = useMemo(() => {
    const ativas = unidades.filter(u => u.ativo).length
    const inativas = unidades.filter(u => !u.ativo).length
    const comEndereco = unidades.filter(u => u.endereco).length
    const comTelefone = unidades.filter(u => u.telefone || u.whatsapp).length
    const comHorario = unidades.filter(u => u.horario_funcionamento).length

    return {
      total: unidades.length,
      ativas,
      inativas,
      percentualAtivas: unidades.length ? ((ativas / unidades.length) * 100).toFixed(1) : 0,
      comEndereco,
      comTelefone,
      comHorario,
      completude: unidades.length ? (((comEndereco + comTelefone + comHorario) / (unidades.length * 3)) * 100).toFixed(1) : 0
    }
  }, [unidades])

  // Distribuição por categoria
  const distribuicaoPorCategoria = useMemo(() => {
    const map = new Map()

    categorias.forEach(cat => {
      const count = unidades.filter(u => u.categoria_id === cat.id).length
      if (count > 0) {
        map.set(cat.nome, count)
      }
    })

    return Array.from(map.entries())
      .map(([nome, count]) => ({ nome, quantidade: count }))
      .sort((a, b) => b.quantidade - a.quantidade)
  }, [unidades, categorias])

  // Dados para gráfico de pizza - Unidades ativas vs inativas
  const statusData = [
    { name: 'Ativas', value: stats.ativas },
    { name: 'Inativas', value: stats.inativas }
  ]

  // Completude de dados
  const completudeData = [
    { campo: 'Com Endereço', quantidade: stats.comEndereco, total: stats.total },
    { campo: 'Com Telefone', quantidade: stats.comTelefone, total: stats.total },
    { campo: 'Com Horário', quantidade: stats.comHorario, total: stats.total }
  ]

  // Ranking de categorias - Top 5
  const topCategorias = distribuicaoPorCategoria.slice(0, 5)

  const columnsTopCategorias = [
    {
      title: '#',
      key: 'rank',
      width: 50,
      render: (_, __, index) => <Text strong>{index + 1}</Text>
    },
    {
      title: 'Categoria',
      dataIndex: 'nome',
      key: 'nome',
      render: (text) => <Text>{text}</Text>
    },
    {
      title: 'Quantidade',
      dataIndex: 'quantidade',
      key: 'quantidade',
      align: 'right',
      render: (value) => <Tag color="blue">{value}</Tag>
    },
    {
      title: 'Proporção',
      dataIndex: 'quantidade',
      key: 'proporcao',
      align: 'right',
      render: (value) => {
        const percent = ((value / stats.total) * 100).toFixed(1)
        return <Text type="secondary">{percent}%</Text>
      }
    }
  ]

  return (
    <div>
      <Title level={2}>Painel de Controle - Assistência Social</Title>

      {/* Cards de Estatísticas de Acesso */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Acessos Hoje"
              value={accessStats.today}
              prefix={<CalendarOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
            <div style={{ marginTop: 8 }}>
              <Text type="secondary" style={{ fontSize: 12 }}>
                Sessões únicas no dia atual
              </Text>
            </div>
          </Card>
        </Col>

        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Acessos na Semana"
              value={accessStats.this_week}
              prefix={<FieldTimeOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
            <div style={{ marginTop: 8 }}>
              <Text type="secondary" style={{ fontSize: 12 }}>
                Sessões únicas nesta semana
              </Text>
            </div>
          </Card>
        </Col>

        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Acessos no Mês"
              value={accessStats.this_month}
              prefix={<ClockCircleOutlined />}
              valueStyle={{ color: '#faad14' }}
            />
            <div style={{ marginTop: 8 }}>
              <Text type="secondary" style={{ fontSize: 12 }}>
                Sessões únicas neste mês
              </Text>
            </div>
          </Card>
        </Col>

        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Acessos no Ano"
              value={accessStats.this_year}
              prefix={<GlobalOutlined />}
              valueStyle={{ color: '#722ed1' }}
            />
            <div style={{ marginTop: 8 }}>
              <Text type="secondary" style={{ fontSize: 12 }}>
                Sessões únicas neste ano
              </Text>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Cards de Estatísticas Principais */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Total de Unidades"
              value={stats.total}
              prefix={<EnvironmentOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
            <div style={{ marginTop: 8 }}>
              <Text type="secondary" style={{ fontSize: 12 }}>
                <CheckCircleOutlined style={{ color: '#52c41a' }} /> {stats.ativas} ativas •
                <CloseCircleOutlined style={{ color: '#ff4d4f', marginLeft: 4 }} /> {stats.inativas} inativas
              </Text>
            </div>
          </Card>
        </Col>

        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Categorias"
              value={categorias.length}
              prefix={<TagsOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
            <div style={{ marginTop: 8 }}>
              <Text type="secondary" style={{ fontSize: 12 }}>
                {distribuicaoPorCategoria.length} categorias com unidades
              </Text>
            </div>
          </Card>
        </Col>

        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Ícones"
              value={icones.length}
              suffix={`/ ${todosIcones.length}`}
              prefix={<PictureOutlined />}
              valueStyle={{ color: '#faad14' }}
            />
            <div style={{ marginTop: 8 }}>
              <Text type="secondary" style={{ fontSize: 12 }}>
                Ícones ativos no sistema
              </Text>
            </div>
          </Card>
        </Col>

        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Completude de Dados"
              value={stats.completude}
              suffix="%"
              prefix={<RiseOutlined />}
              valueStyle={{ color: stats.completude >= 70 ? '#52c41a' : stats.completude >= 40 ? '#faad14' : '#ff4d4f' }}
            />
            <div style={{ marginTop: 8 }}>
              <Progress
                percent={parseFloat(stats.completude)}
                size="small"
                showInfo={false}
                strokeColor={stats.completude >= 70 ? '#52c41a' : stats.completude >= 40 ? '#faad14' : '#ff4d4f'}
              />
            </div>
          </Card>
        </Col>
      </Row>

      {/* Gráficos */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} lg={16}>
          <Card title="Distribuição de Unidades por Categoria">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={distribuicaoPorCategoria}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="nome"
                  angle={-45}
                  textAnchor="end"
                  height={100}
                  interval={0}
                  style={{ fontSize: 12 }}
                />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="quantidade" fill="#1890ff" name="Quantidade de Unidades" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>

        <Col xs={24} lg={8}>
          <Card title="Status das Unidades">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === 0 ? '#52c41a' : '#ff4d4f'} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>

      {/* Completude de Dados */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} lg={12}>
          <Card title="Completude de Informações">
            <Space direction="vertical" style={{ width: '100%' }} size="large">
              {completudeData.map((item) => {
                const percent = ((item.quantidade / item.total) * 100).toFixed(1)
                return (
                  <div key={item.campo}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                      <Text>{item.campo}</Text>
                      <Text strong>{item.quantidade} / {item.total} ({percent}%)</Text>
                    </div>
                    <Progress
                      percent={parseFloat(percent)}
                      strokeColor={percent >= 70 ? '#52c41a' : percent >= 40 ? '#faad14' : '#ff4d4f'}
                    />
                  </div>
                )
              })}
            </Space>
          </Card>
        </Col>

        <Col xs={24} lg={12}>
          <Card title="Top 5 Categorias com Mais Unidades">
            <Table
              dataSource={topCategorias}
              columns={columnsTopCategorias}
              pagination={false}
              size="small"
              rowKey="nome"
            />
          </Card>
        </Col>
      </Row>
    </div>
  )
}
