var Helper = (function(){
  $('th').hide();

  var hideSpinner = function(){
    $('th').show();
    $('tbody').show();
    $('#spinner').addClass('hidden');
  }

  var showSpinner = function(){
    $('th').hide();
    $('tbody').hide();
    $('#spinner').removeClass('hidden');
  }

  return{
  	hideSpinner: hideSpinner,
  	showSpinner: showSpinner
  }
}).call(this);