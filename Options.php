<!DOCTYPE html style = "padding: 0px; margin: 0px;">
<html lang="en">
    <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <meta http-equiv="x-ua-compatible" content="ie=edge">
    <title>EvalPal</title>
    <!-- MDB icon -->
    <link rel="icon" href="img/mdb-favicon.ico" type="image/x-icon">
    <!-- Font Awesome -->
    <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.11.2/css/all.css">
    <!-- Google Fonts Roboto -->
    <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap">
    <!-- Bootstrap core CSS -->
    <link rel="stylesheet" href="css/bootstrap.min.css">
    <!-- Material Design Bootstrap -->
    <link rel="stylesheet" href="css/mdb.min.css">
    <!-- Your custom styles (optional) -->
    <link rel="stylesheet" href="css/style.css">
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.1.1/jquery.min.js"></script>
    </head>
    <body style = "padding: 0px; margin: 0px;">
        <header style = "padding: 0px; margin: 0px; background-color: rgba(0, 48, 78, 1)7">
            <nav class="navbar sticky-top navbar-expand-lg navbar-dark" style = "background-color: rgba(0, 48, 78, 1)">
                <!--<img src="https://scalar.usc.edu/works/new-and-improved/media/cwru_stacked_logo_blue_no_tag.jpg" height="30" class="d-inline-block align-top"
                alt="Case Western logo">-->
                <a class="navbar-brand" href="#">EvalPal</a>
                <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
                </button>
                <form class="form-inline my-2 my-lg-0 ml-auto">
                <form class="form-inline">
                    <div class="md-form my-0">
                    <input class="form-control mr-sm-2" type="text" placeholder="Search" aria-label="Search">
                    </div>
                    <button class="btn btn-outline-white btn-md my-2 my-sm-0 ml-3" type="submit">Search</button>
                </form>
                </form>
            </nav>
        </header>
    <!-- Start your project here-->
    <div id = "section1">
        <div class = "mask rgba-indigo-strong" style = "height: 100%">
            <div style = "background-color: transparent; height: 10%; width: 100%"></div>
        <h2 class = "wow fadeInDown" style = "display: flex; justify-content: center; align-items: center; font-size: 50px; color: white">Results for ""</h2>
        <div style = "height: 4%"></div>
        <div style = "width: 60%; margin-left:20%; background-color: rgb(1, 35, 56); opacity: .85; z-index: 2; position: absolute">
            <div id = "results" style = "width: 80%; margin-left:10%">
                <div class = "row" style = "width: 100%; padding-top: 2%; border-bottom-style: solid; border-width: 2px; border-color: rgba(42, 45, 202, 0.753)">
                    <div class = "col" style = "background-color: transparent; display: flex; justify-content: center; align-items: center; color: white; font-size:25px; font-weight: bolder;">Class</div>
                    <div class = "col" style = "background-color: transparent; display: flex; justify-content: center; align-items: center; color: white; font-size:25px; font-weight: bolder">Professor</div>
                </div>
            </div>
            <div style = "height: 4%; width: 100%; padding: 2%"></div>
            <h2 style = "display: flex; justify-content: center; align-items: center; font-size: 30px; color: white">Didn't find what you were looking for? Try again!</h2>
            <div style = "height: 7%; width: 100%; padding: 2%"></div>
            <div>
                <form action = "./Options.php" method = "POST">
                <div class = "row" style = "width: 100%; margin: 0px; padding: 0px">
                    <div class = "col-lg-2"></div>
                    <div class = "col-lg-8">
                    <div class = "row no-gutters justify-content-center" style = "overflow: hidden">
                        <div><input size = "40" class="form-control" type="text" name = "userInput" placeholder="Search a class or professor" aria-label="Search"></div>
                        <div><button class="btn aqua-gradient btn-rounded btn-md my-0" type="submit">Search</button></div>
                    </div>
                    </div>
                    <div class = "col-lg-2"></div>
                </div>
                </form>
            </div>
        </div>
    </div>
    </div>
    <!--<div id = "section2" style = "overflow-y: auto; ">-->

    </div>
    </header>

    <!-- End your project here-->

    <!-- jQuery -->
    <script type="text/javascript" src="js/jquery.min.js"></script>
    <!-- Bootstrap tooltips -->
    <script type="text/javascript" src="js/popper.min.js"></script>
    <!-- Bootstrap core JavaScript -->
    <script type="text/javascript" src="js/bootstrap.min.js"></script>
    <!-- MDB core JavaScript -->
    <script type="text/javascript" src="js/mdb.min.js"></script>
    <!-- Your custom scripts (optional) -->
    <script type="text/javascript"></script>

    </body>
    <script>

    $(document).ready(function() {
    new WOW().init();
    });
    var request = new XMLHttpRequest()
    request.open('GET', 'http://metal-filament-270618.appspot.com/professor/butler', true)
    console.log("part one")
    request.onload = function(){
        var i = 0;
        var colOne;
        var colTwo;
        var data = JSON.parse(this.response);
        console.log(data.length + "")
        if (request.status >= 200 && request.status < 400) {
            for (i = 0; i < data.length; i++){
                row = document.createElement('div');
                row.setAttribute("style", "width: 100%; padding: 2%");
                row.setAttribute("class", "row rounded-lg result-hover");

                colOne = document.createElement('div');
                colTwo = document.createElement('div');
                colOne.setAttribute("class", "col result-option");
                colTwo.setAttribute("class", "col result-option");
                colOne.innerText = data[i].subject + data[i].catalog_nbr;
                colTwo.innerText = data[i].instructor_name;

                row.appendChild(colOne);
                row.appendChild(colTwo);
                document.getElementById("results").appendChild(row);
            }
        }
    }
    request.send()
    </script>
</html>