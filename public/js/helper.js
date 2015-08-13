var Helper = (function() {
  
  var hideSpinner = function() {
    $('form').show();
    $('#spinner').addClass('hidden');
  }
  
  var showSpinner = function() {
    $('form').hide();
    $('#spinner').removeClass('hidden');
  }

  return {
    hideSpinner: hideSpinner,
    showSpinner: showSpinner
  }
}).call(this);
