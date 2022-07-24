$( function() {
  var data = cityStateList;
  $( "#city-search-input-text" ).autocomplete({
    minLength: 2,
    source: data
  })
});

// $(function () {
//   $('[data-toggle="tooltip"]').tooltip()
// })

// $('#myModal').modal(show)