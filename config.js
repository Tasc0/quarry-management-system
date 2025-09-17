// Configuração do Sistema de Gestão de Pedreira
// Configure os IDs das suas planilhas do Google Sheets

const CONFIG = {
    // ID da planilha principal (pode ser obtido na URL da planilha)
    SPREADSHEET_ID: 'SEU_ID_DA_PLANILHA_AQUI',
    
    // Chave da API do Google Sheets (obtenha no Google Cloud Console)
    API_KEY: 'SUA_CHAVE_API_AQUI',
    
    // Configuração das abas da planilha
    SHEETS: {
        ESTOQUE: 'Estoque',
        CUSTOS: 'Custos',
        ROI: 'ROI',
        FLUXO_CAIXA: 'FluxoCaixa',
        EQUIPAMENTOS: 'Equipamentos',
        MANUTENCAO: 'Manutencao',
        VENDAS: 'Vendas'
    },
    
    // Intervalos de atualização (em milissegundos)
    REFRESH_INTERVAL: 5 * 60 * 1000, // 5 minutos
    
    // Configurações de formatação
    CURRENCY: 'BRL',
    LOCALE: 'pt-BR'
};

// Instruções de configuração:
// 1. Crie uma planilha no Google Sheets
// 2. Configure as abas conforme definido em SHEETS
// 3. Obtenha a API Key no Google Cloud Console
// 4. Substitua os valores acima pelos seus dados
// 5. Configure as permissões da planilha para leitura pública ou compartilhe com a conta de serviço

export default CONFIG;