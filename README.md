# Sistema de Gestão de Pedreira 🏔️

Sistema completo de gestão para pedreiras com dashboard financeiro integrado ao Google Sheets.

## ✨ Funcionalidades

- **Dashboard em Tempo Real**: Monitoramento completo da operação
- **Controle de Estoque**: Brita 0, Brita 1 e Pedrisco
- **Análise Financeira**: Custos de produção, ROI e fluxo de caixa
- **Gestão de Equipamentos**: Controle de depreciação e manutenção
- **Metas vs Realizado**: Acompanhamento de vendas e produção
- **Integração Google Sheets**: Dados em tempo real das planilhas

## 🚀 Configuração

### 1. Google Sheets API

1. Acesse o [Google Cloud Console](https://console.cloud.google.com/)
2. Crie um novo projeto ou selecione um existente
3. Habilite a Google Sheets API
4. Crie credenciais (API Key)
5. Copie a chave e cole no arquivo `config.js`

### 2. Planilha do Google Sheets

Crie uma planilha com as seguintes abas:

#### Aba "Estoque"
| Tipo | Quantidade | Unidade |
|------|------------|---------|
| Brita 0 | 1250 | toneladas |
| Brita 1 | 980 | toneladas |
| Pedrisco | 750 | toneladas |

#### Aba "Custos"
| Mês | Custo/Ton | Total |
|-----|----------|-------|
| Jan | 42.5 | 53125 |
| Fev | 44.2 | 55250 |

#### Aba "ROI"
| ROI_Atual | Emprestimos_Ativos | Retorno_Esperado |
|-----------|-------------------|------------------|
| 15.5 | 850000 | 1200000 |

#### Aba "FluxoCaixa"
| Mês | Receita | Despesas | Saldo |
|-----|---------|----------|-------|
| Jan | 450000 | 320000 | 130000 |
| Fev | 520000 | 380000 | 140000 |

#### Aba "Equipamentos"
| Equipamento | Depreciacao_Mensal | Valor_Atual |
|-------------|-------------------|-------------|
| Carregadeiras | 5000 | 125000 |
| Caminhões | 3500 | 89000 |
| Escavadeiras | 6500 | 156000 |
| Britador Primário | 1800 | 45000 |
| Britador Secundário | 1500 | 38000 |

#### Aba "Manutencao"
| Mês | Custo | Equipamento |
|-----|-------|-------------|
| Jan | 25000 | Geral |
| Fev | 32000 | Geral |

#### Aba "Vendas"
| Meta_Financeira | Meta_Producao | Realizado_Financeiro | Realizado_Producao |
|----------------|---------------|---------------------|-------------------|
| 3500000 | 12000 | 3120000 | 10850 |

### 3. Configuração Local

1. Edite o arquivo `config.js`
2. Substitua `SEU_ID_DA_PLANILHA_AQUI` pelo ID da sua planilha
3. Substitua `SUA_CHAVE_API_AQUI` pela sua API Key
4. Ajuste os nomes das abas se necessário

### 4. Deploy

#### GitHub Pages
1. Faça push dos arquivos para este repositório
2. Vá em Settings > Pages
3. Selecione a branch main como source
4. Acesse via: `https://seuusuario.github.io/quarry-management-system`

#### Deploy Local
1. Abra `index.html` diretamente no navegador
2. Ou use um servidor local: `python -m http.server 8000`

## 📊 Estrutura dos Dados

O sistema utiliza a seguinte estrutura de dados:

```javascript
{
  stock: {
    brita0: number,
    brita1: number, 
    pedrisco: number
  },
  costs: {
    costPerTon: number,
    monthlyData: number[]
  },
  roi: {
    current: number,
    activeLoans: number,
    expectedReturn: number
  },
  // ... outros dados
}
```

## 🛠️ Tecnologias Utilizadas

- HTML5 / CSS3 / JavaScript ES6+
- Chart.js para gráficos
- Google Sheets API
- Design Responsivo
- Animações CSS

## 📱 Responsividade

O sistema é totalmente responsivo e funciona em:
- Desktop (1200px+)
- Tablet (768px - 1199px)
- Mobile (até 767px)

## 🔄 Atualização Automática

- Dados atualizados a cada 5 minutos
- Botão de atualização manual disponível
- Cache local para performance

## 📈 Métricas Disponíveis

### Operacionais
- Estoque por tipo de material
- Custo de produção por tonelada
- Produção vs meta mensal

### Financeiras
- ROI atual e projetado
- Fluxo de caixa mensal
- Impacto de empréstimos

### Equipamentos
- Depreciação por equipamento
- Custos de manutenção
- Planejamento de substituição

## 🚨 Troubleshooting

### Dados não carregam
1. Verifique se a API Key está correta
2. Confirme se a planilha está pública ou compartilhada
3. Verifique os nomes das abas
4. Abra o console do navegador para ver erros

### Gráficos não aparecem
1. Verifique a conexão com a internet
2. Confirme se o Chart.js está carregando
3. Verifique se há dados válidos

### Performance lenta
1. Reduza a frequência de atualização
2. Otimize a planilha (menos fórmulas complexas)
3. Use cache local quando possível

## 📝 Customização

Para customizar o sistema:

1. **Cores**: Edite as variáveis CSS no início do `styles.css`
2. **Métricas**: Adicione novas métricas no `script.js`
3. **Layout**: Modifique a grid no CSS
4. **Dados**: Ajuste os parsers no JavaScript

## 🤝 Contribuição

1. Fork este repositório
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob licença MIT. Veja o arquivo LICENSE para mais detalhes.

## 📞 Suporte

Para suporte técnico:
- Abra uma issue neste repositório
- Consulte a documentação do Google Sheets API
- Verifique os logs do console do navegador

---

Desenvolvido com ❤️ para otimizar a gestão de pedreiras.