$(function() { 
    $('form').on('submit', function(e) { 
        e.preventDefault();
        var currentForm = $(this);
        

        $.ajax({
            url: $(this).attr('action'),
            type: $(this).attr('method'),
            contentType: "application/x-www-form-urlencoded",
            data: $.param($(this).serializeArray()),
            success: function (data) {
                console.log(data.message)
                switch (data.status) {
                    case "success":
                    $('button').prop('disabled', true);
                    $(".message").addClass("message-success").html(data.message).fadeTo( 3000, 0,function(){
                        $(this).html("").removeClass("message-success").removeAttr("style");
                        
                        if(currentForm.hasClass("form-signup")){                            
                            $(location).attr('href', '/user/login');
                        }else if(currentForm.hasClass("form-signin")){                            
                            $(location).attr('href', '/movie/moviesList');
                        }                    

                    });     
                        break;
                    
                    case "error":

                    $(".message").addClass("message-fail").html(data.message).fadeTo( 3000, 0,function(){
                        $(this).html("").removeClass("message-fail").removeAttr("style");
                      }); 
                    break;
                
                    default:
                        break;
                }

               console.log("success",data);
              },
              error: function (data) {
                console.log("error",data);
                               
              },
          });



    });
});
