import React, { useEffect, useRef } from 'react';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

const AnalyticsPage = () => {
    const chartRef = useRef(null);
    const chartInstance = useRef(null);

    useEffect(() => {
        if (chartRef.current) {
            const ctx = chartRef.current.getContext('2d');

            // Create Gradient matching exactly the original
            const gradient = ctx.createLinearGradient(0, 0, 0, 400);
            gradient.addColorStop(0, '#059669');
            gradient.addColorStop(1, '#34D399');

            if (chartInstance.current) {
                chartInstance.current.destroy();
            }

            chartInstance.current = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
                    datasets: [
                        {
                            label: 'Performance 2025',
                            data: [65, 59, 80, 81, 56, 55, 40, 70],
                            backgroundColor: gradient,
                            borderRadius: 6,
                            barPercentage: 0.6,
                            categoryPercentage: 0.8
                        },
                        {
                            label: 'Target',
                            data: [45, 49, 60, 71, 46, 45, 30, 60],
                            backgroundColor: '#E5E7EB',
                            borderRadius: 6,
                            barPercentage: 0.6,
                            categoryPercentage: 0.8,
                            hidden: true
                        }
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'top',
                            align: 'end',
                            labels: { usePointStyle: true, boxWidth: 8 }
                        },
                        tooltip: {
                            backgroundColor: 'rgba(255, 255, 255, 0.9)',
                            titleColor: '#111827',
                            bodyColor: '#4B5563',
                            borderColor: '#E5E7EB',
                            borderWidth: 1,
                            padding: 12,
                            displayColors: true,
                            usePointStyle: true
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            grid: {
                                display: true,
                                color: 'rgba(0, 0, 0, 0.05)',
                                drawBorder: false
                            },
                            ticks: { color: '#9CA3AF' }
                        },
                        x: {
                            grid: { display: false, drawBorder: false },
                            ticks: { color: '#6B7280', font: { weight: '500' } }
                        }
                    },
                    animation: {
                        duration: 1000,
                        easing: 'easeOutQuart'
                    }
                }
            });
        }

        return () => {
            if (chartInstance.current) {
                chartInstance.current.destroy();
            }
        };
    }, []);

    return (
        <section className="view-section active">
            <div className="page-header"></div>
            <div className="chart-card">
                <canvas ref={chartRef} id="detailedChart"></canvas>
            </div>
        </section>
    );
};

export default AnalyticsPage;
