// Configurações do Google Sheets API
const GOOGLE_SHEETS_API_KEY = 'YOUR_API_KEY_HERE';
const SPREADSHEET_ID = 'YOUR_SPREADSHEET_ID_HERE';

// Classe principal do sistema de gestão
class QuarryManagementSystem {
    constructor() {
        this.data = {};
        this.charts = {};
        this.init();
    }

    async init() {
        await this.loadGoogleSheetsAPI();
        this.setupEventListeners();
        this.createCharts();
        await this.refreshData();
    }

    async loadGoogleSheetsAPI() {
        return new Promise((resolve) => {
            if (typeof gapi !== 'undefined') {
                gapi.load('client', () => {
                    gapi.client.init({
                        apiKey: GOOGLE_SHEETS_API_KEY,
                        discoveryDocs: ['https://sheets.googleapis.com/$discovery/rest?version=v4'],
                    }).then(resolve);
                });
            } else {
                console.warn('Google API não carregada. Usando dados simulados.');
                resolve();
            }
        });
    }

    setupEventListeners() {
        document.getElementById('refreshData').addEventListener('click', () => {
            this.refreshData();
        });

        document.getElementById('exportReport').addEventListener('click', () => {
            this.exportReport();
        });

        // Auto-refresh a cada 5 minutos
        setInterval(() => {
            this.refreshData();
        }, 5 * 60 * 1000);
    }

    async refreshData() {
        try {
            // Tenta carregar dados do Google Sheets
            await this.loadDataFromSheets();
        } catch (error) {
            console.warn('Erro ao carregar do Google Sheets, usando dados simulados:', error);
            this.loadSimulatedData();
        }
        this.updateUI();
    }

    async loadDataFromSheets() {
        const ranges = [
            'Estoque!A:C',
            'Custos!A:E', 
            'ROI!A:D',
            'FluxoCaixa!A:F',
            'Equipamentos!A:E',
            'Manutencao!A:D',
            'Vendas!A:G'
        ];

        const responses = await Promise.all(
            ranges.map(range => 
                gapi.client.sheets.spreadsheets.values.get({
                    spreadsheetId: SPREADSHEET_ID,
                    range: range,
                })
            )
        );

        this.data = {
            stock: this.parseStockData(responses[0].result.values),
            costs: this.parseCostData(responses[1].result.values),
            roi: this.parseROIData(responses[2].result.values),
            cashFlow: this.parseCashFlowData(responses[3].result.values),
            equipment: this.parseEquipmentData(responses[4].result.values),
            maintenance: this.parseMaintenanceData(responses[5].result.values),
            sales: this.parseSalesData(responses[6].result.values)
        };
    }

    loadSimulatedData() {
        this.data = {
            stock: {
                brita0: 1250,
                brita1: 980,
                pedrisco: 750
            },
            costs: {
                costPerTon: 45.80,
                monthlyData: [42.5, 44.2, 43.8, 45.1, 45.8, 46.2]
            },
            roi: {
                current: 15.5,
                activeLoans: 850000,
                expectedReturn: 1200000
            },
            cashFlow: {
                labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'],
                income: [450000, 520000, 480000, 560000, 590000, 620000],
                expenses: [320000, 380000, 350000, 410000, 420000, 450000]
            },
            equipment: {
                loaders: 125000,
                trucks: 89000,
                excavators: 156000,
                primaryCrusher: 45000,
                secondaryCrusher: 38000
            },
            maintenance: {
                monthly: [25000, 32000, 28000, 35000, 42000, 38000],
                impact: -85000
            },
            sales: {
                financialTarget: 3500000,
                productionTarget: 12000,
                financialAchieved: 3120000,
                productionAchieved: 10850,
                monthlyData: [520000, 480000, 560000, 590000, 620000, 650000]
            }
        };
    }

    parseStockData(values) {
        const data = { brita0: 0, brita1: 0, pedrisco: 0 };
        if (values && values.length > 1) {
            values.slice(1).forEach(row => {
                if (row[0]) {
                    const type = row[0].toLowerCase().replace(' ', '');
                    data[type] = parseFloat(row[1]) || 0;
                }
            });
        }
        return data;
    }

    parseCostData(values) {
        const data = { costPerTon: 0, monthlyData: [] };
        if (values && values.length > 1) {
            values.slice(1).forEach(row => {
                if (row[1]) data.monthlyData.push(parseFloat(row[1]) || 0);
            });
            data.costPerTon = data.monthlyData[data.monthlyData.length - 1] || 0;
        }
        return data;
    }

    parseROIData(values) {
        const data = { current: 0, activeLoans: 0, expectedReturn: 0 };
        if (values && values.length > 1) {
            const row = values[1];
            data.current = parseFloat(row[0]) || 0;
            data.activeLoans = parseFloat(row[1]) || 0;
            data.expectedReturn = parseFloat(row[2]) || 0;
        }
        return data;
    }

    parseCashFlowData(values) {
        const data = { labels: [], income: [], expenses: [] };
        if (values && values.length > 1) {
            values.slice(1).forEach(row => {
                if (row[0]) {
                    data.labels.push(row[0]);
                    data.income.push(parseFloat(row[1]) || 0);
                    data.expenses.push(parseFloat(row[2]) || 0);
                }
            });
        }
        return data;
    }

    parseEquipmentData(values) {
        const data = {};
        if (values && values.length > 1) {
            values.slice(1).forEach(row => {
                if (row[0] && row[1]) {
                    const key = row[0].toLowerCase().replace(/[^a-z]/g, '');
                    data[key] = parseFloat(row[1]) || 0;
                }
            });
        }
        return data;
    }

    parseMaintenanceData(values) {
        const data = { monthly: [], impact: 0 };
        if (values && values.length > 1) {
            values.slice(1).forEach(row => {
                if (row[1]) data.monthly.push(parseFloat(row[1]) || 0);
            });
            data.impact = data.monthly.reduce((sum, val) => sum - val, 0);
        }
        return data;
    }

    parseSalesData(values) {
        const data = {
            financialTarget: 0,
            productionTarget: 0,
            financialAchieved: 0,
            productionAchieved: 0,
            monthlyData: []
        };
        if (values && values.length > 1) {
            const totals = values[1];
            data.financialTarget = parseFloat(totals[0]) || 0;
            data.productionTarget = parseFloat(totals[1]) || 0;
            data.financialAchieved = parseFloat(totals[2]) || 0;
            data.productionAchieved = parseFloat(totals[3]) || 0;
            
            values.slice(2).forEach(row => {
                if (row[4]) data.monthlyData.push(parseFloat(row[4]) || 0);
            });
        }
        return data;
    }

    updateUI() {
        // Atualizar estoque
        document.getElementById('brita0-stock').textContent = this.data.stock.brita0.toLocaleString('pt-BR');
        document.getElementById('brita1-stock').textContent = this.data.stock.brita1.toLocaleString('pt-BR');
        document.getElementById('pedrisco-stock').textContent = this.data.stock.pedrisco.toLocaleString('pt-BR');

        // Atualizar custos
        document.getElementById('costPerTon').textContent = 
            this.data.costs.costPerTon.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

        // Atualizar ROI
        document.getElementById('currentRoi').textContent = this.data.roi.current + '%';
        document.getElementById('activeLoans').textContent = 
            this.data.roi.activeLoans.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
        document.getElementById('expectedReturn').textContent = 
            this.data.roi.expectedReturn.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

        // Atualizar depreciação de equipamentos
        document.getElementById('loaders-depreciation').textContent = 
            this.data.equipment.loaders.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
        document.getElementById('trucks-depreciation').textContent = 
            this.data.equipment.trucks.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
        document.getElementById('excavators-depreciation').textContent = 
            this.data.equipment.excavators.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
        document.getElementById('primary-crusher-depreciation').textContent = 
            this.data.equipment.primaryCrusher.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
        document.getElementById('secondary-crusher-depreciation').textContent = 
            this.data.equipment.secondaryCrusher.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

        // Atualizar manutenção
        document.getElementById('maintenanceImpact').textContent = 
            this.data.maintenance.impact.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

        // Atualizar vendas vs metas
        document.getElementById('financialTarget').textContent = 
            this.data.sales.financialTarget.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
        document.getElementById('productionTarget').textContent = 
            this.data.sales.productionTarget.toLocaleString('pt-BR') + ' ton';
        document.getElementById('financialAchieved').textContent = 
            this.data.sales.financialAchieved.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
        document.getElementById('productionAchieved').textContent = 
            this.data.sales.productionAchieved.toLocaleString('pt-BR') + ' ton';

        // Atualizar gráficos
        this.updateCharts();
    }

    createCharts() {
        // Gráfico de custo de produção
        const productionCostCtx = document.getElementById('productionCostChart').getContext('2d');
        this.charts.productionCost = new Chart(productionCostCtx, {
            type: 'line',
            data: {
                labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'],
                datasets: [{
                    label: 'Custo por Tonelada (R$)',
                    data: [],
                    borderColor: '#4facfe',
                    backgroundColor: 'rgba(79, 172, 254, 0.1)',
                    tension: 0.4,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false }
                }
            }
        });

        // Gráfico de fluxo de caixa
        const cashFlowCtx = document.getElementById('cashFlowChart').getContext('2d');
        this.charts.cashFlow = new Chart(cashFlowCtx, {
            type: 'bar',
            data: {
                labels: [],
                datasets: [
                    {
                        label: 'Receita',
                        data: [],
                        backgroundColor: '#43e97b'
                    },
                    {
                        label: 'Despesas',
                        data: [],
                        backgroundColor: '#f093fb'
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return 'R$ ' + value.toLocaleString('pt-BR');
                            }
                        }
                    }
                }
            }
        });

        // Gráfico de manutenção
        const maintenanceCtx = document.getElementById('maintenanceChart').getContext('2d');
        this.charts.maintenance = new Chart(maintenanceCtx, {
            type: 'doughnut',
            data: {
                labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'],
                datasets: [{
                    data: [],
                    backgroundColor: [
                        '#ff6b6b',
                        '#4ecdc4',
                        '#45b7d1',
                        '#96ceb4',
                        '#ffeaa7',
                        '#dda0dd'
                    ]
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false
            }
        });

        // Gráfico de vendas vs metas
        const salesTargetCtx = document.getElementById('salesTargetChart').getContext('2d');
        this.charts.salesTarget = new Chart(salesTargetCtx, {
            type: 'line',
            data: {
                labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'],
                datasets: [
                    {
                        label: 'Vendas Realizadas',
                        data: [],
                        borderColor: '#4facfe',
                        backgroundColor: 'rgba(79, 172, 254, 0.1)',
                        tension: 0.4
                    },
                    {
                        label: 'Meta Mensal',
                        data: [],
                        borderColor: '#43e97b',
                        backgroundColor: 'rgba(67, 233, 123, 0.1)',
                        borderDash: [5, 5],
                        tension: 0.4
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return 'R$ ' + value.toLocaleString('pt-BR');
                            }
                        }
                    }
                }
            }
        });
    }

    updateCharts() {
        // Atualizar gráfico de custo de produção
        this.charts.productionCost.data.datasets[0].data = this.data.costs.monthlyData;
        this.charts.productionCost.update();

        // Atualizar gráfico de fluxo de caixa
        this.charts.cashFlow.data.labels = this.data.cashFlow.labels;
        this.charts.cashFlow.data.datasets[0].data = this.data.cashFlow.income;
        this.charts.cashFlow.data.datasets[1].data = this.data.cashFlow.expenses;
        this.charts.cashFlow.update();

        // Atualizar gráfico de manutenção
        this.charts.maintenance.data.datasets[0].data = this.data.maintenance.monthly;
        this.charts.maintenance.update();

        // Atualizar gráfico de vendas vs metas
        const monthlyTarget = this.data.sales.financialTarget / 12;
        this.charts.salesTarget.data.datasets[0].data = this.data.sales.monthlyData;
        this.charts.salesTarget.data.datasets[1].data = new Array(6).fill(monthlyTarget);
        this.charts.salesTarget.update();
    }

    exportReport() {
        const reportData = {
            timestamp: new Date().toISOString(),
            stock: this.data.stock,
            financial: {
                costPerTon: this.data.costs.costPerTon,
                roi: this.data.roi.current,
                activeLoans: this.data.roi.activeLoans,
                expectedReturn: this.data.roi.expectedReturn
            },
            equipment: this.data.equipment,
            sales: this.data.sales
        };

        const blob = new Blob([JSON.stringify(reportData, null, 2)], 
            { type: 'application/json' });
        
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `relatorio-pedreira-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
}

// Inicializar sistema quando a página carregar
document.addEventListener('DOMContentLoaded', () => {
    new QuarryManagementSystem();
});