function Project(id, ghUsername, repoName, branchOrSha) {
    this.id = id;
    this.ghUsername = ghUsername;
    this.repoName = repoName;
    this.branchOrSha = branchOrSha;
}

// The list of all projects currently in the system.
// (Feel free to imagine this came from a database somewhere on page load.)
var CURRENT_PROJECTS = [
    new Project(0, "cpkenn09y", "webdev-exercise", "current-with-master"),
    new Project(1, "quixey", "webdev-exercise", "outdated-branch-2")
];

// The current maximum ID, so we know how to allocate an ID for a new project.
// (Yes, the database should be taking care of this, too.)
var MAX_ID = Math.max.apply(null, $.map(CURRENT_PROJECTS, function(pj) { return pj.id; }));

$(function(){
    var loadProjects = function($container, projects) {
        $.fn.append.apply($container, $.map(projects, function(pj) {
            return $("<tr>").append(
                $("<td>").text(pj.id),
                $("<td>").text(pj.ghUsername),
                $("<td>").text(pj.repoName),
                $("<td>").text(pj.branchOrSha)
            );
        }));
    };

    // Creates a new project based on the user input in the form.
    var createProject = function($form) {
        return new Project(
            MAX_ID + 1,
            $form.find("#github-name").val(),
            $form.find("#repo-name").val(),
            $form.find("#branch-sha").val()
        );
    };

    // Clears the data in the form so that it's easy to enter a new project.
    var resetForm = function($form) {
        $form.find("#github-name").val("");
        $form.find("#repo-name").val("");
        $form.find("#branch-sha").val("");
        $form.find("input:first").focus();
    };

    var $projectTable = $("#project-list>tbody");
    loadProjects($projectTable, CURRENT_PROJECTS);

    $("#add-project-form").submit(function(e) {
        var $form = $(this);
        pj = createProject($form);
        MAX_ID = pj.id;
        CURRENT_PROJECTS.push(pj);
        loadProjects($projectTable, [pj]);
        resetForm($form);
        e.preventDefault();
    });

    $.ajax({
        url: 'https://api.github.com/repos/cpkenn09y/webdev-exercise/compare/master...current-with-master',
        type: 'GET'
    }).success(function(returnData) {
        console.log("WAS SUCCESSFUL");
        console.log(returnData);
    }).error(function(returnData) {
        console.log("FAILED!");
        console.log(returnData);
    });
});
