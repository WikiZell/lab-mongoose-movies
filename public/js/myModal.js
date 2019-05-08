function makeModal(data,type){

    switch (type) {
        case "updateModal":

        let updateModal = 
        `<div id="dynamic-modal" class="modal dynamic-modal-update" tabindex="-1" role="dialog">
        <div class="modal-dialog" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title"><i class="fas fa-film"></i> ${data.title} (${data.year})</h5>
              <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body">
      
            <form id="updateMovie" action="/movie/update-movie" method="post">
            <input type="hidden" name="id" value="${data._id}"></input>
            <div class="form-group">
              <label for="title">Title:</label>
              <input type="text" class="form-control" id="title" aria-describedby="titleInfo" name="title" placeholder="${data.title}" value="${data.title}">
              <small id="titleInfo" class="form-text text-muted">Insert the updated title of the movie.</small>
            </div>
      
            <div class="form-group">
              <label for="year">Year</label>
              <input type="number" class="form-control" id="year" aria-describedby="yearInfo" name="year" placeholder="${data.year}" value="${data.year}">
              <small id="yearInfo" class="form-text text-muted">Insert the updated year of the movie.</small>
            </div>
      
            <div class="form-group">
              <label for="director">Director</label>
              <input type="text" class="form-control" id="director" aria-describedby="directorInfo" name="director" placeholder="${data.director}" value="${data.director}">
              <small id="directorInfo" class="form-text text-muted">Insert the updated director of the movie.</small>
            </div>
      
            <div class="form-group">
              <label for="duration">Duration</label>
              <input type="text" class="form-control" id="duration" aria-describedby="durationInfo" name="duration" placeholder="${data.duration}" value="${data.duration}">
              <small id="durationInfo" class="form-text text-muted">Insert the updated duration of the movie. Format: Xh XXmin</small>
            </div>
      
            <div class="form-group">
              <label for="genre">Genre</label>
              <input type="text" class="form-control" id="genre" aria-describedby="genreInfo" name="genre" placeholder="${data.genre}" value="${data.genre}">
              <small id="genreInfo" class="form-text text-muted">Insert the updated genre of the movie. Format: genre1,genre2,genre3</small>
            </div>
      
            <div class="form-group">
              <label for="rate">Rate</label>
              <input type="number" class="form-control" id="rate" aria-describedby="rateInfo" name="rate" placeholder="${data.rate}" value="${data.rate}">
              <small id="rateInfo" class="form-text text-muted">Insert the updated rate of the movie.</small>
            </div>
            <button type="submit" class="btn btn-success">Update</button> <span class="update-success"></span>
          </form>  
            </div>
            <div class="modal-footer">              
              <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
            </div>
          </div>
        </div>
      </div>`

      $(updateModal).modal("show");
            
            break;
        
        case "detailModal":
        let celebrities = [];
        $.each(data.celebrities, function( index, value ) {          
          celebrities.push(value.name);
        });
            
            

            let detailModal = 
        `<div id="dynamic-modal" class="modal dynamic-modal-detail" tabindex="-1" role="dialog">
        <div class="modal-dialog" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title"><i class="fas fa-info-circle"></i> MOVIE DETAILS:</h5>
              <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body">

            <div class="card mb-3" style="max-width: 540px;">
                <div class="row no-gutters">
                <div class="col-md-4">
                <img src="https://dummyimage.com/180x250/000/fff.jpg" class="card-img" alt="image">
            </div>
            <div class="col-md-8">
                <div class="card-body">
                <h4 class="card-title">${data.title} (${data.year})</h4>
                <span class="genre text-muted">${data.genre}</span>
                <hr>
                <small class="text-muted">Description:</small>
                <p class="card-text description font-weight-light">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum</p>
                <small class="text-muted">Director: ${data.director}</small><br>
                <small class="text-muted">Duration: ${data.duration}</small><br>
                <small class="text-muted">Rate: ${data.rate}</small><br>
                <small class="text-muted">Celebrities: ${celebrities.join(" | ")}</small><br>
                </div>
                </div>
                </div>
            </div>
      
             
            </div>
            <div class="modal-footer">              
              <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
            </div>
          </div>
        </div>
      </div>`


      
      $(detailModal).modal("show");

        break;

        case "celebModal":
        
       
            let celebModal = 
        `<div id="dynamic-modal" class="modal dynamic-modal-celeb" tabindex="-1" role="dialog">
        <div class="modal-dialog modal-xl" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title"><i class="fas fa-info-circle"></i> CELEBRITIES DETAILS:</h5>
              <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body">
            
            <h4>Add Celebrity:</h4>
            <form id="addCelebrity" action="/celebrities/add-celebrities" method="post">
            <div class="input-group">            
            <div class="input-group-prepend">
                <span class="input-group-text">Name and Age</span>
            </div>
            <input type="text" name="name" aria-label="Name" class="form-control">
            <input type="number" name="age" aria-label="Age" class="form-control">
            <button id="add-celebrity-btn" data-action="add-celebrity" type="submit" class="btn btn-primary" role="button">Add Celebrity</button>
            </div>
            </form>
            <hr>
            <h4>Celebrities Manager:</h4>

            <form id="relation-celebrity-form" action="/celebrities/celeb-movies" method="post">
            <div class="form-row">
            <div class="form-group col-md-6">
                <label for="celebritiesList">Celebrity:</label>
                <select size="5" name="celebrity" id="celebritiesList" class="form-control">
                    
                </select>
            </div>
            <div class="form-group col-md-6">
                <label for="movieList">Movies:</label>
                <select size="5" name="movies" id="movieList" class="form-control" multiple disabled>
                    
                </select>
            </div>
            </div>
            
            <a class="btn btn-danger float-left" data-action="delete-celebrity" role="button">Delete Celebrity</a> <a class="btn btn-success float-right" data-action="update-celebrity" role="button">Update</a>
        </form>

            </div>
            <div class="modal-footer">
              
               
              <span class="mr-auto">Response: <span class="message"></span></span>
              <button type="button" class="btn btn-secondary float-right" data-dismiss="modal">Close</button>
                          
              
            </div>
          </div>
        </div>
      </div>`

      $(celebModal).modal("show");

        break;
    
        default:
            break;
    }
             

  }