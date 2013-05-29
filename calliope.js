function getPredictions() {
  $.ajax({
    url: 'update.php',
    dataType: 'json',
    success: function(response) {
      var data = response,
          firstRun = $('body').hasClass('run'),
          predictions = false;

      // For each route we're retrieving data for
      for (var i = 0; i < data.length; i++) {
        var count = i + 1;

        // Populate route letter/number
        $('#route-' + count + '-id').text(data[i].routeTag);

        // If predictions are available for this route
        if (typeof data[i].direction !== 'undefined') {

          // Remove old predictions from page
          $('#route-' + count + ' .route-predictions').find('.no-predictions').hide().end().children().not('.no-predictions').remove();

          // If multiple route directions exist for this route, use the last one
          if (data[i].direction.length > 1) {
            data[i].direction = data[i].direction[data[i].direction.length - 1];
          }

          // Populate route direction
          $('#route-' + count + '-direction').text(data[i].direction.title);

          // For each available prediction
          if (data[i].direction.prediction.length > 1) {

            for (var j = 1; j <= ((data[i].direction.prediction.length >= 3) ? 3 : data[i].direction.prediction.length); j++) {

              // Render prediction
              var prediction = '<span';
              if (firstRun) {
                prediction += ' class="hidden"';
              }
              prediction += '>' + data[i].direction.prediction[j - 1].minutes;
              // Append comma if this is not the last prediction of the series
              if (j !== ((data[i].direction.prediction.length >= 3) ? 3 : data[i].direction.prediction.length)) {
                prediction += ',';
              }
              prediction += '</span> ';

              $('#route-' + count + ' .route-predictions').append(prediction);
            }

            predictions = true;
          } else {
            var prediction = '<span';
            if (firstRun) {
              prediction += ' class="hidden"';
            }
            prediction += '>' + data[i].direction.prediction.minutes + '</span>';

            $('#route-' + count + ' .route-predictions').append(prediction);

            predictions = true;
          }
        } else {
          // No predictions available for this route, so show emdash
          $('#route-' + count + ' .route-predictions').find('.no-predictions').show().end().children().not('.no-predictions').remove();
          $('#route-' + count + '-direction').text(data[i].dirTitleBecauseNoPredictions);
        }

        // Populate stop location name
        $('#route-' + count + '-stop').text(data[i].stopTitle);
      }

      // Animate predictions on first run
      if (firstRun) {
        if (predictions) {
          $('.route-predictions span').not('.no-predictions').each(function(i, elem) {
            setTimeout(function() {
              $(elem).animate({top: 0, opacity: 1}, 400);
            }, 500 + (i * 150));
          });
        }

        $('.route-name, .route-stop').css('display', 'block').delay(100).animate({top: 0, opacity: 1}, 500);
      }

      $('body').removeClass('run');
    }
  })
}

getPredictions();

setInterval(getPredictions, 15000);
