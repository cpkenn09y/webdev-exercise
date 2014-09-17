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
    new Project(1, "quixey", "webdev-exercise", "outdated-branch-2"),
    new Project(2, "ztztdtsdf", "asfagag34234", "rw2323tfd")
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
                $("<td>").text(pj.branchOrSha),
                $("<td><i class='status fa'></i></td>")
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

    var createQueryURL = function(project) {
        return 'https://api.github.com/repos/' + project.ghUsername + '/' + project.repoName + '/compare/master...' + project.branchOrSha;
    };

    var currentIndex = 0;

    $.ajax({
        url: createQueryURL(CURRENT_PROJECTS[currentIndex]),
        type: 'GET'
    }).success(function(returnData) {
        if (returnData.behind_by === 0) {
            $('#project-list i.status').eq(currentIndex).addClass('fa-thumbs-up green');
        } else {
            $('#project-list i.status').eq(currentIndex).addClass('fa-thumbs-down red');
        }
    }).error(function(returnData) {
        $('#project-list i.status').eq(currentIndex).addClass('fa-exclamation-triangle red').text(' invalid data');
    });
});
