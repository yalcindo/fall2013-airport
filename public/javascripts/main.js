$(function() {

	$("#dropdown-form").submit(function(e)
	{
		e.preventDefault();
		var dest=$("#dest-list").val();
		console.log("destination"+ dest);
        window.location.href= "/airport/" + dest;
	});

});
