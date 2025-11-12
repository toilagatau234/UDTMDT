app.controller("StatisticalController", function($scope, DataServices){
  // Bạn có thể gọi API thống kê riêng nếu có.
  // Ở đây demo vẽ chart với dữ liệu giả để có sẵn giao diện.
  // Gợi ý: backend có thể trả { labels:[], sales:[], orders:[] }
  $scope.chartReady = false;

  // ví dụ mock nhanh
  var labels = ["T1","T2","T3","T4","T5","T6"];
  var sales  = [3,5,2,8,6,9];
  var orders = [10,12,8,15,11,18];

  setTimeout(function(){
    var ctx = document.getElementById('statistic-chart');
    if (!ctx) return;
    new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [
          { label: 'Doanh thu (triệu)', data: sales },
          { label: 'Số đơn', data: orders }
        ]
      }
    });
    $scope.chartReady = true;
  }, 50);
});
