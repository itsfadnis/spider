var Helper = (function() {
  $('th').hide();

  var hideSpinner = function() {
    $('form').show();
    $('th').show();
    $('tbody').show();
    $('p').show();
    $('#spinner').addClass('hidden');
  }

  var showSpinner = function() {
    $('form').hide();
    $('th').hide();
    $('tbody').hide();
    $('p').hide();
    $('#spinner').removeClass('hidden');
  }

  return {
    hideSpinner: hideSpinner,
    showSpinner: showSpinner
  }
}).call(this);