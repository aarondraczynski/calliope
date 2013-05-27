function getPredictions() {
  $.ajax({
    url: 'update.php',
    dataType: 'json',
    success: function(response) {
      var data = response,
          firstRun = $('body').hasClass('run'),
          predictions = false;

      for (var i = 0; i < data.length; i++) {
        var count = i + 1;

        $('#route-' + count + '-id').text(data[i].routeTag);
        if (typeof data[i].direction !== 'undefined') {
          $('#route-' + count + '-direction').text(data[i].direction.title);
          $('#route-' + count + ' .route-predictions').find('.no-predictions').hide().end().children().not('.no-predictions').remove();

          if (data[i].direction.prediction.length > 1) {
            for (var j = 1; j <= ((data[i].direction.prediction.length >= 3) ? 3 : data[i].direction.prediction.length); j++) {
              var prediction = '<span';
              if (firstRun) {
                prediction += ' class="hidden"';
              }
              prediction += '>' + data[i].direction.prediction[j - 1].minutes;
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
          $('#route-' + count + ' .route-predictions').find('.no-predictions').show().end().children().not('.no-predictions').remove();
          $('#route-' + count + '-direction').text(data[i].dirTitleBecauseNoPredictions);
        }

        $('#route-' + count + '-stop').text(data[i].stopTitle);
      }

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
