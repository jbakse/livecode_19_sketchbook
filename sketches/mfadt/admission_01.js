// allow console log in eslint
/* eslint no-console: 0 */

function assignApplications(reviewer_count = 4, applicant_count = 8) {
  const reviewer_ids = [...Array(reviewer_count).keys()];
  const applicant_ids = [...Array(applicant_count).keys()];

  // add all ids twice, then shuffle
  const shuffled_applicant_ids = shuffleArray(
    [].concat(applicant_ids, applicant_ids)
  );

  const applicantsPerReviewer = Math.ceil(
    (2 * applicant_count) / reviewer_count
  );

  // create array of length reviewer_count populated with empty arrays
  const assignments = Array.from({ length: reviewer_count }, () => []);

  // assign applicants each reviewer in turn
  for (const reviewer_id of reviewer_ids) {
    console.log(`assigning ${reviewer_id}`);
    // each reviewer gets several applicants
    for (let i = 0; i < applicantsPerReviewer; i++) {
      // take the next applicant on the shuffled list
      const applicant_id = shuffled_applicant_ids.shift();
      if (applicant_id === undefined) break;
      if (assignments[reviewer_id].includes(applicant_id)) {
        // if this applicant is already assigned to the reviewer,
        // put it at the end of the shuffled list
        shuffled_applicant_ids.push(applicant_id);
        i--;
      } else {
        // if this applicant is not already assigned to the reviewer,
        // add it to their assignments
        assignments[reviewer_id].push(applicant_id);
      }
    }

    assignments[reviewer_id] = assignments[reviewer_id].sort();
  }

  return assignments;
}

console.log("starting");

const assignments = assignApplications(19, 356);

console.log(assignments);
// convert nested array [[1,2], [3,4]] to tupples of [[0,1, [0,2], [1,3], [1,4]]
const tupples = assignments.reduce(
  (acc, curr, i) => acc.concat(curr.map((c) => [i, c])),
  []
);

console.log(tupples);

for (t of tupples) {
  console.log(`${t[0]}, ${t[1]}`);
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
