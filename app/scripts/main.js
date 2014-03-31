
window.Puzzle = (function (){

  var Puzzle = {};

  var puzzleItemPrefix = 'puzzle-';


  function random (from, to) {

    return Math.floor(Math.random()*( Math.abs(to)-Math.abs(from) ) ) + from ;

  }

  Puzzle.Games = {
    "collibra" : {
      itemWidth: 100,
      itemHeight : 100,
      logo: 'logo.png',
      items : {

        A1 : 'Puzzle-A1.png',
        A2 : 'Puzzle-A2.png',
        A3 : 'Puzzle-A3.png',
        B1 : 'Puzzle-B1.png',
        B2 : 'Puzzle-B2.png',
        B3 : 'Puzzle-B3.png',
        C1 : 'Puzzle-C1.png',
        C2 : 'Puzzle-C2.png',
      }
    }
  };


  Puzzle.App = {
    
    gameName : null,
    goalItems : 0,
    goalCounter : 0,

    el : {
      $sourceBoard: null,
      $targetBoard : null,
      $gameBoard : null,
      $doneWindow : null
    },
    html : {

      puzzleItem : function (name, src, game, w, h){

        var iWidth = w || 100;
        var iHeight = h || 100;

        var t = random(iWidth, 500) - iWidth;
        var l = random(iHeight, 500) - iHeight;
        console.log(t,l);

        return '<img style="top: '+t+'px; left: '+l+'px ;" class="puzzle draggable '+ puzzleItemPrefix + name + '" src="images/'+game+'/'+src+'" />';
      },
      destItem : function (name,w,h){

        return '<div class="destination-item" style="width:'+w+'px; height:'+h+'px; " data-accept="' + puzzleItemPrefix + name + '"/>';
      }
    },

    puzzleOk : function () {
      this.goalCounter++;
      console.log('more to go!', this.goalCounter, this.goalItems);

      if( this.goalCounter == this.goalItems){
        this.el.$targetBoard.addClass('success');

        this.el.$doneWindow.show();
      }
    },

    initElements : function (){
      this.el.$sourceBoard =  $('.js_source-container');
      this.el.$targetBoard = $('.js_target-container');
      this.el.$gameBoard = $('.js_game-board');
      this.el.$doneWindow = $('#js_done-window');
    },

    bindDragging : function () {

      var self = this;

      for (puzzle in Puzzle.Games[this.gameName].items) {

        $('.'+puzzleItemPrefix + puzzle).draggable({ 
            revert: 'invalid',
            containment : self.el.$gameBoard,
            snap: ".destination-item",
            snapMode: "inner",
            snapTolerance: 100
        });
      }

    },
    bindDroppable : function () {

      var self = this;

      this.el.$targetBoard.children('.destination-item').each(function(){
        
        $(this).droppable({
          accept : '.'+$(this).attr('data-accept'),
          drop: function( event, ui ) {

            $(this).addClass("puzzle-ok");

            self.puzzleOk.call(self);
    
          }
        });

      });
    },
    drawTargetBoard : function () {

      var lastRow = 'A', actRow;

      for (puzzle in Puzzle.Games[this.gameName].items) {

        actRow = puzzle.toString().split("")[0];

        if(actRow != lastRow){
          this.el.$targetBoard.append("<br/>");
          lastRow = actRow;          
        }
        console.log(actRow);

        this.el.$targetBoard.append(
          this.html.destItem(
            puzzle, 
            Puzzle.Games[this.gameName].itemWidth, 
            Puzzle.Games[this.gameName].itemHeight
          )
        );
      }
    },
    insertLogo : function (){
      this.el.$doneWindow
      .find('.js_puzzle-logo')
      .append('<img src="images/'+this.gameName+'/'+Puzzle.Games[this.gameName].logo+'" />');

    },
    loadGame : function() {


      var puzzleName,
        puzzleSrc,
        puzzleObj;
      

      for (puzzle in Puzzle.Games[this.gameName].items) {
        
        puzzleName = puzzle;
        puzzleSrc = Puzzle.Games[this.gameName].items[puzzle];

        this.goalItems++;

        console.log(puzzle);
        this.el.$sourceBoard.append(this.html.puzzleItem(puzzleName,puzzleSrc,this.gameName));

      }
      this.insertLogo();

      this.bindDragging();

      this.drawTargetBoard();

      this.bindDroppable();

    },
    init : function () {
      console.log('Game init');
      
      this.gameName = 'collibra'
      
      this.initElements();

      this.loadGame();
    }

  };

  return Puzzle;

})();



$(document).ready(function(){

  Puzzle.App.init();

});