angular.module('reg')
  .controller('AdminUserCtrl', [
    '$scope',
    '$rootScope',
    '$http',
    '$state',
    'user',
    'Utils',
    'UserService',
    function ($scope, $rootScope, $http, $state, User, Utils, UserService) {
      $scope.selectedUser = User.data;

      // Set up the user
      var user = User.data;
      $scope.user = user;

      $scope.formatTime = Utils.formatTime;


      // Populate the school dropdown
      populateSchools();

      // -------------------------------
      // All this just for dietary restriction checkboxes fml

      var dietaryRestrictions = {
        'Vegetarian': false,
        'Vegan': false,
        'Halal': false,
        'Kosher': false,
        'Nut Allergy': false
      };

      if (user.confirmation.dietaryRestrictions) {
        user.confirmation.dietaryRestrictions.forEach(function (restriction) {
          if (restriction in dietaryRestrictions) {
            dietaryRestrictions[restriction] = true;
          }
        });
      }

      $scope.dietaryRestrictions = dietaryRestrictions;

      /**
       * TODO: JANK WARNING
       */
      function populateSchools() {

        $http
          .get('/assets/schools.json')
          .then(function (res) {
            var schools = res.data;
            var email = $scope.selectedUser.email.split('@')[1];

            if (schools[email]) {
              $scope.selectedUser.profile.school = schools[email].school;
              $scope.autoFilledSchool = true;
            }

          });
      }


      $scope.updateProfile = function () {

        var conf = confirm("Are you sure that you want to update the current attendee's information?");
        if (conf) {
          UserService
            .updateProfile($scope.selectedUser._id, $scope.selectedUser.profile)
            .success(function (data) {
              $selectedUser = data;

              var confirmation = $scope.user.confirmation;
              // Get the dietary restrictions as an array
              var drs = [];
              Object.keys($scope.dietaryRestrictions).forEach(function (key) {
                if ($scope.dietaryRestrictions[key]) {
                  drs.push(key);
                }
              });
              confirmation.dietaryRestrictions = drs;

              UserService
                .updateConfirmation(user._id, confirmation)
                .success(function (data) {
                  sweetAlert({
                    title: "Success!",
                    text: "Profile updated!",
                    type: "success",
                    confirmButtonColor: "#e76482"
                  });
                })
                .error(function (res) {
                  sweetAlert("Uh oh!", "Something went wrong.", "error");
                });

            })
            .error(function () {
              swal("Oops, you forgot something.");
            });
        } else {
          swal("Aborted!", "No change has been made.", "info");
        }
      };

    }
  ]);