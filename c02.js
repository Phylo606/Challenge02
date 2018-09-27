
var currentPlayer = []
let playerID = "";
let playerName = "";
currentPlayer[3] = 3;
let playerIcon = "";
let playerColor = "";

let tilelist = [];
let playerlist = [];

$(document).ready(function () {

    $("#player-select").change(function () {

        var t = $("#player-select").val()
        for (const element in playerlist) {
            if (t == playerlist[element].id) {
                currentPlayer[0] = playerlist[element].id
                currentPlayer[1] = playerlist[element].name
                currentPlayer[4] = playerlist[element].icon
                currentPlayer[2] = playerlist[element].color
            }
        }
    });

    refreshplayerlist()
    settilelist()
    setplayerlist()

    function settilelist() {
        tilelist = []
        $.ajax({
            url: "http://localhost:3000/tiles/",
            success: function (result) {
                

                for (var i = 0; i < result.length; i++) {
                    tilelist.push(result[i])
                }
            }
        });
    }

    function setplayerlist() {
        playerlist = []
        $.ajax({
            url: "http://localhost:3000/players/",
            success: async function (result) {
                

                for (var i = 0; i < result.length; i++) {
                    playerlist.push(result[i])
                }
            }
        });
    }
    var nu = 1
    function refreshgrid() {
        
        console.log(nu)
        console.log(tilelist)
        settilelist()
        setplayerlist()

        for (const tile in tilelist) {
            for (const player in playerlist) {
                if (tilelist[tile].player == playerlist[player].id) {
                    $("#" + tilelist[tile].id).removeClass().addClass("fa " + playerlist[player].icon)
                    $("#" + tilelist[tile].id).css('color', playerlist[player].color)
                    $("#" + tilelist[tile].id).attr('data-player', playerlist[player].id)
                }
            }
        }
        nu = nu + 1


        setTimeout(function () {
            refreshgrid();

        }, 1000);
    }



    function refreshplayerlist() {
        let html = '<option value="" selected disabled hidden>Choose here</option>'
        $.ajax({
            url: "http://localhost:3000/players/",
            success: function (result) {
                for (i = 0; i < result.length; i++) {
                    //console.log(result[i]);

                    html += "<option value=" + result[i].id + ">";
                    html += result[i].name;
                    html += "</option>";

                    $("#player-select").html(html);
                }
            }
        })
    }

    $('#start-game').click(function () {
        buildGameGrid(10, 10)
        refreshgrid()
    });

    $('#create-player').click(function () {
        setplayerid()
        let players = {
            "id": playerID,
            "name": $("#player-name").val(),
            "nukes": 3,
            "icon": $("#player-icon").val(),
            "color": $("#player-color").val(),
        }
        $.ajax({
            url: "http://localhost:3000/players/", // + id
            method: "POST", //PATCH or DELETE
            data: players,
            success: function (result) {
                console.log("SUCCESS POST!");
            }
        });
        refreshplayerlist()
    })

    $('#set-player').click(function () {



    });


    //$('#get-players').click( function() {

    /*$.ajax({
        url: "http://localhost:3000/players/", // + id
        success: function (result) {
        }
    });
});*/

    $("#my-grid").on("click", ".fa", function () {

        var num = (Math.round(Math.random() * 10));

        var t = $("#" + this.id).attr('data-player')


        if (t == -1) {

            var split = this.id.split('-');
            let tiles = {
                "id": this.id,
                "X": split[0],
                "Y": split[1],
                "player": currentPlayer[0]
            }
            console.log("post")
            $.ajax({
                url: "http://localhost:3000/tiles/", // + id
                method: "POST", //PATCH or DELETE
                data: tiles,
                success: function (result) {
                    console.log("SUCCESSFULLY CREATED TILE!");
                }
            })
            //Post Tile info
        }
        else if (num <= 5) {
            //document.getElementById("9-9").removeAttribute("class")
            $(this).removeClass().addClass("fa " + currentPlayer[4])
            $(this).css('color', currentPlayer[2]);
            let tiles = {
                "id": this.id,
                "player": currentPlayer[0]
            }
            console.log("patch")
            $.ajax({
                url: "http://localhost:3000/tiles/" + this.id, // + id
                method: "PATCH", //PATCH or DELETE
                data: tiles,
                success: function (result) {
                    console.log("SUCCESSFULLY UPDATED TILE!");
                }
            })
        }
        else if (num > 5) {
            (console.log("Number is greater than 5"))
        }
        

    });



    function setplayerid() {

        var num = (Math.round(Math.random() * (10000 - 1)) + 1);
        playerID = num;
        //currentPlayer[0] = num;
    }

    function buildGameGrid(rows, cells) {

        let html = "";
        for (y = 0; y < rows; y++) {
            html += "<tr>";

            for (x = 0; x < cells; x++) {
                html += "<td>";
                html += "<i class='fa fa-reddit' id='" + y + "-" + x + "' data-player='-1'></i>";
                html += "</td>";
            }
            html += "</tr>";
        }
        $("#my-grid").html(html);
    }


    /*$(document).ready(function () {
        $.ajax({
            url: "http://localhost:3000/players/",
            success: function (result) {
                for (i = 0; i < result.length; i++) {
    
                    let html = "<option value=" + result[i].id + ">";
                    html += result[i].id + ": " + result[i].name;
                    html += "</option>";
    
                    $("#user-select").append(html);
                }
            }
        })
    */
});