// Auto-dismiss alerts after 5 seconds
document.addEventListener('DOMContentLoaded', function() {
  const alerts = document.querySelectorAll('.alert');
  alerts.forEach(alert => {
    setTimeout(() => {
      alert.style.transition = 'opacity 0.5s';
      alert.style.opacity = '0';
      setTimeout(() => alert.remove(), 500);
    }, 5000);
  });
});

// Confirm delete
document.querySelectorAll('.delete-confirm').forEach(btn => {
  btn.addEventListener('click', function(e) {
    if (!confirm('Are you sure you want to delete this?')) {
      e.preventDefault();
    }
  });
});
