angular.module('reg')
    .controller('ApplicationCtrl', [
        '$scope',
        '$rootScope',
        '$state',
        '$http',
        'currentUser',
        'settings',
        'Session',
        'UserService',
        function ($scope, $rootScope, $state, $http, currentUser, Settings, Session, UserService) {

            // Set up the user
            $scope.user = currentUser.data;

            // Populate the school dropdown
            populateSchools();

            // Populate the states dropdown
            populateStates();
            _setupForm();

            $scope.regIsClosed = Date.now() > Settings.data.timeClose;

            /**
             * TODO: JANK WARNING
             */
            function populateSchools() {
                $http
                    .get('/assets/schools.json')
                    .then(function (res) {
                        var schools = res.data;
                        var email = $scope.user.email.split('@')[1];

                        if (schools[email]) {
                            $scope.user.profile.school = schools[email].school;
                            $scope.autoFilledSchool = true;
                        }
                    });

                $http
                    .get('/assets/schools.csv')
                    .then(function (res) {
                        $scope.schools = res.data.split('\n');
                        $scope.schools.push('Other');

                        var content = [];

                        for (i = 0; i < $scope.schools.length; i++) {
                            $scope.schools[i] = $scope.schools[i].trim();
                            content.push({
                                title: $scope.schools[i]
                            })
                        }

                        $('#school.ui.search')
                            .search({
                                source: content,
                                cache: true,
                                onSelect: function (result, response) {
                                    $scope.user.profile.school = result.title.trim();
                                }
                            })
                    });
            }

            function populateStates() {
                $http
                    .get('/assets/states.csv')
                    .then(function (res) {
                        $scope.states = res.data.split('\n');
                        $scope.states.push('Other');

                        var content = [];

                        for (i = 0; i < $scope.states.length; i++) {
                            $scope.states[i] = $scope.states[i].trim();
                            content.push({
                                title: $scope.states[i]
                            })
                        }

                        $('#state.ui.search')
                            .search({
                                source: content,
                                cache: true,
                                onSelect: function (result, response) {
                                    $scope.user.profile.state = result.title.trim();
                                }
                            })
                    });
            }

            function _updateUser(e) {
                UserService
                    .updateProfile(Session.getUserId(), $scope.user.profile)
                    .success(function (data) {
                        sweetAlert({
                            title: "Awesome!",
                            text: "Your application has been saved.",
                            type: "success",
                            confirmButtonColor: "#e76482"
                        }, function () {
                            $state.go('app.dashboard');
                        });
                    })
                    .error(function (res) {
                        sweetAlert("Uh oh!", "Something went wrong.", "error");
                    });
            }

            function isMinor() {
                return !$scope.user.profile.adult;
            }

            function minorsAreAllowed() {
                return Settings.data.allowMinors;
            }

            function minorsValidation() {
                // Are minors allowed to register?
                if (isMinor() && !minorsAreAllowed()) {
                    return false;
                }
                return true;
            }

            function _setupForm() {
                // Custom minors validation rule
                $.fn.form.settings.rules.allowMinors = function (value) {
                    return minorsValidation();
                };

                // Semantic-UI form validation
                $('.ui.form').form({
                    inline: true,
                    fields: {
                        name: {
                            identifier: 'name',
                            rules: [{
                                type: 'empty',
                                prompt: 'Please enter your name.'
                            }]
                        },
                        school: {
                            identifier: 'school',
                            rules: [{
                                type: 'empty',
                                prompt: 'Please enter your school name.'
                            }]
                        },
                        year: {
                            identifier: 'year',
                            rules: [{
                                type: 'empty',
                                prompt: 'Please select your graduation year.'
                            }]
                        },
                        gender: {
                            identifier: 'gender',
                            rules: [{
                                type: 'empty',
                                prompt: 'Please select a gender.'
                            }]
                        },
                        description: {
                            identifier: 'description',
                            rules: [{
                                type: 'empty',
                                prompt: 'Please provide a brief description'
                            }]
                        },
                        sponsorName: {
                            identifier: 'sponsor-name',
                            rules: [{
                                type: 'empty',
                                prompt: 'You must provide a sponsor'
                            }]
                        }
                    }
                });
            }

            $scope.submitForm = function () {
                if ($('.ui.form').form('is valid')) {
                    _updateUser();
                } else {
                    sweetAlert("Uh oh!", "Please Fill The Required Fields", "error");
                }
            };

        }
    ]);

