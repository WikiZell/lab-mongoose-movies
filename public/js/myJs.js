$(document).ready(function(){
    //live search
    $("#livesearch").on("keyup", function() {
      var value = $(this).val().toLowerCase();
      $("#movies-table tr").filter(function() {
        $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
      });
    });

    //bind tooltip everywhere
    $(document.body).tooltip({ selector: "[title]" });
    //remove dynamic modal from DOM once closed
    $(document).on('hidden.bs.modal',"#dynamic-modal", function (e) {
      $(e.target).remove();
    })

    //$(this).data("id")
    $(document).on("change", "#celebritiesList", function (e) {

      $("#movieList").attr("disabled",false);
      let moviesToSelect = jQuery.parseJSON($(this).find(':selected').data('movies'))

      $("#movieList option:selected").prop("selected", false)
      $(moviesToSelect).each(function (i, movieID) {
        $("#movieList").find(`[value='${movieID}']`).prop("selected",true);
      });
    })

    //listener for celebrity modal
    $(document.body).on("click", ".dynamic-modal-celeb a, .dynamic-modal-celeb button", function (e) {

      let selectedCeleb,selectedMovies;

      switch ($(this).data("action")) {
        
        case "add-celebrity":                
          $("#addCelebrity").submit(function (e) {
            
            e.preventDefault();
            e.stopImmediatePropagation();           
            

            if($(this)[0][0].value == "" || $(this)[0][1].value == ""){
              $(".message").addClass("message-fail").html("Error: Name or Age is missing !").fadeTo( 3000, 0,function(){
                $(this).html("").removeClass("message-fail").removeAttr("style");
              });
              return false;
            }

            let form = $(this);
            let formData = $(this).serializeArray();
            /* formData.push({ name: "movies", value: [""] }); */
            let actionurl = $(this).attr("action")                  

            $.ajax({
              url: actionurl,
              type: 'post',
              contentType: "application/x-www-form-urlencoded",
              data: $.param(formData),
              success: function (data) {
                //What to do after celebrity insert   
               
                $(form).trigger("reset");
                let $selectInputCeleb= $("#celebritiesList")
                $selectInputCeleb.append($("<option />").val(data._id).text(data.name).data('movies','[""]'));
                $(".message").addClass("message-success").html("Celebrity Added!").fadeTo( 3000, 0,function(){
                  $(this).html("").removeClass("message-success").removeAttr("style");
                });
                
              },
              error: function (data) {
                $(".message").addClass("message-fail").html("Error: Celebrity not added!").fadeTo( 3000, 0,function(){
                  $(this).html("").removeClass("message-fail").removeAttr("style");
                });                
              }
            })

          });
          break;
        case "delete-celebrity":
          
          //          
          selectedCeleb= $("#celebritiesList").find(":selected");
          
          if(selectedCeleb.length === 0){
            $(".message").addClass("message-fail").html("No celebrity selected!").fadeTo( 3000, 0,function(){
              $(this).html("").removeClass("message-fail").removeAttr("style");
            });            
            return false;
          }

          if (confirm(`Are you sure you want to delete celebrity: ${selectedCeleb.text()}?`)) {
            //Delete
            $.get("/celebrities/delete-celebrity", {"id": selectedCeleb.val() })
                .done(function (data) {
                    //Remove THIS ---> ROW                    
                    selectedCeleb.remove();
                    $("#movieList").attr("disabled",true);
                    $(".message").addClass("message-success").html("Celebrity removed!").fadeTo( 3000, 0,function(){
                      $(this).html("").removeClass("message-success").removeAttr("style");
                    });
                }).fail(function(err){
                    alert(err)
                })
              } 

          break;
        case "update-celebrity":
        /* alert($(this).data("action")) */
        
        /* selectedCeleb = $("#celebritiesList").find(":selected").val();
        selectedMovies = $("#movieList").find(":selected").map((key,selection) => $(selection).val() ); */
        if($("#celebritiesList").find(":selected").length == 0){
          $(".message").addClass("message-fail").html("Select a Celebrity!").fadeTo( 3000, 0,function(){
            $(this).html("").removeClass("message-fail").removeAttr("style");
          });          
          return false;
        }

        let relationCelebrityForm = $( "#relation-celebrity-form" );
        
        let relationCelebrityFormData = $( "#relation-celebrity-form" ).serializeArray();
        
        $.each($.parseJSON( $("#celebritiesList").find(':selected').data('movies') ),function(key,value){
          relationCelebrityFormData.push({"name":"oldMovies","value":value})
        });
        
        let actionurl = relationCelebrityForm.attr("action");
        
        $.ajax({
          url: actionurl,
          type: 'post',
          contentType: "application/x-www-form-urlencoded",
          data: $.param(relationCelebrityFormData),
          success: function (data) {
            //What to do after celebrity insert   
            $(".message").addClass("message-success").html("Celebrity updated!").fadeTo( 3000, 0,function(){
              $(this).html("").removeClass("message-success").removeAttr("style");
            });
            let moviesToAdd = JSON.stringify(data.movies);
            $("#celebritiesList").find(`[value='${data._id}']`).data("movies", moviesToAdd);
          },
          error: function (data) {
            $(".message").addClass("message-fail").html("Error: Celebrity not updated!").fadeTo( 3000, 0,function(){
              $(this).html("").removeClass("message-fail").removeAttr("style");
            });                
          }
        })
          break;      
        default:
          break;
      }

    });
    

    //MovieList    
    $(function () {
        //Activate tooltip bootstrap
        /* $(document.body).find('[data-toggle="tooltip"]').tooltip(); */
        
        //Action
        $(".movie-list-container, nav").on("click", ".actions > i,button , a" ,function(){
            let id = $(this).data("id");

            switch ($(this).data("action")) {
                case "delete":
                if (confirm('Are you sure you want to delete '+ $(this).closest('tr').find( ".title" ).data("title") +'?')) {
                    //Delete
                    $.get("/movie/delete-movie", { "action": $(this).data("action"),"id": $(this).data("id") })
                        .done(function (data) {
                            //Remove THIS ---> ROW
                            $(this).tooltip("hide")
                            $('#row_'+id).hide('slow', function(){ $('#row_'+id).remove(); });
                        }).fail(function(err){
                            alert(err)
                        })
                      }                    
                    break;

                case "edit": 
                                
                $.get("/movie/detail-movie", {id:$(this).data("id")})
                        .done(function (data) {
                            //Create modal with current data
                            makeModal(data[0],"updateModal");                
                        }).fail(function(err){
                            alert(err)
                        }).then(()=>{
                          $("#updateMovie").submit(function(e) {
                            e.preventDefault();
                          let formData = $(this).serializeArray();
                          formData.push({name: "action", value: "updateMovie"});
                          var actionurl = $(this).attr("action")
                          
                          $.ajax({
                                  url: actionurl,
                                  type: 'post',
                                  contentType: "application/x-www-form-urlencoded",
                                  data: $.param(formData),
                                  success: function(data) {                                    
                                      //What to do after update   
                                                                         
                                      let res = data/* jQuery.parseJSON( data ) */;
                                      let row = $(`#row_${res._id}`);

                                      $(".update-success").html("Success !").fadeTo( 3000, 0,function(){
                                        $(this).html("").removeAttr("style");
                                      });

                                      $.each(res, function(i, item) {
                                        row.find(`.${i}`).attr(`data-${i}`,item).html(item);
                                      });
                                  },
                                  error: function(data) { 
                                    $(".update-success").html(`Error: ${data}`).fadeTo( 5000, 0,function(){
                                      $(this).html("").removeAttr("style");
                                    }); 
                                } 
                          })                  
                      });

                        })
                    break;
                
                case "details":
                    //alert( "Will get DETAILS -->" +  $(this).data("id")   );
                  $.get("/movie/detail-movie",{id: $(this).data("id")})
                    .done(function (data) {                  
                    //Create modal with current data
                    makeModal(data[0],"detailModal");                
                  }).fail(function(err){
                    alert(err)
                  })

                break;
                
                case "add-movie-btn":
                addMovie();
                  break;

                case "celebrities-btn":
                  celebrities();
                  
                  break;
                
                  case "sign-up-btn":                  
                  $(location).attr('href', '/user/sign-up');
                  
                  break;

                  case "login-btn":                  
                  $(location).attr('href', '/user/login');
                  
                  break;

                  case "logout-btn":                  
                  $(location).attr('href', '/user/logout');
                  
                  break;

                default:
                
                break;
            }
            
          });

        function celebrities(){

          $.get("/celebrities")
                    .done(function (data) {
                    //Create modal with current data
                    
                    makeModal(data,"celebModal");                    
                    let $celebSelect = $(".dynamic-modal-celeb #celebritiesList"),
                        $movieSelect = $(".dynamic-modal-celeb #movieList"),
                        movies;
                      
                      // add-celebrity-btn

                      $.each(data, function (index,value) {
                        if(index == "movie"){
                          $.each(value, function (i,movie) {
                            $movieSelect.append($("<option />").val(this._id).text(this.title));
                          })
                          
                        }else if (index == "celeb"){
                          $.each(value, function (i,celeb) {
                            
                            if(this.movies){
                              movies = JSON.stringify(this.movies);
                            }

                            $celebSelect.append($(`<option />`).val(this._id).text(this.name).data("movies",movies) );
                          })
                        }
                        
                      });
                      
                     
                                  
                  }).fail(function(err){
                    alert(err)
                  })


          }

        function addMovie(){
          //Add Movie
            let row = `<tr class="add-movie-input" id="">
            <th scope="row"></th>
            <td class="title" data-title=""><input class="form-control form-control-sm" name="title" value="" type="text" placeholder="" required></td>
            <td class="year"><input class="form-control form-control-sm" name="year" value="" type="number" step="1" min="1800" placeholder="" required></td>
            <td class="director"><input class="form-control form-control-sm" name="director" value="" type="text" placeholder="" required></td>
            <td class="duration"><input class="form-control form-control-sm" name="duration" value="" type="text" placeholder="" required></td>
            <td class="genre"><input class="form-control form-control-sm" type="text" name="genre" value="" placeholder="" required></td>
            <td class="rate"><input class="form-control form-control-sm" type="number" name="rate" value="" step="0.1" min="0" max="10" placeholder="" required></td>
            <td class="actions">
                <i class="far fa-plus-square" data-toggle="tooltip" data-placement="top" title="ADD" data-action="add"  data-original-title="ADD"></i>
                <i class="fas fa-ban" data-toggle="tooltip" data-placement="top" title="CANCEL" data-action="cancel"  data-original-title="CANCEL"></i>
            </td>
        </tr>`

            if(!$("#movies-table").find('tr').hasClass("add-movie-input")){
              $("#movies-table").find('tbody').prepend( $(row).hide().fadeIn('slow') );
              /* $(".add-movie-input").tooltip({selector: `[data-toggle="tooltip"]`}); */
              let inputRow = $(".add-movie-input")
              inputRow.find("i").click(function(e){
                if($(this).data("action") == "cancel"){
                  $(this).tooltip('hide')
                  inputRow.fadeOut("3000",function(){this.remove()});
                }else if($(this).data("action") == "add"){
                  
                  //add movie to database
                  let input = $(this).closest( "tr" ).find("input");
                  let isValid = true;
                  $.each($(input), function(i, field) {
                      if(field.value == ""){
                        $(this).removeClass("is-valid").addClass("is-invalid");
                        $(this).focus();
                        isValid = false;
                        return false;
                     }else{
                        $(this).removeClass("is-invalid").addClass("is-valid");
                        isValid = true;
                     }
                  });

                  if(isValid){
                    let formData = [];
                    $.each($(input),function(i, field) {                      
                      formData.push({name: `${field.name}`, value: `${field.value}`});
                      });                     
                          
                    $.ajax({
                      url: "/movie/add-movie",
                      type: "post",
                      dataType: "text",
                      data: $.param(formData),
                      success: function(data) {
                        //What to do after update
                        inputRow.fadeOut("3000",function(){this.remove()});
                        let res = jQuery.parseJSON(data);
                        let newRow = $('#movies-table tbody tr:last').clone()

                        $.each(res,function(i,field) {
                          newRow.find(`.${i}`).attr(`data-${i}`,field).html(field); //row.find(`.${i}`).attr(`data-${i}`,item).html(item);                   
                          });
                          newRow.find(`.counter`).html(parseInt(newRow.find(`.counter`).html())+1);                          
                          newRow.find(`.fas`).each(function() {
                            $(this).attr(`data-id`,res._id)
                        });
                          
                          newRow.prop('id',"row_"+res._id);                          

                        $('#movies-table tbody').append(newRow);
                        
                      },
                      error: function(data) {

                      }
                    });
                  }
                }                
              })
            }
        }
      })
});

