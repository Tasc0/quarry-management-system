// Modern Quarry Management System JavaScript - 2025

class QuarryManagementSystem {
    constructor() {
        this.currentSection = 'dashboard';
        this.charts = {};
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.initializeCharts();
        this.showSection('dashboard');
        this.startDataUpdates();
    }

    setupEventListeners() {
        // Navigation
        document.querySelectorAll('.menu-item').forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const section = item.dataset.section;
                this.showSection(section);
            });
        });

        // Modal functionality
        document.querySelectorAll('[id^="add"]').forEach(btn => {
            btn.addEventListener('click', () => this.openModal());
        });

        document.querySelector('.btn-close')?.addEventListener('click', () => this.closeModal());
        document.querySelector('#modalOverlay')?.addEventListener('click', (e) => {
            if (e.target === e.currentTarget) this.closeModal();
        });

        // Form submissions
        document.querySelector('.modern-form')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleFormSubmit(e);
        });

        // Notifications
        document.querySelector('#notifications')?.addEventListener('click', () => {
            this.showNotifications();
        });
    }

    showSection(sectionId) {
        // Update navigation
        document.querySelectorAll('.menu-item').forEach(item => {
            item.classList.remove('active');
        });
        document.querySelector(`[data-section="${sectionId}"]`).classList.add('active');

        // Update content
        document.querySelectorAll('.content-section').forEach(section => {
            section.classList.remove('active');
        });
        document.querySelector(`#${sectionId}`).classList.add('active');

        // Update page title
        const titles = {
            dashboard: 'Dashboard',
            estoque: 'Estoque de Pedras',
            producao: 'Controle de Produção',
            equipamentos: 'Gestão de Equipamentos',
            financeiro: 'Gestão Financeira',
            roi: 'Análise de ROI'
        };
        document.querySelector('.page-title').textContent = titles[sectionId];

        this.currentSection = sectionId;
        this.updateCharts(sectionId);
    }

    initializeCharts() {
        // Production Chart
        const productionCtx = document.getElementById('productionChart');
        if (productionCtx) {
            this.charts.production = new Chart(productionCtx, {
                type: 'line',
                data: {
                    labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'],
                    datasets: [{
                        label: 'Produção (m³)',
                        data: [2100, 2300, 2150, 2400, 2250, 2500],
                        borderColor: '#6366f1',
                        backgroundColor: 'rgba(99, 102, 241, 0.1)',
                        borderWidth: 3,
                        fill: true,
                        tension: 0.4
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            display: false
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            grid: {
                                color: 'rgba(0,0,0,0.1)'
                            }
                        },
                        x: {
                            grid: {
                                display: false
                            }
                        }
                    }
                }
            });
        }

        // Cash Flow Chart
        const cashFlowCtx = document.getElementById('cashFlowChart');
        if (cashFlowCtx) {
            this.charts.cashFlow = new Chart(cashFlowCtx, {
                type: 'bar',
                data: {
                    labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'],
                    datasets: [{
                        label: 'Entrada',
                        data: [180000, 220000, 195000, 245000, 210000, 268000],
                        backgroundColor: '#10b981',
                        borderRadius: 8
                    }, {
                        label: 'Saída',
                        data: [120000, 145000, 135000, 165000, 155000, 178000],
                        backgroundColor: '#ef4444',
                        borderRadius: 8
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'top'
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            grid: {
                                color: 'rgba(0,0,0,0.1)'
                            }
                        },
                        x: {
                            grid: {
                                display: false
                            }
                        }
                    }
                }
            });
        }

        // ROI Chart
        const roiCtx = document.getElementById('roiChart');
        if (roiCtx) {
            this.charts.roi = new Chart(roiCtx, {
                type: 'doughnut',
                data: {
                    labels: ['ROI Positivo', 'ROI Neutro', 'ROI Negativo'],
                    datasets: [{
                        data: [75, 18, 7],
                        backgroundColor: ['#10b981', '#f59e0b', '#ef4444'],
                        borderWidth: 0
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'bottom'
                        }
                    }
                }
            });
        }

        // Detailed Cash Flow Chart
        const cashFlowDetailCtx = document.getElementById('cashFlowDetailChart');
        if (cashFlowDetailCtx) {
            this.charts.cashFlowDetail = new Chart(cashFlowDetailCtx, {
                type: 'line',
                data: {
                    labels: Array.from({length: 30}, (_, i) => i + 1),
                    datasets: [{
                        label: 'Fluxo Diário',
                        data: this.generateRandomData(30, 5000, 15000),
                        borderColor: '#06b6d4',
                        backgroundColor: 'rgba(6, 182, 212, 0.1)',
                        borderWidth: 2,
                        fill: true,
                        tension: 0.4
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            display: false
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            grid: {
                                color: 'rgba(0,0,0,0.1)'
                            }
                        },
                        x: {
                            grid: {
                                display: false
                            }
                        }
                    }
                }
            });
        }
    }

    generateRandomData(length, min, max) {
        return Array.from({length}, () => Math.floor(Math.random() * (max - min + 1)) + min);
    }

    updateCharts(section) {
        // Update chart data based on current section
        if (section === 'dashboard' && this.charts.production) {
            // Simulate real-time data update
            const newData = this.generateRandomData(6, 2000, 2600);
            this.charts.production.data.datasets[0].data = newData;
            this.charts.production.update('none');
        }
    }

    openModal() {
        const modal = document.getElementById('modalOverlay');
        if (modal) {
            modal.classList.add('active');
            // Focus first input
            const firstInput = modal.querySelector('input');
            if (firstInput) {
                setTimeout(() => firstInput.focus(), 100);
            }
        }
    }

    closeModal() {
        const modal = document.getElementById('modalOverlay');
        if (modal) {
            modal.classList.remove('active');
        }
    }

    handleFormSubmit(e) {
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData.entries());
        
        // Simulate API call
        this.showLoading(true);
        
        setTimeout(() => {
            this.showLoading(false);
            this.closeModal();
            this.showNotification('Item adicionado com sucesso!', 'success');
            
            // Reset form
            e.target.reset();
        }, 1000);
    }

    showLoading(show) {
        const submitBtn = document.querySelector('.modal form .btn-primary');
        if (submitBtn) {
            if (show) {
                submitBtn.classList.add('loading');
                submitBtn.innerHTML = '<i class="bi bi-hourglass-split"></i> Salvando...';
            } else {
                submitBtn.classList.remove('loading');
                submitBtn.innerHTML = '<i class="bi bi-plus"></i> Adicionar';
            }
        }
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="bi bi-check-circle-fill"></i>
                <span>${message}</span>
            </div>
        `;

        // Add notification styles
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: white;
            padding: 1rem 1.5rem;
            border-radius: 0.75rem;
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
            z-index: 1001;
            transform: translateX(400px);
            transition: all 0.3s ease;
            border-left: 4px solid #10b981;
        `;

        document.body.appendChild(notification);

        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);

        // Auto remove
        setTimeout(() => {
            notification.style.transform = 'translateX(400px)';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }

    showNotifications() {
        const notifications = [
            { message: 'Equipamento #003 necessita manutenção', type: 'warning', time: '5 min' },
            { message: 'Estoque de granito baixo', type: 'alert', time: '15 min' },
            { message: 'Produção mensal bateu a meta', type: 'success', time: '1 hora' }
        ];

        // Create notifications dropdown (simplified)
        this.showNotification('3 notificações pendentes', 'info');
    }

    startDataUpdates() {
        // Simulate real-time data updates
        setInterval(() => {
            this.updateMetrics();
        }, 30000); // Update every 30 seconds
    }

    updateMetrics() {
        // Update metric values with slight variations
        const metrics = document.querySelectorAll('.metric-value');
        metrics.forEach(metric => {
            const currentValue = parseFloat(metric.textContent.replace(/[^0-9.]/g, ''));
            if (currentValue) {
                const variation = (Math.random() - 0.5) * 0.02; // ±1% variation
                const newValue = currentValue * (1 + variation);
                
                if (metric.textContent.includes('R$')) {
                    metric.textContent = `R$ ${newValue.toLocaleString('pt-BR', {minimumFractionDigits: 0})}`;
                } else if (metric.textContent.includes('m³')) {
                    metric.textContent = `${Math.floor(newValue).toLocaleString('pt-BR')} m³`;
                } else if (metric.textContent.includes('%')) {
                    metric.textContent = `${newValue.toFixed(1)}%`;
                }
            }
        });
    }
}

// Initialize the system when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new QuarryManagementSystem();
});

// Add some utility functions for enhanced interactions
function addRippleEffect(element) {
    element.addEventListener('click', function(e) {
        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            left: ${x}px;
            top: ${y}px;
            background: rgba(255, 255, 255, 0.4);
            border-radius: 50%;
            pointer-events: none;
            transform: scale(0);
            animation: ripple 0.6s ease-out;
        `;
        
        this.style.position = 'relative';
        this.style.overflow = 'hidden';
        this.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    });
}

// Add ripple effects to buttons
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.btn-primary, .btn-secondary').forEach(addRippleEffect);
});

// Add ripple animation CSS
const rippleCSS = `
@keyframes ripple {
    to {
        transform: scale(4);
        opacity: 0;
    }
}
`;

const style = document.createElement('style');
style.textContent = rippleCSS;
document.head.appendChild(style);