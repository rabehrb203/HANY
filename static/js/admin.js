// تهيئة الرسوم البيانية
document.addEventListener('DOMContentLoaded', function() {
    // رسم بياني لتوزيع المستويات
    const levelsCtx = document.getElementById('levelsChart').getContext('2d');
    const levelsChart = new Chart(levelsCtx, {
        type: 'doughnut',
        data: {
            labels: ['سهل', 'متوسط', 'صعب'],
            datasets: [{
                data: [0, 0, 0],
                backgroundColor: ['#2ecc71', '#f1c40f', '#e74c3c']
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });

    // رسم بياني لمعدل النقاط
    const scoresCtx = document.getElementById('scoresChart').getContext('2d');
    const scoresChart = new Chart(scoresCtx, {
        type: 'line',
        data: {
            labels: Array.from({length: 7}, (_, i) => {
                const d = new Date();
                d.setDate(d.getDate() - (6 - i));
                return d.toLocaleDateString('ar-SA');
            }),
            datasets: [{
                label: 'معدل النقاط',
                data: [],
                borderColor: '#3498db',
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100
                }
            }
        }
    });

    // تحديث البيانات
    fetch('/admin/stats')
        .then(response => response.json())
        .then(data => {
            // تحديث رسم المستويات
            levelsChart.data.datasets[0].data = [
                data.difficulty_stats['سهل'] || 0,
                data.difficulty_stats['متوسط'] || 0,
                data.difficulty_stats['صعب'] || 0
            ];
            levelsChart.update();

            // تحديث رسم النقاط
            scoresChart.data.datasets[0].data = data.score_stats;
            scoresChart.update();
        });

    // معالجة حذف النتائج
    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            if (confirm('هل أنت متأكد من حذف هذه النتيجة؟')) {
                const resultId = this.dataset.id;
                fetch(`/admin/delete_result/${resultId}`, {
                    method: 'POST'
                })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        this.closest('tr').remove();
                    }
                });
            }
        });
    });

    // البحث المباشر
    const searchInput = document.querySelector('.search-box input');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            document.querySelectorAll('tbody tr').forEach(row => {
                const text = row.textContent.toLowerCase();
                row.style.display = text.includes(searchTerm) ? '' : 'none';
            });
        });
    }
});
