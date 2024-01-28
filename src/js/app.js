const Web3 = require('web3');
const contract = require('@truffle/contract');

const votingArtifacts = require('../../build/contracts/Voting.json');
var VotingContract = contract(votingArtifacts)

window.App = {
  eventStart: function() { 
    window.ethereum.request({ method: 'eth_requestAccounts' });
    VotingContract.setProvider(window.ethereum)
    VotingContract.defaults({from: window.ethereum.selectedAddress,gas:6654755})

    App.account = window.ethereum.selectedAddress;
    $("#accountAddress").html("Your Account: " + window.ethereum.selectedAddress);
    VotingContract.deployed().then(function(instance){
     instance.getCountCandidates().then(function(countCandidates){

            $(document).ready(function(){
              $('#addCandidate').click(function() {
                  var nameCandidate = $('#name').val();
                  var partyCandidate = $('#party').val();
                  if (!nameCandidate || !partyCandidate) {
                    alert("Please fill in both candidate name and party");
                    return;
                  }
                 instance.addCandidate(nameCandidate,partyCandidate).then(function(result){ 
                   alert("Candidate added successfully");
                   $('#name').val('');
                   $('#party').val('');
                   window.location.reload();
                 }).catch(function(err){
                   console.error("Error adding candidate: " + err.message);
                   alert("Error adding candidate. Please try again.");
                 });

            });   
              $('#addDate').click(function(){             
                  var startDateInput = document.getElementById("startDate").value;
                  var endDateInput = document.getElementById("endDate").value;
                  
                  if (!startDateInput || !endDateInput) {
                    alert("Please select both start and end dates");
                    return;
                  }
                  
                  var startDate = Date.parse(startDateInput)/1000;
                  var endDate = Date.parse(endDateInput)/1000;
                  
                  if (isNaN(startDate) || isNaN(endDate)) {
                    alert("Invalid date format. Please select valid dates.");
                    return;
                  }
                  
                  if (endDate <= startDate) {
                    alert("End date must be after start date");
                    return;
                  }
           
                  instance.setDates(startDate,endDate).then(function(rslt){ 
                    console.log("Voting dates set successfully");
                    alert("Voting dates have been set successfully");
                    window.location.reload();
                  }).catch(function(err){
                    console.error("Error setting dates: " + err.message);
                    alert("Error setting voting dates: " + err.message);
                  });

              });     

               instance.getDates().then(function(result){
                var startDate = new Date(result[0]*1000);
                var endDate = new Date(result[1]*1000);

                $("#dates").text( startDate.toDateString() + " - " + endDate.toDateString());
              }).catch(function(err){ 
                console.error("ERROR! " + err.message)
              });           
          });
             
          for (var i = 0; i < countCandidates; i++ ){
            instance.getCandidate(i+1).then(function(data){
              var id = data[0];
              var name = data[1];
              var party = data[2];
              var voteCount = data[3];
              var viewCandidates = `<tr><td> <input class="form-check-input" type="radio" name="candidate" value="${id}" id=${id}>` + name + "</td><td>" + party + "</td><td>" + voteCount + "</td></tr>"
              $("#boxCandidate").append(viewCandidates)
            })
        }
        
        window.countCandidates = countCandidates 
      });

      instance.checkVote().then(function (voted) {
          console.log(voted);
          if(!voted)  {
            $("#voteButton").attr("disabled", false);
          } else {
            $("#voteButton").attr("disabled", true);
            $("#msg").html("<p style='color: orange;'>You have already voted.</p>");
          }
      }).catch(function(err){
        console.error("Error checking vote status: " + err.message);
      });

    }).catch(function(err){ 
      console.error("ERROR! " + err.message)
    })
  },

  vote: function() {    
    var candidateID = $("input[name='candidate']:checked").val();
    if (!candidateID) {
      $("#msg").html("<p>Please vote for a candidate.</p>")
      return
    }
    VotingContract.deployed().then(function(instance){
      instance.vote(parseInt(candidateID)).then(function(result){
        $("#voteButton").attr("disabled", true);
        $("#msg").html("<p style='color: green;'>Vote cast successfully!</p>");
        setTimeout(function(){
          window.location.reload(1);
        }, 2000);
      }).catch(function(err){ 
        console.error("ERROR! " + err.message);
        $("#msg").html("<p style='color: red;'>Error casting vote: " + err.message + "</p>");
      });
    }).catch(function(err){ 
      console.error("ERROR! " + err.message);
      $("#msg").html("<p style='color: red;'>Error connecting to contract: " + err.message + "</p>");
    })
  }
}

window.addEventListener("load", function() {
  if (typeof web3 !== "undefined") {
    console.warn("Using web3 detected from external source like Metamask")
    window.eth = new Web3(window.ethereum)
  } else {
    console.warn("No web3 detected. Falling back to http://localhost:9545. You should remove this fallback when you deploy live, as it's inherently insecure. Consider switching to Metamask for deployment. More info here: http://truffleframework.com/tutorials/truffle-and-metamask")
    window.eth = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:9545"))
  }
  window.App.eventStart()
})

