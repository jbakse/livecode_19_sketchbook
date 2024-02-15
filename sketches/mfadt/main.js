const applicantsInput = document.getElementById("applicants");
const reiviewersInput = document.getElementById("reviewers");
const assignmentsInput = document.getElementById("assignments");
const reviewCountInput = document.getElementById("reviewCount");

applicantsInput.value = ["1", "2", "3", "4"].join("\n");
reiviewersInput.value = ["A", "B", "C"].join("\n");
reviewCountInput.value = 2;

applicantsInput.addEventListener("input", updateAssignments);
reiviewersInput.addEventListener("input", updateAssignments);
reviewCountInput.addEventListener("input", updateAssignments);

updateAssignments();

function updateAssignments() {
  const reviewers = reiviewersInput.value.trim().split("\n");
  const applicants = applicantsInput.value.trim().split("\n");
  const reviewCount = parseInt(reviewCountInput.value, 10);

  // validate inputs
  if (reviewers.length < reviewCount) {
    assignmentsInput.value =
      "Reviews per applicant may not be greater than the number of reviewers";
    return;
  }

  // do the assignments
  const assignments = assignApplications(reviewers, applicants, reviewCount);

  // tab delimit the assignments for google sheets
  const assignmentsFormatted = Object.entries(assignments)
    .map(([reviewer_id, applicant_ids]) =>
      applicant_ids.map((applicant_id) => `${reviewer_id}\t${applicant_id}`)
    )
    .flat();

  // display output
  assignmentsInput.value = assignmentsFormatted.join("\n");
}

function assignApplications(reviewer_ids, applicant_ids, reviewCount) {
  // add all ids reviewCount times, then shuffle
  const shuffled_applicant_ids = shuffleArray(
    Array(reviewCount).fill(applicant_ids).flat()
  );

  // create the assignments object like this:
  // assignments = {
  //    reviewer_id: [applicant_id, ...],
  //    ...
  // }
  const assignments = Object.fromEntries(
    reviewer_ids.map((reviewer_id) => [reviewer_id, []])
  );

  let turn = 0;
  while (shuffled_applicant_ids.length > 0) {
    // which reviewers turn is it?
    const reviewer_id = reviewer_ids[turn % reviewer_ids.length];

    // find index of first applicant id not already assigned to this reviewer
    const applicant_index = shuffled_applicant_ids.findIndex(
      (applicant_id) => !assignments[reviewer_id].includes(applicant_id)
    );

    // if we didn't find an applicant this reviewer can take, stop assigning
    if (applicant_index === -1) {
      console.error(
        `Reviewer ${reviewer_id} can't take any remaining applicants`
      );
      break;
    } else {
      // remove the applicant from the shuffled list and...
      const applicant_id = shuffled_applicant_ids.splice(applicant_index, 1)[0];
      // assign to reviewer
      assignments[reviewer_id].push(applicant_id);
    }
    turn++;
  }

  // sort the assignments for each reviewer
  for (const reviewer_id of reviewer_ids) {
    assignments[reviewer_id] = assignments[reviewer_id].sort(compare);
  }

  return assignments;
}

function compare(a, b) {
  return a.localeCompare(b, undefined, {
    numeric: true,
    sensitivity: "base",
  });
}

// shuffle an array with fisher-yates
function shuffleArray(array) {
  let currentIndex = array.length;
  let temporaryValue, randomIndex;

  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}
