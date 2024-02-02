console.log(assign_reviewers(2, 6));

function assign_reviewers(num_reviewers, num_applicants) {
  const assignments = [];
  const reviewers = Array.from({ length: num_reviewers }, (_, i) => i + 1);
  const applicants = Array.from({ length: num_applicants }, (_, i) => i + 1);
  //   const max = Math.ceil(num_applicants / num_reviewers);
  let reviewersIndex = 0;

  while (applicants.length > 0) {
    const i = Math.floor(Math.random() * applicants.length);
    const current = applicants.splice(i, 1);
    assignments.push([reviewers[reviewersIndex], current[0]]);
    reviewersIndex = (reviewersIndex + 1) % num_reviewers;
  }
  return assignments;
}
